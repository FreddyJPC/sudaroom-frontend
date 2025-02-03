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
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
import './ProfesorPage.css';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const API_BASE_URL = 'http://localhost:5000';

const ProfesoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, token } = useAuth();

  const [profesores, setProfesores] = useState<any[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState<any>(null);
  const [form] = Form.useForm();

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

  const showModal = (profesor: any) => {
    setSelectedProfesor(profesor);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    if (!userId || !token) {
      message.error('Debes iniciar sesión para enviar una solicitud.');
      return;
    }

    try {
      const solicitud = {
        id_profesor: selectedProfesor.id_usuario,
        tema: values.tema,
        mensaje: values.mensaje,
        fecha_solicitada: values.fecha.format('YYYY-MM-DD'),
        duracion: values.duracion,
      };

      await axios.post(`${API_BASE_URL}/api/solicitudes`, solicitud, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Solicitud de tutoría enviada con éxito');
      handleCancel();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      message.error('No se pudo enviar la solicitud.');
    }
  };

  return (
    <Layout className="profesores-layout">
      {/* Se utiliza el Header compartido para lograr coherencia en la navegación */}
      <Header />

      <Content className="profesores-content">
        {/* Título de la página en el contenido */}
        <Title level={2} className="page-title">Profesores</Title>

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
                    <Button type="primary" onClick={() => showModal(profesor)}>
                      Hacer Solicitud
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>

        <Modal
          title={`Solicitar Tutoría con ${selectedProfesor?.nombre}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Tema"
              name="tema"
              rules={[{ required: true, message: 'Por favor ingresa el tema.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mensaje"
              name="mensaje"
              rules={[{ required: true, message: 'Por favor ingresa un mensaje explicativo.' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Fecha solicitada"
              name="fecha"
              rules={[{ required: true, message: 'Por favor selecciona la fecha.' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Duración (horas)"
              name="duracion"
              rules={[{ required: true, message: 'Por favor ingresa la duración en horas.' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Enviar Solicitud
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ProfesoresPage;
