<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="6" sm="12">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2">
            <v-card-title>
              Select User
            </v-card-title>
            <v-card-actions class="ma-5">
              <v-autocomplete
                v-model="autocomplete"
                :search-input.sync="chosenUser"
                :loading="loading"
                :items="possibleUsers"
                label="email"
              ></v-autocomplete>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
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
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <div>
            <v-card :elevation="hover ? 12 : 2" v-if="items.length !== 0">
              <v-card-title>
                My Fridge
                <v-icon color="blue" class="pl-2">mdi-fridge</v-icon>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" width="500">
                  <template v-slot:activator="{ on, attrs }">
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
                      <template v-slot:default>
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
                <template v-slot:item.expirationIn="{ item }">
                  <v-icon :color="status(item.expirationIn).color">
                    {{ status(item.expirationIn).icon }}
                  </v-icon>
                  {{ item.expirationIn }} days left
                </template>

                <template v-slot:item.detail="{ item }">
                  <v-btn icon @click="showDetails(item)"
                    ><v-icon>mdi-eye</v-icon></v-btn
                  >
                </template>
              </v-data-table>
            </v-card>
          </div>
        </v-hover>
      </v-col>
      <v-snackbar v-model="snackbar" timeout="2000">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>

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
          <template v-slot:default>
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
                <td v-else>{{ value }}</td>
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
// import qs from "qs";
export default {
  data: () => ({
    chosenUser: null,
    duration: "",
    showingItem: null,
    amount: "",
    dataDetail: false,
    overlay: false,
    receivedElements: [],
    autocomplete: null,
    elevation: 2,
    search: "",
    loading: false,
    dialog: false,
    selected: [],
    possibleUsers: [],
    singleSelect: false,
    snackbar: false,
    // LoadingAutocomplete: false,
    snackbarText: "",
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
      // { text: "Location", value: "location" },
      { text: "Production", value: "production_datetime" },
      { text: "Expiration", value: "expiration_datetime" },
    ],
    items: [],
  }),
  methods: {
    getData() {
      this.loading = true;
      console.log(this.currentUser)
      axios
        .post("http://192.168.31.175:3000/products", { location: this.currentUser })
        .then((res) => {
          this.items = res.data.found;
          if (this.items) this.loading = false;
          this.items.forEach((element) => {
            var receivedExp = new Date(element.expiration_datetime);
            var receivedprod = new Date(element.production_datetime);
            element.expiration_datetime = `${receivedExp.getFullYear()}/${receivedExp.getMonth() +
              1}/${receivedExp.getDate()}`;
            element.production_datetime = `${receivedprod.getFullYear()}/${receivedprod.getMonth() +
              1}/${receivedprod.getDate()}`;
            this.loading = false;
          });
        });

     
    },
    // sendData() {
    //   const numberRegex = new RegExp("^[0-9]+$");
    //   if (
    //     numberRegex.test(this.amount) &&
    //     numberRegex.test(this.duration) &&
    //     this.chosenProduct !== null
    //   ) {
    //     axios
    //       .put("http://192.168.31.175:3000/producer", {
    //         product: this.chosenProduct,
    //         duration_in_days: this.duration,
    //         amount: this.amount,
    //       })
    //       .then(() => {
    //         this.snackbarText = `${this.amount} units of ${this.chosenProduct} have been added successfully!`;
    //         this.snackbar = true;
    //         this.clearNewProduct();
    //         this.getData();
    //       });
    //   } else {
    //     this.overlay = true;
    //   }
    // },
    // clearNewProduct() {
    //   this.amount = "";
    //   this.duration = "";
    //   this.chosenProduct = null;
    //   this.autocomplete = null;
    // },
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
    },
  },
  created() {
     axios.post(`http://192.168.31.175:3000/users`).then((res) => {
        // this.receivedNames = [];
        this.possibleUsers = [];
        res.data.found.forEach((el) => {
          // this.receivedNames.push(nameProd);
          this.possibleUsers.push(el.email);
        });
      });

    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
  },
  mounted() {},
  computed: {
    // currentUser() {
    //   if (!this.autocomplete) return;
    //   return this.possibleUsers.find(
    //     (element) => element.name == this.autocomplete
    //   );
    // },
    deleteButton() {
      if (this.selected.length == 0) return false;
      else return true;
    },
  },
  watch: {
    autocomplete(value){
      this.currentUser = value
      this.getData()
    }
    // chosenUser(value) {
    //   axios
    //     .post(`http://192.168.31.175:3000/users` )
    //     .then((res) => {
    //       // this.receivedNames = [];
    //       this.possibleUsers = [];
    //       res.data.found.forEach((el) => {
    //         // this.receivedNames.push(nameProd);
    //         this.possibleUsers.push(el.name);
    //       });
    //       console.log(this.possibleUsers);
    //     });
    // },
  },
};
</script>
<style></style>
