const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res ) => {
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en Uptask'
    })
}


exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar Sesión en UpTask', 
        error
    })
}

exports.crearCuenta = async (req, res) => {
    // leer los datos
    const { email, password, rpassword, nombre} = req.body;

    try {

        const errorMessage = {
            errors: []
        }

        if(!email) {
            errorMessage.errors.push({message: 'El email no debe ir vacio'});
        }
        if(!nombre) {
            errorMessage.errors.push({message: 'El nombre no debe ir vacio'});
        }
        if(nombre && nombre.length < 3) {
            errorMessage.errors.push({message: 'El nombre debe contener minimo 3 caracteres'});
        }
        if(password !== rpassword) {
            errorMessage.errors.push({message: 'Las contraseñas debén coincidir'});

            throw (errorMessage);
        }

        // crear el usuario
        await Usuarios.create({
            email, 
            password,
            nombre
        });

        // crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = {
            email
        }

        // enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        });
        
        // redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        const errors = error.errors.map(error => {
            if(error.message === 'El nombre debe tener 3 caracteres o más' && !nombre) {
                return null
            }
            if(error.message === 'La contraseña debe tener minimo 6 caracteres' && !password) {
                return null
            }
            if(error.message === 'Agrega un Correo Válido' && !email) {
                return null
            }
            return error.message
        });

        req.flash('error', errors.filter(error => error !== null));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask', 
            email,
            password,
            nombre,
            rpassword
        })
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}