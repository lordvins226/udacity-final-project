import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJAQ+h6oPvA0nWMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi0xbHZlZXBvaC51cy5hdXRoMC5jb20wHhcNMjIxMDA1MTgzMzMyWhcN
MzYwNjEzMTgzMzMyWjAkMSIwIAYDVQQDExlkZXYtMWx2ZWVwb2gudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7smMljTlJO6jQT99
lkUw197UeEjE0ZeuK4QRUmfv1tDdsc1ZAmXM2IruvPz/pgzTtuAFbwylc9r1kFBH
9IfxODfN1HBTl3Ue/GOikhP915SETvLRd/jZvtpSallFNJfJTwyV4tv/BwbvhPtd
EUOMYUha2vcLwAwiY3dzK4luMZig7RKZBTEO/9BmnrNswjt2pvW65CazmUAvbNXy
07CdZvQYDh8rYjVK5X/I4/Nmtf5+1k814/a9I7KLe55Y64wFEJXIk7w1yCWeH2R7
09sZKV9pFcgA93b5nH9B92cRD6+t1U0E8aR/AM3Xu4l/rKAd1+BBNsu75Ygx4MQS
yVCaMwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBS9DQqcYzuR
mkBEPCT+pk6eDKxaKjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AKLhE64eddUJ/B7x5IwNWYoqwDiWa4SxKBiGlhd0kBE5HJgk2g1gRaetK/FELDMz
MX5t2J8bEhKNbLkLztuSg4LkdjuUTxyfNnh4Xxj99wWkjSq814sJ9KMC5ses5FA0
G7NGJyw71Ub71fN0gtUY20jt2c4EOjUmW3UxkwKWAMgelRf/44CrKzmKmnUPdSHt
XavjxxLPz0k/943iFWMLMrutVLmGkWAU+dEwXUU4273gQXfm3wBfWpeWY6Q9CQkw
7wTE3ndQPDZmO/HzJDw3tuVU6+XaVxpvS5VSyQtvPnsbswz8e9iDKnqynkqGJ/vE
xfmMVcO5P2URf8fWbSaGSmU=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  //  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, jwksUrl, { algorithms: ['RS256'] }) as JwtPayload;
}

export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
