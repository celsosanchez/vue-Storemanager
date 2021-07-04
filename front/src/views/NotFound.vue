<template>
  <div>
    <v-container>
      <v-row>
        <v-col align="center">
          <div class="col-full text-center"></div>
          <v-img max-width="400" src="@/assets/404-error.jpg"></v-img>
          <h3>
            Sorry the requested link :
            {{ $router.history.current.path }} doesn't exist
          </h3>
          <v-btn icon @click="goHome">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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
    goHome() {
      // console.log(this.$router.history.current.path);
      this.$router.push({ path: `/` });
    },
  },
};
</script>
