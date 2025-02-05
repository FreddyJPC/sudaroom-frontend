import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import moment from "moment";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5000";

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
  row: {
    marginTop: "24px",
  },
  card: {
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    border: "none",
  },
  buttonGroup: {
    marginTop: "16px",
  },
  editButton: {
    backgroundColor: "#015C5C",
    borderColor: "#015C5C",
  },
  deleteButton: {
    backgroundColor: "#FF4D4F",
    borderColor: "#FF4D4F",
  },
};

const MisClasesPage: React.FC = () => {
  const { token } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [form] = Form.useForm();

  // Función para cargar las clases del profesor
  const fetchMyClasses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data.clases || []);
      setError(null);
    } catch (err) {
      setError("Hubo un error al cargar tus clases.");
      setClasses([]);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyClasses();
  }, [token]);

  // Muestra el modal de edición y setea los valores en el formulario
  const showEditModal = (clase: any) => {
    setEditingClass(clase);
    form.setFieldsValue({
      titulo: clase.titulo,
      descripcion: clase.descripcion,
      fecha_hora: moment(clase.fecha_hora),
      duracion: Number(clase.duracion),
      capacidad_maxima: Number(clase.capacidad_maxima),
      estado: clase.estado,
      carrera: clase.carrera,
    });
    setIsModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setEditingClass(null);
    form.resetFields();
  };

  // Envío del formulario de edición
  const handleEditSubmit = async (values: any) => {
    try {
      // Preparamos el payload, formateando la fecha y convirtiendo números a string (según la API)
      const payload = {
        ...values,
        fecha_hora: values.fecha_hora.format("YYYY-MM-DDTHH:mm"),
        duracion: values.duracion.toString(),
        capacidad_maxima: values.capacidad_maxima.toString(),
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/clases/${editingClass.id_clase}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedClass = response.data.clase;
      // Actualizamos el listado de clases
      setClasses((prev) =>
        prev.map((clase) =>
          clase.id_clase === updatedClass.id_clase ? updatedClass : clase
        )
      );
      setIsModalVisible(false);
      setEditingClass(null);
      form.resetFields();
    } catch (err: any) {
      console.error(err);
      // Aquí puedes agregar un mensaje de error adicional, si lo deseas
    }
  };

  // Función para eliminar una clase
  const handleDelete = async (id_clase: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/clases/${id_clase}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Eliminamos la clase del listado local
      setClasses((prev) => prev.filter((clase) => clase.id_clase !== id_clase));
    } catch (err) {
      console.error(err);
      // Aquí puedes mostrar un mensaje de error si es necesario
    }
  };

  return (
    <Layout style={styles.layout}>
      <Header />
      {/* <BackButton /> */}

      <Content style={styles.content}>
        <Title level={2}>Mis Clases</Title>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Row gutter={[16, 16]} style={styles.row}>
          {classes.length === 0 ? (
            <Col span={24}>
              <Text type="secondary">No has creado ninguna clase.</Text>
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
                    Fecha y hora:{" "}
                    <strong>
                      {new Date(clase.fecha_hora).toLocaleString()}
                    </strong>
                  </Text>
                  <br />
                  <Text>
                    Carrera: <strong>{clase.carrera}</strong>
                  </Text>
                  <br />
                  <Space style={styles.buttonGroup} direction="horizontal" size="small">
                    <Button
                      type="primary"
                      block
                      style={styles.editButton}
                      onClick={() => showEditModal(clase)}
                    >
                      Editar Clase
                    </Button>
                    <Button
                      type="primary"
                      block
                      danger
                      style={styles.deleteButton}
                      onClick={() => handleDelete(clase.id_clase)}
                    >
                      Eliminar Clase
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Modal para editar la clase */}
        <Modal
          title="Editar Clase"
          visible={isModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
            <Form.Item
              label="Título"
              name="titulo"
              rules={[{ required: true, message: "Por favor ingresa el título" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Descripción" name="descripcion">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="Fecha y hora"
              name="fecha_hora"
              rules={[{ required: true, message: "Por favor ingresa la fecha y hora" }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Duración (horas)"
              name="duracion"
              rules={[{ required: true, message: "Por favor ingresa la duración" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Capacidad máxima"
              name="capacidad_maxima"
              rules={[{ required: true, message: "Por favor ingresa la capacidad máxima" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Estado"
              name="estado"
              rules={[{ required: true, message: "Por favor selecciona el estado" }]}
            >
              <Select>
                <Option value="disponible">Disponible</Option>
                <Option value="no disponible">No Disponible</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Carrera"
              name="carrera"
              rules={[{ required: true, message: "Por favor selecciona la carrera" }]}
            >
              <Select>
                <Option value="Desarrollo de Software">Desarrollo de Software</Option>
                <Option value="Diseño Gráfico">Diseño Gráfico</Option>
                <Option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</Option>
                <Option value="Electricidad">Electricidad</Option>
                <Option value="Gastronomía">Gastronomía</Option>
                <Option value="Turismo">Turismo</Option>
                <Option value="Enfermería">Enfermería</Option>
                <Option value="Marketing Digital">Marketing Digital</Option>
                <Option value="Contabilidad y Asesoría Tributaria">
                  Contabilidad y Asesoría Tributaria
                </Option>
                <Option value="Educación">Educación</Option>
                <Option value="Talento Humano">Talento Humano</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Guardar cambios
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default MisClasesPage;
