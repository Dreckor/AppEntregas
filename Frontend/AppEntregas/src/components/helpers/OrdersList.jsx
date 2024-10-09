import { Table, Tag, Button } from "antd";
import { useNavigate } from 'react-router-dom';
import './OrdersList.css'

const OrdersList = ({ orders }) => {
  const navigate = useNavigate();
  const columns = [
    { 
      title: "Número de Seguimiento",
      key: "trakingAndState",
      render: (record) => {
        let color = "blue";
        if (record.state === "Entregado") {
          color = "green";
        } else if (record.state === "Pendiente") {
          color = "orange";
        } else if (record.state === "En camino") {
          color = "geekblue";
        }
        return (
          <div className="infoped">
            <div>{record.trakingNumber}</div> {}
            <Tag color={color} style={{ marginTop: '8px' }}>{record.state.toUpperCase()}</Tag> {}
          </div>
        );
      },
    },
    {
      title: "Punto Inicial",
      dataIndex: "initialPoint",
      key: "initialPoint",
      render: (initialPoint) => initialPoint.name,
    },
    {
      title: "Punto de Destino",
      dataIndex: "destinyPoint",
      key: "destinyPoint",
      render: (destinyPoint) => destinyPoint.name,
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
      render: (_, record) => <Button className="viewdetails" type="primary" onClick={() => navigate(`/orders/${record._id}`, { state: { order: record } })}>
      Ver Detalles
    </Button>,
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 7 }}
    />
  );
};

export default OrdersList;
