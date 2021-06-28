<template>
  <!-- <v-row> -->
  <v-container fluid>
    <v-card min-height="80vh">
      <v-toolbar flat color="teal lighten-3" class="text-h3">
        <template>
          <v-tabs grow align-with-title v-model="pos">
            <v-tab @click="refreshData(`Lidl`)"
              ><v-img
                class="mr-3"
                :max-width="icoWidth"
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Lidl-Logo.svg"
              />Lidl
            </v-tab>
            <v-tab @click="refreshData(`Leclerc`)"
              ><v-img
                class="mr-3"
                :max-width="icoWidth"
                src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Logo_E.Leclerc_Sans_le_texte.svg"
              />Leclerc</v-tab
            >
            <v-tab @click="refreshData(`Carrefour`)"
              ><v-img
                class="mr-3"
                :max-width="icoWidth + 10"
                src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Carrefour_logo.svg"
              />Carrefour</v-tab
            >
          </v-tabs>
        </template>
      </v-toolbar>
      <v-container fluid>
        <store-windows :store="active" ref="storeWindows" />
      </v-container>
    </v-card>
  </v-container>
  <!-- </v-row> -->
</template>
<script>
import storeWindows from "../components/storeWindows.vue";
export default {
  components: { storeWindows },
  data: () => ({
    stores: ["Lidl", "Leclerc", "Carrefour"],
    active: "Lidl",
    pos: 0,
  }),
  computed: {
    icoWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 20;
        case "sm":
          return 30;
        case "md":
          return 40;
        case "lg":
          return 50;
        case "xl":
          return 50;
        default:
          return 50;
      }
    },
  },
  methods: {
    refreshData(val) {
      if (this.$refs.storeWindows.$refs.shelves != undefined) {
        // console.log(`recalling shelves`)
        this.active = val;
        this.$refs.storeWindows.$refs.shelves.getData(val);
      }
      if (this.$refs.storeWindows.$refs.productData != undefined) {
        // console.log(`recalling productData`)
        this.active = val;
        this.$refs.storeWindows.$refs.productData.getData(val);
      }
      if (this.$refs.storeWindows.$refs.activeOrders != undefined) {
        // console.log(`recalling activeOrders`)
        this.active = val;
        this.$refs.storeWindows.$refs.activeOrders.getData(val);
      }
    },
  },
  watch: {
  },
};
</script>
