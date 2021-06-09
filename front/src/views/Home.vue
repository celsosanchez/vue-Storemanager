<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <ProductData
      ref="productData"
      :url="`http://192.168.31.175:3000/products`"
      :location="`Producer`"
    />
    <v-btn @click="calldata">getData</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
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
    calldata() {
      console.log(this.$refs)
      // this.$refs.productData.getData();
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>
