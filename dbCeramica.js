const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

function porNombre(nombreProd, cbErr, cbProducto) {
  mongoClient.connect(url, function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar al server", err);

      cbErr(err);
      return;
    }
    //console.log(cliente);

    const dbCeramica = cliente.db("CeramicaTrivento");

    const collProductos = dbCeramica.collection("productos");
    //console.log(collProductos);

    collProductos.find({ producto: RegExp(nombreProd) }).toArray(function (err, datos) {
        cliente.close();
        if (err) {
          console.log("hubo un error al convertir el cursor a aray", err);
          cbErr(err);
          return;
        }
        cbProducto(datos);
      });
  });
}

function porId(id, cbErr, cbProducto) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, function (err, client) {
    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbErr(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("CeramicaTrivento");
    const colProductos = dbEjemploProds.collection("productos");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colProductos.findOne({ id : id }, function (err, datos) {
      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al consultar:", err);
        cbErr(err);
        return;
      }

      console.log(datos);

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbProducto(datos);
    });
  });
}

function porLocalidad(nombreLoc, cbErr, cbLocalidad) {
  mongoClient.connect(url, function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar al server", err);

      cbErr(err);
      return;
    }

    const dbCeramica = cliente.db("CeramicaTrivento");

    const collLocalidad = dbCeramica.collection("localidades", "productos");

    collLocalidad.find({ localidad: RegExp(nombreLoc) }).toArray(function (err, datos) {
        cliente.close();
        if (err) {
          console.log("hubo un error al convertir el cursor a aray", err);
          cbErr(err);
          return;
        }
        cbLocalidad(datos);
      });
  });
}

function porUsuario(nombreUser, cbErr, cbUsuario) {
  mongoClient.connect(url, function (err, cliente) {
    if (err) {
      console.log("hubo un error al conectar al server", err);

      cbErr(err);
      return;
    }

    const dbCeramica = cliente.db("CeramicaTrivento");

    const collUsuarios = dbCeramica.collection("usuarios");

    collUsuarios.find({ username: RegExp(nombreUser) }).toArray(function (err, datos) {
        cliente.close();
        if (err) {
          console.log("hubo un error al convertir el cursor a aray", err);
          cbErr(err);
          return;
        }
        cbUsuario(datos);
      });
  });
}

function validacion(usr, pwd) {
  return usuarios.find((usuario) => usuario.username === usr && usuario.pass === pwd);
}

function consultasClientes(consulta,cbErr,respCons){
  mongoClient.connect(url, function (err, cliente){
    if(err){
      console.log("llego un error");
      return;
    }
    const dbCeramica= cliente.db("CeramicaTrivento");

    const collConsultas = dbCeramica.collection("consultas");
    collConsultas.insertOne(consulta, function(err,result){
    cliente.close();
    if(err){
      cbErr(err);
      return;
    }
    console.log(result);
    respCons(result);
   })
  })
}
 
function cargarCv(cargaDatos,cbErr,respCons){
  mongoClient.connect(url, function (err, cliente){
    if(err){
      console.log("llego un error");
      return;
    }
    const dbCeramica= cliente.db("CeramicaTrivento");

    const collCurriculums = dbCeramica.collection("curriculums");
    collCurriculums.insertOne(cargaDatos, function(err,datosSubidos){
    cliente.close();
    if(err){
      cbErr(err);
      return;
    }
    respCons(datosSubidos);
   })
  })
}

module.exports = {
  porNombre,
  porId,
  porLocalidad,
  porUsuario,
  validacion,
  consultasClientes,
  cargarCv
};
