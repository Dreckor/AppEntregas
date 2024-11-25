const recalculateSubTotalPrice = (config, updatedProducts, packaging) => {
    const total = updatedProducts.reduce((sum, product) => {
      const category = config.productCategories.find(
        (cat) => cat._id === product.productCategory
      );
      return sum + (category ? category.pricePerKilo * product.kilos : 0);
    }, 0);
  
    // Si packaging está seleccionado, se suma 10 al total
    const finalTotal = packaging ? total + config.packagingCost : total;
    return(finalTotal);

  };

  const recalculateTotalPrice = (config, subTotal, chkIva ,chkDuty,chkinsurance,chktaxes) => {
    const ivaConfig = config?.iva
    const ivaCost = chkIva ?  subTotal * (ivaConfig / 100): 0

    const dutyconfig = config?.customsDuty
    const dutyCost = chkDuty ? subTotal *  (dutyconfig / 100):0

    const insuranceconfig =config?.insurance
    const insuranceCost = chkinsurance ? subTotal * (insuranceconfig /100):0


    const taxesconfig = config?.otherTaxes
    const taxescost = chktaxes ? subTotal * (taxesconfig /100):0
   
   
    const finalTotal = subTotal + ivaCost + dutyCost + insuranceCost + taxescost ;
    
    return({finalTotal, ivaCost, dutyCost , insuranceCost, taxescost});
  };

  export {recalculateSubTotalPrice, recalculateTotalPrice}