// wrapper for protected route, need to auth token before accessing token
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"


function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized ] = useState(null)

    // as soon as route is loaded, try to authorize
    useEffect(() => {
        auth().catch(()=> setIsAuthorized(false))
    }, [])
    const refreshToken = async () => {
        // refresh access token automatically
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            // sending refresh token to route returns new access token
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken})
            if (res.status === 200) { // if successful response
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () =>  {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        console.log("decoded:", decoded)
        const tokenExpire = decoded.exp // access token expiry time
        const now = Date.now() / 1000 // get date in sec
        if (tokenExpire < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to="login"/>
}

export default ProtectedRoute