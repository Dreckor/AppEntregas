import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Descriptions, Button, Select, notification } from "antd";
import { InvoiceContext } from "../../context/InvoiceContext.jsx";
import { useInvoices } from "../../context/InvoiceContext";
import "../../css/OrderDetail.css";
import comerza from "../../assets/comerza.png";

const { Option } = Select;

const InvoiceDetails = () => {
  const { updateInvoice, cancellInvoice } = useInvoices();
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceId } = useParams(); // Obtener el ID de la URL
  const { invoice: locationInvoice } = location.state || {};
  const [invoice, setInvoice] = useState(locationInvoice || null); // Estado local de la factura
  const { getInvoice, loading, error } = useContext(InvoiceContext);
  const [state, setState] = useState("pending"); // Estado de la factura inicializado en 'pending'
  const printDetails = () => {
    window.print();
  };
  const totalValorDeclarado = invoice?.products?.reduce(
    (total, product) => total + (product.valorDeclarado || 0),
    0
  );
  // Obtener la factura si no está disponible localmente
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoice) {
        try {
          console.log(invoiceId);
          const fetchedInvoice = await getInvoice(invoiceId);
          if (fetchedInvoice) {
            setInvoice(fetchedInvoice);
            setState(fetchedInvoice.status || "pending"); // Actualizar el estado solo si fetchedInvoice es válido
          } else {
            notification.error({ message: "Factura no encontrada" });
          }
        } catch (err) {
          console.log("Error fetching invoice:", err);
          notification.error({ message: "Error al obtener la factura" });
        }
      } else {
        setState(invoice.status); // Asegúrate de que invoice tenga un estado definido
      }
    };

    fetchInvoice();
  }, [invoiceId, invoice, getInvoice]);

  // Manejo de actualización del estado de la factura
  const handleUpdate = async () => {
    try {
      await updateInvoice(invoice._id, state);
      notification.success({ message: "Factura actualizada correctamente" });
      navigate("/invoices");
    } catch (error) {
      console.error(error);
      notification.error({ message: "Error al actualizar la factura" });
    }
  };

  // Manejo de cancelación de la factura
  const handleDelete = async () => {
    try {
      await cancellInvoice(invoice._id);
      notification.success({ message: "Factura cancelada correctamente" });
      navigate("/invoices");
    } catch (error) {
      notification.error({ message: "Error al cancelar la factura" });
    }
  };

  if (loading) return <div>Cargando la factura...</div>;
  if (error) return <div>Error: {error}</div>;

  // Renderizado seguro cuando los datos de la factura están disponibles
  return (
    <>
      <div className="logoPrint">
        <img className="ComerzaLogo" src={comerza} alt="ComerzaLogo" />
        <div className="Bienvenidos">
          <h1>COMERZA</h1>
        </div>{" "}
      </div>
      {invoice ? (
        <div className="detallesord">
          <Descriptions
            title="Detalles de la factura"
            bordered
            className="print-section"
          >
            <Descriptions.Item label="Título">
              Factura #{invoice.invoiceNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Cliente">
              {invoice.customer?.username || "N/A"} -{" "}
              {invoice.customer?.address || "Sin dirección"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              <Select value={state} onChange={(value) => setState(value)}>
                <Option value="unpaid">Sin pagar</Option>
                <Option value="pending">Pendiente</Option>
                <Option value="paid">Pagada</Option>
                <Option value="cancelled">Cancelada</Option>
              </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Productos">
              {invoice.products?.length > 0 ? (
                <ul>
                  {invoice.products.map((product, index) => (
                    <li key={index}>
                      <li key={index}>
                        <strong>
                          {product?.productLabel || "Sin etiqueta"}
                        </strong>
                        <br />- Unidades: {product?.productUnits || 0}
                        <br />- Peso: {product?.kilos || 0} Kg
                        <br />- Coste: {product?.cost || 0}
                        <br />- Tipo de cobro: {product?.tipoDeCobro || 0}
                      </li>
                    </li>
                  ))}
                </ul>
              ) : (
                "Sin productos"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha de emisión">
              {new Date(invoice.issueDate).toLocaleDateString()}{" "}
              {/* Formato amigable de fecha */}
            </Descriptions.Item>
            <Descriptions.Item label="Valor neto">
              {`${invoice.netAmount?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`}{" "}
              {/* Chequeo de valor y formateo */}
            </Descriptions.Item>
            <Descriptions.Item label="Valor IVA">
              {`${invoice.taxAmount?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`}
            </Descriptions.Item>
            <Descriptions.Item label="Coste embalaje">
              {`${invoice.packaging?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`}
            </Descriptions.Item>
            <Descriptions.Item label="Valor total">
              {`${invoice.totalAmount?.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`}
            </Descriptions.Item>

            <Descriptions.Item label="Valor asegurado">
              {invoice?.insurance.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Valor declarado total">
              {totalValorDeclarado.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Otros impuestos">
              {invoice?.otherTaxes.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </Descriptions.Item>
            <Descriptions.Item label="Aduanas">
              {invoice?.customsDuty.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div>No se pudo cargar la factura.</div>
      )}

      <div className="detailsbt">
        <Button
          className="Botondetails"
          type="primary"
          onClick={handleUpdate}
          style={{ marginRight: 10 }}
        >
          Actualizar
        </Button>
        <Button
          className="Botondetails"
          danger
          onClick={handleDelete}
          style={{ marginRight: 10 }}
        >
          Cancelar factura
        </Button>
        <Button className="Botondetails" onClick={() => navigate(-1)}>
          Regresar
        </Button>
        <Button
          className="Botondetails"
          type="primary"
          onClick={printDetails}
          style={{ marginRight: 10 }}
        >
          Imprimir Factura
        </Button>
      </div>
    </>
  );
};

export default InvoiceDetails;
