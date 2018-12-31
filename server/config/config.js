//=========================
// puerto
//=========================
process.env.PORT = process.env.PORT || 3000;

//=========================
// Enviroment
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

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