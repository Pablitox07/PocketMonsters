const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

const url = 'mongodb://localhost:27017';
const dbName = 'pocketmonters';

app.get('/duelo', async (req, res) => {
    const numeroDuelo = req.query.id;

    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection('duelos');

        const resultado = await collection.findOne({ "duelo": numeroDuelo });
        await client.close();

        res.render('duelo', {resultado : resultado});
    } catch (err) {
        console.error(err);
    }
});

// anadir post para sumar turno en duelo
app.post('/duelo/calculosduelo', async (req, res) => {
    const client = new MongoClient(url);
    const numeroDuelo = req.query.id;
    let turno;
    let jugador1 = req.query.jugador1;
    let jugador2 = req.query.jugador2;
    let jugadorataque1;
    let jugadorataque2;
    let checkPokemonsHp = 0;


    // ------------------------------------------ tomar numero de turno ----------------------------------

    try {
        await client.connect();
    
        const db = client.db(dbName);
        const collection = db.collection('duelos');
    
        const resultado = await collection.findOne({ "duelo": numeroDuelo });
        const turno = resultado.infoduelo.turnos;
        jugadorataque1 = resultado['infoduelo']['jugador1']['equipo'][jugador1.toString()]['ataque'];
        jugadorataque2 = resultado['infoduelo']['jugador2']['equipo'][jugador2.toString()]['ataque'];
    
        if (turno % 2 === 0) {
            const pokemonPath = `infoduelo.jugador2.equipo.${jugador2}.HP`;
    
            const currentHP = resultado['infoduelo']['jugador2']['equipo'][jugador2.toString()]['HP'];
            const nuevoHP = Math.max(0, currentHP - jugadorataque1);
    
            const updateResult = await collection.findOneAndUpdate(
                { "duelo": numeroDuelo },
                { $set: { [pokemonPath]: nuevoHP } },
                { returnDocument: 'after' }
            );
            
            // for para revisar si todos los pokemons del jugador 2 estan en 0
            for (let i = 0; i < 6; i++){
                if (updateResult['infoduelo']['jugador2']['equipo'][i.toString()]['HP'] <= 0){
                    checkPokemonsHp += 1; 
                }
            }
            // verificar si checkPokemonsHp is igual a 6 
            if (checkPokemonsHp == 6){
                // actualiza la base de datos para saber que ya hay un ganador
                const filtro = { "duelo": numeroDuelo.toString() };
                const actulizacion = { $set: { "infoduelo.resultados.estaterminado": true } };
                const resultadoActualizado = await collection.updateOne(filtro, actulizacion);
                // actualiza la base de datos para saber quien fue el ganador
                const actulizacionGanador = { $set: { "infoduelo.resultados.ganador": resultado['infoduelo']['jugador1']['nombreUsuario']} };
                const resultadoActualizadoGanador = await collection.updateOne(filtro, actulizacionGanador);
                // actualiza la base de datos para saber quien fue el perdedor
                const actulizacionPerdedor = { $set: { "infoduelo.resultados.perdedor": resultado['infoduelo']['jugador2']['nombreUsuario']} };
                const resultadoActualizadoPerdedor = await collection.updateOne(filtro, actulizacionPerdedor);
                //Modificar la base de datos para sumarle la victoria al jugador1 y agregar una derrota al jugador2
            }
    
        } else {
            const pokemonPath = `infoduelo.jugador1.equipo.${jugador1}.HP`;
    
            const currentHP = resultado['infoduelo']['jugador1']['equipo'][jugador1.toString()]['HP'];
            const nuevoHP = Math.max(0, currentHP - jugadorataque2);
    
            const updateResult = await collection.findOneAndUpdate(
                { "duelo": numeroDuelo },
                { $set: { [pokemonPath]: nuevoHP } },
                { returnDocument: 'after' }
            );
            // for para revisar si todos los pokemons del jugador 1 estan en 0
            for (let i = 0; i < 6; i++){
                if (updateResult['infoduelo']['jugador1']['equipo'][i.toString()]['HP'] <= 0){
                    checkPokemonsHp += 1; 
                }
            }
            // verificar si checkPokemonsHp is igual a 6 
            if (checkPokemonsHp == 6){
                // actualiza la base de datos para saber que ya hay un ganador
                const filtro = { "duelo": numeroDuelo.toString() };
                const actulizacion = { $set: { "infoduelo.resultados.estaterminado": true } };
                const resultadoActualizado = await collection.updateOne(filtro, actulizacion);
                // actualiza la base de datos para saber quien fue el ganador
                const actulizacionGanador = { $set: { "infoduelo.resultados.ganador": resultado['infoduelo']['jugador2']['nombreUsuario']} };
                const resultadoActualizadoGanador = await collection.updateOne(filtro, actulizacionGanador);
                // actualiza la base de datos para saber quien fue el perdedor
                const actulizacionPerdedor = { $set: { "infoduelo.resultados.perdedor": resultado['infoduelo']['jugador1']['nombreUsuario']} };
                const resultadoActualizadoPerdedor = await collection.updateOne(filtro, actulizacionPerdedor);
                //Modificar la base de datos para sumarle la victoria al jugador2 y agregar una derrota al jugador1

            }
        }
        await client.close();
    } catch (err) {
        console.error(err);
    }
    
    

    

    try {
        // Initialize the MongoDB client without deprecated options
        await client.connect();
        
        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection('duelos');
        
    
        // Perform the findOneAndUpdate operation
        const result = await collection.findOneAndUpdate(
            { "duelo": numeroDuelo },
            { $inc: { 'infoduelo.turnos': 1 } }, 
            { returnDocument: 'after' }
        );

        
    
        if (result) {
            res.status(200).json(result['infoduelo']);
        } 
        
        else {
            res.status(404);
        }

        // Close the MongoDB client connection
        await client.close();
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
});

app.get('/actualizardatos/duelo', async (req, res) => {
    let numeroDuelo = req.query.numeroDuelo;
    try{
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('duelos');
        const resultado = await collection.findOne({ "duelo": numeroDuelo });
        res.status(200).json(resultado['infoduelo']);
    }
    catch (error) {
        console.log(error);
    }
});


app.get('/denegarduelo', (req, res) => {
    res.render('denegarduelo');
});

app.get('/ingresar', (req, res) => {
    res.render('ingresar');
});

app.get('/registrar', (req, res) => {
    res.render('registrar');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
