<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="6" sm="12">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" class="mt-6">
            <v-card-title>
              Add New Product
            </v-card-title>
            <v-card-actions class=" d-flex justify-space-around  ma-5">
              <v-autocomplete
                v-model="autocomplete"
                :search-input.sync="chosenProduct"
                :loading="LoadingAutocomplete"
                hide-no-data
                :items="possibleProducts"
                label="Name"
              ></v-autocomplete
              ><v-btn icon large x-large @click="sendData()" color="blue">
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-text-field
                v-model="amount"
                class="ml-6"
                label="Amount"
                hide-details="auto"
              ></v-text-field>
              <v-text-field
                v-model="duration"
                class="ma-6 pd-6"
                label="Duration"
                hide-details="auto"
              ></v-text-field>

              <v-btn icon large x-large class="mr-6" color="blue"
                ><v-icon>mdi-barcode-scan</v-icon></v-btn
              >
            </v-card-actions>
            <v-overlay :absolute="true" :value="overlay">
              <v-btn color="orange lighten-2" @click="overlay = false">
                type a valid input
              </v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-col>
      <v-col>
        <v-expand-x-transition align="right">
          <v-list v-if="autocomplete" class="green lighten-5 ma-5">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Product Name</v-list-item-title>
                <v-list-item-subtitle
                  v-text="description.name"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Producer(s)</v-list-item-title>
                <v-list-item-subtitle
                  v-text="description.producer"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Image</v-list-item-title>
                <div class="d-flex justify-center mt-3">
                  <v-img
                    contain
                    max-height="200"
                    max-width="200"
                    :src="description.image_small_url"
                  ></v-img>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list> </v-expand-x-transition
      ></v-col>
    </v-row>
    <v-row justify="center">
      <v-col> </v-col>
      <v-snackbar v-model="snackbar" timeout="2000">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
    <v-dialog v-model="scannerDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Product Scanner
          <v-btn
            color="red darken-1"
            class="ml-5"
            text
            @click="scannerDialog = false"
          >
            Close
          </v-btn>
        </v-card-title>
        <div id="decoder"></div>
      </v-card>
    </v-dialog>

    <ProductData
      ref="productData"
      :url="url"
      :location="`Producer`"
    />
  </div>
</template>
<script>
import axios from "axios";
import config from '../../config'
import ProductData from "@/components/ProductData.vue";
export default {
  components: {
    ProductData,
  },
  data: () => ({
    chosenProduct: null,
    duration: "",
    url: `http://${config.server.address}/products`,
    amount: "",
    overlay: false,
    receivedElements: [],
    autocomplete: null,
    elevation: 2,
    loading: false,
    scannerDialog: false,
    possibleProducts: [],
    snackbar: false,
    LoadingAutocomplete: false,
    snackbarText: "",
  }),
  methods: {
    sendData() {
      const numberRegex = new RegExp("^[0-9]+$");
      if (
        numberRegex.test(this.amount) &&
        numberRegex.test(this.duration) &&
        this.chosenProduct !== null
      ) {
        axios
          .put(`http://${config.server.address}/producer`, {
            product: this.chosenProduct,
            duration_in_days: this.duration,
            amount: this.amount,
          })
          .then(() => {
            this.snackbarText = `${this.amount} units of ${this.chosenProduct} have been added successfully!`;
            this.snackbar = true;
            this.clearNewProduct();
            this.$refs.productData.getData();
          });
      } else {
        this.overlay = true;
      }
    },

    clearNewProduct() {
      this.amount = "";
      this.duration = "";
      this.chosenProduct = null;
      this.autocomplete = null;
    },
  },
  created() {
    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
  },
  mounted() {},
  computed: {
    description() {
      if (!this.autocomplete) return;
      return this.receivedNames.find(
        (element) => element.name == this.autocomplete
      );
    },
  },
  watch: {
    chosenProduct(value) {
      try {
        this.LoadingAutocomplete = true;
        fetch(
          // `https://data.opendatasoft.com/explore/embed/dataset/open-food-facts-products@public/table/?disjunctive.created_datetime&disjunctive.packaging_tags&disjunctive.brands_tags&disjunctive.categories_tags&disjunctive.origins_tags&disjunctive.manufacturing_places_tags&disjunctive.labels_tags&disjunctive.cities_tags&disjunctive.countries_tags&disjunctive.traces_tags&disjunctive.additives_tags&q=${value}&refine.countries_tags=en:france`
          // `https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-food-facts-products%40public&q=product_name%3A${value}&rows=10000&facet=creator&facet=created_datetime&facet=packaging_tags&facet=brands_tags&facet=categories_tags&facet=categories_fr&facet=origins_tags&facet=manufacturing_places_tags&facet=labels_tags&facet=labels_fr&facet=cities_tags&facet=countries_tags&facet=allergens&facet=traces_tags&facet=additives_n&facet=additives_tags&facet=ingredients_from_palm_oil_n&facet=ingredients_that_may_be_from_palm_oil_n&facet=nutrition_grade_fr&facet=pnns_groups_1&facet=pnns_groups_2&facet=main_category&facet=energy_100g&facet=fat_100g&facet=sugars_100g&refine.countries_tags=en:france`
          `https://data.opendatasoft.com/api/records/1.0/search/?dataset=open-food-facts-products%40public&q=product_name%3A${value}&rows=10000&facet=creator&facet=created_datetime&facet=packaging_tags&facet=brands_tags&facet=categories_tags&facet=categories_fr&facet=origins_tags&facet=manufacturing_places_tags&facet=labels_tags&facet=labels_fr&facet=cities_tags&facet=countries_tags&facet=allergens&facet=traces_tags&facet=additives_n&facet=additives_tags&facet=ingredients_from_palm_oil_n&facet=ingredients_that_may_be_from_palm_oil_n&facet=nutrition_grade_fr&facet=pnns_groups_1&facet=pnns_groups_2&facet=main_category&facet=energy_100g&facet=fat_100g&facet=sugars_100g&refine.origins_tags=france`
        )
          .then((res) => res.json())
          .then((res) => {
            this.receivedNames = [];
            this.possibleProducts = [];
            res.records.forEach((el) => {
              var nameProd = {};
              nameProd.name = el.fields.product_name;
              nameProd.producer = el.fields.brands;
              nameProd.image_small_url = el.fields.image_small_url;
              this.receivedNames.push(nameProd);
              this.possibleProducts.push(nameProd.name);
            });
            this.LoadingAutocomplete = false;
          });
      } catch (e) {
        console.log(`error: ${e}`);
      }
    },
  },
};
</script>
<style></style>
