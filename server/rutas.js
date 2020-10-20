/* iniciamos  */

const Router = require('express').Router();
const User = require('./model/user.js');
const EventCalendar = require('./model/event.js');
var mongoose = require('mongoose');
var crypto = require('crypto');
// metodo CreateHmac y encritamos
function encriptar(user, pass) {

   var hmac = crypto.createHmac('sha1', user).update(pass).digest('hex')
   return hmac
}

//Creacion del User :)
Router.get('/CreateUser', function(req, res) {
//Router.get('/CreateUser', function(req, res) {
alert ('entro a create user');
  var user = new User({
      _id: new mongoose.Types.ObjectId(),
      userId: "usuario@gmail.com",
      name: "usuario guia",
      password: "123456",
      status: "Activo"
  });
  user.password = encriptar(user.userId, '123456');
  user.save(function(error) {
      if (error) {
          res.status(500)
          res.json(error)
      }
      res.json(user);
  });

})


//Crea Evento del User :)
Router.get('/CreateEvent', function(req, res) {
  User.findOne({userId:"usuario@gmail.com"},function (err, user){
     if(user){
       var evento = new EventCalendar({
         _id: new mongoose.Types.ObjectId(),
         title: "Prueba",
         user: user.id,
         startDate: new Date('2018-05-01'),
         endDate: new Date('2018-05-01'),
         startHour: "15",
         endHour: "18"
       });
       evento.save(function(error) {
           if (error) {
               res.status(500)
               res.json(error)
           }
           res.json(evento);
       });
     }
   });

});

//Validamos al Usuario

Router.post('/login', function(req, res) {
  console.log('entro a login');
//  Router.post('/login', function(req, res) {
   var username = req.body.username
   var password = req.body.password

   console.log(req.body.credenciales)
   console.log (username)
   console.log (password)
   //console.log ('el usuario que llego ess: '+username)
   var passEncriptada = encriptar(username,password)
   console.log (passEncriptada)
   //user.password = encriptar(user.userId, '123456');

  User.findOne({userId:username },function (err, user){
console.log('el userId es: ')
//var1 = user.userId;
console.log(var1)

var var1 = user.password;
var var2 = user.status;
console.log (var1)
console.log (var2)


        if(user){
    //verificamos que sea la contrasema encritada su esta bie damos el ok
         if(user.password == passEncriptada &&
            user.status == 'Activo')
            res.send('OK')
         else
            res.send('contraseña incorrecta')
      }
      else
         res.send('usuario no existe')
         //res.send('el usuario ingresado es: '+ username)

   })
})
//cotejamos los datos del usuario
Router.post('/user', function(req, res) {
   var username = req.body.usuario;
   console.log (username);
   User.findOne({userId:username},function (err, user){
      if(user){
        //si es valido :)
          console.log('usuario encontrado');
        res.json(user)
      }
      else
         console.log('usuario no existe: ' + user)
   })
})
//con esta consilta obtenemos todos los usuarios registradosen la base de datos.
Router.post('/all', function(req, res) {
    var username = req.body.usuario;
    User.findOne({userId:username},function (err, user){
       if(user){
         EventCalendar.find({user: user.id}).exec(function(err, doc) {
             if (err) {
                 res.status(500)
                 res.json(err)
             }
             res.json(doc)
           });
       }
     });
})

// Obtener un usuario por su id
//Router.get('/:id', function(req, res) {

Router.get('/', function(req, res) {
  User.findOne({userId:"usuario@gmail.com"},function (err, user){
     if(user){
       EventCalendar.find({user: user.id}).exec(function(err, doc) {
           if (err) {
               res.status(500)
               res.json(err)
           }
           res.json(doc)
         });
     }
   });
})
/*
Router.get('/', function(req, res) {
  User.findOne({userId:"usuario@gmail.com"}),exec(function(err, user){
     if(user){
            if (err) {
               res.status(500)
               res.json(err)
           }
           res.json(docs)
         };
     })

})

*/
// Agregar a un evento
Router.post('/new', function(req, res) {
      var userid = req.body.userId;
      var fechaInicio = new Date(req.body.start);
      var fechaFin = new Date(req.body.end);
      User.findOne({userId:userid},function (err, user){
         if(user){
           var evento = new EventCalendar({
             _id: new mongoose.Types.ObjectId(),
             title: req.body.title,
             user: user.id,
             startDate: fechaInicio,
             endDate: fechaFin,
             startHour: fechaInicio.getHours(),
             endHour: fechaFin.getHours()
           });
           evento.save(function(error) {
               if (error) {
                   res.status(500)
                   res.json(error)
               }
               res.send("Registro guardado");
           });
         }
       });
    })

//update
Router.post('/update', function(req, res) {
  EventCalendar.findByIdAndUpdate(req.body.id,
  {
    startDate: req.body.start,
    endDate: req.body.end,
    startHour: req.body.startHour,
    endHour: req.body.endHour
  },
  function(error, evento) {
    if (error) {
        res.status(500)
        res.json(error)
    }
    res.send("Actualizado");
  });
})

// Eliminar un usuario por su id
Router.post('/delete', function(req, res) {
  EventCalendar.findByIdAndRemove(req.body.id,
  function(error, evento) {
    if (error) {
        res.status(500)
        res.json(error)
    }
    res.send("Actualizado");
  });
})

// Inactivar un usuario por su id
Router.post('/inactive/:id', function(req, res) {

})

// Activar un usuario por su id
Router.post('/active/:id', function(req, res) {

})

module.exports = Router
