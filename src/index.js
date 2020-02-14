// Public modules
const myRequired = require("./npmRequires").required;

const app = myRequired.express();
const initAll = async () => {
  const connection = await myRequired.mysql.createConnection({
    host: "mysql-thesmarthyena.alwaysdata.net",
    user: "199681",
    password: "Rejvesh789?",
    database: "thesmarthyena_test"
  });

  app.connection = connection;
  app.bcrypt = myRequired.bcrypt;
};

initAll();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(myRequired.bodyParser.urlencoded({ extended: true }));
app.use(myRequired.bodyParser.json());

app.use(myRequired.cookieParser());
app.use(
  myRequired.session({
    genid: function(req) {
      return myRequired.uuidv1(); // use UUIDs for session IDs
    },
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // if https only
  })
);

const sessions = new myRequired.nodecache({ stdTTL: 14400, checkperiod: 240 });
app.sessions = sessions;

// My modules
const myMiddlewares = require("./middlewares");
const myRoutesTriggers = require("./routesTriggers");
const myAuth = require("./auth");

// My Cruds
const myCruds = {
  // users: require('./crud/users'),
};

const myRoutes = myRoutesTriggers.routes;

// Applying them
app.use(myMiddlewares.checkPassword(app));
app.use(myMiddlewares.checkSession(app));
app.use(myMiddlewares.checkRoles(app));
//app.use(myMiddlewares.navbarElements(app));
//app.use(myMiddlewares.redirectIfLogged(app));

/**
 * Auth part
 **/
myAuth.get_logout(app, myRequired);
myAuth.get_login(app);
myAuth.post_login(app, myRequired);

app.get("/query", async function(req, res) {
  app.connection.query("SELECT * from test", function(error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/", function(req, res) {
  res.send("Je suis index");
});

app.post("/login", function(req, res) {
  res.json({ success: true });
});

app.post("/logout", function(req, res) {
  res.json({ success: true });
});

app.post("/register", function(req, res) {
  res.json({ success: true });
});

/**
 * Met à jour les infos d'un compte
 */
app.post("/updateAccount", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne les infos de l'utilisateur pâr id, obtenus lors de la connexion
 */
app.post("/getAccount", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne la liste des id des annnonces qui correspondent
 * la recherche se fait via un json de config complet
 */
app.post("/doSearch", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne la liste des searchId de l'utilisateur
 */
app.post("/userSearch", function(req, res) {
  res.json({ success: true });
});

/**
 * Ajoute une recherche aux recherche sauvegardé de l'utilisateur, ==> favoris
 */
app.post("/addUserSearch", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne la liste des id des annnonces qui correspondent
 * la recherche se fait via un json de config complet
 */
app.post("/search", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne les infos en json des annonces en fonction des id
 * En entrée un tableau de id
 */
app.post("/getAnnonceById", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne le dernier message de toutes les conversations d'un utilisateur sur une annonce avec les clefs de thread
 * Un thread ==> UserAId, UserBId, AnnonceId / messages
 */
app.post("/getMessagesList", function(req, res) {
  res.json({ success: true });
});

/**
 * Récupère un thread complet en fonction de la clef de thread
 */
app.post("/getMessagesThead", function(req, res) {
  res.json({ success: true });
});

/**
 * Ajoute un message au thread de messages
 */
app.post("/sendMessageThread", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne les id d'annonces favorites d'un utilisateur
 */
app.post("/fovorites", function(req, res) {
  res.json({ success: true });
});

/**
 * Ajoute l'id d'une annonce aux favoris d'un utilisateur
 */
app.post("/addToFavorites", function(req, res) {
  res.json({ success: true });
});

/**
 * Ajoute une annonce à la base de donnée des annonces
 */
app.post("/createAnnonce", function(req, res) {
  res.json({ success: true });
});

/**
 * Retourne les id des annonces de l'utilisateur
 */
app.post("/userAnnonce", function(req, res) {
  res.json({ success: true });
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
