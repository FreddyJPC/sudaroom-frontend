import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Row, Col, Card, Button, Spin, Empty } from 'antd';
import axios from 'axios';
import Header from '../components/Header'; // Header que ya implementamos

const { Content } = Layout;
const { Search } = Input;

interface Profesor {
  id_usuario: number;
  nombre: string;
  carrera: string;
  correo: string;
  materias: string; // Asumimos que esta columna existe en la tabla de usuarios (puedes agregarla si es necesario).
}

const ProfesorPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para buscar profesores por materia
  const fetchProfesores = async (materia: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tutoria/search`, {
        params: { carrera: materia },
      });
      setProfesores(response.data.profesores);
    } catch (error) {
      console.error('Error al buscar profesores:', error);
      setProfesores([]); // Vacía la lista en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Manejador del filtro de búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchProfesores(value);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header />

      <Content style={{ padding: '24px' }}>
        {/* Introducción */}
        <Typography.Title
          level={3}
          style={{ textAlign: 'center', marginBottom: '24px', fontWeight: 'bold' }}
        >
          Escoge a tu profesor favorito y pide una tutoría
        </Typography.Title>

        {/* Barra de búsqueda */}
        <Search
          placeholder="Filtrar profesores por materia..."
          enterButton="Buscar"
          size="large"
          onSearch={handleSearch}
          style={{ marginBottom: '24px', maxWidth: '600px', margin: '0 auto', display: 'block' }}
        />

        {/* Lista de profesores */}
        {loading ? (
          <Spin style={{ display: 'block', margin: '0 auto' }} size="large" />
        ) : profesores.length > 0 ? (
          <Row gutter={[16, 16]}>
            {profesores.map((profesor) => (
              <Col xs={24} sm={12} md={8} key={profesor.id_usuario}>
                <Card
                  title={profesor.nombre}
                  bordered
                  hoverable
                  style={{ textAlign: 'center' }}
                >
                  <Typography.Text>
                    <strong>Carrera:</strong> {profesor.carrera}
                  </Typography.Text>
                  <br />
                  <Typography.Text>
                    <strong>Materias:</strong> {profesor.materias || 'No especificado'}
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary">
                    <strong>Correo:</strong> {profesor.correo}
                  </Typography.Text>
                  <br />
                  <Button
                    type="primary"
                    style={{ marginTop: '16px' }}
                    onClick={() =>
                      console.log(`Pedir tutoría a profesor con ID ${profesor.id_usuario}`)
                    }
                  >
                    Pedir Tutoría
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No se encontraron profesores" />
        )}
      </Content>
    </Layout>
  );
};

export default ProfesorPage;
