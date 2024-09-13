import { useState } from "react";
import { Form, Input, Button, Select, Modal, message } from "antd";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
// TODO: Arreglar tipo de dato productos
const { Option } = Select;

export default function OrdersForm() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [products, setProducts] = useState([]);
  const [productModalVisible, setProductModalVisible] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState(null);
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

  const handleAddProduct = () => {
    setEditingProduct({ name: "", quantity: 1 });
    setProductModalVisible(true);
  };

  const handleEditProduct = (index) => {
    setEditingProduct(products[index]);
    setProductModalVisible(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct.index !== undefined) {
      const updatedProducts = [...products];
      updatedProducts[editingProduct.index] = editingProduct;
      setProducts(updatedProducts);
    } else {
      setProducts([...products, editingProduct]);
    }
    setProductModalVisible(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
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

        <Form.Item label="Productos">
        <Button type="dashed" onClick={handleAddProduct} icon={<PlusOutlined />}>
          Añadir Productos
        </Button>
        {products.map((product, index) => (
          <div key={index} style={{ marginTop: 10 }}>
            <span>{product.name} - Unidades: {product.quantity}</span>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditProduct(index)}
            />
            <Button
              type="link"
              danger
              onClick={() => handleDeleteProduct(index)}
            >
              Delete
            </Button>
          </div>
        ))}
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
            {/* Obtener usuarios reales*/}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Crear Orden
          </Button>
        </Form.Item>


        <Modal
        title="Añadir productos"
        open={productModalVisible}
        onOk={handleSaveProduct}
        onCancel={() => setProductModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Producto">
            <Input
              value={editingProduct?.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Unidades">
            <Input
              type="number"
              min={1}
              value={editingProduct?.quantity}
              onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>
      </Form>
    </div>
  );
}
