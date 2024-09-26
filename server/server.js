const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = 'M3VyWJFoCLHbkxlJk6PU';  // Cambia esto por una clave secreta segura
app.use(morgan('dev'));

const fs = require('fs');
const path = require('path');

// Configuración manual de CORS
const corsOptions = {
    origin: 'http://localhost:8100',
    credentials: true, // Esto permite que las cookies se envíen con las solicitudes
    optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varios SmartTVs) se bloquean en 204
};

app.use(cors());
app.options('*', cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json());


const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'HomeHarmony$.$',
    database: 'beachmanagementdb'
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No se ha proporcionado un token' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Error al autenticar token' });
        req.userId = decoded.id;
        next();
    });
};


// Obtener todos los usuarios
app.get('/api/users', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM user');
    res.json(rows);
});

// Obtener usuarios online
app.get('/api/users/online', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM user');
        res.json(rows);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).json({ error: 'An error occurred while executing the query' });
    }
});

// Obtener un usuario por su id
app.get('/api/users/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [req.params.id]);
    res.json(rows);
});

// Ruta de login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password:', password); // Debug

    try {
        const [users] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (users.length > 0) {
            const user = users[0];
            console.log('User found:', user); // Debug

            //const passwordIsValid = bcrypt.compareSync(password, user.password);
            const passwordIsValid = password === user.password;
            if (passwordIsValid) {
                console.log("Usuario logueado: ", user); // Debug

                const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // expira en 24 horas
                return res.status(200).send({ auth: true, token: token, user: user });
            } else {
                console.log("Usuario no logueado: ", user); // Debug
                return res.status(401).send({ auth: false, token: null });
            }
        } else {
            return res.status(404).send('No user found.');
        }
    } catch (error) {
        console.error('Error in /api/login:', error);
        return res.status(500).send('Internal server error');
    }
});

// Obtener imagen de usuario
app.get('/api/user/imagen', async (req, res) => {
    const { email } = req.query;
    const [users] = await pool.query('SELECT imagen FROM user WHERE email = ?', [email]);
    if (users.length > 0) {
        // el usuario existe, enviar la imagen
        const imageBuffer = users[0].imagen;
        if (imageBuffer) {
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': imageBuffer.length
            });
            res.end(imageBuffer);
        } else {
            // la imagen del usuario es null
            res.status(404).json({ message: 'Imagen no encontrada' });
        }
    } else {
        // el usuario no existe
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Actualizar usuario
app.put('/api/users/:id', verifyToken, async (req, res) => {
    const { name, surname, email, playa_asociada, imagen } = req.body;
    const { id } = req.params;

    console.log("Imagen del lado del server: ", imagen);
    let dataBuffer;
    if (imagen && !imagen.startsWith('http')) {
        // Convierte la cadena de datos URI a un Buffer
        const base64Data = imagen.replace(/^data:image\/\w+;base64,/, '');
        dataBuffer = Buffer.from(base64Data, 'base64');
    }

    let query;
    let params;
    if (dataBuffer) {
        query = 'UPDATE user SET name = ?, surname = ?, email = ?, imagen = ?, playa_asociada = ? WHERE id = ?';
        params = [name, surname, email, dataBuffer, playa_asociada, id];
    } else {
        query = 'UPDATE user SET name = ?, surname = ?, email = ?, playa_asociada = ? WHERE id = ?';
        params = [name, surname, email, playa_asociada, id];
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows > 0) {
        // El usuario fue actualizado exitosamente
        res.json({ message: 'Usuario actualizado exitosamente' });
    } else {
        // No se encontró el usuario
        res.status(404).json({ message: 'Usuario no encontrado' });
    }
});

// Cambiar estado de usuario
app.put('/api/users/estado/:id', verifyToken, async (req, res) => {
    const { estado } = req.body;
    const { id } = req.params;

    try {
        // Actualiza el estado del usuario en la base de datos
        await pool.query('UPDATE user SET estado = ? WHERE id = ?', [estado, id]);

        // Envía una respuesta de éxito
        res.json({ success: true });
    } catch (error) {
        // Si algo sale mal, envía un error
        console.error(error);
        res.status(500).json({ success: false, message: 'Hubo un error al actualizar el estado del usuario.' });
    }
});

// Actualizar coordenadas de usuario
app.put('/api/users/coords/:id', verifyToken, async (req, res) => {
    const { lat, lng } = req.body;
    const { id } = req.params;
    try {
        const [result] = await pool.query('UPDATE user SET coords_lat = ?, coords_lng = ? WHERE id = ?', [lat, lng, id]);
        if (result.affectedRows > 0) {
            // El usuario fue actualizado exitosamente
            res.json({ message: 'Usuario actualizado exitosamente' });
        } else {
            // No se encontró el usuario
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

// Obtener todos los recursos
app.get('/api/recursos', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM recursos');
    res.json(rows);
});

// Obtener un icono de recurso por su id
app.get('/api/recursos/icono', async (req, res) => {
    const { ID } = req.query;
    const [recursos] = await pool.query('SELECT Icono FROM recursos WHERE ID = ?', [ID]);
    if (recursos.length > 0) {
        // el recurso existe, enviar el icono
        const iconBuffer = recursos[0].Icono;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': iconBuffer.length
        });
        res.end(iconBuffer);
    } else {
        // el recurso no existe
        res.status(404).json({ message: 'Recurso no encontrado' });
    }
});

// Obtener todos los recursos de tipo bandera
app.get('/api/recursos_banderas', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM recursosbanderas');
    res.json(rows);
});

// Obtener la imagen del recurso por su id
app.get('/api/recursos/imagen', async (req, res) => {
    const { ID } = req.query;
    const [recursos] = await pool.query('SELECT ImagenShow FROM recursos WHERE ID = ?', [ID]);
    if (recursos.length > 0) {
        // el recurso existe, enviar el icono
        const iconBuffer = recursos[0].ImagenShow;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': iconBuffer.length
        });
        res.end(iconBuffer);
    } else {
        // el recurso no existe
        res.status(404).json({ message: 'Recurso no encontrado' });
    }
});

// Obtener recurso por ID
app.get('/api/recursos/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM recursos WHERE ID = ?', [req.params.id]);
    res.json(rows[0]);
});

// Obtener un icono de recurso bandera por su id
app.get('/api/recursos_banderas/icono', async (req, res) => {
    const { ID } = req.query;
    const [recursos] = await pool.query('SELECT Icono FROM recursosbanderas WHERE ID = ?', [ID]);
    if (recursos.length > 0) {
        // el recurso existe, enviar el icono
        const iconBuffer = recursos[0].Icono;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': iconBuffer.length
        });
        res.end(iconBuffer);
    } else {
        // el recurso no existe
        res.status(404).json({ message: 'Recurso no encontrado' });
    }
});

// Obtener recurso bandera por ID
app.get('/api/recursos_banderas/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM recursosbanderas WHERE ID = ?', [req.params.id]);
    res.json(rows[0]);
});

// Actualizar recurso por ID
app.put('/api/recursos/:id', verifyToken, async (req, res) => {
    const { Estado, Comentario, UsuarioLastUpdate, ImagenShow } = req.body;
    const { id } = req.params;

    let dataBuffer;
    console.log("ImagenShow: ", ImagenShow);
    // Verifica si ImagenShow comienza con 'http'
    if (!ImagenShow.startsWith('http')) {
        // Convierte la cadena de datos URI a un Buffer
        const base64Data = ImagenShow.replace(/^data:image\/\w+;base64,/, '');
        dataBuffer = Buffer.from(base64Data, 'base64');
    }

    const HoraLastUpdate = new Date().toLocaleTimeString(); // Hora actual
    const fechaActual = new Date();
    const FechaLastUpdate = fechaActual.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    let query;
    let params;
    if (dataBuffer) {
        query = 'UPDATE recursos SET Estado = ?, Comentario = ?, UsuarioLastUpdate = ?, HoraLastUpdate = ?, FechaLastUpdate = ?, ImagenShow = ? WHERE ID = ?';
        params = [Estado, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, dataBuffer, id];
    } else {
        query = 'UPDATE recursos SET Estado = ?, Comentario = ?, UsuarioLastUpdate = ?, HoraLastUpdate = ?, FechaLastUpdate = ? WHERE ID = ?';
        params = [Estado, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, id];
    }

    const [result] = await pool.query(query, params);
    if (result.affectedRows > 0) {
        // El recurso fue actualizado exitosamente
        res.json({ message: 'Recurso actualizado exitosamente' });
    } else {
        // No se encontró el recurso
        res.status(404).json({ message: 'Recurso no encontrado' });
    }
});

// Actualizar recurso bandera por ID
app.put('/api/recursos_banderas/:id', verifyToken, async (req, res) => {
    let { Estado, Comentario, UsuarioLastUpdate, Icono } = req.body;
    const { id } = req.params;

    const iconPath = path.join(__dirname, '../client/src', Icono);
    Icono = fs.readFileSync(iconPath);

    console.log("Icono: ",  Icono);
    const HoraLastUpdate = new Date().toLocaleTimeString(); // Hora actual
    const fechaActual = new Date();
    const FechaLastUpdate = fechaActual.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    const query = 'UPDATE recursosBanderas SET Estado = ?, Comentario = ?, UsuarioLastUpdate = ?, Icono = ?, HoraLastUpdate = ?, FechaLastUpdate = ? WHERE Playa_asociada = ?';
    const params = [Estado, Comentario, UsuarioLastUpdate, Icono, HoraLastUpdate, FechaLastUpdate, id];

    const [result] = await pool.query(query, params);
    if (result.affectedRows > 0) {
        // El recurso fue actualizado exitosamente
        res.json({ message: 'Recurso actualizado exitosamente' });
    } else {
        // No se encontró el recurso
        res.status(404).json({ message: 'Recurso no encontrado' });
    }
});

const updateBanderas = async (req, res, Icono, Comentario, UsuarioLastUpdate) => {
    const { id } = req.params; // ID de la playa
    const iconPath = path.join(__dirname, '../client/src/assets/icons', Icono);
    Icono = fs.readFileSync(iconPath);

    const HoraLastUpdate = new Date().toLocaleTimeString(); // Hora actual
    const fechaActual = new Date();
    const FechaLastUpdate = fechaActual.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    const query = 'UPDATE recursosBanderas SET Icono = ?, Comentario = ?, UsuarioLastUpdate = ?, HoraLastUpdate = ?, FechaLastUpdate = ? WHERE playa_asociada = ?';
    const params = [Icono, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, id];

    const [result] = await pool.query(query, params);
    if (result.affectedRows > 0) {
        // Los recursos fueron actualizados exitosamente
        res.json({ message: 'Recursos actualizados exitosamente' });
    } else {
        // No se encontraron recursos
        res.status(404).json({ message: 'Recursos no encontrados' });
    }
};

app.put('/api/permitirBanio/:id', verifyToken, (req, res) => updateBanderas(req, res, 'bandera_verde.png', 'Baño permitido', req.body.UsuarioLastUpdate));
app.put('/api/banioConPrecaucion/:id', verifyToken, (req, res) => updateBanderas(req, res, 'bandera_amarilla.png', 'Baño con precaución', req.body.UsuarioLastUpdate));
app.put('/api/prohibirBanio/:id', verifyToken, (req, res) => updateBanderas(req, res, 'bandera_roja.png', 'Baño prohibido', req.body.UsuarioLastUpdate));

// Obtener todas las regiones
app.get('/api/regiones', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM region');
    res.json(rows);
});

// Obtener todas las playas
app.get('/api/beach', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beach');
    res.json(rows);
});

// Obtener imagen de una playa por ID
app.get('/api/beach/imagen', async (req, res) => {
    const ID = Number(req.query.ID);
    const [playas] = await pool.query('SELECT ImagenShow FROM beach WHERE ID = ?', [ID]);
    if (playas.length > 0) {
        // el aviso existe, enviar el icono
        const imgBuffer = playas[0].ImagenShow;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': imgBuffer.length
        });
        res.end(imgBuffer);
    } else {
        // el aviso no existe
        res.status(404).json({ message: 'Playa no encontrada' });
    }
});

// Obtener todos los recursos bandera de la playa por ID de playa
app.get('/api/beach/recursos_banderas/:ID', verifyToken, async (req, res) => {
    const ID = Number(req.params.ID);
    const [recursos_banderas] = await pool.query('SELECT * FROM recursosbanderas WHERE Playa_asociada = ?', [ID]);
    res.json(recursos_banderas);
});

// Obtener todos los recursos de la playa por ID de playa
app.get('/api/beach/recursos/todos/:ID', verifyToken, async (req, res) => {
    const ID = Number(req.params.ID);
    const [recursos_rotos] = await pool.query('SELECT * FROM recursos WHERE Playa_asociada = ?', [ID]);
    res.json(recursos_rotos);
});

// Obtener recursos rotos de la playa por ID de playa
app.get('/api/beach/recursos/rotos/:ID',verifyToken,  async (req, res) => {
    const ID = Number(req.params.ID);
    const [recursos_rotos] = await pool.query('SELECT * FROM recursos WHERE estado = "Roto" AND Playa_asociada = ?', [ID]);
    res.json(recursos_rotos);
});

// Obtener recursos robados de la playa por ID de playa
app.get('/api/beach/recursos/robados/:ID', verifyToken, async (req, res) => {
    const ID = Number(req.params.ID);
    const [recursos_robados] = await pool.query('SELECT * FROM recursos WHERE estado = "Robado" AND Playa_asociada = ?', [ID]);
    res.json(recursos_robados);
});

// Obtener incidencias presentes de la playa por ID de playa
app.get('/api/beach/incidencias/:ID', verifyToken, async (req, res) => {
    const ID = Number(req.params.ID);
    const [incidencias_presentes] = await pool.query('SELECT * FROM avisos WHERE Estado = "Presente" AND Playa_asociada = ?', [ID]);
    res.json(incidencias_presentes);
});

app.get('/api/beach/users/online/:ID', verifyToken, async (req, res) => {
    const ID = Number(req.params.ID);
    const [usuarios_presentes] = await pool.query('SELECT COUNT(*) FROM user WHERE estado = "online" AND Playa_asociada = ?', [ID]);
    res.json(usuarios_presentes);
});

// Obtener playa por ID
app.get('/api/beach/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beach WHERE ID = ?', [req.params.id]);
    res.json(rows);
});

// Obtener playas por región
app.get('/api/beach/region/:regionId', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM beach WHERE REGION = ?', [req.params.regionId]);
    res.json(rows);
});

// Obtener todos los avisos
app.get('/api/avisos', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM avisos');
    res.json(rows);
});

// Obtener avisos presentes
app.get('/api/avisos/presentes', verifyToken, async (req, res) => {
    const [avisos] = await pool.query('SELECT * FROM avisos WHERE Estado = "Presente"');
    res.json(avisos);
});

// Obtener icono de un aviso por ID
app.get('/api/avisos/icono', async (req, res) => {
    const ID = Number(req.query.ID);
    const [avisos] = await pool.query('SELECT Icono FROM avisos WHERE ID = ?', [ID]);
    if (avisos.length > 0) {
        // el aviso existe, enviar el icono
        const iconBuffer = avisos[0].Icono;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': iconBuffer.length,
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Expires': '-1',
            'Pragma': 'no-cache'
        });
        res.end(iconBuffer);
    } else {
        // el aviso no existe
        res.status(404).json({ message: 'Aviso no encontrado' });
    }
});

// Obtener imagen de un aviso por ID
app.get('/api/avisos/imagen', async (req, res) => {
    const { ID } = req.query;
    const [avisos] = await pool.query('SELECT ImagenShow FROM avisos WHERE ID = ?', [ID]);
    if (avisos.length > 0) {
        // el recurso existe, enviar el icono
        const iconBuffer = avisos[0].ImagenShow;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': iconBuffer.length
        });
        res.end(iconBuffer);
    } else {
        // el recurso no existe
        res.status(404).json({ message: 'Recurso no encontrado' });
    }
});

// Obtener aviso por ID
app.get('/api/avisos/:id', verifyToken, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM avisos WHERE ID = ?', [req.params.id]);
    res.json(rows);
});

// Insertar un nuevo aviso
app.post('/api/avisos', verifyToken, async (req, res) => {
    let { tipo_aviso, Playa_asociada, Coords_lat, Coords_lng, Estado, Icono, Comentario, UsuarioLastUpdate, ImagenShow } = req.body;

    const iconPath = path.join(__dirname, '../client/src', Icono);
    Icono = fs.readFileSync(iconPath);

    if (ImagenShow.startsWith('data:image')) {
        // Convierte las cadenas de datos URI a un Buffer
        const base64DataImagen = ImagenShow.replace(/^data:image\/\w+;base64,/, '');
        ImagenShow = Buffer.from(base64DataImagen, 'base64');
    } else {
        // Lee el archivo de la imagen y conviértelo a un Buffer
        const imagePath = path.join(__dirname, '../client/src', ImagenShow);
        ImagenShow = fs.readFileSync(imagePath);
    }
    console.log("Vamos a subir como imageNShow: ", ImagenShow);

    const HoraLastUpdate = new Date().toLocaleTimeString(); // Hora actual
    const fechaActual = new Date();
    const FechaLastUpdate = fechaActual.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    try {
        const [results] = await pool.query('SELECT MAX(ID) AS maxID FROM avisos');
        const ID = results[0].maxID + 1;

        const query = 'INSERT INTO avisos (ID, tipo_aviso, Playa_asociada, Coords_lat, Coords_lng, Estado, Icono, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, ImagenShow) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [ID, tipo_aviso, Playa_asociada, Coords_lat, Coords_lng, Estado, Icono, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, ImagenShow];

        await pool.query(query, values);
        res.status(201).send('Aviso insertado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al insertar el aviso');
    }
});

// Actualizar un aviso por ID
app.put('/api/avisos/:id', verifyToken, async (req, res) => {
    const { Comentario, UsuarioLastUpdate, ImagenShow, AvisoSolucionadoString } = req.body;
    const { id } = req.params;

    let dataBuffer;
    console.log("ImagenShow: ", ImagenShow);
    // Verifica si ImagenShow comienza con 'http'
    if (!ImagenShow.startsWith('http')) {
        // Convierte la cadena de datos URI a un Buffer
        const base64Data = ImagenShow.replace(/^data:image\/\w+;base64,/, '');
        dataBuffer = Buffer.from(base64Data, 'base64');
    }

    const HoraLastUpdate = new Date().toLocaleTimeString(); // Hora actual
    const fechaActual = new Date();
    const FechaLastUpdate = fechaActual.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    console.log("Se va a subir " + AvisoSolucionadoString);
    let query;
    let params;
    if (dataBuffer) {
        query = 'UPDATE avisos SET Estado = ?, Comentario = ?, UsuarioLastUpdate = ?, HoraLastUpdate = ?, FechaLastUpdate = ?, ImagenShow = ? WHERE ID = ?';
        params = [AvisoSolucionadoString, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, dataBuffer, id];
    } else {
        query = 'UPDATE avisos SET Estado = ?, Comentario = ?, UsuarioLastUpdate = ?, HoraLastUpdate = ?, FechaLastUpdate = ? WHERE ID = ?';
        params = [AvisoSolucionadoString, Comentario, UsuarioLastUpdate, HoraLastUpdate, FechaLastUpdate, id];
    }
    const [result] = await pool.query(query, params);
    
    if (result.affectedRows > 0) {
        // El aviso fue actualizado exitosamente
        res.json({ message: 'Aviso actualizado exitosamente' });
    } else {
        // No se encontró el aviso
        res.status(404).json({ message: 'Aviso no encontrado' });
    }
});

app.delete('/api/avisos/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM avisos WHERE id = ?', [id]);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Servidor escuchando en el puerto 3000'));