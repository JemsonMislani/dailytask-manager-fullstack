import { useNavigate } from "react-router-dom"
import { useState } from "react";
    
export const useAuthForLogout = () => {
        const nav = useNavigate()
        const [loading, setLoading] = useState(false);

        const handleLogoutBtn = () => {
        const clickLogout = window.confirm('Are you sure you want to logout?')

        if(!clickLogout){
            return
        }

        setLoading(true)
        localStorage.removeItem('userstokens');
        localStorage.removeItem('user');
        sessionStorage.removeItem('userstokens');
        sessionStorage.removeItem('user')

        setTimeout(() => {
        setLoading(false)
        nav('/', {replace: true})
        }, 2000);
    }
        return { handleLogoutBtn, loading };
    }