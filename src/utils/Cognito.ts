import { 
    CognitoUser, 
    CognitoUserSession, 
    CognitoUserPool, 
    AuthenticationDetails, 
    CognitoUserAttribute
} from 'amazon-cognito-identity-js'

class Cognito {

    private CognitoUserPool
    private CognitoUser: CognitoUser | null = null
    private CognitoUserSession: CognitoUserSession | null = null

    constructor () { 
        const ClientId = '1fd0gtvv1usfus4ooeq9rdreq'
        const LastAuthUser = localStorage.getItem(`CognitoIdentityServiceProvider.${ClientId}.LastAuthUser`)
        this.CognitoUserPool = new CognitoUserPool({
            UserPoolId: 'us-east-2_mq9DHmcKV',
            ClientId: ClientId
        })
        try {
            this.CognitoUser = new CognitoUser({ Username: LastAuthUser || '', Pool: this.CognitoUserPool })
        } catch (err) {
            this.CognitoUser = null
        }
        if (this.CognitoUser) {
            this.CognitoUser.getSession((err: any, session: CognitoUserSession) => {
                if (err)
                    this.CognitoUserSession = null
                else
                    this.CognitoUserSession = session
            })
        }
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
            if (!this.CognitoUser) {
                return resolve(null)
            }
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

    public GetGroups = () => {
        return this.CognitoUserSession?.getIdToken().payload['cognito:groups']
    }

    public ChangePassword = (newPassword: string, userAttributes: any): Promise<'Success'> => {
        if (!this.CognitoUser)
            throw new Error(`Cognito User not initialized.`)
        return new Promise((resolve, reject) => {
            if (!this.CognitoUser)
                return reject(`Cognito User not initialized.`)
            this.CognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
                onSuccess: (result) => {
                    this.CognitoUserSession = result
                    resolve('Success')
                },
                onFailure: (err) => {
                    reject(err)
                }
            })
        })
        
    }

    public SignOut = () => {
        if (!this.CognitoUser)
            return
        this.CognitoUser.signOut()
        this.CognitoUser = null
        this.CognitoUserSession = null
    }

    public SendForgotPasswordEmail = (email: string) => {
        return new Promise((resolve, reject) => {
            const cognitoUser = new CognitoUser({
                Username: email,
                Pool: this.CognitoUserPool
            })
            cognitoUser.forgotPassword({
                onSuccess: (result) => {
                    resolve(result)
                },
                onFailure: (err) => {
                    reject(err)
                }
            })
        })
    }

    public CompleteForgotPassword = (email: string, verificationCode: string, newPassword: string) => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.CognitoUserPool
        })
        return new Promise((resolve, reject) => {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onFailure: (err) => {
                    reject(err)
                },
                onSuccess: (data) => {
                    resolve(data)
                }
            })
        })
    }
}

export default Cognito