import { useState, useEffect } from "react";
import {  message } from "antd";

import { useOrders } from "../context/OrderContext";
import { useInvoices } from "../context/InvoiceContext";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { useNavigate } from "react-router-dom";

import {
  recalculateTotalPrice,
  recalculateSubTotalPrice,
} from "../components/utils/PriceFunctions";

export const useFormHook = () => {
  const [loading, setLoading] = useState(false);
  const [dataloading, setDataloading] = useState(true);
  const [users, setUsers] = useState([]);
  const [repartidores, setRepartidores] = useState([]);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [totalPrice, setTotalPrice] = useState(0);
  const [subTotalPrice, setSubTotalPrice] = useState(0);
  const [checkIva, setCheckIva] = useState(false);
  const [ivaPrice, setIvaPrice] = useState(0);
  const [packaging, setPackaging] = useState(false);
  const [checkCustomsDuty, setCheckCustomsDuty] = useState(false);
  const [dutyPrice, setDutyPrice] = useState(0);
  const [checkInsurance, setCheckInsurance] = useState(false);
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [CheckOtherTaxes, setCheckOtherTaxes] = useState(false);
  const [otherTaxesPrice, setOtherTaxesPrice] = useState(0);

  const { createOrder, errors } = useOrders();
  const { createNewInvoice } = useInvoices();
  
  const navigate = useNavigate();

  const { config, fetchConfig } = useConfig();
  const { getUsers } = useAuth();

  useEffect(() => {
    const fetchUsersAndRepartidores = async () => {
      try {
        setDataloading(true);
        const response = await getUsers();
        const { users, repartidores } = response;

        setUsers(users);
        setRepartidores(repartidores);
        setDataloading(false);
      } catch (error) {
        console.error("Error fetching users and repartidores:", error);
        setDataloading(false);
      }
    };

    fetchUsersAndRepartidores();
    fetchConfig(); // Fetch the initial configuration
  }, []);

  useEffect(() => {
    if (errors && errors.length > 0) {
      errors.forEach((error) => {
        handleError(error.data.errorCode, error.data.message); 
      });
    }
  }, [errors]);

  const handleError = (errorCode, errorMessage) => {
    switch (errorCode) {
      case "USER_NOT_FOUND":
        message.error("El usuario no existe. Por favor, verifica tu correo.");
        break;
      case "EAUTH":
        message.error("La contraseña del correo es incorrecta. Intenta nuevamente.");
        break;
      case "SEwRVER_ERROR":
          message.error("Ocurrió un error en el servidor. Intenta más tarde.");
          break;
      case "SERVER_ERROR":
        message.error("Ocurrió un error en el servidor. Intenta más tarde.");
        break;
      default:
        message.error(errorMessage || "Error desconocido");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const invoice = await createNewInvoice({
        products,
        totalCost: totalPrice,
        netCost: subTotalPrice,
        packaging: packaging,
        hasIva: checkIva,
        userId: values.userId,
        customsDuty: dutyPrice,
        iva: ivaPrice,
        insurance: insurancePrice,
        otherTaxes: otherTaxesPrice,
      });
 
      await createOrder({
        ...values,
        products,
        totalCost: totalPrice,
        netCost: subTotalPrice,
        packaging: packaging,
        hasIva: checkIva,
        invoice: invoice._id,
        customsDuty: dutyPrice,
        iva: ivaPrice,
        insurance: insurancePrice,
        otherTaxes: otherTaxesPrice,
       
      });

      navigate("/orders");
      message.success("Orden creada exitosamente");
    } catch (error) {
      console.log(error);
      message.error("Error creando la orden");
    }

    setLoading(false);
  };

  const handleIVAChange = (value) => {
    setCheckIva(value);
  };

  const handleDutyChange = (value) => {
    setCheckCustomsDuty(value);
  };

  const handleInsuranceChange = (value) => {
    setCheckInsurance(value);
  };

  const handleTaxesChange = (value) => {
    setCheckOtherTaxes(value);
  };

  const handlePackagingChange = (value) => {
    setPackaging(value);
  };

  useEffect(() => {
    const updadeAllValues = () => {
      const updatedSubTotal = recalculateSubTotalPrice(
        config,
        products,
        packaging
      );
      setSubTotalPrice(updatedSubTotal);

      const updateValues = recalculateTotalPrice(
        config,
        updatedSubTotal,
        checkIva,
        checkCustomsDuty,
        checkInsurance,
        CheckOtherTaxes
      );
      setTotalPrice(updateValues.finalTotal);
      setIvaPrice(updateValues.ivaCost);
      setDutyPrice(updateValues.dutyCost);
      setInsurancePrice(updateValues.insuranceCost);
      setOtherTaxesPrice(updateValues.taxesCost);
    };
    updadeAllValues();
  }, [
    config,
    products,
    packaging,
    checkIva,
    checkCustomsDuty,
    checkInsurance,
    CheckOtherTaxes,
  ]);

  return {
    config,
    editingProduct,
    products, 
    setProducts, 
    setEditingProduct,
    dataloading,
    loading,
    users,
    repartidores,
    packaging,
    subTotalPrice,
    ivaPrice,
    dutyPrice,
    insurancePrice,
    otherTaxesPrice,
    totalPrice,
    onFinish,
    handleIVAChange,
    handleDutyChange,
    handleInsuranceChange,
    handleTaxesChange,
    handlePackagingChange
  };
};