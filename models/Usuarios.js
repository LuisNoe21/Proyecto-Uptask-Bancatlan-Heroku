const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            len: {
                args: [3, 60],
                msg: 'El nombre debe tener 3 caracteres o más'
            },
            notEmpty: {
                msg: 'El nombre no puede ir vacio'
            }
        }
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull : false, 
        validate: {
            isEmail: {
                msg : 'Agrega un Correo Válido'
            },
            notEmpty: {
                msg: 'El e-mail no puede ir vacio'
            }
        }, 
        unique: {
            args: true,
            msg: 'Usuario Ya Registrado'
        }
    },  
    password: {
        type: Sequelize.STRING, 
        allowNull: false, 
        validate: {
            len: {
                args: [6, 500],
                msg: 'La contraseña debe tener minimo 6 caracteres'
            },
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    }, 
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }, 
    token: Sequelize.STRING, 
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
        }
    }
});

// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
