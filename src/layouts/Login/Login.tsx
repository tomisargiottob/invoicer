import { Form, message, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./authentication.css";
import Spinner from "../../components/Spinner/Spinner";
import { setUser } from "../../store/UserSlice";
import { useDispatch } from 'react-redux'
import { login } from "../../requests/userRequest";

function Login() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const onFinish = async (values: {email: string, password: string}) => {
    try {
      setLoading(true);
      const response = await login(values)
      localStorage.setItem(
        "logged_user",
        response.token
      );
      dispatch(setUser({user: {...response.user, token: response.token}}))
      setLoading(false);
      message.success("Login successful");
      navigate("/");
    } catch (error) {
      console.log(error)
      setLoading(false);
      message.error("Login failed");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("logged_user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register">
      {loading && <Spinner />}
      <div className="row justify-content-center align-items-center w-100 h-100">
        <div className="col-md-4">
          <Form layout="vertical" onFinish={onFinish}>
            <h1>LOGIN</h1>

            <Form.Item label="Email" name="email" rules={[ { message: "Please enter your email!", required: true } ]}>
              <Input autoComplete="on" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[ { message: "Please enter your password!", required: true } ]}>
              <Input autoComplete="on" type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-login">
                <button className="btn btn-outline-light" type="submit">
                  LOGIN
                </button>
              </div>
              <Link to="/register" className="linkTo">
                Not Registered Yet , Click Here To Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
