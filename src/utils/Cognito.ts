import { 
    CognitoUser, 
    CognitoUserSession, 
    CognitoUserPool, 
    AuthenticationDetails, 
    CognitoUserAttribute, 
    CognitoIdToken, 
    CognitoRefreshToken, 
    CognitoAccessToken 
} from 'amazon-cognito-identity-js'

class Cognito {
    private CognitoUser: null | CognitoUser = null
    private CognitoUserSession: null | CognitoUserSession = null

    private CognitoUserPool = new CognitoUserPool({
        UserPoolId: 'us-east-2_mq9DHmcKV',
        ClientId: '1fd0gtvv1usfus4ooeq9rdreq'
    })

    private CacheTokens = (cognitoUserSession: CognitoUserSession, username: string) => {
        const keyPrefix = `CognitoIdentityServiceProvider.${this.CognitoUserPool.getClientId()}`
        const idTokenKey = `${keyPrefix}.idToken`
        const accessTokenKey = `${keyPrefix}.accessToken`
        const refreshTokenKey = `${keyPrefix}.refreshToken`
        const lastUserKey = `${keyPrefix}.LastAuthUser`

        localStorage.setItem(idTokenKey, `.${cognitoUserSession.getIdToken().getJwtToken()}`)
        localStorage.setItem(accessTokenKey, `${keyPrefix}.${cognitoUserSession.getAccessToken().getJwtToken()}`)
        localStorage.setItem(refreshTokenKey, `${keyPrefix}.${cognitoUserSession.getRefreshToken().getToken()}`)
        localStorage.setItem(lastUserKey, username)
    }

    public SignIn = (username: string, password: string): Promise<CognitoUserSession> => {
        return new Promise((resolve, reject) => {
            this.CognitoUser = new CognitoUser({ Username: username, Pool: this.CognitoUserPool })
            this.CognitoUser.authenticateUser(new AuthenticationDetails({
                Username: username,
                Password: password
            }), {
                onSuccess: (result) => {
                    console.log(result)
                    resolve(result)
                    this.CognitoUserSession = result
                    this.CacheTokens(result, username)
                },
                onFailure: (err) => {
                    reject(err)
                }
            })
        })
    }

    public GetUser = (): Promise<CognitoUserAttribute[] | null> => {
        return new Promise((resolve, reject) => {
            if (!this.CognitoUser)
                return resolve(null)
            this.CognitoUser.getUserAttributes((err, result) => {
                if (err) {
                    if (err.message === "User is not authenticated")
                        return resolve(null)
                    else
                        return reject(err)
                }
                if (!result)
                    return resolve(null)
                resolve(result)
            })
        })
    }

    // Get the user's session, used when user closes + reopens web application
    public GetSession = () => {
        const keyPrefix = `CognitoIdentityServiceProvider.${this.CognitoUserPool.getClientId()}`
        const idTokenKey = `${keyPrefix}.idToken`
        const accessTokenKey = `${keyPrefix}.accessToken`
        const refreshTokenKey = `${keyPrefix}.refreshToken`
        const lastUserKey = `${keyPrefix}.LastAuthUser`

        const idToken = new CognitoIdToken({ IdToken: localStorage.getItem(idTokenKey) || '' })
        const accessToken = new CognitoAccessToken({ AccessToken: localStorage.getItem(accessTokenKey) || '' })
        const refreshToken = new CognitoRefreshToken({ RefreshToken: localStorage.getItem(refreshTokenKey) || '' })

        const cachedSession = new CognitoUserSession({
            IdToken: idToken,
            AccessToken: accessToken,
            RefreshToken: refreshToken
        })

        if (cachedSession.isValid()) {
            this.CognitoUserSession = cachedSession
        } else {
            this.CognitoUser = new CognitoUser({
                Username: localStorage.getItem(lastUserKey) || '',
                Pool: this.CognitoUserPool
            })
            this.CognitoUser.refreshSession(refreshToken, (err, res) => {
                if (err) {
                    if (err.code === "InvalidParameterException" && err.message === "Missing required parameter REFRESH_TOKEN") {
                        this.CognitoUserSession = null
                    } else {
                        console.error(err)
                    }
                } else {
                    this.CognitoUserSession = res
                }
            })
        }
    }
}

export default Cognito