import { useEffect } from 'react';
import { Table, Button, Form, Divider, Popconfirm, message } from 'antd';
import { useUser } from '../../context/UserContext';
import { useUserHook } from '../../hooks/configHooks/useUserHook';
import  UsersModal  from "./ConfigModals/UsersModal.jsx";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Users = () => {
  const [form] = Form.useForm();
  const {
    users,
    repartidores,
    administradores,
    fetchUsers,
    updateUser,
    createUser,
    deleteUser,
    loading,
    error,
  } = useUser();
  const configUserHook = useUserHook({ form, updateUser, createUser, deleteUser });

  const isModalVisible = configUserHook.isModalVisible
  const openModal = configUserHook.openModal
  //const closeModal = configUserHook.closeModal
  const handleDelete = configUserHook.handleDelete
  //const editingUser = configUserHook.editingUser

  useEffect(() => {
    fetchUsers();
  }, [isModalVisible]);

  useEffect(() => {
    if (error && error.length > 0) {
      error.forEach(({ data }) => handleError(data.errorCode, data.message));
    }
  }, [error]);

  const handleError = (errorCode, errorMessage) => {
    const messages = {
      USER_NOT_FOUND: 'El usuario no existe. Verifica tu correo.',
      INVALID_CREDENTIALS: 'Contraseña incorrecta. Intenta nuevamente.',
      SERVER_ERROR: 'Error en el servidor. Intenta más tarde.',
    };
    message.error(messages[errorCode] || errorMessage || 'Error desconocido');
  };

  const getColumns = () => [
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
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            style={{ marginRight: 8 }}
          >
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

  const renderTable = (data, title) => (
    <>
      <Divider orientation="left">{title}</Divider>
      <Table columns={getColumns()} dataSource={data} rowKey="id" loading={loading} />
    </>
  );

  return (
    <div>
      <Button type="primary" onClick={() => openModal()}>Crear nuevo usuario</Button>
      {renderTable(users, 'Usuarios')}
      {renderTable(repartidores, 'Repartidores')}
      {renderTable(administradores, 'Administradores')}
      <UsersModal
      form= {form}
      configUserHook= {configUserHook}
      />
    </div>
  );
};

export default Users;
