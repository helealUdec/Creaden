

// cpmseguir ;a fecha actual y almacenarla
let fecha = new Date();
let cadena = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
document.querySelector('.time').innerText = cadena;
// seleccionando los botones utiles
let boton = document.querySelector('.toPost');
let imageUpload = document.getElementById('image');
let imagePreview = document.querySelector('.imageToPost');
imageUpload.addEventListener('change', () => {
     let TmpPath = URL.createObjectURL(imageUpload.files[0]);
     imagePreview.setAttribute('src', TmpPath);
     imagePreview.style.display = 'block';
})



// acomodar la informacion del usuario
try {
     localStorage.clear();
     let data = userData.split('des4523,');
     let n = data.length;
     data[n - 1] = data[n - 1].substring(0, (data[n - 1].length - 7));
     let cambio = 0;
     for (let i = n - 2; i > 1; i -= 5) {

          let userPost = document.createElement('div');
          if (cambio % 2 == 0) {
               userPost.className = "userPost animate__animated animate__bounce colorDiferent";
          } else {
               userPost.className = "userPost animate__animated animate__bounce";
          }
          cambio++;

          // creando contenedores para el texto y la informacion de usuario
          let userInformation = document.querySelector('.userPostArea').cloneNode(true);
          userInformation.removeChild(userInformation.lastElementChild);
          let trash = document.createElement('i');
          // boton para eliminar
          trash.className = "fas fa-trash trash";
          let bottonTrash = document.createElement('button');
          bottonTrash.id = data[i - 3];
          bottonTrash.appendChild(trash);
          userInformation.appendChild(bottonTrash);
          // evento para eliminar 
          bottonTrash.addEventListener('click', (e) => {

               document.getElementById('delete').value = e.target.parentElement.getAttribute('id');
               document.querySelector('.form').submit();

          });
          // crear el post del usuario
          let userText = document.createElement('div');
          userText.className = 'userText';
          let text = document.createElement('p');
          text.classList.add('pTextPost');
          let image = document.createElement('img');
          if (data[i] != "vacio12Se") text.innerText = data[i];
          if (text.innerText.includes('null')) text.innerText = '';
          userText.appendChild(text);
          if (!data[i + 1].includes('vacio12Se')) {
               image.setAttribute('src', `/files/${data[i + 1]}`);
               image.className = 'imgPost';
               image.addEventListener('click', (evt) => {
                    let imageTemp = evt.target;
                    let imageBig = document.querySelector('.imageBig');
                    let div = document.querySelector('.conteinerHidden');
                    let p = document.querySelector(".pHidden");
                    let textTemp = evt.target.parentElement.childNodes[0].innerText;

                    textTemp != "" ? p.innerText = textTemp : p.innerText = "";


                    div.setAttribute('id', 'divVisible')
                    imageBig.setAttribute('src', imageTemp.src);
                    div.classList.remove('conteinerHidden');
                    div.classList.add('conteinerVisible');
                    console.log(div);

                    div.addEventListener('click', (evt) => {
                         if (evt.target.getAttribute('id') == 'divVisible') {
                              div.classList.remove('conteinerVisible');
                              div.classList.add('conteinerHidden');

                         }
                    });

               });
               userText.appendChild(image);
          }



          userPost.appendChild(userInformation);
          userPost.appendChild(userText);


          // insertandolo en el area de publicaciones
          document.querySelector('.userPublicationArea').appendChild(userPost);


     }
} catch (error) {
     console.log(error);
}

// enviar el formulario
boton.addEventListener('click', () => {
     let texto = document.querySelector('.userText').innerText;
     let datePost;
     datePost =
          `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()} ${fecha.getHours()}:${fecha.getMinutes()}:00`;
     document.getElementById('date').value = datePost;
     document.getElementById('text').value = texto;
     if (texto.length <= 200) {
          document.querySelector('.form').submit();
     } else {
          alert('No puede haber mas de 200 caracteres');
     }

});


// evitar que se escriba mas de 200 letras
let userTextArea = document.querySelector('.userText');
let cuenta = 0;
let tecla = 12;
let tamano = 0;
userTextArea.addEventListener('keydown', (evt) => {
     let text = document.querySelector('.countLetter');
     cuenta = userTextArea.innerText.length + 1;
     text.innerText = `${cuenta}/200`;
     let teclaTemp =  evt.keyCode;
     if(cuenta > 200) {
          userTextArea.innerText = userTextArea.innerText.substring(0, userTextArea.innerText.length-2);
     }
    
});

