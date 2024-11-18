import { Layout, Typography, Row, Col, Card, Space, DatePicker, Select, Button, Form } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  CarOutlined,
} from '@ant-design/icons';
import StatCard from '../components/DashboardComponents/StatCard.jsx';
import OrderStateChart from '../components/DashboardComponents/OrderStateChart.jsx';
import ProductCategoryChart from '../components/DashboardComponents/ProductCategoryChart.jsx';
import RecentOrders from '../components/DashboardComponents/RecentOrder.jsx';
import { useDashboard } from '../context/DashboardContext.jsx';
import { useConfig } from "../context/ConfigContext";
import { useAuth } from '../context/AuthContext.jsx';

import { useEffect, useState } from 'react';


const { Header, Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: null,
    assignedTo: null,
    state: null,
  });
  const {dashboard, fetchDashboard  } = useDashboard();
  const { getUsers } = useAuth();
  const { config, fetchConfig } = useConfig();
  const [repartidores, setRepartidores] = useState([]);

  useEffect(() => {
    const fetchUsersAndRepartidores = async () => {
      try {
        const response = await getUsers();
        const { repartidores } = response;
        setRepartidores(repartidores);

      } catch (error) {
        console.error("Error fetching repartidores:", error);

      }
    };
  
    fetchUsersAndRepartidores();
    fetchConfig(); // Fetch the initial configuration
  }, []);
  
  // Fetch data when filters change
  useEffect(() => {
    fetchDashboard(filters);
  }, [filters]);
  
  // Manejo de los cambios en los filtros
  const handleFilterChange = (changedValues) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...changedValues,
    }));
    
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Encabezado del Dashboard */}
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Title level={3} style={{ margin: 0 }}>Dashboard</Title>
          <Typography.Text type="secondary">
            Fecha actualizada: {new Date().toLocaleString()}
          </Typography.Text>
        </Row>
      </Header>

      {/* filtros */}
      <Content style={{ padding: '24px' }}>
        <Card>
          <Form layout="inline" onValuesChange={handleFilterChange}>
            <Form.Item label="Rango de fechas" name="dateRange">
              <RangePicker />
            </Form.Item>

            <Form.Item label="Repartidor" name="assignedTo">
              <Select
                placeholder="Selecciona un Repartidor"
                style={{ width: 200 }}
                allowClear
              >
                {repartidores?.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.username}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Estado" name="state">
              <Select placeholder="Selecciona un estado" style={{ width: 200 }} allowClear>
                {config?.states.map((state) => (
                  <Option key={state._id} value={state._id}>
                    {state.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
             
            </Form.Item>
          </Form>
        </Card>

      {/* Contenido principal del Dashboard */}

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Tarjetas de estadísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Ordenes"
                value={dashboard?.totalOrders.count || 0}
                change={dashboard?.totalOrders.change || 0}
                icon={<ShoppingCartOutlined />}
                trend={dashboard?.totalOrders.trend || 0}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Balance"
                value={dashboard?.totalRevenue.amount.toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}
                change={dashboard?.totalRevenue.change || 0}
                icon={<DollarOutlined />}
                trend={dashboard?.totalRevenue.trend || 0}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Ordenes en curso"
                value={dashboard?.activeDeliveries.count || 0}
                change={dashboard?.activeDeliveries.change || 0}
                icon={<CarOutlined />}
                trend={dashboard?.activeDeliveries.trend || 0}
              />
            </Col>
          </Row>

          {/* Gráficas de órdenes y categorías de productos */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Distribucion estado de ordenes">
                <OrderStateChart states={dashboard?.orderStateDistribution || []}/>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Product Categories">
                <ProductCategoryChart states={dashboard?.productCategoryDistribution || []} />
              </Card>
            </Col>
          </Row>

          {/* Lista de órdenes recientes y mapa de entregas */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Recent Orders">
                <RecentOrders orders={dashboard?.recentOrders.recentOrders || []}/>
              </Card>
            </Col>
            
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};

export default Dashboard;
