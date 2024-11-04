import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../css/LoginPage.css';
import TextCarrusel from '../pages/extras/Carrusel.jsx'
import viaje from '../assets/viaje.jpg';
import comerza from '../assets/comerza.png'
import comerza2 from '../assets/comerza2.png'

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { signIn, user, errors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signIn(values);
    } catch (error) {
      if (error.response && error.response.data) {
        handleError(error.response.data.errorCode, error.response.data.message);
      } else {
        message.error("Error de conexión al servidor");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && user && user.success) {
      localStorage.setItem("token", user.token); 
      message.success(user.message);
      if(user.user.role == 'admin'){
        navigate("/orders");
      }else{
        navigate("/repartidor/orders");
      }
      
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (errors && errors.length > 0) {
      errors.forEach((error) => {
        handleError(error.data.errorCode, error.data.message); 
      });
    }
  }, [errors]);

  const handleError = (errorCode, errorMessage) => {
    switch (errorCode) {
      case "USER_NOT_FOUND":
        message.error("El usuario no existe. Por favor, verifica tu correo.");
        break;
      case "INVALID_CREDENTIALS":
        message.error("La contraseña es incorrecta. Intenta nuevamente.");
        break;
      case "SERVER_ERROR":
        message.error("Ocurrió un error en el servidor. Intenta más tarde.");
        break;
      default:
        message.error(errorMessage || "Error desconocido");
    }
  };

  return (
    <div className="LoginContent">
    <Form className="LoginForm" layout="vertical" onFinish={onFinish}>
      <img className="ComerzaLogo" src={comerza} alt="ComerzaLogo" />
      <div className="Bienvenidos"><h1>COMERZA</h1><h2>Comienza el camino</h2></div>
      <Form.Item className="EmailContent"
        label=""
        name="email"
        rules={[
          {
            required: true,
            message: "Ingresa tu correo electrónico!",
          },
        ]}
      >
        <Input className="EmailInput" placeholder="Introduce tu correo" />
      </Form.Item>

      <Form.Item className="EmailContent"
        label=""
        name="password"
        rules={[
          { required: true, message: "Ingresa tu contraseña!" },
        ]}
      >
        <Input.Password  placeholder="Introduce tu contraseña" className="EmailInput"/>
      </Form.Item>

      <Form.Item >
        <Button className="BtnLogin" type="primary" htmlType="submit" loading={loading}>
          Inicia Sesión
        </Button>
      </Form.Item>
    </Form>
    <div className="ImgLogin">
    <img className="ComerzaLogoImg" src={comerza2} alt="ComerzaLogo" />
    <div className="BienvenidosImg"><h1>CON COMERZAR PODRAS...</h1></div>
     <img className="ViajeImg" src={viaje} alt="Viaje" />
     <TextCarrusel /> {}
    </div>
    </div>
  );
}
