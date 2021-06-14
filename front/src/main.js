import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import VueBarcodeScanner from 'vue-barcode-scanner'
import VueSession from 'vue-session'
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.use(VueSession)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBcOsCacghw5GeRCIBOaeuZo1LpQipgRBU',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
 
    //// If you want to set the version, you can do so:
    // v: '3.26',
  },
})
Vue.config.productionTip = false

let options = {
  sound: true, // default is false
  soundSrc: '/static/sound.wav', // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true, // default is false
  controlSequenceKeys: ['NumLock', 'Clear'], // default is null
  callbackAfterTimeout: true // default is false
}

Vue.use(VueBarcodeScanner, options)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
