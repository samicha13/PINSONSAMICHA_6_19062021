
//Import des packages
const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

// conexion mongoDB grâce au fichier .env dans lequel est renseigné l'url

mongoose.connect(process.env.DB_MGN, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
  })
	.then(() => console.log('Connexion à MangoDB réussis !'))
	.catch((error) => console.log('Connexion à MangoDB échouée'));
  

// constante pour notre application 
const app = express();

//definition des header
app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(bodyParser.json());

//Import user routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


//Serve the route for user
app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes);



module.exports = app;

