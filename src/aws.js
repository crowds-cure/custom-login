import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-east-1:12b7ffd6-0341-42aa-893a-a8d9aaddc7f1',
        
        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_c8ttpP272',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '7m0sm32aao34k650fahvuqi3le', // custom-login client

         // OPTIONAL - Hosted UI configuration
        oauth: {
            domain: 'https://authz.crowds-cure.org',
            scope: ['email', 'profile', 'openid'],
            redirectSignIn: 'https://deploy-preview-83--crowds-cure-cancer.netlify.com/',
            redirectSignOut: 'https://crowds-cure.org',
            responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        }
    }
});