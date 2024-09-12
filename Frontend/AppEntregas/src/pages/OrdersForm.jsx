import { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// TODO: Arreglar tipo de dato productos
const { Option } = Select;

export default function OrdersForm() {
  const [loading, setLoading] = useState(false);
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      
      await createOrder({
        ...values,
        userId: user._id, 
      });
      message.success("Orden creada exitosamente");
      navigate("/orders"); 
    } catch (error) {
      message.error("Error creando la orden");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Crear Nueva Orden</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Título de la Orden"
          name="orderTitle"
          rules={[{ required: true, message: "Por favor ingresa un título para la orden" }]}
        >
          <Input placeholder="Introduce el título de la orden" />
        </Form.Item>

        <Form.Item
          label="Estado"
          name="state"
          rules={[{ required: true, message: "Por favor selecciona un estado" }]}
        >
          <Select placeholder="Selecciona un estado">
            <Option value="pending">Pendiente</Option>
            <Option value="inProgress">En Progreso</Option>
            <Option value="completed">Completada</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Punto Inicial"
          name="initialPoint"
          rules={[{ required: true, message: "Por favor ingresa el punto inicial" }]}
        >
          <Input placeholder="Introduce el punto inicial" />
        </Form.Item>

        <Form.Item
          label="Punto de Destino"
          name="destinyPoint"
          rules={[{ required: true, message: "Por favor ingresa el punto de destino" }]}
        >
          <Input placeholder="Introduce el punto de destino" />
        </Form.Item>

        <Form.Item
          label="Productos"
          name="products"
          rules={[{ required: true, message: "Por favor ingresa los productos de la orden" }]}
        >
          <Input placeholder="Introduce los productos" />
        </Form.Item>

        <Form.Item
          label="Asignar a Usuario"
          name="assignedUserId"
          rules={[{ required: true, message: "Por favor selecciona un usuario asignado" }]}
        >
          <Select placeholder="Selecciona un usuario asignado">
            <Option value="userId1">Usuario 1</Option>
            <Option value="userId2">Usuario 2</Option>
            <Option value="userId3">Usuario 3</Option>
            {/* You can map the actual users here */}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Orden
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
