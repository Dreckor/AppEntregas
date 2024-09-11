import { CustomRouter } from '../routes/Router.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css'

function App() {
  

  return (
    <AuthProvider>
      <CustomRouter/>
    </AuthProvider>
      
    
  )
}

export default App
