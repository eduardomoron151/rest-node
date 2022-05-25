const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if(!existeRol) {
        throw new Error(`EL rol ${rol} no esta registrado en la BD`);
    }
}

const emailExiste = async(correo = '') => {
    // verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if(existeEmail) {
        throw new Error(`El correo ${correo} ya se encuentra en uso`);
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}