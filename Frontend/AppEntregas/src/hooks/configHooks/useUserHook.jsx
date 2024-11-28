import { useState } from 'react';
import { message , Form} from 'antd';
export const useUserHook = ({ form: externalForm, updateUser, createUser, deleteUser }) => {
  
    const [internalForm] = Form.useForm();
    const form = externalForm || internalForm;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorUserHook, setError] = useState(null);
  
    const openModal = (user = null) => {
      setEditingUser(user);
      if (user) form.setFieldsValue(user); // Cargar datos al formulario
      setIsModalVisible(true);
    };
  
    const closeModal = () => {
      setIsModalVisible(false);
      form.resetFields();
    };
  
    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        if (editingUser) {
          await updateUser(editingUser.id, values); // Actualizar
        } else {
          const idNewUser = await createUser(values); // Crear nuevo usuario
          setSelectedUser(idNewUser); // Actualizar estado local si es necesario
        }
        //message.success(editingUser ? 'Usuario actualizado' : 'Usuario creado');
        closeModal();
      } catch (error) {
        console.log(error);
        setError(error.response ? error.response.data : "Server error");
        //message.error('Error al procesar el formulario');
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await deleteUser(id);
        message.success('Usuario eliminado exitosamente');
      } catch {
        message.error('Error al eliminar el usuario');
      }
    };
  
    return { editingUser, isModalVisible, openModal, closeModal, handleSubmit, handleDelete,form, selectedUser, errorUserHook };
  };