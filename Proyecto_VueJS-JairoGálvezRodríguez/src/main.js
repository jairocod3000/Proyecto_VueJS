import './assets/main.css'

import { createApp } from 'vue'
import { firebaseApp } from './firebase'
import { VueFire, VueFireAuth } from 'vuefire'
import { createRouter,createWebHistory} from 'vue-router'
import App from './App.vue'
import inicio from './components/inicio.vue'
import AreaPrivada from './components/AreaPrivada.vue'
import Administracion from './components/Administracion.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
const routes=[
  {
    path:'/',
    component: inicio
  },
  {
    path:'/privada',
    component:AreaPrivada
    
  },

  {
    path:'/administracion',
    component:Administracion
  }
];

let estasLogueado=false;
let eresAdmin=false;
const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to,from)=>
{
  
  console.log("To = " + to)
  if(to.path == "/privada" && !estasLogueado){
    return false;
  }else{
    return true;
  }

  
})

router.beforeEach((to,from)=>{
  if(to.path=="/administracion"&&!eresAdmin){
    return false;
  }else{
    return true;
  }
})

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log("se ha iniciado sesion")
    estasLogueado=true;
    if(user.email="admin@admin.com")
    eresAdmin=true;
    // ...
  } else {
    // User is signed out
    // ...
    console.log("se ha cerrado sesion")
    estasLogueado=false;
  }
});




const app = createApp(App)
app.use(router);
app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
      // we will see other modules later on
      VueFireAuth(),
    ],
  })



app.mount('#app')
