import { Table, Tag, Button } from "antd";
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "./InvoicesList.css"

const InvoicesList = ({ invoices }) => {
  const navigate = useNavigate();

  // Generar filtros basados en los estados de las facturas
  const statusFilters = invoices?.reduce((filters, invoice) => {
    const status = invoice.status ? invoice.status.toUpperCase() : "SIN ESTADO";
    if (!filters.some(filter => filter.text === status)) {
      filters.push({ text: status, value: status });
    }
    return filters;
  }, []);

  const columns = [
    {
      title: "Número de Factura",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      sorter: (a, b) => a.invoiceNumber - b.invoiceNumber,
      render: (invoiceNumber) => invoiceNumber || "N/A",
    },
    {
      title: "Estado",
      key: "status",
      dataIndex: "status",
      filters: statusFilters,
      onFilter: (value, record) => {
        const status = record.status ? record.status.toUpperCase() : "SIN ESTADO";
        return status === value;
      },
      render: (status) => {
        let color = status === "CANCELLED" ? "red" : "green";
        return (
          <Tag color={color} style={{ marginTop: '8px' }}>
            {status ? status.toUpperCase() : "SIN ESTADO"}
          </Tag>
        );
      },
    },
    {
      className:"Datefac",
      title: "Fecha de Emisión",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => new Date(b.issueDate) - new Date(a.issueDate),
      render: (issueDate) => new Date(issueDate).toLocaleDateString(),
    },
    {
      className:"Clientfac",
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
      render: (customer) => customer || "No disponible",
    },
    {
      className:"ProductosLista2",
      title: "Productos",
      dataIndex: "products",
      key: "products",
      render: (products) => (
        <>
          {products?.length > 0 ? (
            products.map((product, index) => (
              <Tag color="purple" key={index}>
                 {product.productUnits || 0}{product.productLabel || "Sin etiqueta"}- Coste: ${product.cost || 0}
              </Tag>
            ))
          ) : (
            <Tag color="red">Sin productos</Tag>
          )}
        </>
      ),
    },
    {
      className:"Totalfac",
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => `$${totalAmount.toFixed(2)}`,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            className="viewdetails"
            type="primary"
            onClick={() => navigate(`/invoice/${record._id}`, { state: { invoice: record } })}
            style={{ marginRight: 8 }}
          >
            Ver Detalles
          </Button>
          <Button
          className="Viewfac"
            icon={<FileTextOutlined />}
            onClick={() => navigate(`/invoice/${record._id}/print`, { state: { invoice: record } })}
          >
            Ver Factura
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table className="ListOrders"
      dataSource={invoices.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 7 }}
    />
  );
};

export default InvoicesList;
