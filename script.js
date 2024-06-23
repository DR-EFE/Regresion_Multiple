function addRow() {
    const table = document.getElementById('inputTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="number" name="x1"></td>
        <td><input type="number" name="x2"></td>
        <td><input type="number" name="y"></td>
        <td><button onclick="removeRow(this)">Eliminar</button></td>
    `;
}

function removeRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function calculate() {
    const rows = document.querySelectorAll('#inputTable tbody tr');
    let data = [];
    rows.forEach(row => {
        const x1 = parseFloat(row.querySelector('input[name="x1"]').value);
        const x2 = parseFloat(row.querySelector('input[name="x2"]').value);
        const y = parseFloat(row.querySelector('input[name="y"]').value);
        if (!isNaN(x1) && !isNaN(x2) && !isNaN(y)) {
            data.push({ x1, x2, y });
        }
    });

    // Cálculos de regresión múltiple
    const n = data.length;
    let sumX1 = 0, sumX2 = 0, sumY = 0;
    let sumX1X2 = 0, sumX1Sqr = 0, sumX2Sqr = 0, sumYX1 = 0, sumYX2 = 0;
    data.forEach(d => {
        sumX1 += d.x1;
        sumX2 += d.x2;
        sumY += d.y;
        sumX1X2 += d.x1 * d.x2;
        sumX1Sqr += d.x1 * d.x1;
        sumX2Sqr += d.x2 * d.x2;
        sumYX1 += d.y * d.x1;
        sumYX2 += d.y * d.x2;
    });

    const denominator = (n * sumX1Sqr - sumX1 * sumX1) * (n * sumX2Sqr - sumX2 * sumX2) - (n * sumX1X2 - sumX1 * sumX2) * (n * sumX1X2 - sumX1 * sumX2);
    const b1 = ((n * sumYX1 - sumY * sumX1) * (n * sumX2Sqr - sumX2 * sumX2) - (n * sumYX2 - sumY * sumX2) * (n * sumX1X2 - sumX1 * sumX2)) / denominator;
    const b2 = ((n * sumYX2 - sumY * sumX2) * (n * sumX1Sqr - sumX1 * sumX1) - (n * sumYX1 - sumY * sumX1) * (n * sumX1X2 - sumX1 * sumX2)) / denominator;
    const a = (sumY - b1 * sumX1 - b2 * sumX2) / n;

    // Crear la tabla de resultados
    const resultTableBody = document.querySelector('#resultTable tbody');
    resultTableBody.innerHTML = '';
    let totalYx1 = 0, totalYx2 = 0, totalX1X2 = 0, totalX1Sqr = 0, totalX2Sqr = 0, totalYStar = 0, totalE = 0, totalESqr = 0, totalYSqr = 0;
    data.forEach(d => {
        const yStar = a + b1 * d.x1 + b2 * d.x2;
        const e = d.y - yStar;
        const eSqr = e * e;
        const ySqr = d.y * d.y;
        const yx1 = d.y * d.x1;
        const yx2 = d.y * d.x2;
        const x1x2 = d.x1 * d.x2;
        const x1Sqr = d.x1 * d.x1;
        const x2Sqr = d.x2 * d.x2;

        totalYx1 += yx1;
        totalYx2 += yx2;
        totalX1X2 += x1x2;
        totalX1Sqr += x1Sqr;
        totalX2Sqr += x2Sqr;
        totalYStar += yStar;
        totalE += e;
        totalESqr += eSqr;
        totalYSqr += ySqr;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${yx1.toFixed(3)}</td>
            <td>${yx2.toFixed(3)}</td>
            <td>${x1x2.toFixed(3)}</td>
            <td>${x1Sqr.toFixed(3)}</td>
            <td>${x2Sqr.toFixed(3)}</td>
            <td>${yStar.toFixed(3)}</td>
            <td>${e.toFixed(3)}</td>
            <td>${eSqr.toFixed(3)}</td>
            <td>${ySqr.toFixed(3)}</td>
        `;
        resultTableBody.appendChild(row);
    });

    document.getElementById('totalYx1').textContent = totalYx1.toFixed(3);
    document.getElementById('totalYx2').textContent = totalYx2.toFixed(3);
    document.getElementById('totalX1X2').textContent = totalX1X2.toFixed(3);
    document.getElementById('totalX1Sqr').textContent = totalX1Sqr.toFixed(3);
    document.getElementById('totalX2Sqr').textContent = totalX2Sqr.toFixed(3);
    document.getElementById('totalYStar').textContent = totalYStar.toFixed(3);
    document.getElementById('totalE').textContent = totalE.toFixed(3);
    document.getElementById('totalESqr').textContent = totalESqr.toFixed(3);
    document.getElementById('totalYSqr').textContent = totalYSqr.toFixed(3);

    // Calcular las matrices y sus determinantes
    const D0 = [
        [sumY, sumX1, sumX2],
        [sumYX1, sumX1Sqr, sumX1X2],
        [sumYX2, sumX1X2, sumX2Sqr]
    ];
    const D1 = [
        [n, sumY, sumX2],
        [sumX1, sumYX1, sumX1X2],
        [sumX2, sumYX2, sumX2Sqr]
    ];
    const D2 = [
        [n, sumX1, sumY],
        [sumX1, sumX1Sqr, sumYX1],
        [sumX2, sumX1X2, sumYX2]
     
    ];
    const D3 = [
        [n, sumX1, sumX2],
        [sumX1, sumX1Sqr, sumX1X2],
        [sumX2, sumX1X2, sumX2Sqr]
       
    ];

    const detD0 = math.det(D0);
    const detD1 = math.det(D1);
    const detD2 = math.det(D2);
    const detD3 = math.det(D3);

    document.getElementById('matrixD0Content').textContent = JSON.stringify(D0, null, 2);
    document.getElementById('matrixD1Content').textContent = JSON.stringify(D1, null, 2);
    document.getElementById('matrixD2Content').textContent = JSON.stringify(D2, null, 2);
    document.getElementById('matrixD3Content').textContent = JSON.stringify(D3, null, 2);

    document.getElementById('determinantD0').textContent = detD0.toFixed(3);
    document.getElementById('determinantD1').textContent = detD1.toFixed(3);
    document.getElementById('determinantD2').textContent = detD2.toFixed(3);
    document.getElementById('determinantD3').textContent = detD3.toFixed(3);


    // Calcular los coeficientes de regresión
    const CoeficienteB0 = a;
    const CoeficienteB1 = b1;
    const CoeficienteB2 = b2;

    document.getElementById('CoeficienteB0').textContent = CoeficienteB0.toFixed(3);
document.getElementById('CoeficienteB1').textContent = CoeficienteB1.toFixed(3);
document.getElementById('CoeficienteB2').textContent = CoeficienteB2.toFixed(3);


    // Calcular el error estándar
    const Se = Math.sqrt(totalESqr / (n - 3));
    document.getElementById('valorSe').textContent = Se.toFixed(3);

    // Calcular Syy
    const Syy = totalESqr / (n - 3);
    document.getElementById('valorSyy').textContent = Syy.toFixed(3);
    
    //Calcular ecuacion de la regresion
    const ecuacion = `y = ${a.toFixed(3)} + ${b1.toFixed(3)} * x1 + ${b2.toFixed(3)} * x2`;
    document.getElementById('ecuacion').textContent = ecuacion;

    
    calculateSyy();
}


function calculateSyy() {
    const rows = document.querySelectorAll('#inputTable tbody tr');
    let yValues = [];
    
    // Recoger los valores de 'y' desde la tabla de entrada
    rows.forEach(row => {
        const y = parseFloat(row.querySelector('input[name="y"]').value);
        if (!isNaN(y)) {
            yValues.push(y);
        }
    });

    if (yValues.length === 0) {
        alert('Por favor, ingrese valores para Y.');
        return;
    }

    // Calcular la media de Y
    const yMean = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;

    // Calcular Syy
    const syy = yValues.reduce((sum, value) => sum + Math.pow(value - yMean, 2), 0);

    // Actualizar el elemento en la página con el valor de Syy
    document.getElementById('valorSyy').textContent = syy.toFixed(3);
}







function formatMatrix(matrix) {
    return matrix.map(row => row.join('\t')).join('\n');
}


