const express = require("express");
const mongoose = require('mongoose');
const { userModel } = require('./models');

const uri = 'mongodb+srv://kevinsastas:2wByfdFsn8Cz78IV@clustertest.klnzr7a.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest';

// Conexión a MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Conectado a MongoDB');
        await initializeData(); // Inicializa los datos
    } catch (error) {
        console.error('No se pudo conectar a MongoDB:', error);
    }
};

// Función para inicializar datos predefinidos
const initializeData = async () => {
    try {
        const initialUsers = [
            { usuario: 'user1', contrasena: 'pass1' },
            { usuario: 'user2', contrasena: 'pass2' }
        ];

        // Verifica si ya existen usuarios en la colección
        const userCount = await userModel.countDocuments();
        if (userCount === 0) {
            await userModel.insertMany(initialUsers);
            console.log('Usuarios iniciales agregados');
        }
    } catch (error) {
        console.error('Error al agregar usuarios iniciales:', error);
    }
};

connectToMongoDB(); // Llama a la función de conexión

const app = express();
app.use(express.json());
const port = 8080;

app.get('/', (req, res) => {
    res.send("I am alive user");
});

app.get('/users', async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/users/:usuario', async (req, res) => {
    try {
        const user = await userModel.findOne({ usuario: req.params.usuario });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const newUser = new userModel({ usuario, contrasena });
        const data = await newUser.save();
        res.status(201).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/authenticate', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        const user = await userModel.findOne({ usuario, contrasena });
        if (user) {
            res.json({ isValid: true });
        } else {
            res.json({ isValid: false });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


