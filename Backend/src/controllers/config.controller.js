import {
  Config,
  DeliveryPoint,
  DeparturePoint,
  PaymentMethod,
  ProductCategory,
  State,
} from "../models/config.model.js";

const initializeConfig = async () => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config({
        deliveryPoints: [],
        departurePoints: [],
        productCategories: [],
        paymentMethods:[],
        state: [],
        packagingCost: 10,
        iva: 0,
        customDuty:0,
        insurance:0,
        otherTaxes:0,
        factorConversion: 0,
        factorDivision : 0,
      });
      await config.save();
    }
    return config;
  } catch (error) {
    console.error("Error initializing config:", error);
  }
};

export const getConfig = async (req, res) => {
  try {
    const config = await initializeConfig();
    res.status(200).json(config);
  } catch (error) {
    console.error("Error retrieving config:", error);
    res.status(500).json({ message: "Error retrieving config", error });
  }
};

export const updateConfig = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        message: "Solo un usuario administrador puede actualizar la config",
      });
  }

  try {
    const config = await initializeConfig();

    // Verificar si se pasó un array de deliveryPoints
    if (req.body.deliveryPoints && Array.isArray(req.body.deliveryPoints)) {
      for (const point of req.body.deliveryPoints) {
        if (!point._id) {
          // Si el punto no tiene un ID, es nuevo
          const newPoint = new DeliveryPoint(point);
          await newPoint.save();
          config.deliveryPoints.push(newPoint);
        } else {
          // Si ya tiene un ID, buscarlo y agregarlo solo si no está ya en la configuración
          let existingDeliveryPoint = await DeliveryPoint.findById(point._id);
          if (!existingDeliveryPoint) {
            return res.status(404).json({ message: "Estado no encontrado" });
          }
          await DeliveryPoint.findByIdAndUpdate(point._id, point);
          const exists = config.deliveryPoints.some(
            (p) => p._id.toString() === point._id
          );

          if (!exists) {
            config.deliveryPoints.push(existingDeliveryPoint); // Agregar solo si no existe
          } else {
            console.log("actualizando la conf ");
            let index = config.deliveryPoints.findIndex(
              (c) => c._id.toString() == point._id
            );
            console.log(index);
            if (index != null) {
              config.deliveryPoints[index] = point;
            }
          }
        }
      }
    }

    // Verificación para departurePoints
    if (req.body.departurePoints && Array.isArray(req.body.departurePoints)) {
      for (const point of req.body.departurePoints) {
        if (!point._id) {
          // Si el punto no tiene un ID, es nuevo
          const newPoint = new DeparturePoint(point);
          await newPoint.save();
          config.departurePoints.push(newPoint);
        } else {
          // Si ya tiene un ID, buscarlo y agregarlo solo si no está ya en la configuración
          let existingDeparturePoint = await DeparturePoint.findById(point._id);
          if (!existingDeparturePoint) {
            return res.status(404).json({ message: "Estado no encontrado" });
          }
          await DeparturePoint.findByIdAndUpdate(point._id, point);
          const exists = config.departurePoints.some(
            (p) => p._id.toString() === point._id
          );

          if (!exists) {
            config.departurePoints.push(existingDeparturePoint); // Agregar solo si no existe
          } else {
            console.log("actualizando la conf ");
            let index = config.departurePoints.findIndex(
              (c) => c._id.toString() == point._id
            );
            console.log(index);
            if (index != null) {
              config.departurePoints[index] = point;
              console.log("uptated");
            }
          }
        }
      }
    }

        // Verificación para productCategories
        if (req.body.productCategories && Array.isArray(req.body.productCategories)) {
            for (const category of req.body.productCategories) {
                if (!category._id) {
                    // Si el punto no tiene un ID, es nuevo
                    const newCategory = new ProductCategory(category);
                    await newCategory.save();
                    config.productCategories.push(newCategory);
                    
                } else {
                    // Si ya tiene un ID, buscarlo y agregarlo solo si no está ya en la configuración
                    let existingProductCategory= await ProductCategory.findById(category._id);
                    if (!existingProductCategory) {
                        return res.status(404).json({ message: 'Estado no encontrado' });
                    }
                    await ProductCategory.findByIdAndUpdate(category._id, category)
                    const exists = config.productCategories.some(p => 
                        p._id.toString() === category._id
                    );
  
                    if (!exists) {
                        config.productCategories.push(existingProductCategory); // Agregar solo si no existe
                    }else{
                      console.log("actualizando la conf ")
                        let index = config.productCategories.findIndex(c => c._id.toString() == category._id )
                        console.log(index)
                        if(index != null){
                          config.productCategories[index] = category
                        }
                    }
                }
            }
        }
        if (req.body.paymentMethods && Array.isArray(req.body.paymentMethods)) {
          for (const method of req.body.paymentMethods) {
              if (!method._id) {
                  // Si el punto no tiene un ID, es nuevo
                  const newMethod = new PaymentMethod(method);
                  await newMethod.save();
                  config.paymentMethods.push(newMethod);
                  
              } else {
                  // Si ya tiene un ID, buscarlo y agregarlo solo si no está ya en la configuración
                  let existingMethod= await PaymentMethod.findById(method._id);
                  if (!existingMethod) {
                      return res.status(404).json({ message: 'Metodo no encontrado' });
                  }
                  await PaymentMethod.findByIdAndUpdate(method._id, method)
                  const exists = config.paymentMethods.some(p => 
                      p._id.toString() === method._id
                  );

                  if (!exists) {
                      config.paymentMethods.push(existingMethod); // Agregar solo si no existe
                  }else{
                    console.log("actualizando la conf ")
                      let index = config.paymentMethods.findIndex(c => c._id.toString() == method._id )
                      if(index != null){
                        config.paymentMethods[index] = method
                        console.log("uptated")
                      }
                  }
              }
          }
      }
        // Verificar si se pasó un array de states
        if (req.body.states && Array.isArray(req.body.states)) {
          for (const state of req.body.states) {
              if (!state._id) {
                  // Si el punto no tiene un ID, es nuevo
                  const newState = new State(state);
                  await newState.save();
                  config.states.push(newState);
                  
              } else {
                  // Si ya tiene un ID, buscarlo y agregarlo solo si no está ya en la configuración
                  let existingState = await State.findById(state._id);
                  if (!existingState) {
                      return res.status(404).json({ message: 'Estado no encontrado' });
                  }
                  await State.findByIdAndUpdate(state._id, state)
                  const exists = config.states.some(p => 
                      p._id.toString() === state._id
                  );

          if (!exists) {
            config.states.push(existingState); // Agregar solo si no existe
          } else {
            console.log("actualizando la conf ");
            let index = config.states.findIndex(
              (s) => s._id.toString() == state._id
            );
            console.log(index);
            if (index != null) {
              config.states[index] = state;
            }
          }
        }
      }
    }
    if (req.body.iva) {
      config.iva = req.body.iva;
    }
    if (req.body.packagingCost) {
      config.packagingCost = req.body.packagingCost;
    }
    if (req.body.customsDuty ) {
      config.customsDuty = req.body.customsDuty; 
    }
    if (req.body.insurance ) {
      config.insurance = req.body.insurance; 
    }
    if (req.body.otherTaxes ) {
      config.otherTaxes = req.body.otherTaxes; 
    }
    if (req.body.factorConversion) {
      config.factorConversion = req.body.factorConversion; 
    }
    if (req.body.factorDivision ) {
      config.factorDivision = req.body.factorDivision; 
    }

    const updatedConfig = await config.save(); // Guardar la configuración actualizada
    res.status(200).json(updatedConfig);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ message: "Error updating config", error });
  }
};

export const deleteConfigOption = async (req, res) => {
    const { optionType, optionValue } = req.body; 
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo un usuario administrador puede eliminar la config' });
    }
  
    try {
      const config = await initializeConfig(); 
  
      // Eliminar según el tipo de opción
      if (optionType === 'deliveryPoints') {
        // Filtrar y eliminar de la configuración
        config.deliveryPoints = config.deliveryPoints.filter(point => point._id.toString() !== optionValue);
        
        // También eliminar el punto de la colección DeliveryPoint en MongoDB
        await DeliveryPoint.findByIdAndDelete(optionValue);
      } else if (optionType === 'departurePoints') {
        // Filtrar y eliminar de la configuración
        config.departurePoints = config.departurePoints.filter(point => point._id.toString() !== optionValue);
        
        // También eliminar el punto de la colección DeparturePoint en MongoDB
        await DeparturePoint.findByIdAndDelete(optionValue);
      } else if (optionType === 'productCategory') {
        // Filtrar y eliminar de la configuración
        config.productCategories = config.productCategories.filter(category => category._id.toString() !== optionValue);
        
        // También eliminar la categoría de la colección ProductCategory en MongoDB
        await ProductCategory.findByIdAndDelete(optionValue);
      }else if (optionType === 'states') {
        // Filtrar y eliminar de la configuración
        config.states = config.states.filter(category => category._id.toString() !== optionValue);
        
        // También eliminar la categoría de la colección ProductCategory en MongoDB
        await State.findByIdAndDelete(optionValue);
      } else if (optionType === 'paymentMethod') {
        // Filtrar y eliminar de la configuración
        config.paymentMethods = config.paymentMethods.filter(method => method._id.toString() !== optionValue);
        
        // También eliminar la categoría de la colección ProductCategory en MongoDB
        await State.findByIdAndDelete(optionValue);
      }
       else {
        return res.status(400).json({ message: 'Invalid option type' });
      }
  
      const updatedConfig = await config.save(); // Guardar la configuración actualizada
      res.status(200).json(updatedConfig);
    } catch (error) {
      console.error('Error deleting config option:', error);
      res.status(500).json({ message: 'Error deleting config option', error });
    }
};
