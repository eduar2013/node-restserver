//=========================
// puerto
//=========================
process.env.PORT = process.env.PORT || 3000;

//=========================
// Enviroment
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//=========================
// Expiracion del token
//=========================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.EXPIRACION_TOKEN = 60 * 60 * 24 * 30;

//=========================
// SEED de autenticacion
//=========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


//=========================
// Base de datos
//=========================

let urlBd;

if (process.env.NODE_ENV === 'dev') {
    urlBd = 'mongodb://localhost:27017/cafe';
} else {
    urlBd = process.env.MONGO_URI;
}

process.env.URLBD = urlBd;

//=========================
// Google Client ID
//=========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '743157863217-aj354k9u0bqhnve4dusoj4f164a0f4oq.apps.googleusercontent.com';