<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <ProductData
      ref="productData"
      :url="this.url"
      :location="`Producer`"
    />
     
    <v-btn href="localhost:3000/auth/google">googleauth</v-btn>
    <v-btn @click="auth">auth</v-btn>
    <v-btn @click="showSession">session</v-btn>
     
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import axios from'axios';
import ProductData from "@/components/ProductData.vue";
// import config from '../../config'

export default {
  name: "Home",
  components: {
    // HelloWorld,
    ProductData,
  },
  data: () => ({
url: `http://localhost:3000/products`
  }),
  methods: {
    auth() {
      // console.log(this.$refs)
      this.$refs.productData.getData();
      // this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      // axios.get("http://localhost:3000/auth/google")
    },
    showSession(){
      
      console.log(this.$session.getAll())
    },
  },
};
</script>
