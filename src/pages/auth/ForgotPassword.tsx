import SidebarWithContent from "../../layouts/SidebarWithContent"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"

interface ForgotPasswordProps {
    user: CognitoUserAttribute[] | null
}

const ForgotPassword = ({ user }: ForgotPasswordProps) => {
    return (
        <SidebarWithContent user={user}>

        </SidebarWithContent>
    )
}

export default ForgotPassword