// see previous example for the things that are not commented

const assert = require('assert');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Provider = require('oidc-provider');
const MongoAdapter = require('./mongodb');
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || `http://localhost:${PORT}/`;
const PREFIX = process.env.PREFIX || '';
const jwks = require('./jwks.json');
const all_routes = require('express-list-endpoints');

// simple account model for this application, user list is defined like so
const Account = require('./account');

const oidc = new Provider(URL, {
  //adapter: MongoAdapter,
  clients: [
    {
      client_id: 'foo',
      redirect_uris: ['https://example.com'],
      response_types: ['id_token'],
      grant_types: ['implicit'],
      token_endpoint_auth_method: 'none',
    },
    {
      client_id: 'crowds-cure-cancer',
      redirect_uris: ['https://cancer.crowds-cure.org'],
      response_types: ['code'],
      grant_types: ['implicit', 'authorization_code'],
      token_endpoint_auth_method: 'none',
    }, // http://localhost:3000/auth?client_id=crowds-cure-cancer&response_type=code&grant_types=authorization_code&scope=openid+email+profile&nonce=foobar&prompt=login
  ],
  jwks,

  // oidc-provider only looks up the accounts by their ID when it has to read the claims,
  // passing it our Account model method is sufficient, it should return a Promise that resolves
  // with an object with accountId property and a claims method.
  findAccount: Account.findAccount,

  // let's tell oidc-provider you also support the email scope, which will contain email and
  // email_verified claims
  claims: {
    openid: ['sub'],
    email: ['email', 'email_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name',
      'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo',
      'custom:data', 'custom:consent', 'custom:occupation', 'custom:experience', 'custom:team'],
  },

  // let's tell oidc-provider where our own interactions will be
  // setting a nested route is just good practice so that users
  // don't run into weird issues with multiple interactions open
  // at a time.
  interactions: {
    url: (ctx) => {
      return `${PREFIX}/interaction/${ctx.oidc.uid}`;
    },
  },
  features: {
    // disable the packaged interactions
    devInteractions: { enabled: false },

    introspection: { enabled: true },
    revocation: { enabled: true },
  },
});

oidc.proxy = true;
oidc.keys = ['abc', '123'];

// let's work with express here, below is just the interaction definition
const expressApp = express();
expressApp.set('trust proxy', true);
expressApp.set('view engine', 'ejs');
expressApp.set('views', path.resolve(__dirname, 'views'));

const parse = bodyParser.urlencoded({ extended: false });

function setNoCache(req, res, next) {
  res.set('Pragma', 'no-cache');
  res.set('Cache-Control', 'no-cache, no-store');
  next();
}

const interactionsRouter = express.Router();

interactionsRouter.get('/:uid', setNoCache, async (req, res, next) => {
  console.log('hit /interaction/:uid route...');
  try {
    const details = await oidc.interactionDetails(req);
    console.log('see what else is available to you for interaction views', details);
    const { uid, prompt, params } = details;

    const client = await oidc.Client.find(params.client_id);

    if (prompt.name === 'login') {
      return res.render('login', {
        client,
        uid,
        details: prompt.details,
        params,
        title: 'Sign-in',
        flash: undefined,
      });
    }

    return res.render('interaction', {
      client,
      uid,
      details: prompt.details,
      params,
      title: 'Authorize',
    });
  } catch (err) {
    return next(err);
  }
});

interactionsRouter.post('/:uid/login', setNoCache, parse, async (req, res, next) => {
  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req);
    const client = await oidc.Client.find(params.client_id);

    const accountId = await Account.authenticate(req.body.email, req.body.password);

    if (!accountId) {
      res.render('login', {
        client,
        uid,
        details: prompt.details,
        params: {
          ...params,
          login_hint: req.body.email,
        },
        title: 'Sign-in',
        flash: 'Invalid email or password.',
      });
      return;
    }

    const result = {
      login: {
        account: accountId,
      },
    };

    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

interactionsRouter.post('/:uid/confirm', setNoCache, parse, async (req, res, next) => {
  try {
    const result = {
      consent: {
        // rejectedScopes: [], // < uncomment and add rejections here
        // rejectedClaims: [], // < uncomment and add rejections here
      },
    };
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
  } catch (err) {
    next(err);
  }
});

interactionsRouter.get('/:uid/abort', setNoCache, async (req, res, next) => {
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

// leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
if (PREFIX) {
  console.log(`Using prefix: ${PREFIX}`);  
  expressApp.use(`${PREFIX}/interaction`, interactionsRouter);
} else {
  expressApp.use('/interaction', interactionsRouter);
}

expressApp.use(oidc.callback);
// express listen
expressApp.listen(PORT);

console.log(all_routes(expressApp));

console.log('OIDC Provider starting...');
console.log(`Test with ${URL}auth?client_id=crowds-cure-cancer&response_type=code&grant_types=authorization_code&scope=openid+email+profile&nonce=foobar&prompt=login`);
console.log('Version 1.0');

process.on('SIGINT', function() {
    process.exit();
});