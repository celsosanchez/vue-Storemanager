<template>
  <div>
    <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
      <div>
        <div v-if="loading">
          <v-sheet
            :color="`grey ${false ? 'darken-2' : 'lighten-4'}`"
            class="pa-3"
          >
            <v-skeleton-loader
              class="mx-auto"
              type="article, article,article"
            ></v-skeleton-loader>
          </v-sheet>
        </div>
        <v-card :elevation="hover ? 12 : 2" v-if="!loading">
          <v-card-title>
            <slot name="tableTitle"><h3>Products in your cart</h3></slot>
            <v-spacer></v-spacer>
            <div style="color: gray">{{ searchCounter }} items</div>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-3"
              icon
              color="red"
              :disabled="!delButton"
              @click="takeFromCart"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title class="headline green lighten-2">
                  Confirm Cart
                </v-card-title>
                <v-card-text class=" mt-3">
                  Confirm that {{ activeUser }} want to buy the following items:
                  <!-- and that {{activeUser}} resides at lat {{buyerData[0]}} , long {{buyerData[1]}}  -->
                </v-card-text>
                <v-simple-table>
                  <template v-slot:[`default`]>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Product Name
                        </th>
                        <th class="text-left">
                          Brand
                        </th>
                        <th class="text-left">
                          Expiration date
                        </th>
                        <th class="text-left">
                          Product Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cart" :key="item.key">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.brands }}</td>
                        <td>{{ item.expiration_datetime }}</td>
                        <td>
                          <div>
                            {{ item.price
                            }}<v-icon small>mdi-currency-eur</v-icon>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-divider></v-divider>
                <v-card-actions class="text-caption" align="center" justify="center">
                  <v-icon color="green darken-2">mdi-nature-people</v-icon><div class="mt-2 ml-2">Aproximate carbon footprint: {{ (check*0.584).toFixed(2) }} kg CO2eq.</div>
                  <v-spacer></v-spacer>
                   
                </v-card-actions>
                <v-card-actions style="background-color: #B9F6CA;">
                  Total: {{ check }}<v-icon small>mdi-currency-eur</v-icon>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="confirmedBuy">
                    Yes, I do.
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table
            @pagination="counter"
            :headers="headers"
            :items="cart"
            v-model="selected"
            :search="search"
            :single-select="singleSelect"
            item-key="_id"
            show-select
            :items-per-page="15"
            class="elevation-4"
          >
            <template v-slot:[`item.expirationIn`]="{ item }">
              <v-icon :color="status(item.expirationIn).color">
                {{ status(item.expirationIn).icon }}
              </v-icon>
              <template v-if="item.expirationIn >= 0">
                {{ item.expirationIn }} days left</template
              >
              <template v-else> Expired! </template>
            </template>
            <template v-slot:[`item.detail`]="{ item }">
              <v-btn icon @click="showDetails(item)"
                ><v-icon>mdi-eye</v-icon></v-btn
              >
            </template>
            <template v-slot:[`item.price`]="{ item }">
              {{ item.price }}
              <v-icon small>mdi-currency-eur</v-icon>
            </template>
          </v-data-table>
        </v-card>
        <v-row>
          <v-col>
            <v-card class="ma-4">
              <v-btn
                icon
                x-large
                large
                color="blue"
                class="mr-5"
                @click="addToCart()"
                ><v-icon x-large large>mdi-cellphone-nfc</v-icon></v-btn
              ></v-card
            >
          </v-col>
          <v-col>
            <v-card class="ma-4">
              <v-btn
                icon
                x-large
                large
                color="green"
                class="mr-5"
                @click="dialog = !dialog"
                ><v-icon x-large large>mdi-cash-register</v-icon></v-btn
              ></v-card
            >
          </v-col>
        </v-row>
      </div>
    </v-hover>
    <v-dialog v-model="dataDetail" scrollable persistent>
      <!-- max-width="290" -->
      <v-card>
        <v-card-title class="headline">
          Product Details
          <v-btn
            color="red darken-1"
            class="ml-5"
            text
            @click="dataDetail = false"
          >
            Close
          </v-btn>
        </v-card-title>
        <v-simple-table>
          <template v-slot:[`default`]>
            <thead>
              <tr>
                <th class="text-center font-weight-black ">
                  Characteristic
                </th>
                <th class="text-center font-weight-black">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) of showingItem" :key="key">
                <td>{{ key }}</td>
                <td v-if="key == 'image_url'" align="center">
                  <v-img contain max-width="300" :src="value"></v-img>
                </td>
                <td
                  v-if="key == 'first_packaging_code_geo' && value.length == 0"
                >
                  No Data
                </td>
                <td
                  v-if="key == 'first_packaging_code_geo' && value.length != 0"
                  align="center"
                >
                  <GmapMap
                    :center="{ lat: 48.1300245, lng: -1.6846513 }"
                    :zoom="6"
                    map-type-id="roadmap"
                    style="width: 300px; height: 300px"
                    :options="{
                      fullscreenControl: false,
                      mapTypeControl: false,
                      disableDefaultUI: true,
                    }"
                  >
                    <GmapMarker
                      :position="{ lat: value[0], lng: value[1] }"
                      :clickable="false"
                      :draggable="false"
                      @click="center = { lat: value[0], lng: value[1] }"
                    />
                  </GmapMap>
                </td>

                <td
                  v-if="key != 'first_packaging_code_geo' && key != 'image_url'"
                >
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from "axios";
import config from "../../config";
export default {
  components: {},
  props: ["url", "location", "activeUser"],
  data: () => ({
    users: {
      Lidl: [48.1300245, -1.6846513],
      Leclerc: [48.13895658009878, -1.6841002289588716],
      Carrefour: [48.08314411074984, -1.6808428178615393],
      finalUser: [48.10900237897419, -1.671035955175149],
    },
    showingItem: null,
    dataDetail: false,
    elevation: 2,
    search: "",
    loading: false,
    dialog: false,
    selected: [],
    cart: [],
    singleSelect: false,
    searchCounter: 0,
    headers: [
      {
        text: "Product",
        align: "start",
        sortable: false,
        value: "product_name",
      },
      { text: "Expiration Status", value: "expirationIn" },
      { text: "Details", value: "detail" },
      { text: "Brands", value: "brands" },
      { text: "Production", value: "production_datetime" },
      { text: "Expiration", value: "expiration_datetime" },
      { text: "Price", value: "price" },
    ],
    items: [],
  }),
  methods: {
    addToCart() {
      if (this.items.length > 0) {
        console.log(this.items);
        const pos = Math.floor(Math.random() * this.items.length);
        this.cart.push(this.items[pos]);
        this.items.splice(pos, 1);
      } else {
        console.log(`there's no products left`);
      }
    },
    takeFromCart() {
      this.cart.forEach((el, ind) => {
        this.selected.forEach((item, index) => {
          if (item._id == el._id) {
            this.items.push(this.cart[ind]);
            this.cart.splice(ind, 1);
            this.selected.splice(index, 1);
          }
        });
      });
      this.selected = [];
    },

    counter(pagination) {
      this.searchCounter = pagination.itemsLength;
    },
    getData(location = this.location) {
      if (location) {
        this.loading = true;

        axios
          .post(this.url, { location: location, inShelves: "true" })
          .then((res) => {
            this.items = res.data.found;
            if (this.items) this.loading = false;
            this.items.forEach((element) => {
              element.exp = element.expiration_datetime;
              element.prod = element.production_datetime;
              var receivedExp = new Date(element.expiration_datetime);
              var receivedprod = new Date(element.production_datetime);
              // console.log(receivedprod);
              element.expiration_datetime = `${receivedExp.getFullYear()}/${receivedExp.getMonth() +
                1}/${receivedExp.getDate()}`;
              element.production_datetime = `${receivedprod.getFullYear()}/${receivedprod.getMonth() +
                1}/${receivedprod.getDate()}`;
              element.expirationIn = Math.round(
                (receivedExp - Date.now()) / 86400000
              );
              // element.price = Math.floor(Math.random() * 21);
              element.price = (Math.random() * 21).toFixed(2);
            });
            this.loading = false;
          });
      }
    },
    // check(){

    // },
    confirmedBuy() {
      this.cart.forEach(async (element, index, array) => {
        console.log(`confirmed buy this.location`)
        console.log(this.location)
        await axios
          .patch(`http://${config.server.address}/storeBuy`, {
            data: {
              productId: element._id,
              buyer: this.activeUser,
              location: this.location
            },
          })
          .then(() => {
            if (index == array.length - 1) {
              this.selected = [];
              this.cart = [];
              this.getData();
              this.dialog = false;
            }
          });
      });
    },
    showDetails(item) {
      this.showingItem = item;
      this.dataDetail = true;
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
  },
  created() {
    this.getData();
    // console.log(config)
    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
  },
  mounted() {},
  computed: {
    check() {
      let total = 0;
      this.cart.forEach((el) => {
        total += parseFloat(el.price);
      });
      return total.toFixed(2);
    },
    delButton() {
      if (this.selected.length == 0) return false;
      else return true;
    },
    buyerData() {
      switch (this.activeUser) {
        case "Lidl":
          return this.users.Lidl;
        case "Leclerc":
          return this.users.Leclerc;
        case "Carrefour":
          return this.users.Carrefour;
        default:
          return this.users.finalUser;
      }
    },
  },
  watch: {
    // items() {
    //   console.log(`calling`)
    //   console.log(this.$parent.productDatafinishedLoad)
    //   this.$parent.productDatafinishedLoad = !this.$parent
    //     .productDatafinishedLoad;
    // },
  },
};
</script>
<style></style>
