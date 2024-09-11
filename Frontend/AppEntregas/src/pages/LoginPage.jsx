import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

//TODO: Arreglar error usuario null antes de autenticar

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAuthenticated } = useAuth()
  const navigate = useNavigate();
  const onFinish  = async (values) => {
    setLoading(true);
    try {
      //const response = {
      //  data: { token: "dsdr34534", message: "Logeado con éxito" },
      //  values: values,
      //};
      //console.log(values)
      await signIn(values);
      
      console.log(user)
      
      if (user && user.success) {
        localStorage.setItem('token', user.token);
        message.success(user.message);
        
      } else {
        handleError(user.errorCode, user.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        handleError(error.response.data.errorCode, error.response.data.message);
      } else {
        console.log(error)
        message.error("Error de conexión al servidor");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleError = (errorCode, errorMessage) => {
    switch (errorCode) {
      case 'USER_NOT_FOUND':
        message.error('El usuario no existe. Por favor, verifica tu correo.');
        break;
      case 'INVALID_CREDENTIALS':
        message.error('La contraseña es incorrecta. Intenta nuevamente.');
        break;
      case 'SERVER_ERROR':
        message.error('Ocurrió un error en el servidor. Intenta más tarde.');
        break;
      default:
        message.error(errorMessage || 'Error desconocido');
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Correo Electrónico"
        name="email"
        rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico!' }]}
      >
        <Input placeholder="Introduce tu correo" />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
      >
        <Input.Password placeholder="Introduce tu contraseña" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  );
}
