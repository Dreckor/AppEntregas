import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Divider, Popconfirm, message } from 'antd';
import { useUser } from '../../context/UserContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const Users = () => {
  const { users, repartidores, administradores, fetchUsers, updateUser, createUser, deleteUser, loading, error } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, [isModalVisible]);

  useEffect(() => {
    if (error && error.length > 0) {
      error.forEach((error) => {
        handleError(error.data.errorCode, error.data.message); 
      });
    }
  }, [error]);

  const handleError = (errorCode, errorMessage) => {
    switch (errorCode) {
      case "USER_NOT_FOUND":
        message.error("El usuario no existe. Por favor, verifica tu correo.");
        break;
      case "INVALID_CREDENTIALS":
        message.error("La contraseña es incorrecta. Intenta nuevamente.");
        break;
      case "SERVER_ERROR":
        message.error("Ocurrió un error en el servidor. Intenta más tarde.");
        break;
      default:
        message.error(errorMessage || "Error desconocido");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user); // Carga los valores del usuario a editar
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      message.success('Usuario eliminado exitosamente');
    } catch {
      message.error('Error al eliminar el usuario');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        // Actualizar usuario
        await updateUser(editingUser.id, values);
      } else {
        // Crear nuevo usuario
        console.log(values)
        await createUser(values);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error en la validación del formulario:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = (role) => [
    {
      title: 'Nombre',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Eliminar
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Divider orientation="left">Usuarios</Divider>
      <Button type="primary" onClick={() => { setEditingUser(null); setIsModalVisible(true); }}>Crear nuevo usuario</Button>
      <Table
        columns={columns("user")}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />

      <Divider orientation="left">Repartidores</Divider>
      <Table
        columns={columns("repartidor")}
        dataSource={repartidores}
        rowKey="id"
        loading={loading}
      />

      <Divider orientation="left">Administradores</Divider>
      <Table
        columns={columns("admin")}
        dataSource={administradores}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingUser ? 'Editar usuario' : 'Agregar usuario'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Nombre"
            rules={[{ required: true, message: 'Ingrese un nombre!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Ingrese un correo' }, { type: 'email', message: 'El correo no es válido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: 'Seleccione un rol' }]}
          >
            <Select disabled={!!editingUser}>
              <Option value="user">User</Option>
              <Option value="repartidor">Repartidor</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="Dirección"
            rules={[{ required: true, message: 'Ingrese una dirección' }, { type: 'text', message: 'Ingresa una dirección' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={editingUser ? "newPassword": "password" }
            label="Nueva Contraseña"
            rules={[{ required: !editingUser, message: 'Ingrese una contraseña' }]} 
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
