import { useState, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";



const Estados = () => {
  const { config, fetchConfig, updateConfig, deleteConfigOption } = useConfig();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchConfig();
  }, []);

  const columns = [
    {
      title: "Nombre de estado",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <div
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: color,
            borderRadius: "50%",
            border: "1px solid #d9d9d9",
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
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
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            danger
          >
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

  const handleEdit = (state) => {
    setEditingCategory(state);
    form.setFieldsValue(state);
    setIsModalVisible(true);
    fetchConfig();
  };

  const handleDelete = async (state) => {
    const optionData = {
      optionType: "states",
      optionValue: state._id,
    };

    try {
      await deleteConfigOption(optionData);
      fetchConfig();
    } catch (error) {
      console.error("Error eliminando estado:", error);
    }
  };

  const handleOk = async () => {
    const values = await form.validateFields();

    const updatedConfig = { ...config };

    if (editingCategory) {
      console.log(updatedConfig)
      updatedConfig.states = updatedConfig.states.map((state) =>
        state._id.toString() === editingCategory._id.toString()
          ? { ...state, ...values }
          : state
      );
    } else {
      const newState = {
        name: values.name,
        description: values.description,
        color: values.color, // Añadimos el color aquí
      };
      updatedConfig.states.push(newState);
    }

    await updateConfig(updatedConfig);

    setIsModalVisible(false);
    fetchConfig();
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Agregar nuevo estado
      </Button>
      <Table
        columns={columns}
        dataSource={config?.states || []}
        rowKey={(record) => record._id}
      />
      <Modal
        title={editingCategory ? "Editar estado" : "Agregar estado"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre del estado"
            rules={[
              { required: true, message: "Ingrese el nombre del estado!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: "Ingrese una descripción" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Seleccione un color" }]}
          >
            <Select>
              <Option key={"185a5ff"} value={"#85a5ff"}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#85a5ff",
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Option>
              <Option key={"295de64"} value={"#95de64"}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#95de64",
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Option>
              <Option key={3} value={"#ffc069"}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#ffc069",
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Option>
              <Option key={4} value={"#5cdbd3"}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#5cdbd3",
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Option>
              <Option key={5} value={"#b37feb"}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#b37feb",
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                  }}
                />
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Estados;
