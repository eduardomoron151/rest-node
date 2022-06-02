
const { Role, Usuario, Categoria, Producto } = require('../models');

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

const existeCategoria = async(id) => {
    const existe = await Categoria.findById(id);
    if(!existe) {
        throw new Error(`El id para la categoria no existe ${id}`);
    }
}

const existeProducto = async(id) => {
    const existe = await Producto.findById(id);
    if(!existe) {
        throw new Error(`El id para el producto no existe ${id}`);
    }
}

/**
 * validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if(!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }

    return true;
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}