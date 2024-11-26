const recalculateSubTotalPrice = (config, updatedProducts, packaging) => {
  const total = updatedProducts.reduce((sum, product) => {
    const category = config?.productCategories?.find(
      (cat) => cat._id === product.productCategory
    );
    const pricePerKilo = category?.pricePerKilo || 0; // Asegurar un valor numérico
    const kilos = product?.kilos || 0; // Asegurar un valor numérico
    return sum + pricePerKilo * kilos;
  }, 0);

  const packagingCost = config?.packagingCost || 0; // Asegurar un valor numérico
  const finalTotal = packaging ? total + packagingCost : total;
  return finalTotal;
};

const recalculateTotalPrice = (config, subTotal, chkIva, chkDuty, chkinsurance, chktaxes) => {
  const safeValue = (value) => (typeof value === 'number' && !isNaN(value) ? value : 0); // Asegurar valores válidos

  const ivaConfig = safeValue(config?.iva);
  const ivaCost = chkIva ? subTotal * (ivaConfig / 100) : 0;

  const dutyConfig = safeValue(config?.customsDuty);
  const dutyCost = chkDuty ? subTotal * (dutyConfig / 100) : 0;

  const insuranceConfig = safeValue(config?.insurance);
  const insuranceCost = chkinsurance ? subTotal * (insuranceConfig / 100) : 0;

  const taxesConfig = safeValue(config?.otherTaxes);
  const taxesCost = chktaxes ? subTotal * (taxesConfig / 100) : 0;

  const finalTotal = subTotal + ivaCost + dutyCost + insuranceCost + taxesCost;

  return { finalTotal, ivaCost, dutyCost, insuranceCost, taxesCost };
};

export { recalculateSubTotalPrice, recalculateTotalPrice };
