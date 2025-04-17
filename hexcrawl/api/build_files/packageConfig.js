export let packageConfig = {
  "name": "hexcrawl-api",
  "type": "module",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "author": "Ryan Kinal",
  "license": "ISC",
  "imports": {
    "#utils/*": "./utils/*"
  },
  "dependencies": {
    "@aws-sdk/client-cognito-identity": "^3.679.0",
    "@aws-sdk/client-cognito-identity-provider": "^3.679.0",
    "@aws-sdk/client-dynamodb": "^3.675.0",
    "@aws-sdk/client-ssm": "^3.675.0",
    "@aws-sdk/credential-providers": "^3.675.0",
    "@aws-sdk/util-dynamodb": "^3.675.0",
    "express": "^4.21.1"
  }
};