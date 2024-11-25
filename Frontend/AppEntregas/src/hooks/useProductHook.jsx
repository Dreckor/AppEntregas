import { useState } from "react";

export const useProductModalHook = (config, editingProduct, products, setProducts, setEditingProduct) => {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productPrice, setProductPrice] = useState(0);

  const handleSaveProduct = () => {
      let updatedProducts;
    
      if (editingProduct.index !== undefined) {
        updatedProducts = [...products];
        updatedProducts[editingProduct.index] = editingProduct;
      } else {
        updatedProducts = [...products, { ...editingProduct, index: products.length }];
      }
    
      setProducts(updatedProducts);
    
      

      setProductModalVisible(false);
      setEditingProduct(null);
    };

    const handleAddProduct = () => {
      setEditingProduct({
        productLabel: "",
        productUnits: 1,
        productCategory: "",
        tipoDeCobro: "",
        kilos: 1,
        largo: 1,
        ancho: 1,
        altura: 1,
        valorDeclarado: 0,
        cost: 0,
      });
      setProductModalVisible(true);
    };

    const handleEditProduct = (index) => {
      setEditingProduct({ ...products[index], index });
      setProductModalVisible(true);
    };

    const handleOnCancel = ()  => {
      setProductModalVisible(false);
      setEditingProduct(null);
    }

    const handleCategoryChange = (categoryId) => {
      const category = config.productCategories.find((cat) => cat._id === categoryId);
      const cost = category ? category.pricePerKilo * editingProduct.kilos : 0;
      setProductPrice(cost); // Update product price based on category and kilos
      setEditingProduct({
        ...editingProduct,
        productCategory: categoryId,
        cost, // Update the product's cost
      });
    };
    
    const handleKilosChange = (kilos) => {
      const category = config.productCategories.find((cat) => cat._id === editingProduct.productCategory);
      const cost = category ? category.pricePerKilo * kilos : 0;
      setProductPrice(cost); // Update product price when kilos change
      setEditingProduct({
        ...editingProduct,
        kilos,
        cost, // Update the product's cost
      });
    };
    const handleTipoDepagoChange = (tipo) => {
      setEditingProduct({
        ...editingProduct,
        tipoDeCobro:tipo
      });
    };

    const handleDimensionChange = (field, value) => {
      setEditingProduct({
        ...editingProduct,
        [field]: value,
      });
    };


    const handleDeleteProduct = (index) => {
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
    
       
    };

  return {  
      productModalVisible,
      productPrice,
      handleSaveProduct,
      handleAddProduct,
      handleEditProduct,
      handleOnCancel,
      handleCategoryChange,
      handleKilosChange,
      handleDeleteProduct,
      handleTipoDepagoChange,
      handleDimensionChange
  }
}
