import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function Contactos() {
    const { store, dispatch } = useGlobalReducer()
    const [contactoEditar, setContactoEditar] = useState(null);
    const [mostrarNuevo, setMostrarNuevo] = useState(false);
    const [nuevoContacto, setNuevoContacto] = useState({
        name: "",
        phone: "",
        email: "",
        address: ""
    });
    const [confirmarDelete, setConfirmarDelete] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null);
    useEffect(function () {

        fetch('https://playground.4geeks.com/contact/agendas/YessicaGarrido/contacts', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                console.log(resp.ok);
                console.log(resp.status);
                return resp.json();
            })
            .then(data => {
                dispatch({
                    type: "añadir_contactos",
                    payload: { contactos: data.contacts }
                })
                console.log(data.contacts);
            })
            .catch(error => {
                // Manejo de errores
                console.log(error);
            });
    }, [])

    function eliminarcontacto(id) {
        fetch(`https://playground.4geeks.com/contact/agendas/YessicaGarrido/contacts/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                console.log(resp.ok); // Será true si la respuesta es exitosa
                console.log(resp.status);
                if (resp.ok) {
                    const nuevos = store.contactos.filter(c => c.id !== id);

                    dispatch({
                        type: "añadir_contactos",
                        payload: { contactos: nuevos }
                    });

                }


                return resp.json(); // Intentará parsear el resultado a JSON y retornará una promesa donde puedes usar .then para seguir con la lógica
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                // Manejo de errores
                console.log(error);
            });

    }
    function guardarCambios(e) {
        e.preventDefault();

        fetch(`https://playground.4geeks.com/contact/agendas/YessicaGarrido/contacts/${contactoEditar.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactoEditar)
        })
            .then(resp => resp.json())
            .then(data => {


                const actualizados = store.contactos.map(c =>
                    c.id === contactoEditar.id ? contactoEditar : c
                );

                dispatch({
                    type: "añadir_contactos",
                    payload: { contactos: actualizados }
                });

                setContactoEditar(null);
            })
            .catch(error => console.log(error));
    }
    function guardarNuevo(e) {
        e.preventDefault();

        fetch("https://playground.4geeks.com/contact/agendas/YessicaGarrido/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoContacto)
        })
            .then(resp => resp.json())
            .then(data => {
                dispatch({
                    type: "añadir_contactos",
                    payload: { contactos: [...store.contactos, data] }
                });

                setMostrarNuevo(false);
            })
            .catch(error => console.log(error));
    }



    return (
        <div className="contactos">
             <div className="titulo"><h1>Lista de Contactos</h1></div>
            <button
                onClick={() => {
                    setNuevoContacto({ name: "", phone: "", email: "", address: "" });
                    setMostrarNuevo(true);
                }}
                className="agregarnuevocontacto"
            >
                Agregar Nuevo Contacto
            </button>

            {contactoEditar && (
                <div className="modal2">
                    <form onSubmit={guardarCambios} className="contactoeditar">
                        <h6><strong>Editar contacto</strong></h6>

                        <input
                            type="text" placeholder="Full Name"
                            value={contactoEditar.name}
                            onChange={(e) => setContactoEditar({ ...contactoEditar, name: e.target.value })}
                        />

                        <input
                            type="text" placeholder="Phone"
                            value={contactoEditar.phone}
                            onChange={(e) => setContactoEditar({ ...contactoEditar, phone: e.target.value })}
                        />

                        <input
                            type="email" placeholder="Email"
                            value={contactoEditar.email}
                            onChange={(e) => setContactoEditar({ ...contactoEditar, email: e.target.value })}
                        />

                        <input
                            type="text" placeholder="Address"
                            value={contactoEditar.address}
                            onChange={(e) => setContactoEditar({ ...contactoEditar, address: e.target.value })}
                        />

                        <button>Guardar</button>
                    </form>
                </div>
            )}


            {store.contactos.map(contacto => (

                <div className="card">
                    <img src="https://play-lh.googleusercontent.com/dT_T_qTstOPFOaMAwqRwP6glYZzwYowxa6oTCYyL50zTMWW9iYJ1S2tXQTeG_h0lV4U" className="avatar" />

                    <div className="info">
                        <h2>{contacto.name}</h2>

                        <p><i className="icon">📞</i> {contacto.phone}</p>
                        <p><i className="icon">✉️</i> {contacto.email}</p>
                        <p><i className="icon">📍</i> {contacto.address}</p>
                    </div>

                    <div className="actions">
                        <button onClick={() => setContactoEditar(contacto)} className="edit">✏️</button>
                        <button
                            onClick={() => {
                                setIdAEliminar(contacto.id);
                                setConfirmarDelete(true);
                            }}
                        >
                            🗑️
                        </button>
                    </div>
                </div>






            ))}

            {confirmarDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>¿ Estas Seguro?</h3>
                        <p>Esta acción no se puede deshacer.</p>

                        <button onClick={() => eliminarcontacto(idAEliminar)}>Eliminar</button>
                        <button onClick={() => setConfirmarDelete(false)}>Cancelar</button>
                    </div>
                </div>
            )}

            {mostrarNuevo && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Nuevo contacto</h2>

                        <form onSubmit={guardarNuevo}>
                            <input
                                type="text"
                                placeholder=" Full Name"
                                value={nuevoContacto.name}
                                onChange={e => setNuevoContacto({ ...nuevoContacto, name: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Phone"
                                value={nuevoContacto.phone}
                                onChange={e => setNuevoContacto({ ...nuevoContacto, phone: e.target.value })}
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={nuevoContacto.email}
                                onChange={e => setNuevoContacto({ ...nuevoContacto, email: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Address"
                                value={nuevoContacto.address}
                                onChange={e => setNuevoContacto({ ...nuevoContacto, address: e.target.value })}
                            />

                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setMostrarNuevo(false)}>
                                Cancelar
                            </button>
                        </form>
                    </div>
                </div>
            )}


        </div>




    )

} 