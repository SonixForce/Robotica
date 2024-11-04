// Obtenemos los datos que se obtienen a través del formulario por parte del usuario, cada vez que produce el evento "submit"
// al presionar el botón
document.getElementById("robot_form").addEventListener("submit",function(event) {
    // Esto previene que la página recargue al recibir los datos
    event.preventDefault();
    
    // Establecemos las constantes para la operación pues las medidas de los eslabones y la distancia de las
    // bridas no cambiará
    const eslabon = 20;
    const distanciaBrida = 5;

    // Obtenemos los datos del usuario de cada ángulo que deseará calcular, los transformamos a radianes y los almacenamos
    // en sus propias variables respectivamente
    let theta1 = parseFloat(document.getElementById("theta1").value) * Math.PI / 180;
    let theta2 = parseFloat(document.getElementById("theta2").value) * Math.PI / 180;

    // Realizamos el cálculo para Xd y Yd conforme a la fórmula vista en clase, y las almacenamos en
    // sus propias variables respectivamente
    let xd = (eslabon * Math.cos(theta1)) + ((eslabon + distanciaBrida) * Math.cos(theta1 + theta2));
    let yd = (eslabon * Math.sin(theta1)) + ((eslabon + distanciaBrida) * Math.sin(theta1 + theta2));

    // Enviamos los resultados obtenidos a su respectivo campo dentro de la página
    document.getElementById("xd").value = xd.toFixed(2);
    document.getElementById("yd").value = yd.toFixed(2);
});