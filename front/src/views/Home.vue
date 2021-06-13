<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <ProductData
      ref="productData"
      :url="`http://192.168.31.175:3000/products`"
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

export default {
  name: "Home",
  components: {
    // HelloWorld,
    ProductData,
  },
  data: () => ({

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
