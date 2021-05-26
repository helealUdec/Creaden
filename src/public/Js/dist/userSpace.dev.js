"use strict";

// cpmseguir ;a fecha actual y almacenarla
var fecha = new Date();
var cadena = "".concat(fecha.getFullYear(), "-").concat(fecha.getMonth() + 1, "-").concat(fecha.getDate());
document.querySelector('.time').innerText = cadena; // seleccionando los botones utiles

var boton = document.querySelector('.toPost');
var imageUpload = document.getElementById('image');
var imagePreview = document.querySelector('.imageToPost');
imageUpload.addEventListener('change', function () {
  var TmpPath = URL.createObjectURL(imageUpload.files[0]);
  imagePreview.setAttribute('src', TmpPath);
  imagePreview.style.display = 'block';
}); // acomodar la informacion del usuario

try {
  localStorage.clear();
  var data = userData.split('des4523,');
  var n = data.length;
  data[n - 1] = data[n - 1].substring(0, data[n - 1].length - 7);
  var cambio = 0;

  for (var i = n - 2; i > 1; i -= 5) {
    var userPost = document.createElement('div');

    if (cambio % 2 == 0) {
      userPost.className = "userPost animate__animated animate__bounce colorDiferent";
    } else {
      userPost.className = "userPost animate__animated animate__bounce";
    }

    cambio++; // creando contenedores para el texto y la informacion de usuario

    var userInformation = document.querySelector('.userPostArea').cloneNode(true);
    userInformation.removeChild(userInformation.lastElementChild);
    var trash = document.createElement('i'); // boton para eliminar

    trash.className = "fas fa-trash trash";
    var bottonTrash = document.createElement('button');
    bottonTrash.id = data[i - 3];
    bottonTrash.appendChild(trash);
    userInformation.appendChild(bottonTrash); // evento para eliminar 

    bottonTrash.addEventListener('click', function (e) {
      document.getElementById('delete').value = e.target.parentElement.getAttribute('id');
      document.querySelector('.form').submit();
    }); // crear el post del usuario

    var userText = document.createElement('div');
    userText.className = 'userText';
    var text = document.createElement('p');
    text.classList.add('pTextPost');
    var image = document.createElement('img');
    if (data[i] != "vacio12Se") text.innerText = data[i];
    if (text.innerText.includes('null')) text.innerText = '';
    userText.appendChild(text);

    if (!data[i + 1].includes('vacio12Se')) {
      image.setAttribute('src', "/files/".concat(data[i + 1]));
      image.className = 'imgPost';
      image.addEventListener('click', function (evt) {
        var imageTemp = evt.target;
        var imageBig = document.querySelector('.imageBig');
        var div = document.querySelector('.conteinerHidden');
        var p = document.querySelector(".pHidden");
        var textTemp = evt.target.parentElement.childNodes[0].innerText;
        textTemp != "" ? p.innerText = textTemp : p.innerText = "";
        div.setAttribute('id', 'divVisible');
        imageBig.setAttribute('src', imageTemp.src);
        div.classList.remove('conteinerHidden');
        div.classList.add('conteinerVisible');
        console.log(div);
        div.addEventListener('click', function (evt) {
          if (evt.target.getAttribute('id') == 'divVisible') {
            div.classList.remove('conteinerVisible');
            div.classList.add('conteinerHidden');
          }
        });
      });
      userText.appendChild(image);
    }

    userPost.appendChild(userInformation);
    userPost.appendChild(userText); // insertandolo en el area de publicaciones

    document.querySelector('.userPublicationArea').appendChild(userPost);
  }
} catch (error) {
  console.log(error);
} // enviar el formulario


boton.addEventListener('click', function () {
  var texto = document.querySelector('.userText').innerText;
  var datePost;
  datePost = "".concat(fecha.getFullYear(), "-").concat(fecha.getMonth() + 1, "-").concat(fecha.getDate(), " ").concat(fecha.getHours(), ":").concat(fecha.getMinutes(), ":00");
  document.getElementById('date').value = datePost;
  document.getElementById('text').value = texto;

  if (texto.length <= 200) {
    document.querySelector('.form').submit();
  } else {
    alert('No puede haber mas de 200 caracteres');
  }
}); // evitar que se escriba mas de 200 letras

var userTextArea = document.querySelector('.userText');
var cuenta = 0;
var tecla = 12;
var tamano = 0;
userTextArea.addEventListener('keydown', function (evt) {
  var text = document.querySelector('.countLetter');
  cuenta = userTextArea.innerText.length + 1;
  text.innerText = "".concat(cuenta, "/200");
  var teclaTemp = evt.keyCode;

  if (cuenta > 200) {
    userTextArea.innerText = userTextArea.innerText.substring(0, userTextArea.innerText.length - 2);
  }
});