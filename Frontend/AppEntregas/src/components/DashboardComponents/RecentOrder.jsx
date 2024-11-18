/* eslint-disable react/prop-types */

import { Table, Tag } from 'antd';

const RecentOrders = ({orders}) => {
  console.log(orders)
  const stateFilters = orders?.reduce((filters, order) => {
    const stateName = order?.state?.name ? order.state.name.toUpperCase() : 'SIN ESTADO';
    if (!filters.some(filter => filter.text === stateName)) {
      filters.push({ text: stateName, value: stateName });
    }
    return filters;
  }, []);
  const columns = [
    {
      title: 'Order',
      dataIndex: 'orderTitle',
      key: 'orderTitle',
    },
    {
      title: 'Número de Seguimiento',
      dataIndex: 'trakingNumber',
      key: 'trakingNumber',
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      render: (trakingNumber) => trakingNumber || 'N/A',
      className: 'listseg',
    },
    {
      title: 'Estado',
      key: 'state',
      dataIndex: 'state',
      filters: stateFilters,
      onFilter: (value, record) => {
        const stateName = record?.state?.name ? record.state.name.toUpperCase() : 'SIN ESTADO';
        return stateName === value;
      },
      render: (state) => {
        const color = state?.color || 'blue';
        return (
          <Tag className="Estadosbtn" color={color} style={{ marginTop: '8px' }}>
            {state?.name ? state.name.toUpperCase() : 'SIN ESTADO'}
          </Tag>
        );
      },
    },
    
    {
      title: 'Cliente',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.username || 'Anónimo',
    },
  ];


  return (
    <Table columns={columns} dataSource={orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} rowKey="id" pagination={false} />
  );
};

export default RecentOrders;
