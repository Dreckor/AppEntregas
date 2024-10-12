import { Layout, Tabs } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import Users from "../components/ConfigComponents/Users.jsx";
import Puntos from "../components/ConfigComponents/Puntos.jsx";
import Categorias from "../components/ConfigComponents/Categorias.jsx";
import Estados from "../components/ConfigComponents/Estados.jsx";

const { Content } = Layout;

const App = () => {
  const items = [
    {
      key: "1",
      label: `Usuarios`,
      children: <Users />,
      icon: <UserOutlined />, // Aquí el contenido de la pestaña
    },
    {
      key: "2",
      label: `Puntos`,
      children: <Puntos />,
      icon: <EnvironmentOutlined />, // Aquí el contenido de la pestaña
    },
    {
      key: "3",
      label: `Categorias`,
      children: <Categorias />,
      icon: <AppstoreOutlined />, // Aquí el contenido de la pestaña
    },
    {
      key: "4",
      label: `Estados`,
      children: <Estados />,
      icon: <ScheduleOutlined />, // Aquí el contenido de la pestaña
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Tabs tabPosition="left" items={items} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
