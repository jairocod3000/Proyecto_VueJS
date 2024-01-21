<script setup>



import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



import { useCollection } from 'vuefire'
import { addDoc, collection, updateDoc, where } from 'firebase/firestore'
import { doc, deleteDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire';
import { ref } from "vue";
import { getStorage,ref as refStorage, uploadBytes, getDownloadURL} from "firebase/storage";
import { query } from 'firebase/database';
let db = useFirestore();
//const auth = getAuth();
const auth = getAuth();

let todo = useCollection(collection(db,"todo"));

let usuario = ref(auth.currentUser);

//let list = useCollection(query(colleccion ,where("idusuario","==",id)));
let file=null;

let contenidoNota="";

const email="admin@admin.com";
const password="administrador";


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
      prioridad:"baja",
      
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
    prioridad:"alta"
  });
}


function inicio(){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const usuario = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

}


function cambiarPrioridadM(id){
  const notaActualizada = doc(db,"todo",id)
  updateDoc(notaActualizada,{
    prioridad:"Media"
  });
}

</script>


<template>
    <header>

    <input type="text" name="" id="" v-model="contenidoNota"><button @click="altaNota">Agregar nota</button>
    <div class="wrapper">

    <ul>
      <p>Notas de: {{ email }}</p>
      <p>Notas Totales: {{ todo.length }}</p>
        <li v-for="todo in todo" :key="todo.id">
          
           <span>{{ todo.texto}} {{ todo.prioridad }} </span> 
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
    background-color: #343a40;
    color: #ffffff;
    padding: 20px;
    border-bottom: 2px solid #212529;
    text-align: center;
  }

  input[type="text"] {
    padding: 8px;
    margin-right: 10px;
  }

  button {
    background-color: #28a745;
    color: #ffffff;
    padding: 10px 15px;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    margin-bottom: 10px;
    
  }

  button:hover {
    background-color: #218838;
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
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p {
    margin: 0;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>
