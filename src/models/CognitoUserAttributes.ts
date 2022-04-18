export default interface CognitoUserAttributes {
    sub: string
    email_verified: boolean
    phone_number_verified: boolean
    phone_number: string
    given_name: string
    family_name: string
    email: string
    groups: string[]
}