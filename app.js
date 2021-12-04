//1 - invocamos express
const express = require('express');
const app = express();

//2 - seteamos urlencoded para capturar os dados do formulário
app.use(express.urlencoded({extended:false}));
app.use(express.json());


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
     const user = req.body.user;
     const name = req.body.name;
     const rol = req.body.rol;
     const pass = req.body.pass;
     let passwordHaash = await bcryptjs.hash(pass,8);
     connection.query('INSERT INTO users SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
             console.log(error);
        }else{
            res.render('register',{
                alert: true, 
                alertTitle: "Registration",
                alertMessage: "Successful REgistration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta:''
            })
        }
     })
})
//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.pass;    
    let passwordHaash = await bcryptjs.hash(pass, 8);	
    if (user && pass) {
		connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });
				
				//Mensaje simple y poco vistoso
                //res.send('Incorrect Username and/or Password!');				
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].name;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
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
			name:'Debe iniciar sesión',			
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


//console.log(__dirname);
app.listen(3001,(req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3001');
})