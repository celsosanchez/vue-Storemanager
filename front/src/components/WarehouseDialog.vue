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
          @click="getData"
          :disabled="!activeUser"
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon large>
           mdi-warehouse
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
              >Desired stock
              <v-icon class="ml-3" color="white">mdi-warehouse</v-icon></v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="save()">
                Save
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-row no-gutters>
            <v-col cols="12" md="8">
              <v-card align="left" min-height="35vh" max-height="35vh">
                <v-card-title>
                  Add New Product
                </v-card-title>
                <v-col cols="12" sm="10">
                  <v-card-actions
                    class=" d-flex justify-space-around  ml-7 ma-5"
                  >
                    <v-autocomplete
                      v-model="autocomplete"
                      :search-input.sync="chosenProduct"
                      :loading="LoadingAutocomplete"
                      hide-no-data
                      :items="possibleProducts"
                      label="Name"
                    ></v-autocomplete>
                  </v-card-actions>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-card-actions class="ml-8 mr-8">
                    <v-text-field
                      v-model="amount"
                      class="mb-6"
                      label="Amount"
                      hide-details="auto"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      large
                      x-large
                      @click="addToList"
                      color="blue"
                      class="ml-10"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-col>
                <v-overlay :absolute="true" :value="overlay">
                  <v-btn color="orange lighten-2" @click="overlay = false">
                    type a valid input
                  </v-btn>
                </v-overlay>
              </v-card>
            </v-col>

            <v-col>
              <v-expand-x-transition align="right">
                <v-card
                  v-if="autocomplete"
                  class="blue lighten-5 d-flex"
                  min-height="35vh"
                  min-width="30vw"
                >
                  <v-spacer></v-spacer>
                  <div>
                    <v-card-title> Name</v-card-title>
                    <v-card-text>
                      {{ description.name }}
                    </v-card-text>
                  </div>
                  <v-spacer></v-spacer>
                  <div>
                    <v-card-title> Brand</v-card-title>
                    <v-card-text>
                      {{ description.producer }}
                    </v-card-text>
                  </div>
                  <v-spacer></v-spacer>
                  <div class=" ma-3">
                    <v-img
                      contain
                      max-height="200"
                      max-width="200"
                      :src="description.image_small_url"
                    ></v-img>
                  </div>
                </v-card>
              </v-expand-x-transition>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <desired-stock ref="DesiredStock" :activeUser="activeUser" />
        </v-card>
      </div>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from "axios";
import DesiredStock from "@/components/DesiredStock.vue";
// import ProductData from "@/components/ProductData.vue";
export default {
  components: {
    DesiredStock,
  },
  props: ["activeUser"],
  data: () => ({
    dialog: false,
    chosenProduct: null,
    currentList: [],
    amount: "",
    overlay: false,
    receivedElements: [],
    autocomplete: null,
    elevation: 2,
    possibleProducts: [],
    snackbar: false,
    LoadingAutocomplete: false,
    snackbarText: "",
  }),
  methods: {
    getData() {
      if (this.$refs.DesiredStock) {
        this.$refs.DesiredStock.getData();
      }
    },
    save() {
      axios
        .put("http://192.168.31.175:3000/users", {
          user: this.activeUser,
          list: this.$refs.DesiredStock.items,
        })
        .then(() => {
          this.dialog = false;
        });
    },
    addToDS() {
      const numberRegex = new RegExp("^[0-9]+$");
      if (numberRegex.test(this.amount) && this.chosenProduct !== null) {
        axios
          .put("http://192.168.31.175:3000/producer", {
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
    addToList() {
      const numberRegex = new RegExp("^[0-9]+$");
      if (numberRegex.test(this.amount) && this.chosenProduct !== null) {
        this.$refs.DesiredStock.items.push({
          name: this.description.name,
          Image: this.description.image_url,
          Producer: this.description.producer,
          Amount: parseInt(this.amount),
        });

        this.clearNewProduct();
      } else {
        this.overlay = true;
      }
    },
    clearNewProduct() {
      this.amount = "";

      this.chosenProduct = null;
      this.autocomplete = null;
    },
  },
  created() {
    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
  },

  computed: {
    description() {
      if (!this.autocomplete) return;
      return this.receivedNames.find(
        (element) => element.name == this.autocomplete
      );
    },
  },
  watch: {
    // activeUser(value) {
    //   console.log(value);
    // },
    chosenProduct(value) {
      this.LoadingAutocomplete = true;
      try {
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
              nameProd.image_url = el.fields.image_url;
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
