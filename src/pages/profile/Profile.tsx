import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Alert, Button, Form, Input, message } from "antd";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const Profile: React.FC = () => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        console.warn("Token no disponible, redirigiendo a login.");
        return;
      }
  
      try {
        setLoading(true);
        console.log("Token enviado:", token);
        
        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        setError(error.response?.data?.message || "Ocurrió un error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    if (token !== null) {
      fetchUserProfile();
    }
  }, [token]);
  
  const handleUpdate = async (values: any) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/me${userProfile.id}`,
        { nombre: values.nombre, correo: values.correo },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Perfil actualizado con éxito.");
      setEditMode(false);
      setUserProfile({ ...userProfile, ...values });
    } catch (err) {
      message.error("No se pudo actualizar el perfil.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ maxWidth: "600px", margin: "20px auto" }}
      />
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Card title="Perfil de Usuario" bordered={false}>
        {!editMode ? (
          <>
            <p>
              <strong>Nombre:</strong> {userProfile?.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {userProfile?.correo}
            </p>
            <p>
              <strong>Rol:</strong> {userProfile?.rol}
            </p>
            {userProfile?.carrera && (
              <p>
                <strong>Carrera:</strong> {userProfile?.carrera}
              </p>
            )}
            <Button type="primary" onClick={() => setEditMode(true)}>
              Editar Perfil
            </Button>
          </>
        ) : (
          <Form
            layout="vertical"
            initialValues={{
              nombre: userProfile?.nombre,
              correo: userProfile?.correo,
            }}
            onFinish={handleUpdate}
          >
            <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: "Por favor ingresa tu nombre." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Correo"
              name="correo"
              rules={[
                { required: true, message: "Por favor ingresa tu correo." },
                { type: "email", message: "Por favor ingresa un correo válido." },
              ]}
            >
              <Input />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
              <Button onClick={() => setEditMode(false)}>Cancelar</Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
