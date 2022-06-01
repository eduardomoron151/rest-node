const { response, request } = require("express");

const { Producto, Categoria } = require("../models");

const obtenerProductos = async(req = request, res = response) => {

    try {

        const { limite = 5, desde = 0 } = req.query;
        const query = { estado : true };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
                
        ]);

        res.json({
            total,
            productos
        });

    } catch (error) {
        console.log(error);
    }
}

const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findById(id).populate('categoria', 'nombre');

    res.json(producto);

}

const crearProducto = async(req = request, res = response) => {

    try {
        
        const { precio, categoria, descripcion = '' } = req.body;

        // validar si existe el producto
        const nombre = req.body.nombre.toUpperCase();

        const productoDB = await Producto.findOne({nombre});

        if(productoDB) {
            return res.status(400).json({
                msg: `El producto : ${productoDB.nombre}, ya existe`
            });
        }

        const usuario = req.usuario._id;

        // creamos la data a guardar
        const data = {
            nombre, 
            usuario,
            precio,
            categoria,
            descripcion
        }

        const producto = new Producto(data);

        await producto.save();

        res.status(201).json(producto);

    } catch (error) {
        console.log(error);
    }


}

const actualizarProducto = async(req = request, res = response) => {

    // recibir los parametros
    const { id } = req.params;
    const { precio, categoria, descripcion = '', disponible } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const usuario = req.usuario._id;

    const data = {
        nombre, 
        usuario,
        precio,
        categoria,
        descripcion, 
        disponible
    }

    const producto = await Producto.findByIdAndUpdate(id, data, {new : true}).populate('usuario', 'nombre').populate('categoria','nombre');

    res.json(producto);
}

const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado : false }, { new : true});

    res.json({
        producto
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}