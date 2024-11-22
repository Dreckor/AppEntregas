import '../css/Header.css'
import { CarOutlined, FileTextOutlined,FormOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import comerza from '../assets/comerza.png'


function Header({ pagename }) {
    return (
        <header className="header">
           <a href='/login'><div className='header_icon1'><h1 className='ComerzaHeader'>Comerza</h1></div></a>
           <a href='/orders'><div className='header_icon'>Listado de ordenes</div><div className='header_icon3'><CarOutlined /></div></a>
           <a href="/createorder"><div className='header_icon'>Crear ordenes</div><div className='header_icon3'><FormOutlined  /></div></a>
           {/* <a href="/invoices"><div className='header_icon'>Facturas</div><div className='header_icon3'><FileTextOutlined /></div></a> */}
           <a href="/dashboard"><div className='header_icon'>Dashboard</div><div className='header_icon3'><FileTextOutlined /></div></a>
           <a href="/settings"><div className='header_icon1'><button className='ButtonPerfil'><UserAddOutlined /></button></div></a>
        </header>
        
    )
}

export default Header