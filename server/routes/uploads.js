const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto')

const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload());


app.put('/uploads/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "No se ha seleccionado ningun archivo"
                }
            })
    }


    //validar tipo

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'los tipos permitidos son ' + tiposValidos.join(',')
                }
            })
    }

    let archivo = req.files.archivo;
    let nombreCompleto = archivo.name.split('.');
    let extension = nombreCompleto[nombreCompleto.length - 1];

    let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: ' las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })

    }

    //cambiar nombre archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }


        //imagen cargada

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!usuarioBD) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'El Usuario no existe'
                    }
                })
        }

        borrarArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500)
                .json({
                    ok: false,
                    err
                })
        }

        if (!productoBD) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                })
        }

        borrarArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}


function borrarArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;