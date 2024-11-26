document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("camionForm");
    const camionDataDiv = document.getElementById("camionData");
    const numCamionesInput = document.getElementById("numCamiones");
    const resultadosDiv = document.getElementById("resultados");

    // Agregar campos de camión
    function agregarCamposCamion(numCamiones) {
        camionDataDiv.innerHTML = "";
        for (let i = 1; i <= numCamiones; i++) {
            const camionDiv = document.createElement("div");
            camionDiv.innerHTML = `
                <h3>Camión ${i}</h3>
                <label for="pesoVacio${i}">Peso vacío (kg):</label>
                <input type="number" id="pesoVacio${i}" name="pesoVacio${i}" min="1" required><br>
                <label for="pesoTotal${i}">Peso total (kg):</label>
                <input type="number" id="pesoTotal${i}" name="pesoTotal${i}" min="1" required><br>
            `;
            camionDataDiv.appendChild(camionDiv);
        }
    }

    // Manejar cambio de número de camiones
    numCamionesInput.addEventListener("input", () => {
        const numCamiones = parseInt(numCamionesInput.value);
        if (numCamiones > 0) agregarCamposCamion(numCamiones);
    });

    // Procesar formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const numCamiones = parseInt(numCamionesInput.value);
        const camiones = [];
        for (let i = 1; i <= numCamiones; i++) {
            const pesoVacio = parseFloat(document.getElementById(`pesoVacio${i}`).value);
            const pesoTotal = parseFloat(document.getElementById(`pesoTotal${i}`).value);
            camiones.push({ pesoVacio, pesoTotal });
        }

        try {
            const response = await fetch("https://7d715c73-f834-46fd-8092-22d249170b68-00-3s3dtkw1n9z3m.spock.replit.dev/api/procesar-camiones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ camiones }),
            });

            if (!response.ok) throw new Error("Error al procesar los datos: " + response.statusText);

            const data = await response.json();
            mostrarResultados(data);
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
        }
    });

    // Mostrar resultados
    function mostrarResultados(data) {
        const { detalleCamiones, totalSacosEspeciales, totalSacosDefectuosos, totalContenedores } = data;

        let resultadosHTML = `
            <h2>Resultados Generales</h2>
            <p><strong>Total Sacos Especiales:</strong> ${totalSacosEspeciales}</p>
            <p><strong>Total Sacos Defectuosos:</strong> ${totalSacosDefectuosos}</p>
            <p><strong>Total Contenedores Utilizados:</strong> ${totalContenedores}</p>
        `;

        detalleCamiones.forEach((camion) => {
            resultadosHTML += `
                <h3>Camión ${camion.camionId}</h3>
                <p><strong>Peso Carga:</strong> ${camion.pesoCarga} kg</p>
                <p><strong>Sacos Especiales:</strong> ${camion.sacosEspeciales}</p>
                <p><strong>Sacos Defectuosos:</strong> ${camion.sacosDefectuosos}</p>
                <p><strong>Capacidad Restante Contenedor Especial:</strong> ${camion.capacidadRestanteEspeciales}</p>
                <p><strong>Capacidad Restante Contenedor Defectuoso:</strong> ${camion.capacidadRestanteDefectuosos}</p>
            `;
        });

        resultadosDiv.innerHTML = resultadosHTML;
    }
});
