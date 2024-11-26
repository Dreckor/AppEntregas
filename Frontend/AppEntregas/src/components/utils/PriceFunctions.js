const recalculateSubTotalPrice = (config, updatedProducts, packaging) => {
  const total = updatedProducts.reduce((sum, product) => {
    const category = config?.productCategories?.find(
      (cat) => cat._id === product.productCategory
    );
    const pricePerKilo = typeof category?.pricePerKilo === "number" ? category.pricePerKilo : 0;
    const kilos = typeof product?.kilos === "number" ? product.kilos : 0;
    return sum + pricePerKilo * kilos;
  }, 0);

  const packagingCost = typeof config?.packagingCost === "number" ? config.packagingCost : 0;
  const finalTotal = packaging ? total + packagingCost : total;

  return finalTotal || 0; // Garantiza que siempre retorna un número
};

const recalculateTotalPrice = (config, subTotal, chkIva, chkDuty, chkinsurance, chktaxes) => {
  const safeValue = (value) => (typeof value === "number" && !isNaN(value) ? value : 0);

  const ivaConfig = safeValue(config?.iva);
  const ivaCost = chkIva ? subTotal * (ivaConfig / 100) : 0;

  const dutyConfig = safeValue(config?.customsDuty);
  const dutyCost = chkDuty ? subTotal * (dutyConfig / 100) : 0;

  const insuranceConfig = safeValue(config?.insurance);
  const insuranceCost = chkinsurance ? subTotal * (insuranceConfig / 100) : 0;

  const taxesConfig = safeValue(config?.otherTaxes);
  const taxesCost = chktaxes ? subTotal * (taxesConfig / 100) : 0;

  const finalTotal = safeValue(subTotal) + ivaCost + dutyCost + insuranceCost + taxesCost;

  return {
    finalTotal: finalTotal || 0, // Garantiza que siempre retorna un número
    ivaCost: ivaCost || 0,
    dutyCost: dutyCost || 0,
    insuranceCost: insuranceCost || 0,
    taxesCost: taxesCost || 0,
  };
};

export { recalculateSubTotalPrice, recalculateTotalPrice };
