<template>
  <div class="home">
    <v-container fluid>
      <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
      <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
      <!-- <ProductData
      ref="productData"
      :url="this.url"
      :location="`Producer`"
    /> -->
      <!-- <v-img contain max-height="80vh" src="https://images.unsplash.com/photo-1568835679605-ba674a4d12e1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80"></v-img> -->
      <!-- <v-btn href="localhost:3000/auth/google">googleauth</v-btn>
    <v-btn @click="auth">auth</v-btn>
    <v-btn @click="showSession">session</v-btn> -->

      <v-parallax
        dark
        contain
        src="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80"
      >
        <v-row align="center" justify="center" no-gutters>
          <v-col class="text-center " xs="10" sm="10" md="4">
            <v-card class="mr-15 ml-15 rounded-xl" max-width="500" elevation="10">
              <v-img contain max-height="300" src="@/assets/logo.png"></v-img>
              <h4 class="subheading">
                The all-in-one store manager
              </h4>
            </v-card>
          </v-col>
        </v-row>
      </v-parallax>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import axios from "axios";
// import ProductData from "@/components/ProductData.vue";
import config from "../../config";

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
      // this.$refs.productData.getData();
      // this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      axios.get("http://localhost:3000/products");
    },
    showSession() {
      // console.log(this.$session.getAll());
    },
  },
  computed: {
    user() {
      return this.$cookies.get("sessid").match(/"(.*)"/m)[1];
    },
  },
  created() {
    if (this.$cookies.get("sessid") == null) {
      window.location.href = `http://${config.server.address}/auth/google`;
    } else {
      axios.get(`http://${config.server.address}/users`).then((res) => {
        res.data.found.forEach((element) => {
          if (element._id == this.user) {
            this.activeUser = element;
            this.active = true;
          }
        });
        console.log(this.activeUser);
        if (this.activeUser.acceptConditions != true)
          window.location.href = `http://localhost:8080/account`;
      });
    }
  },
};
</script>
