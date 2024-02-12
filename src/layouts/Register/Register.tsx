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
      await axios.post(`${import.meta.env.VITE_SERVER_URL}users/register`, values);
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
    return value.length >= 4 ? Promise.resolve() : Promise.reject(new Error("El nombre debe tener al menos 4 caracteres"))
  }

  const validatePassword = (_:any, value: string) => {
    const validationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return validationRegex.test(value) ? Promise.resolve() : Promise.reject(new Error("La contraseña no cumple los criterios"))
  }

  const validateEmail = (_:any, value: string) => {
    const validationRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return validationRegex.test(value) ? Promise.resolve() : Promise.reject(new Error("El mail no es valido"))
  }


  return (
    <div className="register">
      {loading && <Spinner />}
      <div className="row justify-content-center align-items-center w-100 h-100">
        <div className="col-md-4">
          <Form layout="vertical" onFinish={onFinish}>
            <h1>REGISTER</h1>

            <Form.Item label="Nombre" name="name"
                       rules={[{message: "El nombre debe tener al menos 4 letras!", validator: validateName, required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nombre de la organización" tooltip="Puede ser el mismo que el nombre" name="organization" rules={[ { message: "Por favor ingrese un nombre a la organización!", required: true } ]}>
              <Input />
            </Form.Item>
            <Form.Item label="Correo" name="email"
                rules={[{message: "El email no parece valido", validator: validateEmail, required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item label="Contraseña" name="password"
                       rules={[{message: "La contraseña debe tener 8 caracteres minimo, con al menos una mayuscula, minuscula, un numero y caracter especial", validator: validatePassword, required: true}]}>
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
