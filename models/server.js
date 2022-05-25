const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Connectar a base de datos
        this.conectarDB();


        // Middlewares
        this.middlewares();

        // Routes
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //cors
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use(express.json());

        
        // static public directorio
        this.app.use(express.static('public'));
    }

    routes() {
        
        this.app.use(this.usuariosPath, require('../routes/usuarios.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;