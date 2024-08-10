document.addEventListener('DOMContentLoaded', ()=> {
    // ingresar boton event listener. 
    const button = document.getElementById('ingresar');
    button.addEventListener('click', function() {
        const email = document.getElementById('Email').value; 
        const contra = document.getElementById('contra').value;

        // ------------- Check por espacios en blanco -------------------------------------------------------
        if (email == "" || contra == "") {
            if (email == "") {
                document.getElementById('Email').style.border = "red 1px solid";
            } 
            else {
                document.getElementById('Email').style.border = "";
            }
            if (contra == "") {
                document.getElementById('contra').style.border = "red 1px solid";
            } 
            else {
                document.getElementById('contra').style.border = "";
            }
            document.getElementById('failDiv').style = "height: 25px";
            document.getElementById('failDiv').innerHTML = `<span style="color: red;">Llena todos espacios</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
        } else {
            document.getElementById('Email').style.border = "";
            document.getElementById('contra').style.border = "";

            // ----------- Check para el formato del email -------------------------------------------------------
            const emailTesteado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (emailTesteado){
                document.getElementById('failDiv').innerHTML = "";
                fetch(`http://localhost:3000/validaringreso?email=${email}&contra=${contra}`)
                .then(resultado => resultado.json())
                .then(resultado =>{
                    if (resultado['existe']){
                        localStorage.setItem('pocketMonstersUsuario', resultado['usuario']);
                    }
                    else {
                        document.getElementById('failDiv').style = "height: 25px";
                        document.getElementById('failDiv').innerHTML = `<span style="color: red;">Email o contraseña no son correctos</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
                    }
                })
                .catch(err => {
                    alert("Error conectando con el servicdor");                
                });
            }
            else {
                document.getElementById('failDiv').style = "height: 25px";
                document.getElementById('failDiv').innerHTML = `<span style="color: red;">Formato del email es incorrecto</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
            }
        }
    });
});