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

  
window.autocompletarProfe = function() {
    const codigoProfe = document.getElementById("codigoProfe").value.trim().toUpperCase();
    let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
    let profeValido = profesores.find(p => p.codigo === codigoProfe);

    if (profeValido) {
        
        document.getElementById("nombre").value = profeValido.nombre;
        document.getElementById("apellido").value = profeValido.apellido;
        document.getElementById("curso").value = profeValido.curso;
    } else {
     
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("curso").value = "";
    }
}


const btnGuardar = document.getElementById("btnGuardar");
if (btnGuardar) {
    btnGuardar.addEventListener("click", function () {
        const codigoProfe = document.getElementById("codigoProfe").value.trim().toUpperCase();
        const serie = document.getElementById("selectPC").value;

        if (codigoProfe === "" || serie === "") {
            alert("Por favor, ingresá el código del profesor y seleccioná una computadora.");
            return;
        }

        let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
        let profeValido = profesores.find(p => p.codigo === codigoProfe);

        if (!profeValido) {
            alert(" El código de profesor no es válido. Pedile al profe que se registre primero.");
            return;
        }

        const nuevoPrestamo = {
            codigoProfe: codigoProfe,
            nombre: profeValido.nombre,      
            apellido: profeValido.apellido,
            curso: profeValido.curso,        
            serie: serie,
            estado: "Prestada",
            fecha: new Date().toLocaleDateString()
        };

        let historial = JSON.parse(localStorage.getItem("historialPrestamos")) || [];
        historial.push(nuevoPrestamo);
        localStorage.setItem("historialPrestamos", JSON.stringify(historial));

        alert(" ¡Préstamo guardado a nombre de " + profeValido.nombre + " " + profeValido.apellido + "!");
        document.getElementById("formPrestamo").reset();
    });
}//llllllllllllllllllllllllllllllllll

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

            let codigoAleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
            let codigoProfe = "PROF-" + codigoAleatorio;

            let profesores = JSON.parse(localStorage.getItem("baseProfesores")) || [];
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

 S 
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
});