/* eslint-disable react/prop-types */
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatCard = ({ title, value, change, icon, trend }) => {
  
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            background: '#f0f5ff',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '24px',
          }}
        >
          {icon}
        </div>
        <Statistic
          value={change}
          valueStyle={{ color: trend === 'up' ? '#3f8600' : '#cf1322', fontSize: '14px' }}
          prefix={trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        />
      </div>
      <Statistic title={title} value={value} valueStyle={{ fontSize: '24px' }} />
    </Card>
  );
};

export default StatCard;
