// see previous example for the things that are not commented

const assert = require('assert');
const querystring = require('querystring');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Provider = require('oidc-provider');
const MongoAdapter = require('./src/mongodb');
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || `http://localhost:${PORT}/`;
const PREFIX = process.env.PREFIX || '';
const jwks = require('./src/jwks.json');
const all_routes = require('express-list-endpoints');

// simple account model for this application, user list is defined like so
const Account = require('./src/account');

function getInteractionUrl(ctx) {
  return `${PREFIX}/interaction/${ctx.oidc.uid}`;
}
const oidc = new Provider(URL, {
  //adapter: MongoAdapter,
  clients: [
    {
      client_id: 'ccc-oidc-provider',
      client_secret: 'ccc-secret',
      redirect_uris: ['https://cancer.crowds-cure.org',
      'http://localhost:3000', 'https://cancer.crowds-cure.org/auth/realms/dcm4che/broker/crowds-cure-cancer-custom-oidc/endpoint'],
      response_types: ['code'],
      application_type: 'web',
      grant_types: ['authorization_code'],
      token_endpoint_auth_method: 'client_secret_post',
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
    url: getInteractionUrl
  },
  features: {
    // disable the packaged interactions
    devInteractions: { enabled: false },
    registration: { enabled: true },
    backchannelLogout: {
      enabled: true,
      ack: 'draft-04',
    },
    userinfo: { enabled: true },

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
    const { uid, prompt, params } = details;

    const client = await oidc.Client.find(params.client_id);

    //if (prompt.name === 'login') {
      params.interactionUrl = getInteractionUrl({ oidc: { uid }});
      const encoded = querystring.encode(params);

      return res.redirect(`/login?${encoded}`);
    //}

    /*return res.render('interaction', {
      client,
      uid,
      interactionUrl: getInteractionUrl({ oidc: { uid }}),
      details: prompt.details,
      params,
      title: 'Authorize',
    });*/
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
      // TODO: Maybe this should just return JSON?
      params.interactionUrl = getInteractionUrl({ oidc: { uid }});
      params.login_hint = req.body.email || req.body.username;
      params.error = 'invalid-credentials';
      const encoded = querystring.encode(params);

      return res.redirect(`/login?${encoded}`);
    }

    const result = {
      login: {
        account: accountId,
      },
      consent: {}
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

/*expressApp.get('/',function(req, res) {
  return res.sendFile(`./build/index.html`, { root: __dirname });
});*/

expressApp.get('/login',function(req, res) {
  return res.sendFile(`./build/index.html`, { root: __dirname });
});

expressApp.get('/sign-up',function(req, res) {
  return res.sendFile(`./build/index.html`, { root: __dirname });
});

expressApp.use(express.static(__dirname + '/build'));

// leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
if (PREFIX) {
  console.log(`Using prefix: ${PREFIX}`);  
  expressApp.use(`${PREFIX}/interaction`, interactionsRouter);
  expressApp.use(PREFIX, oidc.callback);
} else {
  expressApp.use('/interaction', interactionsRouter);
  expressApp.use(oidc.callback);
}

// express listen
expressApp.listen(PORT);

console.log(all_routes(expressApp));

console.log('OIDC Provider starting...');
console.log(`Test with ${URL}auth?client_id=ccc-oidc-provider&response_type=code&grant_types=authorization_code&scope=openid+email+profile&nonce=foobar&prompt=login&redirect_uri=https://cancer.crowds-cure.org`);
console.log('Version 1.0');

process.on('SIGINT', function() {
    process.exit();
});