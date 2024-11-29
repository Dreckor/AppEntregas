import { useState, useEffect  } from "react";
import { Form, Input, Button, Select, Spin, Checkbox, message,Popconfirm} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductsModal from "./ProductModal.jsx";
import { useFormHook } from "../../hooks/useFormHandler";
import QuickUserModal from "./QuickUserModal.jsx";
import { useProductModalHook } from "../../hooks/useProductHook";
import { useUserHook } from "../../hooks/configHooks/useUserHook.jsx"
import { useUser } from "../../context/UserContext.jsx";
import "../../css/OrdersForm.css";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
export default function Formulario() {
    
    // eslint-disable-next-line react/prop-types
    const {
        config,
        editingProduct,
        products, 
        users, 
        repartidores,
        setProducts, 
        setEditingProduct,
        dataloading,
        loading,
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
        handlePackagingChange,
        setUsers,
        setRepartidores
      } = useFormHook()
      const {
        updateUser,
        createUser,
        deleteUser,
        error
      } = useUser();
      
      const [userRole, setUserRole] = useState(null); // Para controlar el rol en el modal
      const [form] = Form.useForm();
      const [form2] = Form.useForm();
      const configUserHook = useUserHook( {form, updateUser, createUser, deleteUser});
    
      const productModalHook = useProductModalHook(config, editingProduct, products, setProducts, setEditingProduct );
      const handleAddProduct = productModalHook.handleAddProduct
      const handleEditProduct = productModalHook.handleEditProduct
      const handleDeleteProduct = productModalHook.handleDeleteProduct

      useEffect(() => { 
        
        if (configUserHook?.selectedUser && userRole == 'user') {
          // Verifica si el usuario ya está en la lista, si no, agrégalo.
          setUsers((users) => {
            const exists = users.some((user) => user.id === configUserHook.selectedUser.id);
            // Actualiza el campo del formulario
            form2.setFieldsValue({
              userId: configUserHook.selectedUser.id, // Usa el ID del usuario seleccionado
            });
            return exists ? users : [...users, configUserHook.selectedUser];
          });}
          if (configUserHook?.selectedUser && userRole == 'repartidor') {
            // Verifica si el usuario ya está en la lista, si no, agrégalo.
            setRepartidores((repartidores) => {
              const exists = repartidores.some((user) => user.id === configUserHook.selectedUser.id);
              // Actualiza el campo del formulario
              form2.setFieldsValue({
                asignedUserId: configUserHook.selectedUser.id, // Usa el ID del usuario seleccionado
              });
              return exists ? users : [...users, configUserHook.selectedUser];
            });}
       
          
        
      }, [configUserHook.selectedUser, form2, setUsers, setRepartidores , userRole, ]);

      useEffect(() => {
        if (error && error.length > 0 ) {
          error.forEach(({ data }) => handleError(data.errorCode, data.message));
        }
        //if (configUserHook.errorUserHook && configUserHook.errorUserHook.length > 0 ) {
        //  configUserHook.errorUserHook.forEach(({ data }) => handleError(data.errorCode, data.message));
        //}
      }, [error, configUserHook.errorUserHook]);
    
      const handleError = (errorCode, errorMessage) => {
        const messages = {
          USER_NOT_FOUND: 'El usuario no existe. Verifica tu correo.',
          INVALID_CREDENTIALS: 'Contraseña incorrecta. Intenta nuevamente.',
          SERVER_ERROR: 'Error en el servidor. Intenta más tarde.',
        };
        message.error(messages[errorCode] || errorMessage || 'Error desconocido');
      };
      const handleAddNewUser = (role) => {
        setUserRole(role);
        configUserHook.openModal();
      };

      const handleEditUser = (updatedUser) => {
        configUserHook.openModal(updatedUser);
        if (updatedUser) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === updatedUser.id ? updatedUser : user
            )
          );
          message.success("Usuario actualizado correctamente.");
        }
        
      };
      
      const handleDeleteUser = (userId) => {
        deleteUser(userId)
          .then(() => {
            setUsers((prev) => prev.filter((user) => user.id !== userId));
            message.success("Usuario eliminado correctamente.");
          })
          .catch(() => {
            message.error("Error al eliminar el usuario.");
          });
      };
      
  return (
    <Form className="OrderFormContent" layout="vertical" onFinish={onFinish} form={form2}>
        <h1 className="Orderclass">Crear Nueva Orden</h1>
        <Form.Item
          className="FormItem"
          label=""
          name="orderTitle"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el destinatario",
            },
          ]}
        >
          <Input placeholder="Introduce el destinatario" />
        </Form.Item>

        <Form.Item
  className="FormItem"
  label=""
  name="userId"
  rules={[
    {
      required: true,
      message: "Por favor selecciona un cliente asignado",
    },
  ]}
>
  <Select
    className="FormItem"
    showSearch
    placeholder={
      dataloading
        ? "Cargando usuarios..."
        : "Selecciona un cliente asignado"
    }
    disabled={dataloading}
    notFoundContent={dataloading ? <Spin size="small" /> : null}
    filterOption={(input, option) => {
      return (
        option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
      
    }}
    dropdownRender={(menu) => (
      <div>
        {menu}
        <div style={{ display: "flex", justifyContent: "space-between", padding: 8 }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => handleAddNewUser("user")}
          >
            Agregar nuevo cliente
          </Button>
        </div>
      </div>
    )}
  >
    {users.map((user) => (
      <Option key={user.id} value={user.id} title={user.username}>
        <span style={{ marginRight: 18 }}>{user.username}</span>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditUser(user)}
        />
        <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined /> } danger>
              Eliminar
            </Button>
          </Popconfirm>
      </Option>
    ))}
    
  </Select>
</Form.Item>

        <Form.Item
          className="FormItem"
          label=""
          name="state"
          rules={[
            { required: true, message: "Por favor selecciona un estado" },
          ]}
        >
          <Select placeholder="Selecciona un estado" className="FormItem">
            {config && config.states && config.states.length > 0 ? (
              config.states.map((state) => (
                <Option key={state._id} value={state._id}>
                  {state.name}
                </Option>
              ))
            ) : (
              <Option disabled>
                No hay estados disponibles, revise la configuración del panel
              </Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          className="FormItem"
          label=""
          name="initialPoint"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el punto inicial",
            },
          ]}
        >
          <Select
            placeholder="Selecciona un punto de partida"
            className="FormItem"
          >
            {config &&
            config.departurePoints &&
            config.departurePoints.length > 0 ? (
              config.departurePoints.map((point) => (
                <Option key={point._id} value={point._id}>
                  {point.name}
                </Option>
              ))
            ) : (
              <Option disabled>No hay puntos de partida disponibles</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          className="FormItem"
          label=""
          name="destinyPoint"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el punto de destino",
            },
          ]}
        >
          <Select
            placeholder="Selecciona un punto de destino"
            className="FormItem"
          >
            {config &&
            config.deliveryPoints &&
            config.deliveryPoints.length > 0 ? (
              config.deliveryPoints.map((point) => (
                <Option key={point._id} value={point._id}>
                  {point.name}
                </Option>
              ))
            ) : (
              <Option disabled>No hay puntos de destino disponibles</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          className="FormItem"
          label=""
          name="asignedUserId"
          rules={[
            {
              required: true,
              message: "Por favor selecciona un repartidor asignado",
            },
          ]}
        >
          <Select
    className="FormItem"
    showSearch
    placeholder={
      dataloading
        ? "Cargando repartidores..."
        : "Selecciona un repartidor asignado"
    }
    disabled={dataloading}
    notFoundContent={dataloading ? <Spin size="small" /> : null}
    filterOption={(input, option) => {
      return (
        option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
      
    }}
    dropdownRender={(menu) => (
      <div>
        {menu}
        <div style={{ display: "flex", justifyContent: "space-between", padding: 8 }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => handleAddNewUser("repartidor")}
          >
            Agregar nuevo cliente
          </Button>
        </div>
      </div>
    )}
  >
    {repartidores.map((user) => (
      <Option key={user.id} value={user.id} title={user.username}>
        <span style={{ marginRight: 18 }}>{user.username}</span>
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEditUser(user)}
        />
        <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined /> } danger>
              Eliminar
            </Button>
          </Popconfirm>
      </Option>
    ))}
    
  </Select>
          
        </Form.Item>

        <Form.Item label="" className="ContentProducts">
          <Button
            className="ContentProducts"
            type="dashed"
            onClick={handleAddProduct}
            icon={<PlusOutlined />}
          >
            Añadir Productos
          </Button>
          {products.map((product, index) => (
            <div key={index} style={{ marginTop: 10 }} className="ListProducts">
              <span>
                {product.productLabel} - Unidades: {product.productUnits} -
                Kilos: {product.kilos}
              </span>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditProduct(index)}
              />
              <Button
                type="link"
                danger
                onClick={() => handleDeleteProduct(index)}
              >
                Eliminar
              </Button>
            </div>
          ))}
        </Form.Item>

        <Form.Item
          className="Ivacheck"
          label="Cobrar embalaje"
          name="packaging"
          rules={[{ required: false }]}
        >
          <Checkbox onChange={(e) => handlePackagingChange(e.target.checked)} />
        </Form.Item>
        <Form.Item
          className="Ivacheck"
          label="Cobrar IVA"
          name="hasIva"
          rules={[{ required: false }]}
        >
          <Checkbox onChange={(e) => handleIVAChange(e.target.checked)} />
        </Form.Item>
        <Form.Item
          className="Ivacheck"
          label="Cobrar aduanas"
          name="hasCustomsDuty"
        >
          <Checkbox onChange={(e) => handleDutyChange(e.target.checked)} />
        </Form.Item>
        <Form.Item
          className="Ivacheck"
          label="Cobrar seguro"
          name="hasInsurance"
        >
          <Checkbox onChange={(e) => handleInsuranceChange(e.target.checked)} />
        </Form.Item>
        <Form.Item
          className="Ivacheck"
          label="Otros impuestos"
          name="hasOtherTaxes"
        >
          <Checkbox onChange={(e) => handleTaxesChange(e.target.checked)} />
        </Form.Item>
        <Form.Item
          className="paymentItem"
          label=""
          name="paymentMethod"
          rules={[
            {
              required: true,
              message: "Por favor selecciona un método de pago",
            },
          ]}
        >
          <Select
            className="FormItem"
            placeholder={
              dataloading
                ? "Cargando métodos de pago..."
                : "Selecciona un método de pago"
            }
            disabled={dataloading}
            notFoundContent={dataloading ? <Spin size="small" /> : null}
          >
            {config?.paymentMethods.map((paymentMethod) => (
              <Option key={paymentMethod._id} value={paymentMethod._id}>
                {paymentMethod.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <div className="TotalIva">
          <h4>
            Embalaje:{" "}
            {packaging
              ? (config.packagingCost ?? 0).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })
              : 0}
          </h4>
          <h4>
            Subtotal:{" "}
            {(subTotalPrice ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </h4>
          <h4>
            IVA:{" "}
            {(ivaPrice ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </h4>
          <h4>
            Aduanas:{" "}
            {(dutyPrice ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </h4>
          <h4>
            Seguro:{" "}
            
            {(insurancePrice ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </h4>
          <h4>
            Otros impuestos:{" "}
            {(otherTaxesPrice ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </h4>
          <h4>
            Total:{" "}
            {(totalPrice ?? 0).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </h4>
        </div>

        <Form.Item className="FormItem">
          <Button
            className="BtnProduct"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Crear Orden
          </Button>
        </Form.Item>

        <ProductsModal
          productModalHook= {productModalHook}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          config={config}
        />
        <QuickUserModal
        form={configUserHook.form}
        configUserHook= {configUserHook}
        defaultRole={userRole}
      />
      </Form>
  );
}
