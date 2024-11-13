import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Table, Button, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
 
const Metodos = () => {
  const { config, fetchConfig, updateConfig, deleteConfigOption } = useConfig();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConfig(); // Fetch the initial configuration on component mount
  }, []);

  const columns = [
    {
      title: 'Metodo de pago',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button className='EditPuntos'
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button> 
          <Button className='EditPuntos'
           icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingMethod(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (metodo) => {
    setEditingMethod(metodo);
    form.setFieldsValue(metodo);
    setIsModalVisible(true);
  };

  const handleDelete = async (metodo) => {
    const optionData = {
        optionType: 'paymentMethod', // Indica que estás eliminando una categoría de producto
        optionValue: metodo._id, // Pasa el ID de la categoría a eliminar
    };

    try {
        await deleteConfigOption(optionData); // Llama a la función para eliminar la categoría
        fetchConfig(); // Re-fetch config after deletion to update the state
    } catch (error) {
        console.error('Error deleting category:', error);
        // Manejo adicional de errores, si es necesario
    }
};


const handleOk = async () => {
    const values = await form.validateFields();

    // Crear un nuevo objeto de configuración que copie la existente
    const updatedConfig = { ...config };

    if (editingMethod) {
        // Encontrar la categoría que se está editando por ID y actualizarla
        updatedConfig.paymentMethods = updatedConfig.paymentMethods.map(method =>
            method._id.toString() === editingMethod._id.toString()
                ? { ...method, ...values } // Actualiza los valores
                : method
        );
    } else {
        // Agregar una nueva categoría
        const newMethod = {
            name: values.name,
            // No se incluye el ID, ya que MongoDB lo generará automáticamente
        };
        updatedConfig.paymentMethods.push(newMethod); // Agrega la nueva categoría
    }

    // Actualizar la configuración completa en el backend
    await updateConfig(updatedConfig);

    setIsModalVisible(false);
    fetchConfig(); // Re-fetch config after adding/updating
};


  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Agregar nuevo mtodo de pago
      </Button>
      <Table 
        columns={columns} 
        dataSource={config?.paymentMethods || []} // Use categories from config
        rowKey={(record) => record.name} // Use a unique key
      />
      <Modal
        title={editingMethod ? 'Editar metodo' : 'Agregar metodo'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre del metodo"
            rules={[{ required: true, message: 'Ingrese el nombre de la categoria!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Metodos;
