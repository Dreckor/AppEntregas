import { CustomRouter } from './routes/Router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import './App.css'

function App() {
  

  return (
    <AuthProvider>
      <OrderProvider>
        <CustomRouter/>
      </OrderProvider>
    </AuthProvider>
      
    
  )
}

export default App
