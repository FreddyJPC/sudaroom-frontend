import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import "./CreateClassPage.css";
import BackButton from "../../components/BackButton";

const API_BASE_URL = "http://localhost:5000";

const CreateClassPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_hora: "",
    duracion: "",
    capacidad_maxima: "",
    estado: "disponible",
    carrera: "",
  });

  const carreras = [
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/clases`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage("Clase creada con éxito");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/clases");
      }, 1000);
    } catch (error) {
      setSnackbarMessage("Error al crear la clase");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="create-class-container">
      <Card className="create-class-card">
        <div className="back-button-container">
          <BackButton />
        </div>
        <CardContent>
          <Typography className="form-title" variant="h5">
            Crear Nueva Clase
          </Typography>

          <form onSubmit={handleSubmit} className="form-container">
            <TextField
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              fullWidth
              required
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
              required
              multiline
              rows={3}
            />

            <TextField
              label="Fecha y hora"
              type="datetime-local"
              name="fecha_hora"
              value={formData.fecha_hora}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getMinDateTime() }}
              className="date-time-picker"
            />

            <TextField
              label="Duración (minutos)"
              type="number"
              name="duracion"
              value={formData.duracion}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: "15", max: "180" }}
            />

            <TextField
              label="Capacidad máxima"
              type="number"
              name="capacidad_maxima"
              value={formData.capacidad_maxima}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: "1", max: "50" }}
            />

            <FormControl fullWidth>
              <InputLabel>Carrera</InputLabel>
              <Select
                name="carrera"
                value={formData.carrera}
                onChange={handleInputChange}
                required
                label="Carrera"
              >
                {carreras.map((carrera) => (
                  <MenuItem key={carrera} value={carrera}>
                    {carrera}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              className="submit-button"
              fullWidth
            >
              Crear Clase
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CreateClassPage;
