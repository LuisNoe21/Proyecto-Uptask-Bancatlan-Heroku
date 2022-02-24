import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {

    let textoTareaEditando;

    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')) {
        
            const tareaHTML = e.target.parentElement.parentElement, 
                  idTarea = tareaHTML.dataset.tarea;

                  Swal.fire({
                    title: 'Deseas borrar esta Tarea?',
                    text: "Una tarea eliminada no se puede recuperar",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Borrar', 
                    cancelButtonText: 'No, Cancelar'
                }).then((result) => {
                    if (result.value) {
                        const url = `${location.origin}/tareas/${idTarea}`;

                        // enviar el delete por medio axios
                        axios.delete(url, { params: { idTarea }})
                            .then(function(respuesta) {
                                if(respuesta.status === 200) {
                                    // console.log(respuesta);

                                    // Eliminar el Nodo
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    // Opcional una alerta
                                    Swal.fire(
                                        'Tarea Eliminada',
                                        respuesta.data,
                                        'success'
                                    )

                                    actualizarAvance();
                                }
                            });
                    }
                })
        }

        // editar
        if(e.target.classList.contains('fa-pen')) {
            const modal = document.querySelector('.modal');
            modal.addEventListener('click', e => {
                if(e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
                    modal.classList.remove('show');
                }
            })
            if(modal) {
                const target = e.target;
                const parrafo = target.parentElement.parentElement.querySelector('p');
                const modalInput = modal.querySelector('input[type="text"]');
                const modalForm = modal.querySelector('form');
                const idTarea = target.parentElement.parentElement.dataset.tarea;
                modalInput.value = parrafo.textContent;
                modal.classList.add('show');

                modalForm.addEventListener('submit', e => {
                    e.preventDefault();
                    const url = `${location.origin}/tarea/update/${idTarea}`;
                    axios.put(url, {
                        contenido: modalInput.value
                    })
                    .then(r => {
                        if(r.data.ok) {
                            modal.classList.remove('show');
                            parrafo.textContent = modalInput.value;
                            Swal.fire({
                                title: 'Se actualizo correctamente',
                                type: 'success'
                            });
                        }else {
                            Swal.fire({
                                title: r.data.err,
                                type: 'warning'
                            });
                        }
                    });
                });
            }
        }
    });

}

export default tareas;