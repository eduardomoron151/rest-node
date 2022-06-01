const { response, request } = require("express");

const { Categoria } = require('../models');

// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async(req = request, res = response) => {
    try {

        const { limite = 5, desde = 0 } = req.query;
        const query = { estado : true };

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre')
                
        ]);

        res.json({
            total,
            categorias
        });

    } catch (error) {
        console.log(error);
    }
}

// obtenerCategoria - populate {}
const obtenerCategoria = async(req = request, res = response) => {
    try {
        const { id } = req.params;

        const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

        res.json({
            categoria
        });

    } catch (error) {
        console.log(error);
    }
}

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria : ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {
    // recibir los parametros
    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});
    if(categoriaDB) {
        return res.status(400).json({
            msg: `La categoria : ${categoriaDB.nombre}, ya existe`
        });
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new : true }).populate('usuario', 'nombre');

    res.json(categoria);

}   

// borrarCategoria - estado : false
const borrarCategoria = async(req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado : false}, {new : true });

    res.json({
        categoria
    });
}


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}