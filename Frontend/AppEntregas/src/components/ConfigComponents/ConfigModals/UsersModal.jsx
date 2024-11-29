/* eslint-disable react/prop-types */
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

// eslint-disable-next-line react/prop-types
export default function UsersModal({form, configUserHook}){
    const { editingUser, isModalVisible, closeModal, handleSubmit } = configUserHook
    return(
        <Modal
        title={editingUser ? 'Editar usuario' : 'Agregar usuario'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={closeModal}
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
            rules={[
              { required: true, message: 'Ingrese un correo' },
              { type: 'email', message: 'Correo no válido' },
            ]}
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
            rules={[{ required: true, message: 'Ingrese una dirección válida' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={editingUser ? 'newPassword' : 'password'}
            label={editingUser ? 'Nueva Contraseña' : 'Contraseña'}
            rules={[{ required: !editingUser, message: 'Ingrese una contraseña' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    );
}