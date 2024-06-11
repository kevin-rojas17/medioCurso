const express = require("express");
const mongoose = require('mongoose');
const axios = require('axios');
const { Comedor } = require('./models'); // Importa el modelo de comedor

const uri = 'mongodb+srv://kevinsastas:2wByfdFsn8Cz78IV@clustertest.klnzr7a.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest';

// Función para conectar a MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB...');
    await initializeData(); // Llama a initializeData() después de la conexión
  } catch (error) {
    console.error('No se pudo conectar a MongoDB...', error);
  }
};

// Función para inicializar datos pre-registrados
async function initializeData() {
  try {
    const existingDiners = await Comedor.find({});
    if (existingDiners.length === 0) {
      const diners = [
        { firstName: 'Juan', lastName: 'Pérez', phone: '1234567890' },
        { firstName: 'Ana', lastName: 'García', phone: '0987654321' },
        { firstName: 'Carlos', lastName: 'Sánchez', phone: '1122334455' },
      ];
      await Comedor.insertMany(diners);
      console.log('Datos iniciales insertados.');
    } else {
      console.log('Datos iniciales ya existen.');
    }
  } catch (error) {
    console.error('Error al inicializar datos:', error);
  }
}

connectToMongoDB(); // Llama a connectToMongoDB() después de definirla

const app = express();
app.use(express.json());
const port = 8080;

// Verificación de credenciales en userAPI
async function verifyUserCredentials(usuario, contrasena) {
  try {
    const response = await axios.post('http://user_api:8080/authenticate', { usuario, contrasena });
    return response.data.isValid;
  } catch (error) {
    console.error('Error verifying user credentials:', error);
    return false;
  }
}

// Rutas para el API de comedor
app.get('/', (req, res) => { res.send("API de Comedor"); });

app.get('/comedor', async (req, res) => {
  try {
    const diners = await Comedor.find({});
    res.json(diners);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/comedor/:id', async (req, res) => {
  try {
    const diner = await Comedor.findById(req.params.id);
    if (!diner) {
      return res.status(404).json({ message: 'Diner not found' });
    }
    res.json(diner);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/comedor', async (req, res) => {
  try {
    const { firstName, lastName, phone, usuario, contrasena } = req.body;
    const isValidUser = await verifyUserCredentials(usuario, contrasena);
    if (!isValidUser) {
      return res.status(403).json({ message: 'Forbidden: Invalid user credentials' });
    }
    const diner = new Comedor({ firstName, lastName, phone });
    const data = await diner.save();
    return res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/comedor/:id', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const diner = await Comedor.findByIdAndUpdate(req.params.id, {
      firstName,
      lastName,
      phone
    }, { new: true });
    if (!diner) {
      return res.status(404).json({ message: 'Diner not found' });
    }
    return res.status(200).json(diner);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/comedor/:id', async (req, res) => {
  try {
    const diner = await Comedor.findByIdAndRemove(req.params.id);
    if (!diner) {
      return res.status(404).json({ message: 'Diner not found' });
    }
    return res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API de Comedor escuchando en el puerto ${port}`);
});


app.listen(port, () => {
  console.log(`API de Comedor escuchando en el puerto ${port}`);
});
