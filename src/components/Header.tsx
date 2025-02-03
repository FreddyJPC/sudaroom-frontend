import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Divider, Badge, List, Button, Spin } from 'antd';
import { UserOutlined, BellOutlined, MessageOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { userId, token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Función para obtener las notificaciones del usuario
  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/notificaciones/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar el componente y cada 30 segundos
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, token]);

  // Función para marcar una notificación como leída
  const markAsRead = async (id_notificacion: number) => {
    try {
      await axios.put(`http://localhost:5000/api/notificaciones/${id_notificacion}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualizamos el estado local para que la notificación se marque como leída
      setNotifications((prev) =>
        prev.map((n) => (n.id_notificacion === id_notificacion ? { ...n, leido: true } : n))
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Cantidad de notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.leido).length;

  // Menú del dropdown para las notificaciones
  const notificationsMenu = (
    <div
      style={{
        width: 320,
        maxHeight: 400,
        overflowY: 'auto',
        padding: '16px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {loading ? (
        <Spin style={{ display: 'block', textAlign: 'center', marginTop: 20 }} />
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: 'center', margin: 0, fontWeight: 300 }}>No tienes notificaciones</p>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={notifications}
          renderItem={(item: any) => (
            <List.Item
              key={item.id_notificacion}
              style={{
                background: item.leido ? '#fff' : '#e6f7ff',
                borderRadius: 6,
                marginBottom: 12,
                padding: '12px',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <List.Item.Meta
                title={
                  <span style={{ fontWeight: item.leido ? 400 : 600, fontSize: 14, color: '#333' }}>
                    {item.mensaje}
                  </span>
                }
                description={
                  <small style={{ fontFamily: "'Poppins', sans-serif", color: '#777' }}>
                    {new Date(item.fecha).toLocaleString()}
                  </small>
                }
              />
              {!item.leido && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => markAsRead(item.id_notificacion)}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Marcar como leído
                </Button>
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );

  // Menú del avatar
  const userMenu = (
    <Menu style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Menu.Item key="mi-perfil">
        <Link to="/mi-perfil">Mi Perfil</Link>
      </Menu.Item>
      <Divider style={{ margin: '8px 0' }} />
      <Menu.Item key="admin">
        <Link to="/admin">Administrador</Link>
      </Menu.Item>
      <Divider style={{ margin: '8px 0' }} />
      <Menu.Item key="login">
        <Link to="/login">Cerrar Sesión</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: '70px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Nombre de la aplicación */}
      <div style={{ fontSize: '22px', fontWeight: 600, color: '#00AFB5' }}>
        SUDAROOM
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Ícono de mensajería que redirige al buzón */}
        <Link to="/buzon" style={{ color: '#00AFB5',paddingTop:6  }}>
          <MessageOutlined style={{ fontSize: 22, cursor: 'pointer' }} />
        </Link>

        {/* Dropdown de notificaciones */}
        <Dropdown
          overlay={notificationsMenu}
          trigger={['click']}
          placement="bottomRight"
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={unreadCount} overflowCount={99}>
            <BellOutlined style={{ fontSize: 22, cursor: 'pointer', color: '#00AFB5' }} />
          </Badge>
        </Dropdown>

        {/* Avatar con menú */}
        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
          <Avatar
            style={{ cursor: 'pointer', backgroundColor: '#00AFB5' }}
            icon={<UserOutlined style={{ fontSize: 18 }} />}
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
