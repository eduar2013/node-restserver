const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');

let app = express();


app.get('/producto', verificaToken, (req, res) => {

    Producto.find()
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            if (!producto) {
                res.status(401).json({
                    ok: false,
                    err: {
                        message: `No se encontro producto para el id ${id}`
                    }
                })
            }

            res.json({
                ok: true,
                producto
            });
        });


});



app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria_id,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No fue posible grabar el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });

});


app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni
    }

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });


});







module.exports = app;