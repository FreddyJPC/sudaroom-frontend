import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Select,
  Alert,
  Space,
} from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = 'http://localhost:5000';

const ProfesoresPage: React.FC = () => {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState<any[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const carreras = [
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
    const fetchProfesores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/profesores`);
        setProfesores(response.data || []);
        setError(null);
      } catch (err) {
        setError('Hubo un error al cargar los profesores.');
        setProfesores([]);
        console.error(err);
      }
    };

    fetchProfesores();
  }, []);

  const filteredProfesores = selectedCarrera
    ? profesores.filter((profesor) =>
        selectedCarrera === 'Todos'
          ? true
          : profesor.carrera === selectedCarrera
      )
    : profesores;

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      <Header style={{ backgroundColor: '#007070', padding: '16px' }}>
        <Space size="middle">
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            <LeftOutlined /> Volver
          </button>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            Profesores
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
            value={selectedCarrera || ''}
            onChange={(value) => setSelectedCarrera(value || null)}
            allowClear
          >
            {carreras.map((carrera) => (
              <Option key={carrera} value={carrera}>
                {carrera}
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

        {/* Lista de Profesores */}
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          {filteredProfesores.length === 0 ? (
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                No hay profesores disponibles para la carrera seleccionada.
              </Text>
            </Col>
          ) : (
            filteredProfesores.map((profesor) => (
              <Col key={profesor.id_usuario} xs={24} sm={12} lg={8}>
                <Card
                  title={profesor.nombre}
                  bordered
                  hoverable
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Text>
                    <strong>Correo:</strong> {profesor.correo}
                  </Text>
                  <br />
                  <Text>
                    <strong>Carrera:</strong> {profesor.carrera}
                  </Text>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Content>
    </Layout>
  );
};

export default ProfesoresPage;
