import { Table, Tag, Button } from "antd";
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './OrdersList.css'

const OrdersList = ({ orders }) => {
  const navigate = useNavigate();

  // Generar filtros basados en los estados de las órdenes
  const stateFilters = orders?.reduce((filters, order) => {
    const stateName = order?.state?.name ? order.state.name.toUpperCase() : "SIN ESTADO";
    if (!filters.some(filter => filter.text === stateName)) {
      filters.push({ text: stateName, value: stateName });
    }
    return filters;
  }, []);

  const columns = [
    {
      title: "Número de Seguimiento",
      dataIndex: "trakingNumber",
      key: "trakingNumber",
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      render: (trakingNumber) => trakingNumber || "N/A",
    },
    {
      title: "Estado",
      key: "state",
      dataIndex: "state",
      filters: stateFilters,
      onFilter: (value, record) => {
        const stateName = record?.state?.name ? record.state.name.toUpperCase() : "SIN ESTADO";
        return stateName === value;
      },
      render: (state) => {
        let color = state?.color || "blue";
        return (
          <Tag color={color} style={{ marginTop: '8px' }}>
            {state?.name ? state.name.toUpperCase() : "SIN ESTADO"}
          </Tag>
        );
      },
    },
    {
      title: "Punto Inicial",
      dataIndex: "initialPoint",
      key: "initialPoint",
      render: (initialPoint) => initialPoint?.name || "No disponible",
    },
    {
      title: "Punto de Destino",
      dataIndex: "destinyPoint",
      key: "destinyPoint",
      render: (destinyPoint) => destinyPoint?.name || "No disponible",
    },
    {
      title: "Productos",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <>
          {products?.length > 0 ? (
            products.map((product, index) => (
              <Tag color="purple" key={index}>
                {product.productLabel || "Sin etiqueta"} - Unidades: {product.productUnits || 0} - Peso: {product.kilos || 0} Kg - Coste: ${product.cost || 0}
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
      render: (user) => user?.username || "Anónimo",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            className="viewdetails"
            type="primary"
            onClick={() => navigate(`/orders/${record._id}`, { state: { order: record } })}
            style={{ marginRight: 8 }}
          >
            Ver Detalles
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={() => navigate(`/invoice/${record.invoice}`, { state: { order: record } })}
          >
            Ver Factura
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 7 }}
    />
  );
};

export default OrdersList;
