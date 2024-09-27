import './Header.css'
import { Button, Flex, Space,Avatar, } from 'antd';
import { UserOutlined,CarOutlined,HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    SearchOutlined   
} from '@ant-design/icons';

function Header({ pagename }) {
    return (
        <header className="header">
           <a href='/login'><div className='header_icon'><HomeOutlined style={{ fontSize:'45px' }}/></div></a>
           <a href='/orders'><div className='header_icon'><CarOutlined style={{ fontSize:'45px' }}/></div></a>
           <a href="/createorder"><div className='header_icon'><UserOutlined style={{ fontSize:'45px' }}/></div></a>
        </header>
    )
}

export default Header