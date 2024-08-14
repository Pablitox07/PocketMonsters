document.addEventListener('DOMContentLoaded', ()=> {
    const button = document.getElementById('recuperar');
    button.addEventListener('click', () => {
        let email = document.getElementById('email').value;
        const emailTesteado = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (emailTesteado){
            document.getElementById('failDiv').innerHTML = "";
            console.log(`${email}`);
            fetch(`http://localhost:3000/cambiodecontra?email=${email}`,{ method: 'POST'})
            .then(resultado => resultado.json())
            .then(resultado =>{
                document.getElementById('divprincipal').innerHTML = `<div style="text-align: center;"><div><h1>${resultado['mensaje']}</h1><img src="../pikaFeliz.png" alt="pikaFeliz" style="width: 200px; height: auto;"></div></div>`;
                    
            })
        }
        else {
            document.getElementById('failDiv').style = "height: 25px";
            document.getElementById('failDiv').innerHTML = `<span style="color: red;">Tu email no tiene un formato correcto</span><img src="./pika.png" alt="pikachu triste" style="height: 80%; width: auto;">`;
        }

    });


});