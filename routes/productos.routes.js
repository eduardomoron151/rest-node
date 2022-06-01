const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controller');

const { existeCategoria, existeProducto } = require('../helpers/db-validators');


const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const router = Router();

// Obtener Todos los productos
router.get('/', obtenerProductos);

// Obtener producto por id
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProducto);

// Crear Producto
router.post('/', [
    validarJWT, 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de categoria valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    check('categoria', 'No es un id de categoria valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto)



module.exports = router;