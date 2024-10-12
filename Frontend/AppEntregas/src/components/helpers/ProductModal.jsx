import { Form, Input, InputNumber, Select,Button } from "antd";
import { useState, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";

const { Option } = Select;

export default function ProductModal({ product, onSave }) {
  const { config } = useConfig();
  const [formProduct, setFormProduct] = useState(product || { kilos: 1, productUnits: 1 });
  const [productPrice, setProductPrice] = useState(0);

  useEffect(() => {
    if (formProduct.productCategory) {
      const category = config.productCategories.find(cat => cat._id === formProduct.productCategory);
      if (category) {
        setProductPrice(category.pricePerKilo * formProduct.kilos);
      }
    }
  }, [formProduct, config]);

  const handleCategoryChange = (categoryId) => {
    const category = config.productCategories.find(cat => cat._id === categoryId);
    const cost = category ? category.pricePerKilo * formProduct.kilos : 0;
    setFormProduct({ ...formProduct, productCategory: categoryId, cost });
  };

  const handleSave = () => onSave(formProduct);

  return (
    <Form layout="vertical">
      <Form.Item label="Producto">
        <Input
          value={formProduct.productLabel}
          onChange={e => setFormProduct({ ...formProduct, productLabel: e.target.value })}
        />
      </Form.Item>
      <Form.Item label="Categoría del Producto">
        <Select
          placeholder="Selecciona una categoría"
          value={formProduct.productCategory}
          onChange={handleCategoryChange}
        >
          {config.productCategories.map(cat => (
            <Option key={cat._id} value={cat._id}>{cat.categoryName}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Kilos">
        <InputNumber
          value={formProduct.kilos}
          min={1}
          onChange={value => setFormProduct({ ...formProduct, kilos: value })}
        />
      </Form.Item>
      <h3>Precio: ${productPrice.toFixed(2)}</h3>
      <Button onClick={handleSave}>Guardar</Button>
    </Form>
  );
}
