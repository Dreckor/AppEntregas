import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Tabs, Table, Button, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';


const Puntos = () => {
  const { config, fetchConfig, updateConfig, deleteConfigOption } = useConfig();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [activeTab, setActiveTab] = useState('delivery');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConfig(); // Obtener configuración al montar el componente
  }, []);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Direccion',
      dataIndex: 'address',
      key: 'address',
    },
    { 
      className:"Acciones",
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
          <Button className='EditPuntos' icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingPoint(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (point) => {
    setEditingPoint(point);
    form.setFieldsValue(point);
    setIsModalVisible(true);
  };

  const handleDelete = async (point) => {
    const optionData = {
      optionType: activeTab === 'delivery' ? 'deliveryPoints' : 'departurePoints',
      optionValue: point._id,
    };

    try {
        console.log(optionData)
      await deleteConfigOption(optionData); // Llama a la función para eliminar el punto
      fetchConfig(); // Refresca la configuración después de la eliminación
    } catch (error) {
      console.error('Error deleting point:', error);
    }
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const updatedConfig = { ...config };

    if (editingPoint) {
      // Si se está editando, actualiza el punto correspondiente
      updatedConfig[activeTab === 'delivery' ? 'deliveryPoints' : 'departurePoints'] =
        updatedConfig[activeTab === 'delivery' ? 'deliveryPoints' : 'departurePoints'].map((point) =>
          point._id.toString() === editingPoint._id.toString()
            ? { ...point, ...values }
            : point
        );
    } else {
      // Si es un nuevo punto, agrégalo a la lista correspondiente
      const newPoint = {
        name: values.name,
        address: values.address,
      };
      updatedConfig[activeTab === 'delivery' ? 'deliveryPoints' : 'departurePoints'].push(newPoint);
      
    }

    await updateConfig(updatedConfig); // Actualiza la configuración en el backend
    setIsModalVisible(false);
    fetchConfig(); // Refresca la configuración después de agregar/editar
  };

  const items = [
    {
      key: 'delivery',
      label: 'Puntos de entrega',
      children: (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ marginBottom: 16 }}
          >
            Agregar punto de entrega
          </Button>
          <Table
            columns={columns}
            dataSource={config?.deliveryPoints || []}
            rowKey={(record) => record._id}
          />
        </>
      ),
    },
    {
      key: 'departure',
      label: 'Puntos de partida',
      children: (
        <>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{ marginBottom: 16 }}
          >
            Agregar punto de partida
          </Button>
          <Table
            columns={columns}
            dataSource={config?.departurePoints || []}
            rowKey={(record) => record._id}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="delivery" items={items} onChange={setActiveTab} />
      <Modal
        title={editingPoint ? 'Edit Point' : `Add New ${activeTab === 'delivery' ? 'Delivery' : 'Departure'} Point`}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the point name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Puntos;
