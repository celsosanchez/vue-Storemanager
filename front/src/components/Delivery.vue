<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
          :disabled="!activeUser"
        >
          <v-icon   x-large color="indigo accent-2">
            mdi-cube-send
          </v-icon>
        </v-btn>
      </template>
      <div>
        <v-card tile min-height="100vh">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >Delivery
              <v-icon large class="ml-3" color="white">
                mdi-cube-send
              </v-icon></v-toolbar-title
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-col>
            <active-orders ref="activeOrders" :location="activeUser" :url="url"/>
          </v-col>
        </v-card>
      </div>
    </v-dialog>

    <v-dialog v-model="showingImage" max-width="500px">
      <v-card>
        <v-card-title>{{ showingImageName }}</v-card-title>
        <v-img contain max-height="70vh" :src="showingImageUrl" />
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import ActiveOrders from './ActiveOrders.vue';
import config from '../../config'
export default {
  components: {  ActiveOrders },
  props: ["warningList", "activeUser"],
  data: () => ({
    switchColor: false,
    dialog: false,
    showingImage: false,
     url: `http://${config.server.address}/products`,
    showingImageName: "",
    showingImageUrl: "",
    headers: [
      {
        text: "Product Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Expiration Status", value: "expirationOn" },
      { text: "Producer", value: "producer" },
      { text: "Image", value: "image_url" },
    ],
  }),
  methods: {
    // showActiveUser(){
    //   console.log(this.activeUser)
    // },
    closeDialog(){
      this.$parent.$parent.$parent.reload()
      this.dialog = false;
    }
    ,
    status(value) {
      if (value > 7) return { color: "green", icon: "mdi-circle-slice-8" };
      if (value == 7) return { color: "green", icon: "mdi-circle-slice-7" };
      if (value == 6) return { color: "orange", icon: "mdi-circle-slice-6" };
      if (value == 5) return { color: "orange", icon: "mdi-circle-slice-5" };
      if (value == 4) return { color: "orange", icon: "mdi-circle-slice-4" };
      if (value == 3) return { color: "red", icon: "mdi-circle-slice-3" };
      if (value == 2) return { color: "red", icon: "mdi-circle-slice-2" };
      if (value == 1) return { color: "red", icon: "mdi-circle-slice-1" };
      if (value == 0) return { color: "red", icon: "mdi-circle-outline" };
      else return { color: "red", icon: "mdi-alert-circle" };
    },
    showImage(item) {
      this.showingImageName = item.name;
      this.showingImage = true;
      this.showingImageUrl = item.image_url;
    },
  },
  created() {
    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
    setInterval(() => {
      this.switchColor = !this.switchColor;
    }, 1000);
  },
};
</script>
<style></style>
