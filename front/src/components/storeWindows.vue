<template>
  <v-row align="center">
    <v-item-group v-model="window" mandatory>
      <v-item v-for="n in length" :key="n" v-slot="{ active, toggle }">
        <div>
          <v-btn
            class="mt-5 ml-1"
            :color="active ? `blue` : `grey`"
            icon
            large
            @click="
              toggle();
              active ? '' : reload(n);
            "
          >
            <v-icon>{{ icons[n] }}</v-icon>
          </v-btn>
        </div>
      </v-item>
    </v-item-group>
    <v-col>
      <v-window v-model="window" class="elevation-1" vertical>
        <v-window-item>
          <v-card flat min-height="70vh">
            <!-- <v-card-text> asd</v-card-text> -->
            <v-row class="ma-3">
              <v-col xs="2" md="2" xl="2">
                <v-btn @click="showRec">caca</v-btn>
                <user-selector ref="UserSelector" />
              </v-col>
            </v-row>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <strong class="text-h6">{{ store }}'s Sheleves</strong>
                <v-spacer></v-spacer>
                <v-btn v-if="add" icon @click="add = !add"
                  ><v-icon>mdi-minus</v-icon></v-btn
                >
                <v-btn v-if="!add" icon @click="addDialog">
                  <v-icon>mdi-plus</v-icon></v-btn
                >
                <v-card-text>
                  <shelves ref="shelves" :store="store" />
                </v-card-text>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <product-data
                :url="url"
                :location="store"
                ref="productData"
                :customHeaders="customHeaders"
                ><template v-slot:tableTitle>
                  <h3>{{ store }} Storage</h3>
                  <v-icon large class="pl-3" color="blue"
                    >mdi-package-variant-closed</v-icon
                  >
                  <v-spacer></v-spacer>
                  <v-btn icon @click="sendToSelves" :disabled="isSelected()">
                    <v-icon large color="green">mdi-tray-full</v-icon></v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn icon @click="takeFromSelves" :disabled="isSelected()">
                    <v-icon large color="red">mdi-tray</v-icon></v-btn
                  >
                  <v-spacer></v-spacer>
                  <expiration-warning
                    :activeUser="store"
                    :warningList="expiredWarning"
                  />
                </template>
              </product-data>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" :multi-line="multiLine">
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
              <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mt-4" align="center">
                <v-icon class="ml-4 " color="teal">mdi-cube-send</v-icon>
                <strong class="text-h6 ml-3"
                  >{{ store }}'s Active Orders</strong
                >
              </v-row>
            </v-card-text>
            <active-orders ref="activeOrders" :location="store" :url="url" />
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <v-icon large color="blue" class="mr-4">mdi-warehouse</v-icon>
                <strong class="text-h6">{{ store }}'s Providers</strong>
              </v-row>
              <producer-buy
                :url="url"
                :location="`Producer`"
                :activeUser="store"
              />
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-col>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          New Shelf
        </v-card-title>

        <v-card-text>
          <div>
            <v-text-field v-model="shelfname">
              <template v-slot:label>
                Name the new shelf
                <v-icon style="vertical-align: middle">
                  mdi-pencil
                </v-icon>
              </template>
            </v-text-field>
          </div>
        </v-card-text>

        <v-divider></v-divider>
        <v-overlay :absolute="true" :value="overlay">
          <v-card theme="dark">
            <v-card-title>
              Please enter a name with at least 4 characters
            </v-card-title>
            <v-card-text>
              <v-btn color="orange lighten-2" @click="overlay = false">
                ok!
              </v-btn>
            </v-card-text>
          </v-card>
        </v-overlay>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="callAddShelf">
            Add Shelf
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import ExpirationWarning from "./ExpirationWarning.vue";
import ProducerBuy from "./ProducerBuy.vue";
import ProductData from "./ProductData.vue";
import config from "../../config";
import ActiveOrders from "./ActiveOrders.vue";
import Shelves from "./Shelves.vue";
import UserSelector from "./UserSelector.vue";
export default {
  components: {
    ProducerBuy,
    ProductData,
    ExpirationWarning,
    ActiveOrders,
    Shelves,
    UserSelector,
  },
  name: "storeWindows",
  props: ["store"],
  data: () => ({
    customHeaders: [
      {
        text: "Product",
        align: "start",
        sortable: false,
        value: "product_name",
      },
      { text: "In Shelves", value: "inShelves" },
      { text: "Expiration Status", value: "expirationIn" },
      { text: "Details", value: "detail" },
      { text: "Brands", value: "brands" },
      { text: "Production", value: "production_datetime" },
      { text: "Expiration", value: "expiration_datetime" },
    ],
    shelfname: "",
    multiLine: true,
    snackbar: false,
    snackbarText: `I'm a multi-line snackbar.`,
    dialog: false,
    overlay: false,
    add: false,
    shelves: [],
    expiredWarning: [],
    productDatafinishedLoad: false,
    url: `http://${config.server.address}/products`,
    length: 5,
    icons: [
      ``,
      `mdi-store`,
      `mdi-library-shelves`,
      `mdi-package-variant-closed`,
      `mdi-truck`,
      `mdi-warehouse`,
    ],
    window: 0,
  }),
  watch: {
    productDatafinishedLoad() {
      this.currentItems = this.$refs.productData.items;

      this.expiredWarning = [];
      this.currentItems.forEach((element) => {
        var expiration = new Date(element.expiration_datetime);
        element.expirationIn = Math.round((expiration - Date.now()) / 86400000);
        if (element.expirationIn < 3) {
          const soonExpires = {
            name: element.product_name,
            producer: element.brands,
            expirationOn: element.expirationIn,
            image_url: element.image_url,
          };
          this.expiredWarning.push(soonExpires);
        }
      });
    },
  },
  methods: {
    sendToSelves() {
      let ids = [];
      this.snackbarText = "";
      let names = "";
      this.$refs.productData.selected.forEach((item) => {
        if (item.inShelves == false || item.inShelves == undefined) {
          ids.push(item._id);
          item.inShelves = true;
          if (names.length == 0) names = item.product_name;
          else names += `, ` + item.product_name;
        }
      });
      if (ids.length > 0) {
        axios.put(`http://${config.server.address}/ProductToShelf`, {
          productIds: ids,
          storeName: this.store,
        });
        this.snackbarText = `Adding to Shelves: ${names} `;
      } else this.snackbarText = `No products added to shelves`;

      this.snackbar = true;
      this.$refs.productData.selected = [];
    },
    takeFromSelves() {
      let ids = [];
      this.snackbarText = "";
      let names = "";
      this.$refs.productData.selected.forEach((item) => {
        if (item.inShelves == true || item.inShelves == undefined) {
          ids.push(item._id);
          item.inShelves = false;
          if (names.length == 0) names = item.product_name;
          else names += `, ` + item.product_name;
        }
      });
      if (ids.length > 0) {
        axios.put(`http://${config.server.address}/ProductFromShelf`, {
          productIds: ids,
          storeName: this.store,
        });
        this.snackbarText = `Removing from Shelves: ${names} `;
      } else this.snackbarText = `No products removed from shelves`;

      this.snackbar = true;
      this.$refs.productData.selected = [];
    },
    isSelected() {
      if (this.$refs.productData) {
        return this.$refs.productData.selected.length > 0 ? false : true;
      } else return true;
    },

    reload(n) {
      switch (n) {
        case 2:
          if (this.$refs.shelves) this.$refs.shelves.getData();
          break;
        case 3:
          if (this.$refs.productData) this.$refs.productData.getData();
          break;
        case 4:
          if (this.$refs.activeOrders) this.$refs.activeOrders.getData();
          break;

        default:
          break;
      }
    },
    showRec() {
      console.log(this.$refs.UserSelector.recommendations)
    },
    callAddShelf() {
      if (this.shelfname.length > 3) {
        this.dialog = false;
        this.$refs.shelves.addShelf(this.shelfname);
        this.shelfname = "";
      } else {
        this.overlay = true;
      }
    },
    addDialog() {
      this.dialog = !this.dialog;
      this.shelfname = "";
    },
  },
  computed: {},
};
</script>

<style></style>
