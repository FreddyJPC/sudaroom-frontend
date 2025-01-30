import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Typography, Row, Col, Card, Select, Alert } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import './ProfesorPage.css';

const { Header, Content } = Layout;
const { Title } = Typography;
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
    <Layout className="profesores-layout">
      <Header className="profesores-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            <LeftOutlined /> Volver
          </button>
          <Title level={3} className="header-title">
            Profesores
          </Title>
        </div>
      </Header>

      <Content className="profesores-content">
        <div className="filter-section">
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
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        <Row gutter={[16, 16]}>
          {filteredProfesores.length === 0 ? (
            <Col span={24}>
              <div className="no-results">
                No hay profesores disponibles para la carrera seleccionada.
              </div>
            </Col>
          ) : (
            filteredProfesores.map((profesor) => (
              <Col key={profesor.id_usuario} xs={24} sm={12} lg={8}>
                <Card className="profesor-card" title={profesor.nombre}>
                  <div className="profesor-info">
                    <div>
                      <span className="info-label">Correo:</span>
                      <span className="info-value">{profesor.correo}</span>
                    </div>
                    <div>
                      <span className="info-label">Carrera:</span>
                      <span className="info-value">{profesor.carrera}</span>
                    </div>
                  </div>
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