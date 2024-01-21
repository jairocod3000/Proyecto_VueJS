<script setup>
import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import { GithubAuthProvider } from "firebase/auth";

const auth = getAuth();

let usuario = ref(auth.currentUser);
const router = useRouter();

function iniciaSesion(){
    console.log("inicio sesion");
    
    const provider = new GoogleAuthProvider();

   signInWithPopup(auth, provider)
  .then((result) => {
    
    const user = result.user;
    usuario.value= user;
    router.push({ path: '/privada' })
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
   
  });
}
function GitHubInicio(){
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
    
  .then((result) => {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });
}


function cerrarSesion(){
  
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
    
    <button v-on:click="GitHubInicio()">Iniciar Sesion con GitHub</button>
    <div v-if="usuario">
            Bienvenido {{ usuario.displayName }} al proyecto de las notas
            <button v-on:click="cerrarSesion()">Cerrar Sesion</button>
        </div>
        <div v-else>
            <button v-on:click="iniciaSesion()">Iniciar Sesion</button>
            
        </div>
</template>  
<style>
  body {
    background-color: #1a1a1a;
    color: #ffffff;
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  button {
    background-color: #3498db;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  button:hover {
    background-color: #2980b9;
  }

  div {
    text-align: center;
  }

  div.v-if {
    background-color: #2c3e50;
    padding: 20px;
    border-radius: 10px;
  }

  div.v-if button {
    background-color: #e74c3c;
    margin-top: 10px;
  }

  div.v-else button {
    background-color: #2ecc71;
    margin-top: 10px;
  }
</style>
