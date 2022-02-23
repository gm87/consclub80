import SidebarWithContent from "../../layouts/SidebarWithContent"
import CognitoUserAttributes from "../../models/CognitoUserAttributes"

interface ForgotPasswordProps {
    user: CognitoUserAttributes | null
}

const ForgotPassword = ({ user }: ForgotPasswordProps) => {
    return (
        <SidebarWithContent user={user}>

        </SidebarWithContent>
    )
}

export default ForgotPassword