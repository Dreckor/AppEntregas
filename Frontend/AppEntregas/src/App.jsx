import { CustomRouter } from './routes/Router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { ConfigProvider } from "./context/ConfigContext.jsx";
import './App.css'
import {  InvoiceProvider } from './context/InvoiceContext.jsx';
import { UserProvider } from './context/UserContext.jsx';

function App() {
  

  return (
    <AuthProvider>
      <ConfigProvider>
      <OrderProvider>
        <InvoiceProvider>
        <UserProvider>
        <CustomRouter/>
        </UserProvider>
        </InvoiceProvider> 
      </OrderProvider>
      </ConfigProvider>
    </AuthProvider>
      
    
  )
}

export default App
