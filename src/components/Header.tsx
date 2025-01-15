import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const menu = (
    <Menu>
      <Menu.Item key="mi-perfil">
        <a href="/mi-perfil">Mi Perfil</a>
      </Menu.Item>
      <Divider style={{ margin: '8px 0' }} />
      <Menu.Item key="admin">
        <a href="/admin">Administrador</a>
      </Menu.Item>
      <Divider style={{ margin: '8px 0' }} />
      <Menu.Item key="login">
        <a href="/login">Cerrar Sesión</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '0 20px',
        height: '64px',
      }}
    >
      {/* Nombre de la aplicación */}
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#008080' }}>
        SUDAROOM
      </div>

      {/* Icono de usuario y menú desplegable */}
      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Avatar
          style={{ cursor: 'pointer', backgroundColor: '#008080' }}
          icon={<UserOutlined />}
        />
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
