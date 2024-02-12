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
    
    useEffect(()=> {
      const getUserInformation = async () => {
        try {
          const response = await getUserData(localStorage.getItem('logged_user')!)
          dispatch(setUser({user: {...response.user, token: response.token, paymentRequired: response.paymentRequired, maxCuits: response.maxCuits}}))
        } catch (err) {
          localStorage.removeItem('logged_user')
          navigate('/login')
        }
      }
      if(!user.id && isLoggedIn) {
        getUserInformation()
      }
    },[isLoggedIn])

    useEffect(() => {
      if(user.paymentRequired && location.pathname !== '/profile') {
        navigate('/profile')
      }
    },[location, user])
  
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