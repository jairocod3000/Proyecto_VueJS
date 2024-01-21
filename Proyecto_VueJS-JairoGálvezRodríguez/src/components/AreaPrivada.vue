<script setup>

import { useCollection } from 'vuefire'
import { addDoc, collection, updateDoc, where } from 'firebase/firestore'
import { doc, deleteDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire';
import { ref } from "vue";
import { getAuth,signOut } from "firebase/auth";
import { getStorage,ref as refStorage, uploadBytes, getDownloadURL} from "firebase/storage";
import { query } from 'firebase/database';
import { useRouter } from 'vue-router';
const auth = getAuth();
const router = useRouter();
let db = useFirestore();
//const auth = getAuth();
let usuario = getAuth().currentUser

let col = collection(db, 'todo');
let que = query(col,where("usuario", "==", usuario.uid));
let todo = useCollection(que);

//let list = useCollection(query(colleccion ,where("idusuario","==",id)));
let file=null;

let contenidoNota="";

console.log(usuario);

function altaNota(){
  

    const storage = getStorage();
    const storageRef = refStorage(storage, "hola");
    uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    return getDownloadURL(snapshot.ref)
  }).then(downloadURL=>{
    console.log("Download URL",downloadURL);
    console.log(contenidoNota);
    const docRef = addDoc(collection(db,"todo"),{
      texto:contenidoNota,
      prioridad:"Baja",
      usuario:usuario.uid
    }).then((e)=>console.log(e));
    //
  })
}

function eliminarNota(id){
  deleteDoc(doc(db,"todo",id))
}



function cambiarPrioridad(id){
  const notaActualizada = doc(db,"todo",id)
  updateDoc(notaActualizada,{
    prioridad:"Alta"
  });
}

function cambiarPrioridadM(id){
  const notaActualizada = doc(db,"todo",id)
  updateDoc(notaActualizada,{
    prioridad:"Media"
  });
}


function subirAjdunto(e){
  file = e.target.files[0];
  console.log(file);
}

function cerrarSesion()
{
    signOut(auth).then(() => {
        // Sign-out successful.
          usuario.value="";
         router.push({ path: '/' })
    }).catch((error) => {
        // An error happened.
    });

}
</script>


<template>
  <header>
    <input type="file" name="file" id="" @change="subirAjdunto($event)">
    <input type="text" name="" id="" v-model="contenidoNota"><button @click="altaNota">Agregar nota</button>
    <button v-on:click="cerrarSesion()">Cerrar Sesion</button>
    <div class="wrapper">

    <ul>
      <p>Notas de {{ usuario.displayName }} {{  }}</p>
      <p>Notas Totales: {{ todo.length }}</p>
        <li v-for="todo in todo" :key="todo.id">
          
           <span>Texto:{{ todo.texto}}, Prioridad:{{ todo.prioridad }}, User:{{ usuario.uid }} </span> 
           <button @click="eliminarNota(todo.id)">Eliminar</button>
           <button @click="cambiarPrioridad(todo.id)">Prioridad Alta</button>
           <button @click="cambiarPrioridadM(todo.id)">Prioridad Media</button>
        </li>
    </ul>
    
    
    </div>

  </header>
</template>
<style>
  body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #222222;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  header {
    background-color: #3498db;
    padding: 20px;
    border-bottom: 2px solid #2980b9;
    text-align: center;
  }

  input[type="file"] {
    margin-bottom: 10px;
  }

  input[type="text"] {
    padding: 8px;
    margin-right: 10px;
  }

  button {
    background-color: #2ecc71;
    color: #ffffff;
    padding: 10px 15px;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    margin-bottom: 10px;
    margin-right: 2px;
    margin-left: 2px;
  }

  button:hover {
    background-color: #27ae60;
  }

  .wrapper {
    max-width: 800px;
    margin: 20px auto;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background-color: orangered;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p {
    margin: 0;
    font-weight: bold;
  }
</style>
