const express = require('express');

let Categoria = require('../models/categoria');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


let app = express();

app.get('/categoria', verificaToken, function(req, res) {

    Categoria.find()
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

app.get('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            if (!categoria) {
                res.status(401).json({
                    ok: false,
                    err: {
                        message: `No se encontro categoria para el id ${id}`
                    }
                })
            }

            res.json({
                ok: true,
                categoria
            });

        });
});

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })

    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;


    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});


app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (categoriaBD === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});


module.exports = app;