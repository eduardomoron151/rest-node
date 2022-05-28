const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {
        
        // verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }

        // Si el usuario esta activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado : false'
            });
        }

        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }


        // generarl el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignin = async (req, res = response) => {

    try {
        const { id_token } = req.body;

        const {correo, nombre, img} = await googleVerify(id_token);

        // Verificar que el correo exista en la base de datos
        let usuario = await Usuario.findOne({correo});

        if(!usuario) {
            // tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // si el usuario en BD tiene status en false
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // generarl el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario, 
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido'
        })
    }
    
}


module.exports = {
    login,
    googleSignin
}