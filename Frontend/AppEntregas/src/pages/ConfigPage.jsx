import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons';
import Users from '../components/ConfigComponents/Users.jsx';
import Puntos from '../components/ConfigComponents/Puntos.jsx';
import Categorias from '../components/ConfigComponents/Categorias.jsx';

const { Content, Sider } = Layout;

const App = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('users');

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Usuarios':
        return <Users />;
      case 'Puntos':
        return <Puntos />;
      case 'categorias':
        return <Categorias />;
      default:
        return <Users />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['Usuarios']}
          style={{ height: '100%', borderRight: 0 }}
          onClick={(e) => setSelectedMenuItem(e.key)}
        >
          <Menu.Item key="Usuarios" icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item key="Puntos" icon={<EnvironmentOutlined />}>
            Points
          </Menu.Item>
          <Menu.Item key="categorias" icon={<AppstoreOutlined />}>
            Categories
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
