document.addEventListener("DOMContentLoaded", function () {

    const listaComputadoras = [
        { codigo: "PC-01", serie: "JM-1111" },
        { codigo: "PC-02", serie: "JM-2222" },
        { codigo: "PC-03", serie: "JM-3333" },
        { codigo: "PC-04", serie: "JM-4444" },
        { codigo: "PC-05", serie: "JM-5555" }
    ];

    window.mostrarRegistroProfe = function() {
        document.getElementById("pantallaPrestamo").classList.add("oculto");
        document.getElementById("pantallaProfe").classList.remove("oculto");
    }

    window.mostrarPrestamo = function() {
        document.getElementById("pantallaProfe").classList.add("oculto");
        document.getElementById("pantallaPrestamo").classList.remove("oculto");
    }

    const selectPC = document.getElementById("selectPC");
    if (selectPC) {
        listaComputadoras.forEach(pc => {
            let option = document.createElement("option");
            option.value = pc.serie;
            option.text = pc.codigo + " (Serie: " + pc.serie + ")";
            selectPC.appendChild(option);
        });
    }

    // autocompletar
    const inputCodigoProfe = document.getElementById("codigoProfe");
    
    if (inputCodigoProfe) {
        inputCodigoProfe.addEventListener("blur", function () {
            const codigo = this.value.trim().toUpperCase(); 
            
            if (codigo !== "") {
                let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
                let profe = profesores.find(p => p.codigo === codigo);
                
                if (profe) {
                    document.getElementById("nombre").value = profe.nombre;
                    document.getElementById("apellido").value = profe.apellido;
                    document.getElementById("curso").value = profe.curso;
                }
            }
        });
    }
    
    const btnGuardar = document.getElementById("btnGuardar");
    if (btnGuardar) {
        btnGuardar.addEventListener("click", function () {
            const codigoProfe = document.getElementById("codigoProfe").value.trim().toUpperCase();
            const nombre = document.getElementById("nombre").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            const curso = document.getElementById("curso").value.trim();
            const serie = document.getElementById("selectPC").value;

            if (codigoProfe === "" || nombre === "" || apellido === "" || curso === "") {
                alert("Por favor, completá todos los campos.");
                return;
            }

            let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
            let profeValido = profesores.find(p => p.codigo === codigoProfe);

            if (!profeValido) {
                alert("El código de profesor no es válido. Pedile al profe que se registre primero.");
                return;
            }

            // doble no deja que se registre doble pc 
            let historial = JSON.parse(localStorage.getItem("historialPrestamos")) || [];
            let pcOcupada = historial.find(prestamo => prestamo.serie === serie && prestamo.estado === "Prestada");

            if (pcOcupada) {
                alert("¡ERROR!\nLa computadora con serie " + serie + " ya está prestada a " + pcOcupada.nombre + " " + pcOcupada.apellido + ".\n\nPrimero tenés que ir al Historial y registrar la devolución.");
                return; 
            }
        

            const nuevoPrestamo = {
                codigoProfe: codigoProfe,
                nombre: nombre,
                apellido: apellido,
                curso: curso,
                serie: serie,
                estado: "Prestada",
                fecha: new Date().toLocaleDateString()
            };

            historial.push(nuevoPrestamo);
            localStorage.setItem("historialPrestamos", JSON.stringify(historial));

            alert("¡Préstamo guardado!\nSe prestó la compu con serie: " + serie);
            document.getElementById("formPrestamo").reset();
        });
    }

    const btnRegistrarProfe = document.getElementById("btnRegistrarProfe");
    if (btnRegistrarProfe) {
        btnRegistrarProfe.addEventListener("click", function () {
            const nombre = document.getElementById("profNombre").value.trim();
            const apellido = document.getElementById("profApellido").value.trim();
            const email = document.getElementById("profEmail").value.trim();
            const curso = document.getElementById("profCurso").value.trim();
            const materia = document.getElementById("profMateria").value.trim();

            if (nombre === "" || apellido === "" || email === "" || curso === "" || materia === "") {
                alert("Por favor, completá todos los campos.");
                return;
            }

            // gmail
            const validarEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!validarEmail.test(email)) {
                alert(" Correo no corresponde escribi bien , por ejemplo: nombre@gmail.com");
                document.getElementById("profEmail").focus();
                return; 
            }
            // antiduplicados 
            let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
            
           
            let existeEmail = profesores.find(p => p.email.toLowerCase() === email.toLowerCase());
            let existeNombre = profesores.find(p => p.nombre.toLowerCase() === nombre.toLowerCase() && p.apellido.toLowerCase() === apellido.toLowerCase());

            if (existeEmail || existeNombre) {
                let profeDuplicado = existeEmail || existeNombre;
                alert(" Este profesor ya está registrado.\n\nSu código es: " + profeDuplicado.codigo + "\n\nUsá ese código para cargar el préstamo.");
                return;
            }
        

            let codigoAleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
            let codigoProfe = "PROF-" + codigoAleatorio;


            profesores.push({ 
                codigo: codigoProfe, nombre: nombre, apellido: apellido, 
                email: email, curso: curso, materia: materia 
            });
            localStorage.setItem("baseProfesores", JSON.stringify(profesores));

            alert(" ¡Registro exitoso!\n\nProfesor: " + nombre + " " + apellido + "\nCódigo único: " + codigoProfe);
            
            document.getElementById("formProfe").reset();
            mostrarPrestamo();
        });
    }

    const tablaHistorial = document.getElementById("tablaHistorial");
    if (tablaHistorial) {
        const historial = JSON.parse(localStorage.getItem("historialPrestamos")) || [];
        
        historial.forEach(function (item, index) {
            const fila = document.createElement("tr");
            
            let botonAccion = "";
            if (item.estado === "Prestada") {
                botonAccion = `<button class="boton-tabla-cambiar" onclick="devolverPC(${index})" style="background-color: #28c00a; color: white; padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer;">Devolver</button>`;
            } else {
                botonAccion = `<span style="color: green; font-weight: bold;">✔ Devuelta</span>`;
            }

            let colorEstado = item.estado === "Prestada" ? "red" : "green";

            fila.innerHTML = `
                <td>${item.nombre} ${item.apellido}</td>
                <td>${item.curso}</td>
                <td>${item.serie}</td>
                <td style="color: ${colorEstado}; font-weight: bold;">${item.estado}</td>
                <td>${botonAccion}</td>
            `;
            tablaHistorial.appendChild(fila);
        });
    }

    window.devolverPC = function(index) {
        let historial = JSON.parse(localStorage.getItem("historialPrestamos")) || [];
        historial[index].estado = "Devuelta";
        localStorage.setItem("historialPrestamos", JSON.stringify(historial));
        alert("Netbook devuelta correctamente. El estado se actualizó.");
        location.reload(); 
    }


    const btnVerAdmin = document.getElementById("btnVerAdmin");
    const panelAdminDatos = document.getElementById("panelAdminDatos");
    
    if (btnVerAdmin) {
        btnVerAdmin.addEventListener("click", function () {
            if (panelAdminDatos.classList.contains("oculto")) {
                panelAdminDatos.classList.remove("oculto");
                
                let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
                let listaProfes = document.getElementById("listaProfesAdmin");
                listaProfes.innerHTML = profesores.map(p => `<li>${p.nombre} ${p.apellido} - ${p.codigo}</li>`).join("");
                
                let historial = JSON.parse(localStorage.getItem("historialPrestamos")) || [];
                let listaHist = document.getElementById("listaHistorialAdmin");
                listaHist.innerHTML = historial.map(h => `<li>PC: ${h.serie} | ${h.nombre} ${h.apellido} | ${h.estado}</li>`).join("");
            } else {
                panelAdminDatos.classList.add("oculto");
            }
        });
    }


    const btnBorrarTodo = document.getElementById("btnBorrarTodo");
    if (btnBorrarTodo) {
        btnBorrarTodo.addEventListener("click", function () {
            if (confirm("¿Seguro que querés borrar todo el historial?")) {
                localStorage.removeItem("historialPrestamos");
                location.reload();
            }
        });
    }


    const btnBorrarTodoAdmin = document.getElementById("btnBorrarTodoAdmin");
    if (btnBorrarTodoAdmin) {
        btnBorrarTodoAdmin.addEventListener("click", function () {
            if (confirm(" ¿Estás seguro de que querés borrar TODOS los datos?\n\nSe eliminarán los profesores y todo el historial.")) {
                localStorage.removeItem("baseProfesores");
                localStorage.removeItem("historialPrestamos");
                alert(" Todos los datos fueron eliminados. El sistema está como nuevo.");
                location.reload();
            }
        });
    }

});