import { Table, Tag, Button } from "antd";
import { useNavigate } from 'react-router-dom';

const OrdersList = ({ orders }) => {
  const navigate = useNavigate();
  const columns = [
    {
      title: "Título de la Orden",
      dataIndex: "orderTitle",
      key: "orderTitle",
    },
    {
      title: "Estado",
      dataIndex: "state",
      key: "state",
      render: (state) => {
        let color = "blue";
        if (state === "Entregado") {
          color = "green";
        } else if (state === "Pendiente") {
          color = "orange";
        } else if (state === "En camino") {
          color = "geekblue";
        }
        return <Tag color={color}>{state.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Punto Inicial",
      dataIndex: "initialPoint",
      key: "initialPoint",
    },
    {
      title: "Punto de Destino",
      dataIndex: "destinyPoint",
      key: "destinyPoint",
    },
    {
      title: "Número de Seguimiento",
      dataIndex: "trakingNumber",
      key: "trakingNumber",
    },
    {
      title: "Productos",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <>
          {products.length > 0 ? (
            products.map((product, index) => (
              <Tag color="purple" key={index}>
                {product.productLabel} - Unidades: {product.productUnits}
              </Tag>
            ))
          ) : (
            <Tag color="red">Sin productos</Tag>
          )}
        </>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "user",
      key: "user",
      render: (user) => user.username,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => <Button type="primary" onClick={() => navigate(`/orders/${record._id}`, { state: { order: record } })}>
      Ver Detalles
    </Button>,
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default OrdersList;
