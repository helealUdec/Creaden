"use strict";

var userName = document.querySelector('.loginUserName');
var password = document.querySelector('.loginUserPassword');
var confirm = document.querySelector('.confirm');
var botton = document.querySelector('.submit');
var background = botton.style.background;
botton.setAttribute('disabled', 'true');
botton.style.color = "#fff";
botton.style.background = "#eee"; // comprobar que la cantidad de texto sea la adecuada

userName.addEventListener('keyup', function (evt) {
  if (String.fromCharCode(evt.keyCode) == " ") {
    var textoAux = userName.value;
    textoAux = textoAux.replace(/ /g, "");
    userName.value = textoAux;
  }

  comprobar(evt);
});
password.addEventListener('keyup', function (evt) {
  comprobar(evt);
});
confirm.addEventListener('keyup', function (evt) {
  comprobar(evt);
  var texto1 = userName.value;
  var texto2 = password.value;
  var texto3 = confirm.value;

  if (texto2 == texto3) {
    if (texto1.length >= 6 && texto2.length >= 6 && texto3.length >= 7) {
      password.style.color = 'grey';
      confirm.style.color = 'grey';
      botton.removeAttribute('disabled');
      botton.style.color = "#fff";
      botton.style.background = background;
    } else {
      botton.setAttribute('disabled', 'true');
      botton.style.color = "#fff";
      botton.style.background = "#eee";
    }
  } else if (texto2.length >= 6 && texto3.length >= 7) {
    password.style.color = 'yellow';
    confirm.style.color = 'yellow';
  } else {
    password.style.color = 'red';
    confirm.style.color = 'red';
  }
}); // comprobar si esta correcto el input

function comprobar(evt) {
  var texto = evt.target.value;

  if (texto.length <= 6) {
    evt.target.style.color = 'red';
  } else {
    evt.target.style.color = 'grey';
  }
}

function alerta(texto) {
  alert(texto);
}