const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // obtenemos el Proyecto actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url }});

    // leer el valor del input
    const {tarea} = req.body;

    if(tarea.length === 0) {
        req.flash('error', 'La tareá no puede ir vacia');
        return res.redirect(`/proyectos/${req.params.url }`);
    }

    // estado 0 = incompleto y ID de Proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId});

    if(!resultado){
        return next();
    }

    // redireccionar
    res.redirect(`/proyectos/${req.params.url }`);

}

exports.cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: { id }});

    // cambiar el estado
    let estado = 0;
    if(tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado) return next();
    
    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res) => {

    const { id } = req.params;

    // Eliminar la tarea
    const resultado = await Tareas.destroy({where : { id  }});

    if(!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}

// cambiar contenido
exports.cambiarContenido = async (req, res) => {
    try {
        const { id } = req.params;

        if(!req.body.contenido) {
            throw 'El contenido es obligatorio'
        }
    
        await Tareas.update({
            tarea: req.body.contenido
        }, {
            where: {
                id
            }
        });

        res.status(200).json({
            ok: true
        })
    } catch(err) {
        res.json({
            ok: false,
            err
        })
    }
}