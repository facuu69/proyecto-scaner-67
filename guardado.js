
document.addEventListener("DOMContentLoaded", function () {


    const btnGuardar = document.getElementById("btnGuardar");

    if (btnGuardar) {

        btnGuardar.addEventListener("click", function () {

            const nombre = document.getElementById("nombre").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            const curso = document.getElementById("curso").value.trim();
            const serie = document.getElementById("serie").value.trim();

            
            if (nombre === "" || apellido === "" || curso === "" || serie === "") {
                alert("Por favor, completá todos los campos.");
                return;
            }

            const nuevoPrestamo = {
                nombre: nombre,
                apellido: apellido,
                curso: curso,
                serie: serie,
                estado: "Prestada",
                fecha: new Date().toLocaleDateString()
            }
            let historial = JSON.parse(
                localStorage.getItem("historialPrestamos")
            ) || [];

            // Agregar el nuevo préstamo
            historial.push(nuevoPrestamo);

            // Guardar nuevamente en localStorage
            localStorage.setItem(
                "historialPrestamos",
                JSON.stringify(historial)
            );

            alert("¡Préstamo guardado correctamente!");

            // Limpiar formulario
            document.getElementById("formPrestamo").reset();
        });
    }


    const tablaHistorial = document.getElementById("tablaHistorial");

    if (tablaHistorial) {

        const historial = JSON.parse(
            localStorage.getItem("historialPrestamos")
        ) || [];

        historial.forEach(function (item, index) {

            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${item.nombre} ${item.apellido}</td>
                <td>${item.curso}</td>
                <td>${item.serie}</td>
                <td>${item.estado}</td>
            `;

            tablaHistorial.appendChild(fila);
        });
    }


    const btnBorrarTodo = document.getElementById("btnBorrarTodo");

    if (btnBorrarTodo) {

        btnBorrarTodo.addEventListener("click", function () {

            const confirmar = confirm(
                "¿Estás seguro de que querés borrar todo el historial?"
            );

            if (confirmar) {

                localStorage.removeItem("historialPrestamos");

                alert("Historial borrado correctamente.");

                location.reload();
            }
        });
    }

});
