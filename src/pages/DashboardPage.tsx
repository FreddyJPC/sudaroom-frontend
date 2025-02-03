import React from 'react';
import { Layout, Typography, Button, Row, Col } from 'antd'; // Usamos Row y Col para diseño responsivo
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Importamos el Header creado anteriormente
import './DashboardPage.css';

const { Content } = Layout;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        {/* Llamado a la acción principal */}
        <Typography.Title
          level={2}
          style={{ textAlign: 'center', marginBottom: '32px', fontWeight: 'bold' }}
        >
          ¿Qué deseas hacer?
        </Typography.Title>

        {/* Opciones principales */}
        <Row gutter={[16, 16]} justify="center" style={{ width: '100%' }}>
          <Col xs={24} sm={12} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
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
          <Col xs={24} sm={12} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
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
