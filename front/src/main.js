import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import VueBarcodeScanner from "vue-barcode-scanner";
import VueSession from "vue-session";
import VueCookies from "vue-cookies";
import * as VueGoogleMaps from "vue2-google-maps";
import VueApexCharts from "vue-apexcharts";
Vue.use(VueCookies);
Vue.use(VueSession);
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyBcOsCacghw5GeRCIBOaeuZo1LpQipgRBU",
    libraries: "places", // This is required if you use the Autocomplete plugin
  },
});
Vue.config.productionTip = false;
Vue.use(VueGoogleMaps.Marker);
let options = {
  sound: true, // default is false
  soundSrc: "/static/sound.wav", // default is blank
  sensitivity: 300, // default is 100
  requiredAttr: true, // default is false
  controlSequenceKeys: ["NumLock", "Clear"], // default is null
  callbackAfterTimeout: true, // default is false
};

Vue.use(VueBarcodeScanner, options);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
