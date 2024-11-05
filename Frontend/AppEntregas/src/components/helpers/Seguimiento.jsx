import { Steps } from 'antd';

const formatOrderHistory = (orderHistory) => {
  return orderHistory.map(item => {
    // Convertir la fecha a un formato legible
    const date = new Date(item.startedDate);
    const formattedDate = date.toLocaleString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Check if stateLabel exists and has a name property
    const stateLabel = item.stateLabel || {};
    const title = stateLabel.name || 'Estado desconocido'; // Provide a fallback title

    return {
      title,
      description: `${formatDescription(stateLabel.name)} - ${formattedDate}`
    };
  });
};

// Puedes ajustar las descripciones de estado aquí
const formatDescription = (stateLabel) => {
  switch (stateLabel) {
    case 'En camino':
      return 'Va en camino';
    case 'Preparación':
      return 'Estamos generando tu orden';
    case 'Alistamiento':
      return 'Hemos alistado tu paquete';
    case 'Salida de la sucursal':
      return 'El repartidor salió de la sucursal';
    case 'Último trayecto':
      return 'Último trayecto';
    default:
      return stateLabel;
  }
};

function Seguimiento({ history }) {
  if (!Array.isArray(history)) {
    return <p>No hay historial de órdenes disponible.</p>;
  }

  const formattedOrderHistory = formatOrderHistory(history);
  const current = formattedOrderHistory.length - 1;

  return (
    <div className="steps-container">
      <Steps current={current} direction="vertical" items={formattedOrderHistory} />
    </div>
  );
}

export default Seguimiento;
