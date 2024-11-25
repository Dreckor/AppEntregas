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

  const { createOrder } = useOrders();
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
        hasCustomsDuty: checkCustomsDuty,
        hasInsurance: checkInsurance,
        hasTaxes: CheckOtherTaxes,
      });

      await createOrder({
        ...values,
        products,
        totalCost: totalPrice,
        netCost: subTotalPrice,
        packaging: packaging,
        hasIva: checkIva,
        invoice: invoice._id,
        hasCustomsDuty: checkCustomsDuty,
        hasInsurance: checkInsurance,
        hasTaxes: CheckOtherTaxes,
      });

      console.log({
        ...values,
        products,
        totalCost: totalPrice,
        netCost: subTotalPrice,
        packaging: packaging,
        hasIva: checkIva,
        invoice: invoice._id,
      });
      //console.log(products);
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
    recalculateTotalPrice(subTotalPrice, checkIva, value, checkInsurance);
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
        otherTaxesPrice
      );
      setTotalPrice(updateValues.finalTotal);
      setIvaPrice(updateValues.ivaCost);
      setDutyPrice(updateValues.dutyCost);
      setInsurancePrice(updateValues.insuranceCost);
      setOtherTaxesPrice(updateValues.taxescost);
    };
    updadeAllValues();
  }, [
    config,
    products,
    packaging,
    checkIva,
    checkCustomsDuty,
    checkInsurance,
    otherTaxesPrice,
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