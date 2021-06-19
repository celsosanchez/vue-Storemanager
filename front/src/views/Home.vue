<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <ProductData
      ref="productData"
      :url="this.url"
      :location="`Producer`"
    /> -->
    <!-- <v-img contain max-height="80vh" src="https://images.unsplash.com/photo-1568835679605-ba674a4d12e1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"></v-img> -->
    <v-btn href="localhost:3000/auth/google">googleauth</v-btn>
    <v-btn @click="auth">auth</v-btn>
    <v-btn @click="showSession">session</v-btn>

    <v-parallax
      dark
      contain
      src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80"
    >
      <v-row align="center" justify="center" >
        <v-col class="text-center" >
          <v-card class="mr-15 ml-15" >
          <h1 class="text-h4 font-weight-thin mb-4">
            Grocery-Shop
          </h1>
          <h4 class="subheading">
           The all-in-one store manager
          </h4>
          </v-card>
        </v-col>
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import axios from'axios';
// import ProductData from "@/components/ProductData.vue";
// import config from '../../config'

export default {
  name: "Home",
  components: {
    // HelloWorld,
    // ProductData,
  },
  data: () => ({
    url: `http://localhost:3000/products`,
  }),
  methods: {
    auth() {
      // console.log(this.$refs)
      this.$refs.productData.getData();
      // this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      // axios.get("http://localhost:3000/auth/google")
    },
    showSession() {
      console.log(this.$session.getAll());
    },
  },
};
</script>
