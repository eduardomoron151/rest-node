const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoria } = require('../helpers/db-validators');

const { obtenerCategorias, obtenerCategoria, crearCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');

const router = Router();
/**
 * {{url}}/api/categorias
 */

// TODO: Midleware personalizado para el id 

router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

// Crear una nueva categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar un registro por id - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],  actualizarCategoria);

// Borrar una categoria - Admin - estado : false
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);



module.exports = router;