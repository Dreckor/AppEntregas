import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Categorias = () => {
  const { config, fetchConfig, updateConfig, deleteConfigOption } = useConfig();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConfig(); // Fetch the initial configuration on component mount
  }, []);

  const columns = [
    {
      title: 'Nombre de la categoria',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Precio por kilo',
      dataIndex: 'pricePerKilo',
      key: 'pricePerKilo',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Editar
          </Button>
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDelete = async (category) => {
    const optionData = {
        optionType: 'productCategory', // Indica que estás eliminando una categoría de producto
        optionValue: category._id, // Pasa el ID de la categoría a eliminar
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

    if (editingCategory) {
        // Encontrar la categoría que se está editando por ID y actualizarla
        updatedConfig.productCategories = updatedConfig.productCategories.map(category =>
            category._id.toString() === editingCategory._id.toString()
                ? { ...category, ...values } // Actualiza los valores
                : category
        );
    } else {
        // Agregar una nueva categoría
        const newCategory = {
            categoryName: values.categoryName,
            pricePerKilo: values.pricePerKilo,
            // No se incluye el ID, ya que MongoDB lo generará automáticamente
        };
        updatedConfig.productCategories.push(newCategory); // Agrega la nueva categoría
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
        Agregar nueva categoria
      </Button>
      <Table 
        columns={columns} 
        dataSource={config?.productCategories || []} // Use categories from config
        rowKey={(record) => record.categoryName} // Use a unique key
      />
      <Modal
        title={editingCategory ? 'Editar categoria' : 'Agregar categoria'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Nombre de la categoria"
            rules={[{ required: true, message: 'Ingrese el nombre de la categoria!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pricePerKilo"
            label="Precio por kilo"
            rules={[{ required: true, message: 'Ingrese el valor por kilo!' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categorias;
