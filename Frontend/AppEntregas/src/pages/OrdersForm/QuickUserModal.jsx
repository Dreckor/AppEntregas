/* eslint-disable react/prop-types */
import { Modal, Form, Input } from "antd";
export default function QuickUserModal({
  form: externalForm,
  configUserHook,
  defaultRole,
}) {
  //const [internalForm] = Form.useForm();
  const form = externalForm;
  const { editingUser, isModalVisible, closeModal, handleSubmit } =
    configUserHook;
  const generateRandomPassword = () => Math.random().toString(36).slice(-8); // Genera un password aleatorio de 8 caracteres
  const onOpen = () => {
    if (!editingUser) {
      externalForm.setFieldsValue({
        role: defaultRole,
        password: generateRandomPassword(), // Asignar contraseña por defecto
      });
    }
  };
  return (
    <Modal
      title={editingUser ? "Editar usuario" : "Agregar usuario"}
      open={isModalVisible}
      onOk={handleSubmit}
      onCancel={closeModal}
      afterOpenChange={(visible) => visible && onOpen()} // Asignar valores al abrir el modal
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="Nombre"
          rules={[{ required: true, message: "Ingrese un nombre!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Ingrese un correo" },
            { type: "email", message: "Correo no válido" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Dirección"
          rules={[{ required: true, message: "Ingrese una dirección válida" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="role" style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="password" style={{ display: "none" }}>
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
