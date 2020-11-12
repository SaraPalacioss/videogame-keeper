//DEPENDENCIES
const chalk     = require("chalk");
const dotenv    = require("dotenv");
const express   = require("express");
const hbs       = require("hbs");
const mongoose  = require("mongoose");
const bodyParser  = require("body-parser");

//CONSTANTS
const app = express();
const Videogame = require ('./models/Videogame');

//CONFIGURATION

//configuración de .env
require('dotenv').config();

//Configuración de Mongoose
mongoose.connect(`mongodb://localhost/${process.env.DATABASE}`, {
    userCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
.then((result)=>{
    console.log(chalk.cyan(`Connected to Mongo! Database used: ${result.connections[0].name}`));
})

.catch((error)=>{
    console.log(chalk.red(`There has been an error: ${error}`));

});


//configuración de .hbs
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//configuración de body parser
app.use(bodyParser.urlencoded({extended: true}));



//ROUTES
app.get('/', (req, resp, next)=>{
    resp.render('home');
});

app.get('/new-videogame', (req, res, next)=>{
    res.render('newVideogame');
});

app.post('/new-videogame', (req, res, next)=>{

    const splitString = (_string)=>{
        const genreString = req.body.genre;
        const splittedGenreString = genreString.split(', ') 
        return splittedGenreString;
    }

    const arrayPlatform = splitString(req.body.platform);
    const arrayGenre = splitString(req.body.genre);

    const newVideogame ={...req.body, genre: arrayGenre, platform: arrayPlatform};
  
    Videogame.create(newVideogame)
        .then((result)=>{
            console.log(result);
            res.render('newVideogame');
            })
        .catch((err)=>console.log(err));
});


app.get('/all-videogames', (req, res, next)=>{
    Videogame.find({}, {name: 1, _id:0})
    .then((videogames)=>{
      res.render('allVideogames', {videogames})
    })

    .catch((err)=>{
        console.log(err)
        res.send(err)  
    })
});
//LISTENER

app.listen(process.env.PORT, ()=>{
    console.log(chalk.green.inverse.bold(`Conectado al puerto ${process.env.PORT}`));
});