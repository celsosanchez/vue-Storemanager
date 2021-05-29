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
          :disabled="!activeUser"
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            mdi-cart-outline
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >Shopping List
            <v-icon>mdi-text-box-check-outline</v-icon></v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false">
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>
                Add New Product
              </v-card-title>
              <v-card-actions class=" d-flex justify-space-around  ma-5">
                <v-autocomplete
                  v-model="autocomplete"
                  :search-input.sync="chosenProduct"
                  :loading="loading"
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
                  class="mb-3"
                  label="Amount"
                  hide-details="auto"
                ></v-text-field>
              </v-card-actions>
              <v-overlay :absolute="true" :value="overlay">
                <v-btn color="orange lighten-2" @click="overlay = false">
                  type a valid input
                </v-btn>
              </v-overlay>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-expand-x-transition align="right">
              <v-list v-if="autocomplete" class="blue lighten-5  ">
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
        <v-divider></v-divider>
        <v-list three-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>
              <v-list-item-subtitle
                >Notify me about updates to apps or games that I
                downloaded</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Sound</v-list-item-title>
              <v-list-item-subtitle
                >Auto-update apps at any time. Data charges may
                apply</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox></v-checkbox>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Auto-add widgets</v-list-item-title>
              <v-list-item-subtitle
                >Automatically add home screen widgets</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: ["activeUser"],
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style></style>
<script>
import axios from "axios";
import ProductData from "@/components/ProductData.vue";
export default {
  components: {
    ProductData,
  },
  props: ["activeUser"],
  data: () => ({
    dialog: false,
    chosenProduct: null,

    amount: "",
    overlay: false,
    receivedElements: [],
    autocomplete: null,
    elevation: 2,
    loading: false,

    possibleProducts: [],
    snackbar: false,
    LoadingAutocomplete: false,
    snackbarText: "",
  }),
  methods: {
    sendData() {
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
          });
      } catch (e) {
        console.log(`error: ${e}`);
      }
    },
  },
};
</script>
