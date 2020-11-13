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

app.use(express.static(__dirname + '/public'))

//RUTA DE LA HOMEPAGE
app.get('/', (req, resp, next)=>{
    resp.render('home');
});

//RUTA GET PARA RENDERIZAR EL FORMULARIO DE CREACIÓN DE UN NUEVO VIDEOJUEGO
app.get('/new-videogame', (req, res, next)=>{
    res.render('newVideogame');
});

// RUTA POST PARA CREAR UN NUEVO VIDEOJUEGO

app.post('/new-videogame', (req, res, next)=>{

    const splitString = (_string)=>{
        const genreString = req.body.genre;
        const splittedGenreString = genreString.split(',');
        return splittedGenreString;
    };

    const arrayPlatform = splitString(req.body.platform);
    const arrayGenre = splitString(req.body.genre);

    const newVideogame ={...req.body, genre: arrayGenre, platform: arrayPlatform};
  
    Videogame.create(newVideogame)
        .then((result)=>{
            console.log(result);
            res.redirect('/all-videogames');
            })
        .catch((err)=>console.log(err));
});

// RUTA GET PARA VER UN VIDEOJUEGO
app.get('/videogame/:id', (req, res, next)=>{
    const videogameID = req.params.id;
    Videogame.findById(videogameID)
    .then((result)=>{
        res.render('singleVideogame', result);
    })
    .catch((error)=>{
        res.send(error);
    });
});

// RUTA GET PARA VER TODOS LOS VIDEOJUEGOS
app.get('/all-videogames', (req, res, next)=>{
    Videogame.find({}, {name: 1, _id:1, imageUrl: 1}, {sort: {rating: -1}})
    .then((videogames)=>{
      res.render('allVideogames', {videogames});
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    });
});

// RUTA GET PARA BORRAR UN VIDEOJUEGO
app.post('/delete-game/:id', (req, res, next) =>{
    const id = req.params.id
    Videogame.findByIdAndDelete(id)
    .then(()=>{
        res.redirect('/all-videogames')
    })

    .catch((err)=> {
        console.log(err)
        res.send(err)
    })
})


// RUTA GET PARA VER EL FORMULARIO DE EDICION DE UN VIDEOJUEGO
app.get('/edit-videogame/:id', (req, res, next)=>{
    const id = req.params.id
    Videogame.findById(id)
    .then((result)=>{
        res.render('editForm', result)
    })
    .catch((err)=>{
        console.log(err)
        res.render(err)
    })
    
 
})

//RUTA POST PARA EDITAR UN GAME ESPECÍFICO

app.post('/edit-videogame/:id', (req, res, next)=>{
    const id = req.params.id
    const editedVideogame = req.body
    Videogame.findByIdAndUpdate(id,  editedVideogame)
    .then(()=>{
        res.redirect(`/videogame/${id}`)
    })

})


//LISTENER

app.listen(process.env.PORT, ()=>{
    console.log(chalk.green.inverse.bold(`Conectado al puerto ${process.env.PORT}`));
});