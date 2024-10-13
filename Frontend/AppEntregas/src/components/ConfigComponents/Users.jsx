import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'repartidor' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingUser) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
      } else {
        const newUser = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          ...values,
        };
        setUsers([...users, newUser]);
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<UserOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16, backgroundColor: '#52c41a' }}
      >
        Agregar usuario
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" />
      <Modal
        title={editingUser ? 'Editar usuario' : 'Agregar usuario'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Ingrese un nombre!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Ingrese un correo' },
              { type: 'email', message: 'El correo no es valido' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Seleccione un ro' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="repartidor">Repartidor</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
