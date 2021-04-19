<template>
<div>
  <div class="col-full text-center"></div>
  <h1 @click="asd">404</h1>
  <h3>
    Sorry the requested link {{$router.history.current.path}}  doesn't
    exist
  </h3> 
  <router-link to="/">Go back Home </router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      asdss: this.$router.path,
    };
  },
  methods: {
    asd() {
      console.log(this.$router.history.current.path);
    },
  },
};
</script>
