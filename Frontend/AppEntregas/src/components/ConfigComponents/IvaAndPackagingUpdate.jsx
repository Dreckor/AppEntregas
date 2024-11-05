import { useState, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext"; // Asumiendo que el contexto tiene la config y funciones para actualizarla
import { Form, InputNumber, Button, notification } from "antd";

const IvaAndPackagingUpdate = () => {
  const { config, fetchConfig, updateConfig } = useConfig();
  const [iva, setIva] = useState(0);
  const [packagingCost, setPackagingCost] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfig(); // Obtener la configuración actual al cargar el componente
  }, []);

  useEffect(() => {
    if (config) {
      setIva(config.iva || 0); // Asignar el valor de IVA actual
      setPackagingCost(config.packagingCost || 0); // Asignar el valor de coste de embalaje actual
    }
  }, [config]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedConfig = {
        iva,
        packagingCost,
      };
      await updateConfig(updatedConfig); // Llamar al controlador para actualizar la configuración
      notification.success({ message: "Configuración actualizada correctamente" });
    } catch (error) {
      console.error("Error actualizando configuración:", error);
      notification.error({ message: "Error al actualizar la configuración" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Actualizar IVA y Coste de Embalaje</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="IVA (%)" required>
          <InputNumber
            value={iva}
            min={0}
            max={100}
            onChange={(value) => setIva(value)}
            precision={2}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Coste de Embalaje ($)" required>
          <InputNumber
            value={packagingCost}
            min={0}
            precision={2}
            onChange={(value) => setPackagingCost(value)}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default IvaAndPackagingUpdate;