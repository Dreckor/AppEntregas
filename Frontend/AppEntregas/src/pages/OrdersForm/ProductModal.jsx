/* eslint-disable react/prop-types */
import { Form, Input, Select, Modal, InputNumber} from "antd";
import "../../css/OrdersForm.css";

const { Option } = Select;

export default function ProductsModal({productModalHook, editingProduct, setEditingProduct, config}) {
    const { productModalVisible, productPrice, handleSaveProduct, handleOnCancel, handleCategoryChange, handleKilosChange } = productModalHook;
  return (
    <Modal
      className="ProductsForm"
      title="Añadir productos"
      open={productModalVisible}
      onOk={handleSaveProduct}
      onCancel={handleOnCancel}
    >
      <Form layout="vertical" className="ProductAdd">
        <Form.Item label="Producto" className="ProductInput">
          <Input
            name="productLabel"
 
            value={editingProduct?.productLabel}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                productLabel: e.target.value,
              })
            }
          />
        </Form.Item>
        <Form.Item label="Categoría del Producto" className="ProductInput">
          <Select
            placeholder="Selecciona una categoría"
            value={editingProduct?.productCategory || ""}
            onChange={handleCategoryChange}
          >
            {config &&
            config.productCategories &&
            config.productCategories.length > 0 ? (
              config.productCategories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.categoryName}
                </Option>
              ))
            ) : (
              <Option disabled>No hay categorías disponibles</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item label="Unidades" className="ProductInput">
          <InputNumber
            name="productUnits"
            min={1}
            value={editingProduct?.productUnits}
            onChange={(value) =>
              setEditingProduct({ ...editingProduct, productUnits: value })
            }
          />
        </Form.Item>
        <Form.Item label="Kilos" className="ProductInput">
          <InputNumber
            name="kilos"
            min={1}
            value={editingProduct?.kilos}
            onChange={handleKilosChange}
          />
        </Form.Item>
        <h3>Precio: ${productPrice?.toFixed(2)}</h3>{" "}
        {/* Display the product price */}
      </Form>
    </Modal>
  );
}
