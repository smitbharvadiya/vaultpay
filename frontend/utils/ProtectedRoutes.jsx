import { Children } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({isLogin, children}) => {
    if(!isLogin){
        return <Navigate to="/" replace />
    }
    return children;
}

export default ProtectedRoutes;