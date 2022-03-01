///"server.js" écoute les requêtes et envoie une réponse

//package "http"
const http = require("http");

//framework express"
const app = require("./app");


//"normalizePort" renvoie un port 
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//création du port
const port = normalizePort(process.env.PORT || "3000");

//configuration du port pour le frontend
app.set("port", port);

//"errorHandler" en cas d'erreurs
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port" + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + "requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + "is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//création du serveur
const server = http.createServer(app);

//ecoute des évenements
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe" + address : "port" + port;
  console.log("listening on " + bind);
});

//serveur écoute le port
server.listen(port);
