import { message } from "antd";

export default function useFormHandlers({ setLoading, products, createOrder, navigate }) {
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createOrder({ ...values, products });
      message.success("Orden creada exitosamente");
      navigate("/orders");
    } catch (error) {
      message.error("Error creando la orden");
    }
    setLoading(false);
  };

  return { onFinish };
}
