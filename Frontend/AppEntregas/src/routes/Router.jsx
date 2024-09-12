import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import OrdersForm from '../pages/OrdersForm';
import Home from '../pages/Home';
import ProtectedRoute from '../ProtectedRoute';

export const CustomRouter = ()=>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/login' element={<LoginPage/>} />
                
                <Route element={<ProtectedRoute/>}>
                    
                    <Route path='/createuser' element={<h1>createuser</h1>} />
                    <Route path='/createorder' element={<OrdersForm/>} />
                </Route>
                
                <Route path='/order:trakingnumber' element={<h1>createorder</h1>} />
            </Routes>
        </BrowserRouter>
    )
}