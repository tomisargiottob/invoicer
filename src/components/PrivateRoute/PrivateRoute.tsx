import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../requests/userRequest";
import { useAppSelector } from "../../store/store";
import { setUser } from "../../store/UserSlice";

const PrivateRoute = (props: { children: React.ReactNode }): JSX.Element => {
    const { children } = props
    const isLoggedIn: boolean = localStorage.getItem('logged_user') !== null;
    const location = useLocation()
    const user = useAppSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const getUserInformation = async () => {
      try {
        const response = await getUserData(localStorage.getItem('logged_user')!)
        dispatch(setUser({user: {...response.user, token: response.token}}))
      } catch (err) {
        localStorage.remove.Item('logged_user')
        navigate('/login')
      }
    }
    useEffect(()=> {
      if(!user.id && isLoggedIn) {
        getUserInformation()
      }
    },[isLoggedIn])
  
    return isLoggedIn ? (
      <>{children}</>
    ) : (
      <Navigate
        replace={true}
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

export default PrivateRoute