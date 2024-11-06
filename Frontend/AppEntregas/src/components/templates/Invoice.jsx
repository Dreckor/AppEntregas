const Invoice = ({ invoice }) => {
  const { invoiceNumber, customer, products, packaging, totalAmount, taxAmount, netAmount, status, issueDate } = invoice;

  return (
    <div className="invoice-container" style={{ margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Factura #{invoiceNumber}</h2>
      <div>
        <p><strong>Cliente ID:</strong> {customer.username}</p>
        <p><strong>Fecha de emisión:</strong> {new Date(issueDate).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> {status.charAt(0).toUpperCase() + status.slice(1)}</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Producto</th>
            <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Unidades</th>
            <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Kilos</th>
            <th style={{ borderBottom: '1px solid black', padding: '8px' }}>Costo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ padding: '8px' }}>{product.productLabel}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{product.productUnits}</td>
              <td style={{ padding: '8px', textAlign: 'center' }}>{product.kilos}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{product.cost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <p><strong>Subtotal:</strong> {netAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        <p><strong>Impuestos:</strong> {taxAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        <p><strong>Empaque:</strong> {packaging.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        <p><strong>Total:</strong> {totalAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
      </div>

      <button  className="Print"
        onClick={() => window.print()} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Imprimir Factura
      </button>
    </div>
  );
};

export default Invoice;
