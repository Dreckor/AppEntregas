import { CustomRouter } from './routes/Router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { ConfigProvider } from "./context/ConfigContext.jsx";
import './App.css'

function App() {
  

  return (
    <AuthProvider>
      <ConfigProvider>
      <OrderProvider>
        <CustomRouter/>
      </OrderProvider>
      </ConfigProvider>
    </AuthProvider>
      
    
  )
}

export default App
