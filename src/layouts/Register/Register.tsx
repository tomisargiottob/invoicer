import { Form, message, Input } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./authentication.css";
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values: {name: string, email: string, password: string}) => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/users/register`, values);
      message.success("Registration Successfull");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("logged_user")) {
      navigate("/");
    }
  }, [navigate]);

  const validateName = (_:any, value: string) => {
    return value.length >= 4 ? Promise.resolve() : Promise.reject(new Error("Name need minimum of 4 characters"))
  }

  const validatePassword = (_:any, value: string) => {
    const validationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return validationRegex.test(value) ? Promise.resolve() : Promise.reject(new Error("Password does not matches the criteria"))
  }

  return (
    <div className="register">
      {loading && <Spinner />}
      <div className="row justify-content-center align-items-center w-100 h-100">
        <div className="col-md-4">
          <Form layout="vertical" onFinish={onFinish}>
            <h1>REGISTER</h1>

            <Form.Item label="Name" name="name"
                       rules={[{message: "Name should have minimum 4 characters!", validator: validateName, required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item label="Organization Name" name="organization" rules={[ { message: "Please enter your organization name!", required: true } ]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email"
                       rules={[{message: "Email should be valid!", type: "email", required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password"
                       rules={[{message: "Password must contain at least 8 characters, includes 1 number, 1 lowercase and uppercase letters and 1 special character", validator: validatePassword, required: true}]}>
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-login">
                <button className="btn btn-outline-light" type="submit">
                  REGISTER
                </button>
              </div>
              <Link to="/login" className="linkTo">
                Already Registered? Click Here To Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
