import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Select,
  Alert,
  Space,
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = 'http://localhost:5000';

const ClassesPage: React.FC = () => {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const careers = [
    'Todos',
    'Desarrollo de Software',
    'Diseño Gráfico',
    'Redes y Telecomunicaciones',
    'Electricidad',
    'Gastronomía',
    'Turismo',
    'Enfermería',
    'Marketing Digital',
    'Contabilidad y Asesoría Tributaria',
    'Educación',
    'Talento Humano',
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clases/disponibles`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { carrera: selectedCareer },
        });
        setClasses(response.data.clases || []);
        setError(null);
      } catch (err) {
        setError('Hubo un error al cargar las clases.');
        setClasses([]);
        console.error(err);
      }
    };

    fetchClasses();
  }, [selectedCareer, token]);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <Header style={{ backgroundColor: '#007070', padding: '16px' }}>
        <Space size="middle">
          <Button
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ color: '#fff', borderColor: '#fff' }}
          />
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            Clases Disponibles
          </Title>
        </Space>
      </Header>

      {/* Content */}
      <Content style={{ padding: '24px' }}>
        {/* Filtro de Carreras */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="Filtrar por carrera"
            style={{ width: 300 }}
            value={selectedCareer || ''}
            onChange={(value) => setSelectedCareer(value || null)}
            allowClear
          >
            <Option value="">Todas las carreras</Option>
            {careers.map((career) => (
              <Option key={career} value={career}>
                {career}
              </Option>
            ))}
          </Select>

          {/* Mensaje de Error */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ maxWidth: '600px' }}
            />
          )}
        </Space>

        {/* Lista de Clases */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          {classes.length === 0 ? (
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                No hay clases disponibles para la carrera seleccionada.
              </Text>
            </Col>
          ) : (
            classes.map((clase) => (
              <Col key={clase.id_clase} xs={24} sm={12} lg={8}>
                <Card
                  title={clase.titulo}
                  bordered
                  hoverable
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Text type="secondary">{clase.descripcion}</Text>
                  <br />
                  <Text>
                    Profesor: <strong>{clase.profesor}</strong>
                  </Text>
                  <br />
                  <Text>
                    Fecha y hora:{' '}
                    <strong>{new Date(clase.fecha_hora).toLocaleString()}</strong>
                  </Text>
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: '16px', backgroundColor: '#015C5C' }}
                    onClick={() => navigate(`/clases/${clase.id_clase}`)}
                  >
                    Ver Detalles
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Botón de Crear Clase */}
        {role === 'profesor' && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              type="primary"
              size="large"
              style={{ backgroundColor: '#015C5C', borderColor: '#008080' }}
              onClick={() => navigate('/clases/crear')}
            >
              Crear Clase
            </Button>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ClassesPage;
