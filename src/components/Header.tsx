import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Divider, Badge, List, Button, Spin } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.tsx';
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar el componente y cada 30 segundos (por ejemplo)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, token]);

  // Función para marcar una notificación como leída
  const markAsRead = async (id_notificacion: number) => {
    try {
      await axios.put(`http://localhost:5000/api/notificaciones/${id_notificacion}/read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Actualizamos el estado local para que la notificación se marque como leída
      setNotifications((prev) =>
        prev.map((n) =>
          n.id_notificacion === id_notificacion ? { ...n, leido: true } : n
        )
      );
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  // Notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.leido).length;

  // Menú del dropdown para las notificaciones
  const notificationsMenu = (
    <div style={{ width: 300, maxHeight: 400, overflowY: 'auto', padding: '8px' }}>
      {loading ? (
        <Spin style={{ display: 'block', textAlign: 'center', marginTop: 20 }} />
      ) : notifications.length === 0 ? (
        <p style={{ textAlign: 'center', margin: 0 }}>No tienes notificaciones</p>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={notifications}
          renderItem={(item: any) => (
            <List.Item
              key={item.id_notificacion}
              style={{
                background: item.leido ? '#fff' : '#e6f7ff',
                borderRadius: 4,
                marginBottom: 8,
                padding: '8px',
              }}
            >
              <List.Item.Meta
                title={
                  <span style={{ fontWeight: item.leido ? 'normal' : 'bold' }}>
                    {item.mensaje}
                  </span>
                }
                description={
                  <small>
                    {new Date(item.fecha).toLocaleString()}
                  </small>
                }
              />
              {!item.leido && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => markAsRead(item.id_notificacion)}
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
    <Menu>
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
        fontFamily: "'Poppins', sans-serif",
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Dropdown de notificaciones */}
        <Dropdown
          overlay={notificationsMenu}
          trigger={['click']}
          placement="bottomRight"
          overlayStyle={{ padding: 0 }}
        >
          <Badge count={unreadCount} overflowCount={99}>
            <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Badge>
        </Dropdown>

        {/* Avatar con menú */}
        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
          <Avatar
            style={{ cursor: 'pointer', backgroundColor: '#008080' }}
            icon={<UserOutlined />}
          />
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
