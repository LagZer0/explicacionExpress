//*1 Una vez instalado Express, lo primero en hacerse es importarlo
const express = require('express');  //* <-- 1

//? 1 apunte de IA
/* `const express = require('express')` está importando el módulo Express al archivo JavaScript actual.
Esto permite que el código utilice las funcionalidades proporcionadas por Express para crear un
servidor web. */

const users = require('./users');


//*2 para levantar el server abrimos una nueva instancia de Express
//* normalmente se lo llama app o server, y se ejecuta express()

const server = express(); //* <-- 2

//? 2 Apunte de IA
/* `const server = express();` está creando una nueva instancia del servidor Express. Esta instancia se
usará para manejar las solicitudes HTTP entrantes y definir las rutas y el middleware para el
servidor. */


// Middlewares  //! siempre crearlos antes de Routes
// server.use()


function firstMiddleWare(req, res, next) {  //* <-- 5 el metodo next lo que hace es Avanzar
    console.log('firstMiddleWare')
    next()
}


//?9 Apunte de IA
/**
 * La función securityMiddleWare comprueba si la contraseña de un usuario es correcta en función de su
 * ID.
 */
const usersMap = new Map(users.map(user => [user.id, user.password]));

function segurityMiddleWare(req, res, next) {  //* <-- 9
    const id = req.params.id;
    const password = usersMap.get(Number(id));

    if (password === undefined) {
        return res.end("usuario no encontrado"); //* dato que aprendi, el servidor solo da una respuesta  
    }                    //* res.end , res.json, res.send solo se puede colocar 1 vez, si pasa por 2 res, explota el server

    if (password === req.params.password) {
        console.log('usuario autenticado');
        console.log('password correcta');
        next();
    } else {
        return res.end("password incorrecta");
    }
}





//? 5 Apunte de IA
/**
 * La función firstMiddleWare registra la cadena "firstMiddleWare" y luego llama a la
 * siguiente función de middleware.
 * @param next - El parámetro `next` es una función que se usa para pasar el control a la
 * siguiente función de middleware en la cadena. Por lo general, se llama al final de la función de
 * middleware actual para indicar que ha completado su procesamiento y se debe llamar a la siguiente
 * función de middleware.
 */



//? 8 Apunte de IA
/* `server.use(express.json())` es una función de middleware que analiza las solicitudes entrantes con
cargas JSON. Permite que el servidor maneje los datos JSON enviados en el cuerpo de la solicitud.
Este middleware agrega una propiedad `body` al objeto `req`, que contiene los datos JSON analizados.
Se usa comúnmente para manejar solicitudes POST y PUT donde los datos se envían en el cuerpo de la
solicitud. */

server.use(express.json()); // * <-- 8 Body post put no lo entendi del todo bien, perdon


//? 10 Apunte de IA
/* El código `const urlencoded = express.urlencoded({ extended: false });` está creando una función de
middleware llamada `urlencoded` que se utiliza para analizar los datos codificados en URL de los
envíos de formularios. */
const urlencoded = express.urlencoded({ extended: false }); //* <-- 10 sirve para formularios

server.post("/form", urlencoded, (req, res) => {   //los middlewares mas importantes son unlencoded y json
    res.status(200).end("Formulario enviado");
})



server.use("/users", firstMiddleWare) //* <-- 7 envez de colocarlos en el medio en los server. 
                                    //* se utiliza el server.use y hace que todos los /users ejecuten el middleware
//? 7 Apunte de IA
/* El código `server.use("/users", firstMiddleWare)` está registrando una función de middleware
`firstMiddleWare` que se ejecutará para cualquier solicitud que comience con la ruta "/users". Esto
significa que cada vez que se realiza una solicitud a una ruta que comienza con "/users", se llamará
a la función `firstMiddleWare` antes que cualquier otro middleware o controlador de ruta para esa
solicitud específica. */

server.use("/users/:id/:password", segurityMiddleWare)




// Routes
//*4 server.get se inicializa SIEMPRE con el primer y ultimo parametro, entre medio puede tener mas
//        1°URL  el ultimo que es la function
server.get("/", (req, res) => {  //* <-- 4 incluye referencia de imagen !4!
    res.status(200).json({ message: "Bienvenidos a Express" });//* <-- 4 como buena practica, se coloca un mensaje inicial
    /*
    end <-- headers mas complejos
    send <-- headers mas simples
    json
    */
})

server.get("/users", (req , /*firstMiddleWare ,*/ res) => {  //* <-- 6 los middlewares se ejecutan antes de las rutas,                                
    res.status(200).json(users);                     //* y se colocan siempre en el medio para ejecutarlos
})


server.get("/users/:id", (req, res) => {
    console.log("--->",req) //* por si queremos observar que contiene req
    const { id } = req.params;  // el ID llega como string, no como number
    const resultado = users.find(user => user.id == Number(id));
    if(resultado) res.json(resultado)
    else res.status(404).json({ message: "User not found" })
})

server.get("/users/:id/:password",/*segurityMiddleWare*/ (req, res) => {
    console.log("--->",req) 
    const { id } = req.params;
    const resultado = users.find(user => user.id == Number(id));
    if(resultado) res.json(resultado)
    else res.status(404).json({ message: "User not found" })
})

/* //* req es un objeto que contiene muchisima data {
    lo mas importante y que mas vamos a usar es 
    body {}
    query {}
    params {
        id: undefined 
    }
}
}

*/


// Listen

//*3 se levanta el servidor en un puerto

const PORT = 5040 //* <-- 3

server.listen(PORT, () => 
console.log(`Servidor Express escuchando en http://localhost:${PORT}`)) //* <-- 3

//? 3 Apunte de IA
/* Este código está configurando el servidor para escuchar en el puerto 5040. La línea `const PORT =
5040` declara una variable constante `PORT` y le asigna el valor 5040. Luego, `server.listen(PORT,
() => console La línea .log(`Servidor Express escuchando en http://localhost:`))` inicia el
servidor y escucha las solicitudes entrantes en el puerto especificado. Cuando el servidor se inicia
correctamente, registra un mensaje en la consola que indica que el servidor está escuchando en el
puerto especificado. */