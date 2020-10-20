/*===============================================================================
=            logica de la seccion del Login , verificamos al User :             =
===============================================================================*/
/*var url1 = 'http://localhost:8082/CreateUser'
alert('inicia a verificar la dirección create user');

let credenciales = {
  username: 'jagaitanr@hotmail.com',
  password: '11223344'
};

$.post(url1, credenciales, function (response){
  alert(response);
})
*/
$('.loginButton').on('click', function(event) {
  let credenciales = {
    username: $('#user').val(),
    password: $('#pass').val()
  };
  alert("hola: " + credenciales.username);
  //window.location.href = 'main.html';
  var url = 'http://localhost:8082/app/login'

  $.post(url, credenciales, function(response) {
    if (response == "OK") {
          localStorage.setItem("user",credenciales.username);
        window.location.href = 'main.html';
        }else {

          alert("no solamente no entro sino que los errores son los siguientes: ");
          alert(response);
        }
    });
})


/*=====  End of logica de la seccion del Login , verificamos al User :   ======*/
