const jwt = require('jsonwebtoken');

//==============
// Verificar token
//==============
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

//==============
// Verificar Admin Role
//==============
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Role no autorizado'
            }
        });
    }

    next();
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}