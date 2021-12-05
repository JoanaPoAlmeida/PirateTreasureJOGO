//1 - invocamos express
const express = require('express');
const app = express();


//2 - seteamos urlencoded para capturar os dados do formulário
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use("/public", express.static('public'));

//3 - invocar o dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4 - setear o diretorio publico
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + '/public'));

//5 - estabelecer o motor de plantillas ejs
app.set('view engine','ejs');

//6 - invocar modulo para fazer o caching, bcryptjs
const bcryptjs = require('bcryptjs');

//7 - VAriaveis de sessão
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}));

//8 - invocamos o modulo de conexao à bd
const connection = require('./database/db');

//estabelecer rotas

app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/register', (req, res)=>{
    res.render('register');
})

//10 - Registo
app.post('/register', async (req, res)=>{
     
	 const { name, email, pass, passwordConfirm} = req.body;
     let passwordHaash = await bcryptjs.hash(pass,8);

	 connection.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0) {
            return res.render('register', {
                alert: true, 
                alertTitle: "Email in use",
                alertMessage: "Oops! Seems like that email is already in use",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta:''
            })
        } else if( pass !== passwordConfirm){
            return res.render('register', {
                alert: true, 
                alertTitle: "Does not match",
                alertMessage: "Passwords do not match",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta:''
            });
        }
	
     connection.query('INSERT INTO users SET ?', {name:name, email:email, pass:passwordHaash}, async(error, results)=>{
        if(error){
             console.log(error);
        }else{
            res.render('register',{
                alert: true, 
                alertTitle: "Registration",
                alertMessage: "Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta:''
            })
        }
     })
	});
})
//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const email = req.body.email;
	const pass = req.body.pass;    
    let passwordHaash = await bcryptjs.hash(pass, 8);	
    if (email && pass) {
		connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Incorrect user or password",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });
				
				//Mensaje simple y poco vistoso
                //res.send('Incorrect Username and/or Password!');				
			} else {    
				//criamos uma var de sessao, set true se iniciou sessao        
				req.session.loggedin = true;                
				req.session.name = results[0].name;
				res.render('login', {
					alert: true,
					alertTitle: "Conexão Efetuada",
					alertMessage: "WELCOME TO PIRATE TREASURE",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter email and Password!');
		res.end();
	}
});
//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Hello! Please Log In or Register',			
		});				
	}
	res.end();
});


//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //13 - Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});


//inserir posiçoes das zonas dos inimigos na base de dados
const mysql = require("mysql");
var con = mysql.createConnection({
	host: process.env.DB_HOST,
  	user: process.env.DB_USER,
  	password:process.env.DB_PASSWORD,
  	database: process.env.DB_DATABASE,
  });

  
con.connect(function(err) {
	if(err){
		console.log(err);
	}

	var sql = "INSERT INTO zona_inimigo (`id`, `ex`, `ey`) VALUES ?";
	var values = [
		[1, 300, 0],
		[1, 300, 75],		
		[1, 300, 150],
		[1, 300, 220],
		[2, 0, 225],	
		[2, 0, 300],	
		[2, 0, 375],	
		[2, 75, 225],		
		[2, 75, 300],		
		[2, 75, 375],
		[3, 150, 375],
		[3, 150, 450],
		[3, 150, 525],
		[3, 225, 375],
		[3, 225, 450],
		[3, 225, 525],
		[4, 375, 225],
		[4, 375, 300],
		[4, 450, 225],
		[4, 450, 300],
		[4, 520, 225],
		[4, 520, 300],
		[5, 150, 150],
		[5, 150, 225],
		[5, 225, 150],
		[5, 225, 225],
		[6, 525, 375],
		[6, 525, 450]
	];
	con.query(sql, [values], function (err, result) {
		if(err){
			console.log(err);
		}
		console.log("zonas de inimigos inseridas " + result.affectedRow);
	  });
})

var con = mysql.createConnection({
	host: process.env.DB_HOST,
  	user: process.env.DB_USER,
  	password:process.env.DB_PASSWORD,
  	database: process.env.DB_DATABASE,
  });

con.connect(function(err) {
	if(err){
		console.log(err);
	}

	var sql = "INSERT INTO zona_island (`id`, `ax`, `ay`) VALUES ?";
	var values = [
		[1, 150, 0],
		[1, 150, 75],		
		[1, 225, 0],
		[1, 225, 75],
		[11, 0, 150],	
		[11, 75, 150],	
		[2, 375, 0],	
		[2, 375, 75],		
		[2, 375, 150],		
		[2, 450, 0],
		[2, 450, 75],
		[2, 450, 150],
		[2, 525, 0],
		[2, 525, 75],
		[2, 525, 150],
		[3, 0, 450],
		[3, 0, 525],
		[3, 75, 450],
		[3, 75, 525],
		[4, 300, 375],
		[4, 300, 450],
		[4, 300, 525],
		[4, 375, 375],
		[4, 375, 450],
		[4, 375, 525],
		[4, 450, 375],
		[4, 450, 450],
		[4, 450, 525]
	];
	con.query(sql, [values], function (err, result) {
		if(err){
			console.log(err);
		}
		console.log("zonas de ilhas inseridas " + result.affectedRow);
	  });
})

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json())

var zone = 1;
app.post('/insertZona', (req, res)=>{
	var zona = req.body.zona;

	
	console.log(zona);

	res.send(zone);
})

//Select random numbers for the positions
//Selecionar x e y da zona 1
app.get('/islandXposition', (req, res)=>{
	
	console.log(zone);

	let sql = "SELECT ax FROM zona_island WHERE id= "+1+" ORDER BY RAND() LIMIT 1";
	con.query(sql,(err,result)=>{
		if(err) throw err;
		
		console.log(result)
		
		res.send(result);
		
		});
})
app.get('/islandYposition', (req, res)=>{
	let sql = "SELECT ay FROM zona_island WHERE id= "+1+" AND (SELECT ax FROM zona_island WHERE id= "+1+" ORDER BY RAND() LIMIT 1 ) ORDER BY RAND() LIMIT 1"
	con.query(sql,(err,result)=>{
		if(err) throw err;
		
		console.log(result)
		
		res.send(result);
		
		});
})

//positions for enemy
app.get('/enemyXposition', (req, res)=>{
	
	console.log(zone);

	let sql = "SELECT ex FROM zona_inimigo WHERE id= "+1+" ORDER BY RAND() LIMIT 1";
	con.query(sql,(err,result)=>{
		if(err) throw err;
		
		console.log(result)
		
		res.send(result);
		
		});
})
app.get('/enemyYposition', (req, res)=>{
	let sql = "SELECT ey FROM zona_inimigo WHERE id= 1 AND (SELECT ex FROM zona_inimigo WHERE id= 1 ORDER BY RAND() LIMIT 1 ) ORDER BY RAND() LIMIT 1"
	con.query(sql,(err,result)=>{
		if(err) throw err;
		
		console.log(result)
		
		res.send(result);
		
		});
})






//console.log(__dirname);
app.listen(3001,(req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3001');
})