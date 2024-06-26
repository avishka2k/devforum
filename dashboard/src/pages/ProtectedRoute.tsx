import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    let auth = {'token': localStorage.getItem('access_token')}
    return(
        auth.token ? <Outlet/> : <Navigate to="/auth/signin"/>
    )
}

export default PrivateRoutes