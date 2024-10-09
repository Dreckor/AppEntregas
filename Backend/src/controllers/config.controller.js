import {Config, DeliveryPoint, DeparturePoint,ProductCategory} from '../models/config.model.js';

const initializeConfig = async () => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config({
        deliveryPoints: [],
        departurePoints: [],
        productCategories: [],
      });
      await config.save();
    }
    return config;
  } catch (error) {
    console.error('Error initializing config:', error);
  }
};

export const getConfig = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Solo un usuario administrador puede obtener la config' });
  }
  try {
    const config = await initializeConfig(); 
    res.status(200).json(config);
  } catch (error) {
    console.error('Error retrieving config:', error);
    res.status(500).json({ message: 'Error retrieving config', error });
  }
};



export const updateConfig = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Solo un usuario administrador puede actualizar la config' });
    }

    try {
        const config = await initializeConfig();

        // Verificar si se pasó un array de deliveryPoints
        if (req.body.deliveryPoints && Array.isArray(req.body.deliveryPoints)) {
            for (const point of req.body.deliveryPoints) {
                if (!point._id) {
                    // Si el punto no tiene un ID, es nuevo
                    const newDeliveryPoint = new DeliveryPoint(point);
                    await newDeliveryPoint.save();

                    // Evitar duplicados: verificar si ya existe un punto con el mismo nombre y dirección
                    const exists = config.deliveryPoints.some(p => 
                        p.name === newDeliveryPoint.name && p.address === newDeliveryPoint.address
                    );

                    if (!exists) {
                        config.deliveryPoints.push(newDeliveryPoint); // Agregar solo si no existe
                    }
                } else {
                    // Si ya tiene un ID, buscarlo y agregarlo solo si no está ya en la configuración
                    let existingDeliveryPoint = await DeliveryPoint.findById(point._id);
                    if (!existingDeliveryPoint) {
                        return res.status(404).json({ message: 'Delivery point not found' });
                    }

                    const exists = config.deliveryPoints.some(p => 
                        p._id.toString() === point._id
                    );

                    if (!exists) {
                        config.deliveryPoints.push(existingDeliveryPoint); // Agregar solo si no existe
                    }
                }
            }
        }

        // Verificación para departurePoints
        if (req.body.departurePoints && Array.isArray(req.body.departurePoints)) {
            for (const point of req.body.departurePoints) {
                if (!point._id) {
                    const newDeparturePoint = new DeparturePoint(point);
                    await newDeparturePoint.save();

                    // Evitar duplicados: verificar si ya existe un punto con el mismo nombre y dirección
                    const exists = config.departurePoints.some(p => 
                        p.name === newDeparturePoint.name && p.address === newDeparturePoint.address
                    );

                    if (!exists) {
                        config.departurePoints.push(newDeparturePoint); // Agregar solo si no existe
                    }
                } else {
                    let existingDeparturePoint = await DeparturePoint.findById(point._id);
                    if (!existingDeparturePoint) {
                        return res.status(404).json({ message: 'Departure point not found' });
                    }

                    const exists = config.departurePoints.some(p => 
                        p._id.toString() === point._id
                    );

                    if (!exists) {
                        config.departurePoints.push(existingDeparturePoint); // Agregar solo si no existe
                    }
                }
            }
        }

        // Verificación para productCategories
        if (req.body.productCategories && Array.isArray(req.body.productCategories)) {
            for (const category of req.body.productCategories) {
                // Verificar si la categoría ya existe en la configuración
                const exists = config.productCategories.some(c => 
                    c.categoryName === category.categoryName && c.pricePerKilo === category.pricePerKilo
                );
        
                if (!exists) {
                    if (!category._id) {
                        // Si la categoría no tiene ID, crear una nueva
                        const newProductCategory = new ProductCategory(category);
                        await newProductCategory.save(); // Guardar en la colección de MongoDB
                        config.productCategories.push(newProductCategory); // Agregar la nueva categoría a la configuración
                    } else {
                        // Si la categoría tiene ID, buscarla y agregarla
                        const existingProductCategory = await ProductCategory.findById(category._id);
                        if (!existingProductCategory) {
                            return res.status(404).json({ message: 'Product category not found' });
                        }
                        config.productCategories.push(existingProductCategory); // Agregar la categoría existente
                    }
                }
            }
        }

        const updatedConfig = await config.save(); // Guardar la configuración actualizada
        res.status(200).json(updatedConfig);
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ message: 'Error updating config', error });
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
      } else {
        return res.status(400).json({ message: 'Invalid option type' });
      }
  
      const updatedConfig = await config.save(); // Guardar la configuración actualizada
      res.status(200).json(updatedConfig);
    } catch (error) {
      console.error('Error deleting config option:', error);
      res.status(500).json({ message: 'Error deleting config option', error });
    }
};