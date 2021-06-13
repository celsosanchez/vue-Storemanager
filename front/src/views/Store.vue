<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-btn></v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data: () => ({
   
  }),
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
