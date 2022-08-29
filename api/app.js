const express = require("express");
const app = express();
require("./config/database")
const Users = require("./src/models/Users");
const Games = require("./src/models/Games");
const jwt = require("jsonwebtoken")
const cors = require("cors");


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}))
const jwtSecret = "hdjshdauidhsgdfuad";


function auth(req, res, next) {
  const bearToken = req.headers["authorization"];

  if(bearToken != undefined) {
    const arrayToken = bearToken.split(" ");
    const token = arrayToken[1];

    jwt.verify(token, jwtSecret, (err, data) => {
      if(err) {
        res.status(401).json({err: "Token inválido"})
      } else {
        next();
      }
    })
  } else {
    res.status(401).json({err: "Token inválido"})
  }
}



app.get("/games",auth, (req, res) => {
  Games.find({}).then((games) => {
    res.status(200).json(games);
  }).catch((err) => {
    res.sendStatus(404);
  })
})

app.get("/game/:id",auth, (req, res) => {
  Games.findById(req.params.id).then((game) => {
    res.status(200).json(game);
  }).catch((err) => {
    res.sendStatus(404);
  })
})

app.post("/game",auth, (req, res) => {
  const {name, year, price} = req.body

  Games.create({name:name, year: year, price: price}).then(() => {
    res.sendStatus(201);
  }).catch((err) => {
    res.sendStatus(400)
  })
})

app.put("/game/:id",auth, (req, res) => {
  const {name, year, price} = req.body;
  Games.findByIdAndUpdate(req.params.id, {name, year, price}).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.sendStatus(400);
  })
})

app.delete("/game/:id",auth, (req, res) => {
  Games.findByIdAndRemove(req.params.id).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    res.sendStatus(400);
  })
})

app.post("/user/new", (req, res) => {
  const {email, password} = req.body;

  Users.findOne({email: email}).then((user) => {
    if(user == undefined) {
      Users.create({email, password}).then(() => {
        res.sendStatus(201);
      }).catch((err) => {
        res.sendStatus(400);
      })
    } else {
      res.status(400).json({err: "Email já cadastrado"})
    }
  }).catch((err) => {
    res.status(400).json({err: "Houve um erro interno"})
  })

})

app.post("/login", (req, res) => {
  const {email, password} = req.body;

  Users.findOne({email: email}).then((user) => {
    if(user != undefined) {
      if(password == user.password) {
        jwt.sign({email: user.email, id: user._id}, jwtSecret, {expiresIn: "48h"}, (err, token) => {
          if(err) {
            res.status(400).json({err: "Houve um erro ao gerar token"});
          } else {
            res.status(200).json({token: token})          }
        })
      } else {
        res.status(400).json({err: "A senha está incorreta"})
      }
    } else {
      res.status(404).json({err: "E-mail não cadastrado"})
    }
  })
})


app.listen(3000, () => {
  console.log("Servidor rodando")
})