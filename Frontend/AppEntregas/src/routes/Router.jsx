import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import OrdersForm from '../pages/OrdersForm';
import OrdersPage from '../pages/OrdersPage';
import OrderDetails from '../pages/OrderDetails';
import Home from '../pages/Home';
import ProtectedRoute from '../ProtectedRoute';
import OrderByTrakingName from '../pages/OrderByTrakingName';

export const CustomRouter = ()=>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/login' element={<LoginPage/>} />
                
                <Route element={<ProtectedRoute/>}>
                    
                    <Route path='/orders' element={<OrdersPage/>} />
                    <Route path='/createorder' element={<OrdersForm/>} />
                    <Route path="/orders/:orderId" element={<OrderDetails />} />
                </Route>
                
                <Route path='/order/:trakingnumber' element={<OrderByTrakingName/>} />
            </Routes>
        </BrowserRouter>
    )
}