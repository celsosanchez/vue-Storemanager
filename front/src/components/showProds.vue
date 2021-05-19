<template>
  <div>
    <v-row justify="center">
      <v-col>
        <v-card>
          <v-card-title>
            Add New Product
          </v-card-title>
          <v-card-actions class="ma-5">
            <v-autocomplete
              v-model="chosenProduct"
              :items="possibleProducts"
              label="Name"
            ></v-autocomplete
            ><v-btn icon @click="showSelected" color="blue">
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
          <div class="d-flex justify-start ">
            <v-card-actions>
              <v-text-field
                v-model="amount"
                :rules="rules"
                label="Amount"
                hide-details="auto"
                class="ma-6 pd-6"
              ></v-text-field>
              <v-text-field
                v-model="duration"
                label="Duration"
                hide-details="auto"
              ></v-text-field>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col>
        <div v-if="items.length == 0">
          <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
          ></v-progress-circular>
        </div>
        <v-card elevation="3" v-if="items.length !== 0">
          <v-card-title>
            Products

            <v-spacer></v-spacer>
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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    chosenProduct: "",
    duration: "",
    amount: "",

    search: "",
    selected: [],
    possibleProducts: ["La pizza du moulin"],
    rules: [(value) => !!value || "Required."],
    singleSelect: false,
    headers: [
      {
        text: "Product",
        align: "start",
        sortable: false,
        value: "product_name",
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Brands", value: "brands" },
      { text: "Location", value: "location" },
      { text: "Production", value: "production_datetime" },
      { text: "Expiration", value: "expiration_datetime" },
    ],
    items: [],
  }),
  methods: {
    getData() {
      axios.get("http://192.168.31.175:3000/products").then((res) => {
        this.items = res.data.found;
        this.items.forEach((element) => {
          var receivedExp = new Date(element.expiration_datetime);
          var receivedprod = new Date(element.production_datetime);
          element.expiration_datetime = `${receivedExp.getFullYear()}/${receivedExp.getMonth() +
            1}/${receivedExp.getDate()}`;
          element.production_datetime = `${receivedprod.getFullYear()}/${receivedprod.getMonth() +
            1}/${receivedprod.getDate()}`;
        });
      });
    },
    sendData() {
      axios
        .put("http://192.168.31.175:3000/producer", {
          product: this.chosenProduct,
          duration_in_days: this.duration,
          amount: this.amount,
        })
        .then((res) => {
          console.log(res);
        });
    },
    showSelected() {
      console.log(this.selected);
    },
  },

  created() {
    this.getData();
  },
};
</script>

<style></style>
