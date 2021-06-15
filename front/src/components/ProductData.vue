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
            <slot name="tableTitle"><h3>Products</h3></slot>
            <v-spacer></v-spacer>
            <div style="color: gray">{{ searchCounter }} items</div>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:[`activator`]="{ on, attrs }">
                <v-btn
                  icon
                  x-large
                  color="red"
                  :disabled="!deleteButton"
                  class="mr-5"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
              </template>

              <v-card>
                <v-card-title class="headline red lighten-2">
                  Confirm Deletion
                </v-card-title>
                <v-card-text class=" mt-3">
                  Confirm that you want to delete the following items:
                </v-card-text>
                <v-simple-table>
                  <template v-slot:[`default`]>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Product Name
                        </th>
                        <th class="text-left">
                          Location
                        </th>
                        <th class="text-left">
                          Expiration date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in selected" :key="item.key">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.location }}</td>
                        <td>{{ item.expiration_datetime }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="confirmedDeletion">
                    Yes, I do want to Delete them.
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
            :items="items"
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
          </v-data-table>
        </v-card>
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
                <td v-if="key == 'first_packaging_code_geo' && value.length == 0">No Data</td>
                 <td v-if="key == 'first_packaging_code_geo' && value.length != 0" align="center">
                
                  
                  <GmapMap
                    :center="{lat: value[0], lng: value[1]}"
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
                      :position="{lat: value[0], lng: value[1]}"
                      :clickable="false"
                      :draggable="false"
                      @click="center = {lat: value[0], lng: value[1]}"
                    />
                  </GmapMap>
                </td>
                <td v-if="key != 'first_packaging_code_geo' && key != 'image_url'">{{ value }}</td>
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
export default {
  components: {},
  props: ["url", "location"],
  data: () => ({
    showingItem: null,
    dataDetail: false,
    elevation: 2,
    search: "",
    loading: false,
    dialog: false,
    selected: [],
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
    ],
    items: [],
  }),
  methods: {
    counter(pagination) {
      this.searchCounter = pagination.itemsLength;
    },
    getData(location = this.location) {
      if (location) {
        this.loading = true;
        axios.post(this.url, { location: location }).then((res) => {
          this.items = res.data.found;
          if (this.items) this.loading = false;
          this.items.forEach((element) => {
            var receivedExp = new Date(element.expiration_datetime);
            var receivedprod = new Date(element.production_datetime);
            element.expiration_datetime = `${receivedExp.getFullYear()}/${receivedExp.getMonth() +
              1}/${receivedExp.getDate()}`;
            element.production_datetime = `${receivedprod.getFullYear()}/${receivedprod.getMonth() +
              1}/${receivedprod.getDate()}`;
            element.expirationIn = Math.round(
              (receivedExp - Date.now()) / 86400000
            );
          });
          this.loading = false;
        });
      }
    },
    confirmedDeletion() {
      this.selected.forEach(async (element, index, array) => {
        await axios
          .delete("http://192.168.31.175:3000/producer", {
            data: {
              productName: element.product_name,
              amount: 1,
              location: element.location,
            },
          })
          .then(() => {
            if (index == array.length - 1) {
              this.selected = [];
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
    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
  },
  mounted() {
    this.getData();
  },
  // renderTriggered() { this.getData();},
  computed: {
    deleteButton() {
      if (this.selected.length == 0) return false;
      else return true;
    },
  },
  watch: {
    items() {
      this.$parent.productDatafinishedLoad = !this.$parent
        .productDatafinishedLoad;
    },
  },
};
</script>
<style></style>
