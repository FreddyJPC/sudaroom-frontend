import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Button, Spin, Empty, Select } from 'antd';
import axios from 'axios';
import Header from '../components/Header'; // Header que ya implementamos

const { Content } = Layout;
const { Option } = Select;

interface Profesor {
  id_usuario: number;
  nombre: string;
  carrera: string;
  correo: string;
  materias: string;
}

const ProfesorPage: React.FC = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]); // Lista de profesores
  const [loading, setLoading] = useState(false); // Estado de carga
  const [carreras, setCarreras] = useState<string[]>([]); // Lista de carreras
  const [selectedCarrera, setSelectedCarrera] = useState<string>(''); // Carrera seleccionada

  // Obtener las opciones de carreras al cargar la página
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await axios.get('/api/profesores/carreras'); // Ruta para obtener las carreras
        setCarreras(response.data.carreras || []); // Asegura que `carreras` sea un array
      } catch (error) {
        console.error('Error al cargar las carreras:', error);
        setCarreras([]); // En caso de error, setea carreras como un array vacío
      }
    };
    fetchCarreras();
  }, []);

  // Función para buscar profesores por carrera
  const fetchProfesores = async (carrera: string) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/profesores', {
        params: { carrera }, // Ruta para obtener profesores filtrados por carrera
      });
      setProfesores(response.data || []); // Asegura que `profesores` sea un array
    } catch (error) {
      console.error('Error al buscar profesores:', error);
      setProfesores([]); // Vacía la lista en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Manejador de cambio en el selector de carrera
  const handleCarreraChange = (carrera: string) => {
    setSelectedCarrera(carrera);
    fetchProfesores(carrera);
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

        {/* Selector de carreras */}
        <Select
          placeholder="Selecciona una carrera"
          style={{ marginBottom: '24px', maxWidth: '600px', margin: '0 auto', display: 'block' }}
          onChange={handleCarreraChange}
          value={selectedCarrera}
          size="large"
        >
          {carreras.length > 0 ? (
            carreras.map((carrera) => (
              <Option key={carrera} value={carrera}>
                {carrera}
              </Option>
            ))
          ) : (
            <Option disabled>Cargando carreras...</Option>
          )}
        </Select>

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
