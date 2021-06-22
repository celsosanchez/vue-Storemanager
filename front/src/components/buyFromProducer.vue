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
          @click="loadData"
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
          :disabled="!activeUser"
        >
          <v-icon large color="green">
            mdi-shopping-outline
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
              >Buy directly from Producer
              <v-icon large class="ml-3" color="white">
                mdi-shopping
              </v-icon></v-toolbar-title
            >
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-row class="ma-1">
            <v-col>
              <v-row>
                <v-col>
                  <shopping-list
                    max-width="30vw"
                    ref="shoppingList"
                    :activeUser="activeUser"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-toolbar-title>
                        <v-icon large class="ml-3" color="white">
                          mdi-electron-framework
                        </v-icon>
                        Recommendations
                      </v-toolbar-title>
                    </v-toolbar>
                    <template v-if="!loading_Recommendation">
                      <v-chip
                        class="ma-4"
                        v-for="item in recommendations"
                        :key="item"
                        outlined
                        >{{ item }}</v-chip
                      >
                    </template>
                    <template v-if="loading_Recommendation">
                      <v-progress-circular
                        class=" ma-5"
                        indeterminate
                        color="purple"
                      ></v-progress-circular>
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <producer-buy
                :url="`http://${url}/products`"
                :location="`Producer`"
                :activeUser="activeUser"
              />
            </v-col>
          </v-row>
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
import ProducerBuy from "./ProducerBuy.vue";
import ShoppingList from "./ShoppingList.vue";
import config from "../../config";
import axios from "axios";
export default {
  components: { ProducerBuy, ShoppingList },
  props: ["warningList", "activeUser"],
  data: () => ({
    switchColor: false,
    dialog: false,
    url: `${config.server.address}`,
    showingImage: false,
    showingImageName: "",
    recommendations: [],
    loading_Recommendation: true,
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
    loadData() {
      if (this.$refs.shoppingList) {
        this.$refs.shoppingList.getData();
        console.log(`calling getData`);
      }
    },
    getRecommendations() {
      this.loading_Recommendation = true;
      this.recommendations = [];
      setTimeout(() => {
        let lh = this.$refs.shoppingList.items;
        let lh_products = [];
        lh.forEach((lh) => {
          if (lh.Categories) {
            let processing = lh.Categories;
            processing = processing.replaceAll(",", " ").split(" ");
            processing.forEach((element) => {
              element = element.slice(0, -1);
              if (!lh_products.find((item) => item == element)) {
                lh_products.push(element);
              }
            });
          }
        });
        lh_products.forEach((element) => {
          let productsData = [];
          productsData.push(element);
          axios
            .post(`http://recommend:5000/api/associations`, productsData)
            .then((res) => {
              if (res.data.data[0] != "" && res.data.data[0] != undefined) {
                if (!this.recommendations.find((item) => item == res.data.data[0])) 
                {
                  let words = res.data.data[0];
                  if (words.includes(",")) {
                    words = words.split(",");
                    words.forEach((word) => {
                      if (!this.recommendations.find((item) => item == word)) this.recommendations.push(word);
                    });
                  } else {
                    this.recommendations.push(words);
                  }
                }
              }
            });
        });
        console.log(` recommendations : ${this.recommendations}`);
        this.loading_Recommendation = false;
      }, "500");
    },
    closeDialog() {
      this.$parent.$parent.$parent.reload();
      this.dialog = false;
    },
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
