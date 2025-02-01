import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Spin, Alert, Button, Form, Input, message, Avatar } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";
import BackButton from "../../components/BackButton";

const API_BASE_URL = "http://localhost:5000";

const Profile: React.FC = () => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Ocurrió un error inesperado."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleUpdate = async (values: any) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/users/me`,
        { nombre: values.nombre, correo: values.correo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Perfil actualizado con éxito.");
      setUserProfile({ ...userProfile, ...values });
      setEditMode(false);
    } catch {
      message.error("No se pudo actualizar el perfil.");
    }
  };

  if (loading)
    return (
      <div className="profile-loading">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="profile-error"
      />
    );

  return (
    <div className="profile-container">
      <div className="back-button-container">
        <BackButton />
      </div>
      <div className="profile-header">
        <div className="profile-cover"></div>
        <Avatar size={100} className="profile-avatar">
          {userProfile?.nombre?.charAt(0).toUpperCase()}
        </Avatar>
      </div>

      <Card bordered={false} className="profile-card">
        {!editMode ? (
          <div className="profile-info">
            <h2 className="profile-name">{userProfile?.nombre}</h2>
            <p className="profile-email">{userProfile?.correo}</p>
            <p className="profile-role">
              <strong>Rol:</strong> {userProfile?.rol}
            </p>
            {userProfile?.carrera && (
              <p className="profile-career">
                <strong>Carrera:</strong> {userProfile?.carrera}
              </p>
            )}

            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
            >
              Editar Perfil
            </Button>
          </div>
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
              rules={[
                { required: true, message: "Por favor ingresa tu nombre." },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Correo"
              name="correo"
              rules={[
                { required: true, message: "Por favor ingresa tu correo." },
                { type: "email", message: "Correo inválido." },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="profile-buttons">
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                Guardar
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;
