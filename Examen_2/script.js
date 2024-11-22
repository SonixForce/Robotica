// Variables globales para almacenar la posición actual del robot
let currentX = 15; // Posición inicial X
let currentY = 15; // Posición inicial Y

// Referencias globales para los gráficos
let xChart = null;
let yChart = null;

document.getElementById("generate").addEventListener("click", () => {
  const xf = parseFloat(document.getElementById("xf").value); // Nueva posición final X
  const yf = parseFloat(document.getElementById("yf").value); // Nueva posición final Y

  // Parámetros fijos
  const ti = 0; // Tiempo inicial
  const tf = 15; // Tiempo final
  const T = 0.01; // Periodo de muestreo
  const l1 = 15; // Longitud del eslabón 1
  const l2 = 15; // Longitud del eslabón 2

  // Verificar límites del espacio de trabajo
  const maxReach = l1 + l2;
  const distance = Math.sqrt(xf ** 2 + yf ** 2);
  if (distance > maxReach) {
    alert("La posición final está fuera del espacio de trabajo del robot.");
    return;
  }

  // Calcular coeficientes para trayectorias suaves desde la posición actual
  const ax = calculateCoefficientsSmooth(ti, tf, currentX, xf);
  const ay = calculateCoefficientsSmooth(ti, tf, currentY, yf);

  // Generar trayectoria
  const time = [];
  const xd = [];
  const yd = [];
  for (let t = ti; t <= tf; t += T) {
    time.push(t);
    xd.push(evaluatePolynomial(ax, t));
    yd.push(evaluatePolynomial(ay, t));
  }

  // Graficar trayectorias
  plotChart("x-chart", time, xd, "Posición en X", "x");
  plotChart("y-chart", time, yd, "Posición en Y", "y");

  // Actualizar la posición inicial para la siguiente iteración
  currentX = xf;
  currentY = yf;

  // Limpiar los campos de entrada
  document.getElementById("xf").value = "";
  document.getElementById("yf").value = "";
});

// Calcular coeficientes con perfil suave
function calculateCoefficientsSmooth(ti, tf, pi, pf) {
  const T = tf - ti;
  const delta = pf - pi;

  // Coeficientes para un polinomio cúbico con suavidad (S-Curve)
  return [
    pi, // a0
    0, // a1 (velocidad inicial)
    0, // a2 (aceleración inicial)
    (10 * delta) / Math.pow(T, 3), // a3
    (-15 * delta) / Math.pow(T, 4), // a4
    (6 * delta) / Math.pow(T, 5), // a5
  ];
}

// Evaluar polinomio
function evaluatePolynomial(coefficients, t) {
  return coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(t, i), 0);
}

// Graficar con Chart.js
function plotChart(chartId, labels, data, label, type) {
  // Destruir gráfico previo si existe
  if (type === "x" && xChart) {
    xChart.destroy();
  } else if (type === "y" && yChart) {
    yChart.destroy();
  }

  labels = labels.map((t) => t.toFixed(2)); // Limitar decimales en el eje X
  data = data.map((v) => parseFloat(v.toFixed(2))); // Limitar decimales en el eje Y

  // Crear nuevo gráfico
  const ctx = document.getElementById(chartId).getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // Eje X: tiempo
      datasets: [
        {
          label: label,
          data: data, // Eje Y: posición
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Tiempo (s)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Posición (cm)",
          },
        },
      },
    },
  });

  // Guardar referencia al gráfico
  if (type === "x") {
    xChart = chart;
  } else if (type === "y") {
    yChart = chart;
  }
}
