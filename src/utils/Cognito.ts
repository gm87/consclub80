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

        localStorage.setItem(idTokenKey, cognitoUserSession.getIdToken().getJwtToken())
        localStorage.setItem(accessTokenKey, cognitoUserSession.getAccessToken().getJwtToken())
        localStorage.setItem(refreshTokenKey, cognitoUserSession.getRefreshToken().getToken())
        localStorage.setItem(lastUserKey, username)
    }

    public SignIn = (username: string, password: string): Promise<CognitoUserAttribute[] | null> => {
        return new Promise((resolve, reject) => {
            this.CognitoUser = new CognitoUser({ Username: username, Pool: this.CognitoUserPool })
            this.CognitoUser.authenticateUser(new AuthenticationDetails({
                Username: username,
                Password: password
            }), {
                onSuccess: (result) => {
                    resolve(this.GetUser())
                    this.CognitoUserSession = result
                    this.CacheTokens(result, username)
                    console.log(result)
                },
                newPasswordRequired: (userAttributes) => {
                    reject({
                        message: `New password required.`,
                        userAttributes
                    })
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

    public ChangePassword = (newPassword: string, userAttributes: any) => {
        if (!this.CognitoUser)
            throw new Error(`Cognito User not initialized.`)
        this.CognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
            onSuccess: (result) => {
                this.CognitoUserSession = result
                this.CacheTokens(result, userAttributes.email)
            },
            onFailure: (err) => {
                console.log(err)
            }
        })
    }

    // Get the user's session, used when user closes + reopens web application
    public GetSession = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
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
                resolve(true)
            } else {
                this.CognitoUser = new CognitoUser({
                    Username: localStorage.getItem(lastUserKey) || '',
                    Pool: this.CognitoUserPool
                })
                this.CognitoUser.refreshSession(refreshToken, (err, res) => {
                    if (err) {
                        if (err.code === "InvalidParameterException" && err.message === "Missing required parameter REFRESH_TOKEN") {
                            this.CognitoUserSession = null
                            resolve(false)
                        } else {
                            reject(err)
                        }
                    } else {
                        this.CognitoUserSession = res
                        resolve(true)
                    }
                })
            }
        })
    }
}

export default Cognito