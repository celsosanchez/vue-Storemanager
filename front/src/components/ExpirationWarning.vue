<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:[`activator`]="{ on, attrs }">
        <v-btn
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
          :disabled="!activeUser"
        >
          <v-icon
            large
            :color="
              warningList.length == 0 ? 'grey' : switchColor ? 'brown' : 'red'
            "
          >
            mdi-alert-outline
          </v-icon>
        </v-btn>
      </template>
      <div>
        <v-card tile min-height="100vh">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title
              >Next to expire Products
              <v-icon large class="ml-3" color="white">
                mdi-alert-outline</v-icon
              ></v-toolbar-title
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="warningList"
              :items-per-page="15"
              class="elevation-1"
            >
              <template v-slot:[`item.expirationOn`]="{ item }">
                <v-icon :color="status(item.expirationOn).color">
                  {{ status(item.expirationOn).icon }}
                </v-icon>
                <template v-if="item.expirationOn >= 0">
                  {{ item.expirationOn }} days left</template
                >
                <template v-else> Expired! </template>
              </template>
              <template v-slot:[`item.image_url`]="{ item }">
                <v-btn icon @click="showImage(item)"
                  ><v-icon>mdi-eye</v-icon></v-btn
                >
              </template></v-data-table
            >
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
export default {
  props: ["activeUser", "warningList"],
  data: () => ({
    switchColor: false,
    dialog: false,
    showingImage: false,
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
