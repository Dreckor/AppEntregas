import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, theme, Descriptions, Skeleton } from "antd";
import { useOrders } from "../context/OrderContext";
import Seguimiento from "../components/helpers/Seguimiento";

const { Content, Sider } = Layout;

const DetallesOrden = ({ order }) => {
  return (
    <Descriptions title="Detalles de la Orden" bordered>
      <Descriptions.Item label="Título">{order.orderTitle}</Descriptions.Item>
      <Descriptions.Item label="Estado">{order.state}</Descriptions.Item>
      <Descriptions.Item label="Punto Inicial">{order.initialPoint}</Descriptions.Item>
      <Descriptions.Item label="Destino">{order.destinyPoint}</Descriptions.Item>
      <Descriptions.Item label="Número de Seguimiento">{order.trakingNumber}</Descriptions.Item>
      <Descriptions.Item label="Productos">
        {order.products && order.products.length > 0 ? (
          <ul>
            {order.products.map((product, index) => (
              <li key={index}>
                {product.productLabel} - Unidades: {product.productUnits}
              </li>
            ))}
          </ul>
        ) : (
          "Sin productos"
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Cliente">
        Cliente: {order.user?.username}, Dirección: {order.user?.address}
      </Descriptions.Item>
    </Descriptions>
  );
};

// Extraer el Layout en una constante
const OrderLayout = ({ children, order }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        padding: "24px 0",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Sider
        style={{
          background: colorBgContainer,
        }}
        width={200}
      >
        {order.history && <Seguimiento history={order.history} />}
      </Sider>
      <Content
        style={{
          padding: "0 24px",
          minHeight: 280,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

function OrderByTrakingName() {
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const { getOrder } = useOrders();
  const { trakingnumber } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true); // Iniciar el estado de carga
        const response = await getOrder(trakingnumber);
        setOrder(response);
      } catch (error) {
        console.error("Error al obtener la orden:", error);
      } finally {
        setLoading(false); // Terminar el estado de carga
      }
    };

    if (trakingnumber) {
      fetchOrder();
    }
  }, [trakingnumber, getOrder]);

  return (
    <>
      {loading ? (
        <Skeleton active /> 
      ) : (
        <OrderLayout order={order}>
          <DetallesOrden order={order} />
        </OrderLayout>
      )}
    </>
  );
}

export default OrderByTrakingName;
