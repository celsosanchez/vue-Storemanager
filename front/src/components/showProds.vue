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
              :search-input.sync="chosenProduct"
              :items="possibleProducts"
              label="Name"
            ></v-autocomplete
            ><v-btn icon @click="sendData" color="blue">
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
    chosenProduct: null,
    duration: "",
    amount: "",
    watching: null,
    name: ["ff", "UU", "CC"],
    search: "",
    selected: [],
    possibleProducts: [],
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
        .then(() => {
          this.getData();
        });
    },
    showSelected() {
      console.log(this.selected);
    },
  },

  created() {
    this.getData();
  },
  mounted() {},
  watch: {
    chosenProduct(value) {
      fetch(
        `https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-food-facts-products%40public&q=product_name%3A${value}&rows=10000&facet=creator&facet=created_datetime&facet=packaging_tags&facet=brands_tags&facet=categories_tags&facet=categories_fr&facet=origins_tags&facet=manufacturing_places_tags&facet=labels_tags&facet=labels_fr&facet=cities_tags&facet=countries_tags&facet=allergens&facet=traces_tags&facet=additives_n&facet=additives_tags&facet=ingredients_from_palm_oil_n&facet=ingredients_that_may_be_from_palm_oil_n&facet=nutrition_grade_fr&facet=pnns_groups_1&facet=pnns_groups_2&facet=main_category&facet=energy_100g&facet=fat_100g&facet=sugars_100g&refine.origins_tags=france`
      )
        .then((res) => res.json())
        .then((res) => {
          var receivedNames = [];
          res.records.forEach((el) => {
            receivedNames.push(el.fields.product_name);
          });
          this.possibleProducts = receivedNames;
        });
    },
  },
};
</script>

<style></style>
