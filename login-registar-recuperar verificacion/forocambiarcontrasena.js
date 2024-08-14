document.addEventListener('DOMContentLoaded', () => {
    // ingresar boton event listener. 
    const button = document.getElementById('registar');
    button.addEventListener('click', () => {
        const contra1 = document.getElementById('contra1').value;
        const contra2 = document.getElementById('contra2').value;

        // ------------- Check por espacios en blanco -------------------------------------------------------
        if ( contra1 === "" || contra2 === "" ) {
            if (contra1 === "") {
                document.getElementById('contra1').style.border = "red 1px solid";
            } else {
                document.getElementById('contra1').style.border = "";
            }
            if (contra2 === "") {
                document.getElementById('contra2').style.border = "red 1px solid";
            } else {
                document.getElementById('contra2').style.border = "";
            }
            document.getElementById('failDiv').style = "height: 25px";
            document.getElementById('failDiv').innerHTML = `<span style="color: red;">Debes llenar los espacios en rojo</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
        } 
        else {
            document.getElementById('contra1').style.border = "";
            document.getElementById('contra2').style.border = "";
            document.getElementById('failDiv').style = "height: 0px";
            document.getElementById('failDiv').innerHTML = "";
            // -----------check contrasena iguales 

            if (contra1 !== contra2){
                document.getElementById('failDiv').style = "height: 25px";
                document.getElementById('failDiv').innerHTML = `<span style="color: red;">Las contraseñas deben ser iguales</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
            }
            // ------------- check cantidad de caracteres y numeros --------------------------------------------------

            else if (contra1.length < 8){
                document.getElementById('failDiv').style = "height: 25px";
                document.getElementById('failDiv').innerHTML = `<span style="color: red;">La contraseña debe tener por lo menos 8 caracteres</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
            }

            // ----------- Check para el formato del email -------------------------------------------------------

            else {
                document.getElementById('failDiv').style = "height: 0px";
                document.getElementById('failDiv').innerHTML = "";
                fetch(`http://localhost:3000/cambiarcontrasenabasededatos?email=${resultado['email']}&contra=${contra1}`,{ method: 'POST' })
                .then(resultado => resultado.json())
                .then(resultado =>{
                    if (resultado['registrado']){
                        document.getElementById('mainIngresar').innerHTML = `<div style="text-align: center;"><div><h1>${resultado['mensaje']}</h1><img src="../pikaFeliz.png" alt="pikaFeliz" style="width: 200px; height: auto;"></div></div>`;
                    }
                    else {
                        document.getElementById('failDiv').style = "height: 25px";
                        document.getElementById('failDiv').innerHTML = `<span style="color: red;">${resultado['mensaje']}</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
                    }
                })

            }

        }
    });
});
