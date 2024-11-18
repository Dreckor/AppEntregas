import { Pie } from '@ant-design/plots';
import { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
const ProductCategoryChart = ({states}) => {

  const [data, setData] = useState(states)
  useEffect(()=>{
    setData(states)
  }, [states])

  const config = {
    data,
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    
    interactions: [{ type: 'element-active' }],
  };

  return <Pie {...config} />;
};

export default ProductCategoryChart;