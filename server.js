const server = require("express");
const path = require("path");
const app = server();
const hbs = require("express-handlebars");
const puerto = 3003;
const datosCeramica = require("./dbCeramica");
const expSession = require("express-session");
const multer = require("multer");
const upload = multer({ dest: "cliente/cvs" });
const fs = require("fs");

app.engine(
  "handlebars",
  hbs({
    defaultLayout: "main-layout",
    layoutsDir: "views/layouts",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(server.urlencoded({ extended: true }));
app.use(server.json());

app.use(server.static(path.join(__dirname, "cliente")));

app.use(
  expSession({
    secret:
      "muro-de-cristal,gran-cuerno,ondas-infernales,otra-dimension,plasma-relampago,seim-samsara,cien-dragones,aguja-escarlata,trueno-atomico,excalibur,ejecucion-aurora,rosa-sangrienta",
  })
);

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  console.log(req.session);
  res.render("home", {
    titulo: "Home",
    leyenda: "CERAMICA TRIVENTO SRL",
    session: req.session,
  });
});

app.get("/productos", (req, res) => {
  const nombreProd = "";
  datosCeramica.porNombre(
    nombreProd,
    (err) => {
      console.log(err);
    },
    (lista) => {
      res.render("productos", {
        lista,
        titulo: "Nuestros Produtos",
        leyenda: "Nuestros Productos",
        session: req.session,
      });
    }
  );
});

app.get("/detalle-producto", (req, res) => {
  const id = parseInt(req.query.id);
  datosCeramica.porId(
    id,
    (err) => {
      console.log(err);
    },
    (lista) => {
      console.log(lista),
        res.render("detalle-prod", {
          lista,
          titulo: "Nuestros Produtos",
          leyenda: "Nuestros Productos",
          session: req.session,
        });
    }
  );
});

app.get("/presupuestos", (req, res) => {
  const nombreLoc = "";
  const nombreProd = "";
  datosCeramica.porLocalidad(
    nombreLoc,
    (err) => {
      console.log(err);
    },

    (localidades) =>
      datosCeramica.porNombre(
        nombreProd,
        (err) => {
          console.log(err);
        },
        (productos) => {
          res.render("presupuestos", {
            localidades,
            productos,
            titulo: "presupuestos",
            leyenda: "Calculá tu presupuesto",
            session: req.session,
          });
        }
      )
  );
});

app.get("/contacto", (req, res) => {
  res.render("contacto", {
    titulo: "Contacto",
    leyenda: "Envianos tu consulta y te asesoraremos a la brevedad",
    session: req.session,
  });
});

app.post("/contacto", (req, res) => {
  const consulta = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    numero: req.body.numero,
    email: req.body.mail,
    consultas: req.body.consulta,
  };
  datosCeramica.consultasClientes(
    consulta,
    (err) => {
      console.log(err);
    },
    (consultas) => {
      console.log(consultas);
      res.render("contacto", {
        consultas: true,
        session: req.session,
      });
    }
  );
});

app.get("/login", (req, res) => {
  res.render("login", {
    titulo: "Login",
    leyenda: "Ingresar",
  });
});

app.post("/login", (req, res) => {
  const nombreUser = "";
  datosCeramica.porUsuario(
    nombreUser,
    (err) => {
      console.log(err);
    },
    (usuarios) => {
      function validacion(usr, pwd) {
        return usuarios.find(
          (usuario) => usuario.username === usr && usuario.pass === pwd
        );
      }
      const usuario = validacion(req.body.usr, req.body.pwd);

      if (usuario) {
        req.session.username = usuario.username;
        req.session.name = usuario.name;
        req.session.pass = usuario.pass;

        console.log(req.session);

        res.redirect("/administrador");
      } else {
        res.render("login", {
          mensaje: "Usuario o contraseña incorrecta",
        });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/administrador", (req, res) => {
  if (!req.session.username) {
    res.redirect("/login");
    return;
  }
  res.render("administrador", {
    titulo: "Administrador",
    leyenda: "Bienvenido",
    session: req.session,
  });
});

app.get("/trabaja-con-nosotros", (req, res) => {
  res.render("trabajaConNosotros", {
    titulo: "Cargar cv",
    leyenda: "TRABAJA CON NOSOTROS",
    session: req.session,
  });
});

app.post("/cargarCv", upload.single("archivo"), (req, res) => {
  const cargarDatos = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.mail,
    curriculum: `cv-${req.body.nombre}.${req.file.mimetype.split("/")[1]}`,
  };
  fs.renameSync(
    req.file.path,
    `cliente/cvs/curriculum-${req.body.nombre}.${
      req.file.mimetype.split("/")[1]
    }`
  );
  datosCeramica.cargarCv(
    cargarDatos,
    (err) => {
      console.log(err);
    },
    (datos) => {
      res.render("trabajaConNosotros", {
        datos: true,
        session: req.session,
      });
    }
  );
});

app.listen(puerto, () => {
  console.log("servidor corriendo en puerto", puerto);
});
