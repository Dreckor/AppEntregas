import { Button, Modal } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ProductModal from "./ProductModal";

export default function ProductsList({ products, setProducts }) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalVisible(true);
  };

  const handleEditProduct = (index) => {
    setEditingProduct({ ...products[index], index });
    setProductModalVisible(true);
  };

  const handleSaveProduct = (product) => {
    const updatedProducts = product.index !== undefined
      ? products.map((p, i) => (i === product.index ? product : p))
      : [...products, product];
    setProducts(updatedProducts);
    setProductModalVisible(false);
  };

  return (
    <div>
      <Button type="dashed" onClick={handleAddProduct} icon={<PlusOutlined />}>
        Añadir Productos
      </Button>

      {products.map((product, index) => (
        <div key={index}>
          <span>{product.productLabel} - Unidades: {product.productUnits} - Kilos: {product.kilos}</span>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditProduct(index)} />
          {/* Agregar botón de eliminar */}
        </div>
      ))}

      <Modal
        title="Añadir producto"
        visible={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        footer={null}
      >
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      </Modal>
    </div>
  );
}
