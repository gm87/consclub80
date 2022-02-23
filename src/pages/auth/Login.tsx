import SidebarWithContent from "../../layouts/SidebarWithContent"
import { CognitoUserAttribute } from "amazon-cognito-identity-js"

interface LoginProps {
    user: CognitoUserAttribute[] | null
}

const Login = ({ user }: LoginProps) => {
    return (
        <SidebarWithContent user={user}>

        </SidebarWithContent>
    )
}

export default Login