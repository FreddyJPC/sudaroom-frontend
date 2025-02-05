import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Typography, Button, Row, Col, Spin } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './DashboardPage.css';

const { Content } = Layout;
const API_BASE_URL = 'http://localhost:5000';

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  // Usamos un estado local para almacenar la información del usuario
  const [userProfile, setUserProfile] = useState<any>(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    // Si el contexto aún no tiene la información, la obtenemos
    if (!user) {
      fetchUserProfile();
    }
  }, [token, user]);

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Content
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header />

      {/* Contenido del dashboard */}
      <Content
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Mensaje de bienvenida */}
        <Typography.Title level={4} style={{ marginBottom: '16px' }}>
          Bienvenido, {userProfile?.nombre || 'Usuario'}
        </Typography.Title>

        {/* Llamado a la acción principal */}
        <Typography.Title
          level={2}
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            fontWeight: 'bold',
          }}
        >
          ¿Qué deseas hacer?
        </Typography.Title>

        {/* Opciones principales */}
        <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
          <Col
            xs={24}
            sm={12}
            md={8}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              type="primary"
              size="large"
              style={{
                width: '100%',
                height: '80px',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => navigate('/clases')}
            >
              Buscar Clases
            </Button>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={8}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              type="default"
              size="large"
              style={{
                width: '100%',
                height: '80px',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#1890ff',
              }}
              onClick={() => navigate('/profesores')}
            >
              Buscar Profesores
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default DashboardPage;
