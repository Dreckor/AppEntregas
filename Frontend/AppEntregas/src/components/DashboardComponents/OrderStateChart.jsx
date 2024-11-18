import { Column } from '@ant-design/plots';
import { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const OrderStateChart = ({states}) => {
  const [data, setData] = useState(states)
  useEffect(()=>{
    setData(states)
  },[states])
 
  const config = {
    data,
    xField: 'state',
    yField: 'value',
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      state: {
        alias: 'Order State',
      },
      value: {
        alias: 'Percentage',
        formatter: (v) => `${v}%`,
      },
    },
    color: ({ state }) => {
      const colors = {
        'Pending': '#1890ff',
        'In Transit': '#faad14',
        'Delivered': '#52c41a',
      };
      return colors[state] || '#888888';
    },
  };

  return <Column {...config} />;
};

export default OrderStateChart;