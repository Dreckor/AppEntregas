import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  message,
  Spin,
  InputNumber,
} from "antd";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import "../css/OrdersForm.css";

const { Option } = Select;

export default function OrdersForm() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [repartidores, setRepartidores] = useState([]);
  const [dataloading, setDataloading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const { createOrder } = useOrders();
  const { getUsers, errors } = useAuth();
  const { config, fetchConfig } = useConfig();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndRepartidores = async () => {
      try {
        setDataloading(true);
        const response = await getUsers();
        const { users, repartidores } = response;

        setUsers(users);
        setRepartidores(repartidores);
        setDataloading(false);
      } catch (error) {
        console.error("Error fetching users and repartidores:", error);
        setDataloading(false);
      }
    };

    fetchUsersAndRepartidores();
    fetchConfig(); // Fetch the initial configuration
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createOrder({
        ...values,
        products,
      });
      console.log(values)
      console.log(products)
      message.success("Orden creada exitosamente");
      navigate("/orders");
    } catch (error) {
      message.error("Error creando la orden");
    }
    setLoading(false);
  };

  const handleAddProduct = () => {
    setEditingProduct({
      productLabel: "",
      productUnits: 1,
      productCategory: "",
      kilos: 1,
    });
    setProductModalVisible(true);
  };

  const handleEditProduct = (index) => {
    setEditingProduct(products[index]);
    setProductModalVisible(true);
  };

  const handleSaveProduct = () => {
    let updatedProducts;
  
    // Si estamos editando un producto existente
    if (editingProduct.index !== undefined) {
      updatedProducts = [...products];
      updatedProducts[editingProduct.index] = editingProduct;
    } else {
      // Si estamos agregando un nuevo producto
      updatedProducts = [...products, editingProduct];
    }
  
    // Actualiza los productos
    setProducts(updatedProducts);
  
    // Calcular el precio total basado en las categorías y kilos
    const total = updatedProducts.reduce((sum, product) => {
      console.log(product)
      const category = config.productCategories.find(
        (cat) => cat._id === product.productCategory // Asegúrate de que la comparación sea correcta
      );
  
      
  
      return sum + (category ? category.pricePerKilo * product.kilos : 0); // Asegúrate de que `kilos` está definido
    }, 0);
  
    setTotalPrice(total);
    console.log(total); // Debug: Verificar el total calculado
  
    // Cierra el modal y reinicia el estado de editingProduct
    setProductModalVisible(false);
    setEditingProduct(null);
  };
  

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);

    const total = updatedProducts.reduce((sum, product) => {
      const category = config.productCategories.find(
        (cat) => cat.categoryName === product.productCategory
      );
      return sum + (category ? category.pricePerKilo * product.kilos : 0);
    }, 0);

    setTotalPrice(total);
  };

  return (
    <div>
      <h1 className="Orderclass">Crear Nueva Orden</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Título de la Orden"
          name="orderTitle"
          rules={[
            {
              required: true,
              message: "Por favor ingresa un título para la orden",
            },
          ]}
        >
          <Input placeholder="Introduce el título de la orden" />
        </Form.Item>

        <Form.Item
          label="Asignar a cliente"
          name="userId"
          rules={[
            {
              required: true,
              message: "Por favor selecciona un cliente asignado",
            },
          ]}
        >
          <Select
            placeholder={
              dataloading
                ? "Cargando usuarios..."
                : "Selecciona un cliente asignado"
            }
            disabled={dataloading}
            notFoundContent={dataloading ? <Spin size="small" /> : null}
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Estado"
          name="state"
          rules={[
            { required: true, message: "Por favor selecciona un estado" },
          ]}
        >
          <Select placeholder="Selecciona un estado">
            <Option value="Pendiente">Pendiente</Option>
            <Option value="En camino">En Camino</Option>
            <Option value="Entregado">Entregado</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Punto Inicial"
          name="initialPoint"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el punto inicial",
            },
          ]}
        >
          <Select placeholder="Selecciona un punto de partida">
            {config &&
            config.departurePoints &&
            config.departurePoints.length > 0 ? (
              config.departurePoints.map((point) => (
                <Option key={point._id} value={point._id}>
                  {point.name}
                </Option>
              ))
            ) : (
              <Option disabled>No hay puntos de partida disponibles</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          label="Punto de Destino"
          name="destinyPoint"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el punto de destino",
            },
          ]}
        >
          <Select placeholder="Selecciona un punto de destino">
            {config &&
            config.deliveryPoints &&
            config.deliveryPoints.length > 0 ? (
              config.deliveryPoints.map((point) => (
                <Option key={point._id} value={point._id}>
                  {point.name}
                </Option>
              ))
            ) : (
              <Option disabled>No hay puntos de destino disponibles</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item label="Productos">
          <Button
            type="dashed"
            onClick={handleAddProduct}
            icon={<PlusOutlined />}
          >
            Añadir Productos
          </Button>
          {products.map((product, index) => (
            <div key={index} style={{ marginTop: 10 }}>
              <span>
                {product.productLabel} - Unidades: {product.productUnits} -
                Kilos: {product.kilos}
              </span>
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
                Eliminar
              </Button>
            </div>
          ))}
        </Form.Item>

        <h3>Total: ${totalPrice.toFixed(2)}</h3>

        <Form.Item
          label="Asignar a repartidor"
          name="asignedUserId"
          rules={[
            {
              required: true,
              message: "Por favor selecciona un repartidor asignado",
            },
          ]}
        >
          <Select
            placeholder={
              dataloading
                ? "Cargando repartidores..."
                : "Selecciona un repartidor asignado"
            }
            disabled={dataloading}
            notFoundContent={dataloading ? <Spin size="small" /> : null}
          >
            {repartidores.map((repartidor) => (
              <Option key={repartidor.id} value={repartidor.id}>
                {repartidor.username}
              </Option>
            ))}
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
          onCancel={() => {
            setProductModalVisible(false);
            setEditingProduct(null); 
          }}
        >
          <Form layout="vertical">
            <Form.Item label="Producto">
              <Input
                name="productLabel"
                value={editingProduct?.productLabel}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    productLabel: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item
      label="Categoría del Producto"
      //name="productCategory"
      rules={[
        {
          required: true,
          message: "Por favor selecciona una categoría de producto",
        },
      ]}
      
    >
      <Select
        placeholder="Selecciona una categoría"
        value={editingProduct?.productCategory || ""}
        selected={editingProduct?.productCategory != null || 0}
        onChange={(value) =>
          setEditingProduct({ ...editingProduct, productCategory: value })
        }
        
      >

        {config &&
        config.productCategories &&
        config.productCategories.length > 0 ? (
          config.productCategories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.categoryName}
            </Option>
          ))
        ) : (
          <Option disabled>No hay categorías disponibles</Option>
        )}
      </Select>
    </Form.Item>
            <Form.Item label="Kilos">
              <InputNumber
                name="kilos"
                min={1}
                value={editingProduct?.kilos}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, kilos: value })
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </Form>
    </div>
  );
}
