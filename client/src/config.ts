// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '0h4a44fdhk'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  domain: 'dev-1lveepoh.us.auth0.com',            // Auth0 domain
  clientId: 'IpHNtyeH18Vi49a2otst94GbypyNWdXL',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
