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
  Checkbox
} from "antd";
import { useOrders } from "../context/OrderContext";
import { useInvoices } from "../context/InvoiceContext";
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
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [checkIva, setCheckIva] = useState(false);
  const [ivaPrice, setIvaPrice] = useState(0);
  const [packaging, setPackaging] = useState(false);
  const [productPrice, setProductPrice] = useState(0);

  const { createOrder } = useOrders();
  const { createNewInvoice } = useInvoices();
  const { getUsers } = useAuth();
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
  
  const recalculateSubTotalPrice = (updatedProducts, packaging) => {
    const total = updatedProducts.reduce((sum, product) => {
      const category = config.productCategories.find(
        (cat) => cat._id === product.productCategory
      );
      return sum + (category ? category.pricePerKilo * product.kilos : 0);
    }, 0);
  
    // Si packaging está seleccionado, se suma 10 al total
    const finalTotal = packaging ? total + config.packagingCost : total;
    setSubTotalPrice(finalTotal);
    recalculateTotalPrice(finalTotal, checkIva)
  };
  const recalculateTotalPrice = (subTotal, chkIva) => {
    const ivaConfig = config.iva
    const ivaCost = chkIva ?  subTotal * (ivaConfig / 100): 0
    setIvaPrice(ivaCost)
    // Si IVa está seleccionado
    const finalTotal = chkIva ? subTotal + ivaCost : subTotal;
    setTotalPrice(finalTotal);
  };
  
  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      const invoice = await createNewInvoice({
        products,
        totalCost: totalPrice,
        netCost: subTotalPrice,
        packaging: packaging,
        hasIva: checkIva,
        userId: values.userId
      });
      console.log(invoice)
      await createOrder({
        ...values,
        products,
        totalCost: totalPrice,
        netCost: subTotalPrice,
        packaging: packaging,
        hasIva: checkIva,
        invoice: invoice._id
      });
      
      //console.log(values);
      //console.log(products);
      navigate("/orders");
      message.success("Orden creada exitosamente");
    } catch (error) {
      console.log(error)
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
      cost: 0,
    });
    setProductModalVisible(true);
  };
  const handleIVAChange = (value) => {

    setCheckIva(value);
  
    recalculateTotalPrice(subTotalPrice, value);
  };
  const handlePackagingChange = (value) => {
    setPackaging(value);
    recalculateSubTotalPrice(products, value);
  };
  
  const handleEditProduct = (index) => {
    setEditingProduct({ ...products[index], index });
    setProductModalVisible(true);
  };
  
  const handleSaveProduct = () => {
    let updatedProducts;
  
    if (editingProduct.index !== undefined) {
      updatedProducts = [...products];
      updatedProducts[editingProduct.index] = editingProduct;
    } else {
      updatedProducts = [...products, { ...editingProduct, index: products.length }];
    }
  
    setProducts(updatedProducts);
  
    // Recalcular el precio total con los productos actualizados
    recalculateSubTotalPrice(updatedProducts, packaging);
  
    setProductModalVisible(false);
    setEditingProduct(null);
  };
  
  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  
    // Recalcular el precio total después de eliminar un producto
    recalculateSubTotalPrice(updatedProducts, packaging);
  };
  
  const handleCategoryChange = (categoryId) => {
    const category = config.productCategories.find((cat) => cat._id === categoryId);
    const cost = category ? category.pricePerKilo * editingProduct.kilos : 0;
    setProductPrice(cost); // Update product price based on category and kilos
    setEditingProduct({
      ...editingProduct,
      productCategory: categoryId,
      cost, // Update the product's cost
    });
  };
  
  const handleKilosChange = (kilos) => {
    const category = config.productCategories.find((cat) => cat._id === editingProduct.productCategory);
    const cost = category ? category.pricePerKilo * kilos : 0;
    setProductPrice(cost); // Update product price when kilos change
    setEditingProduct({
      ...editingProduct,
      kilos,
      cost, // Update the product's cost
    });
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
            {config &&
            config.states &&
            config.states.length > 0 ? (
              config.states.map((state) => (
                <Option key={state._id} value={state._id}>
                  {state.name}
                </Option>
              ))
            ) : (
              <Option disabled>No hay estados disponibles, revise la configuración del panel</Option>
            )}
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
        <h4>Embalaje: ${packaging? config.packagingCost : 0 }</h4>
        <h4>Subtotal: ${subTotalPrice.toFixed(2)}</h4>
        <h4>IVA: ${ivaPrice.toFixed(2)}</h4>
        <h2>Total: ${totalPrice.toFixed(2)}</h2>
        
        <Form.Item
          label="Cobrar embalaje"
          name="packaging"
          rules={[
            { required: false },
          ]}
        >
        <Checkbox onChange={(e) =>
                  handlePackagingChange(
                     e.target.checked,
                  )
                }/>
        </Form.Item>
        <Form.Item
          label="Cobrar IVA"
          name="hasIva"
          rules={[
            { required: false },
          ]}
        >
        <Checkbox onChange={(e) =>
                  handleIVAChange(
                     e.target.checked,
                  )
                }/>
        </Form.Item>
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
            <Form.Item label="Categoría del Producto">
              <Select
                placeholder="Selecciona una categoría"
                value={editingProduct?.productCategory || ""}
                onChange={handleCategoryChange}
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
            <Form.Item label="Unidades">
              <InputNumber
                name="productUnits"
                min={1}
                value={editingProduct?.productUnits}
                onChange={(value) =>
                  setEditingProduct({ ...editingProduct, productUnits: value })
                }
              />
            </Form.Item>
            <Form.Item label="Kilos">
              <InputNumber
                name="kilos"
                min={1}
                value={editingProduct?.kilos}
                onChange={handleKilosChange}
              />
            </Form.Item>
            <h3>Precio: ${productPrice.toFixed(2)}</h3> {/* Display the product price */}
          </Form>
        </Modal>
      </Form>
    </div>
  );
}
