import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import OrdersForm from '../pages/OrdersForm';
import OrdersPage from '../pages/OrdersPage';
import OrderDetails from '../pages/OrderDetails';
import Header from '../pages/Header';
//import Home from '../pages/Home';
import ProtectedRoute from '../ProtectedRoute';
import OrderByTrakingName from '../pages/OrderByTrakingName';
import ConfigPage from '../pages/ConfigPage';
import InvoicesPage from '../pages/invoices/InvoicesPage';
import InvoicePrintable from '../pages/invoices/InvoicePrintable';
import InvoicesDetail from '../pages/invoices/InvoicesDetail';

export const CustomRouter = ()=>{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>} />
                <Route path='/login' element={<LoginPage/>} />
                
                <Route element={<ProtectedRoute/>}>
                    
                    <Route path='/orders' element={<><Header /><OrdersPage /></>} />
                    <Route path='/createorder' element={<><Header /><OrdersForm/></>} />
                    <Route path="/orders/:orderId" element={<><Header /><OrderDetails /></>} />
                    <Route path="/settings" element={<><Header /><ConfigPage /></>} />
                    <Route path="/invoices" element={<><Header /><InvoicesPage /></>} />
                    <Route path="/invoice/:invoiceId" element={<><Header /><InvoicesDetail /></>} />
                    <Route path="/invoice/:invoiceId/print" element={<><Header /><InvoicePrintable /></>} />
                </Route>
                
                <Route path='/order/:trakingnumber' element={<OrderByTrakingName/>} />
            </Routes>
        </BrowserRouter>
    )
}