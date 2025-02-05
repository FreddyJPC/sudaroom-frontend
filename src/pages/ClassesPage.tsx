import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "antd";
import Header from "../components/Header";
import BackButton from "../components/BackButton";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000";

// Estilos definidos en objetos para aplicar inline.
const styles = {
  layout: {
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    fontFamily: "'Poppins', sans-serif",
  },
  content: {
    padding: "24px",
    fontFamily: "'Poppins', sans-serif",
  },
  filterContainer: {
    marginBottom: "24px",
  },
  alert: {
    maxWidth: "600px",
  },
  row: {
    marginTop: "24px",
  },
  card: {
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    border: "none",
  },
  detailsButton: {
    marginTop: "16px",
    backgroundColor: "#015C5C",
    borderColor: "#015C5C",
  },
  createButtonContainer: {
    textAlign: "center",
    marginTop: "24px",
  },
  createButton: {
    backgroundColor: "#015C5C",
    borderColor: "#015C5C",
  },
};

const ClassesPage: React.FC = () => {
  const { role, token } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const careers = [
    "Desarrollo de Software",
    "Diseño Gráfico",
    "Redes y Telecomunicaciones",
    "Electricidad",
    "Gastronomía",
    "Turismo",
    "Enfermería",
    "Marketing Digital",
    "Contabilidad y Asesoría Tributaria",
    "Educación",
    "Talento Humano",
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/clases/disponibles`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { carrera: selectedCareer },
          }
        );
        setClasses(response.data.clases || []);
        setError(null);
      } catch (err) {
        setError("Hubo un error al cargar las clases.");
        setClasses([]);
        console.error(err);
      }
    };

    fetchClasses();
  }, [selectedCareer, token]);

  return (
    <Layout style={styles.layout}>
      {/* Componente Header para una navegación consistente */}
      <Header />
      {/* <BackButton /> */}

      <Content style={styles.content}>
      <Title level={2} className="page-title">
          Clases
        </Title>
        <Space direction="vertical" style={styles.filterContainer}>
          <Select
            placeholder="Filtrar por carrera"
            style={{ width: 300 }}
            value={selectedCareer || ""}
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

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={styles.alert}
            />
          )}
        </Space>

        <Row gutter={[16, 16]} style={styles.row}>
          {classes.length === 0 ? (
            <Col span={24}>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                No hay clases disponibles para la carrera seleccionada.
              </Text>
            </Col>
          ) : (
            classes.map((clase) => (
              <Col key={clase.id_clase} xs={24} sm={12} lg={8}>
                <Card
                  title={clase.titulo}
                  bordered={false}
                  hoverable
                  style={styles.card}
                >
                  <Text type="secondary">{clase.descripcion}</Text>
                  <br />
                  <Text>
                    Profesor: <strong>{clase.profesor}</strong>
                  </Text>
                  <br />
                  <Text>
                    Fecha y hora:{" "}
                    <strong>
                      {new Date(clase.fecha_hora).toLocaleString()}
                    </strong>
                  </Text>
                  <Button
                    type="primary"
                    block
                    style={styles.detailsButton}
                    onClick={() => navigate(`/clases/${clase.id_clase}`)}
                  >
                    Ver Detalles
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {role === "profesor" && (
          <div style={styles.createButtonContainer}>
            <Button
              type="primary"
              size="large"
              style={styles.createButton}
              onClick={() => navigate("/clases/crear")}
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
