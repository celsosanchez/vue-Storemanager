<template>
  <v-app>
    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item.name" :to="item.value">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    tab: null,
    items: {
      Home: { name: "Home", value: "/" },
      Producer: { name: "Producer", value: "/producer" },
      Consumer: { name: "Consumer", value: "/consumer" },
      Store: { name: "Store", value: "/store" },
      About: { name: "About", value: "/about" },
    },
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
