import '../css/Header.css'
import { Button, Flex, Space,Avatar, } from 'antd';
import { CarOutlined,HomeOutlined,SettingOutlined, FileTextOutlined,FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    SearchOutlined   
} from '@ant-design/icons';

function Header({ pagename }) {
    return (
        <header className="header">
           <a href='/login'><div className='header_icon'><HomeOutlined style={{ fontSize:'2.344vw' }}/></div></a>
           <a href='/orders'><div className='header_icon'><CarOutlined style={{ fontSize:'2.344vw' }}/></div></a>
           <a href="/createorder"><div className='header_icon'><FormOutlined  style={{ fontSize:'2.344vw' }}/></div></a>
           <a href="/invoices"><div className='header_icon'><FileTextOutlined style={{ fontSize:'2.344vw' }}/></div></a>
           <a href="/settings"><div className='header_icon'><SettingOutlined  style={{ fontSize:'2.344vw' }}/></div></a>
        </header>
    )
}

export default Header