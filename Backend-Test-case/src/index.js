const express = require("express");
const memberController = require("./member/member.controller");
const bookController = require('./book/book.controller');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const app = express();

// dotenv.config();

// const PORT = process.env.PORT;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api", (req, res) => {
  res.send("Selamat datang di API akuh");
});

app.use("/members", memberController);
app.use("/books", bookController);


let server;

if (require.main === module) {
  server = app.listen(3000, () => {
    console.log("Express API running in port: 3000");
  });
}

const startServer = () => {
  return new Promise((resolve) => {
    server = app.listen(3000, () => {
      resolve(server);
    });
  });
};

const stopServer = () => {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = { app, startServer, stopServer };
