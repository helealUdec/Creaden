
let userName = document.querySelector('.loginUserName');
let password = document.querySelector('.loginUserPassword');
let confirm = document.querySelector('.confirm');
let botton = document.querySelector('.submit');
let background = botton.style.background;
botton.setAttribute('disabled', 'true');
botton.style.color = "#fff";
botton.style.background = "#eee";
// comprobar que la cantidad de texto sea la adecuada
userName.addEventListener('keyup', (evt) => {
     if(String.fromCharCode(evt.keyCode) == " ") {
          let textoAux = userName.value;
          textoAux = textoAux.replace(/ /g, "");
          userName.value = textoAux;
     }
     comprobar(evt);
});
password.addEventListener('keyup', (evt) => {
     comprobar(evt);
});
confirm.addEventListener('keyup', (evt) => {
     comprobar(evt);
    
     let texto1 = userName.value;
     let texto2 = password.value;
     let texto3 = confirm.value;

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
     } else if(texto2.length >= 6 && texto3.length >= 7) {
          password.style.color = 'yellow';
          confirm.style.color = 'yellow';
     } else {
          password.style.color = 'red';
          confirm.style.color = 'red';
     }

});

// comprobar si esta correcto el input
function comprobar(evt) {
     let texto = evt.target.value;
     if (texto.length <= 6) {
          
          evt.target.style.color = 'red';
     } else {
          evt.target.style.color = 'grey';
     }
}

function alerta(texto) {
     alert(texto);
}

