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
           <div className='header_icon'><HomeOutlined style={{ fontSize:'45px' }}/></div>
           <div className='header_icon'><CarOutlined style={{ fontSize:'45px' }}/></div>
           <div className='header_icon'><UserOutlined style={{ fontSize:'45px' }}/></div>
        </header>
    )
}

export default Header