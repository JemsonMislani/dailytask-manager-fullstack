import { useNavigate } from "react-router-dom"
    
export const useAuthForLogout = () => {
        const nav = useNavigate()

        const handleLogoutBtn = () => {
        const clickLogout = confirm('Are you sure you want to logout?')
            if(clickLogout){
                localStorage.removeItem('userstokens');
                localStorage.removeItem('user');
                sessionStorage.removeItem('userstokens');
                sessionStorage.removeItem('user')

                setTimeout(() => {
                nav('/', {replace: true})
                }, 2000);
            } else {
                return
            }
        }
        return { handleLogoutBtn };
    }