<template>
  <div>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card :elevation="hover ? 12 : 2" min-width="400" class="mb-8">
            <v-card-title>
              Select User
            </v-card-title>
            <v-card-actions>
              <v-autocomplete
                v-model="autocomplete"
                :loading="loading"
                :items="possibleUsers"
                label="Email"
              ></v-autocomplete>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :min-width="cardWidth"
            min-height="150"
            class="mb-8"
          >
            <v-card-title :class="smallText">
              Desired stock
            </v-card-title>
            <v-card-actions>
              <warehouse-dialog
                ref="warehouse"
                :activeUser="currentUser"
                :currentItems="currentItems"
              />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :min-width="cardWidth"
            min-height="150"
            class="mb-8"
          >
            <v-card-title :class="smallText">
              Shopping List
            </v-card-title>
            <v-card-actions>
              <list-dialog
                :activeUser="currentUser"
                align="center"
                justify="center"
              />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :min-width="cardWidth"
            min-height="150"
            class="mb-8"
          >
            <v-card-title :class="smallText">
              Warning!
            </v-card-title>
            <v-card-actions>
              <expiration-warning
                :activeUser="currentUser"
                :warningList="expiredWarning"
              />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :min-width="cardWidth"
            min-height="150"
            class="mb-8"
          >
            <v-card-title :class="smallText">
              Buy from source
            </v-card-title>
            <v-card-actions>
              <buy-from-producer :activeUser="currentUser" @childCallsReload="reload" />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :min-width="cardWidth"
            min-height="150"
            class="mb-8"
          >
            <v-card-title :class="smallText">
              Go Shopping
            </v-card-title>
            <v-card-actions>
              <go-shopping :activeUser="currentUser" @childCallsReload="reload" />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            :min-width="cardWidth"
            min-height="150"
            class="mb-8"
          >
            <v-card-title :class="smallText">
              Delivery
            </v-card-title>
            <v-card-actions>
              <delivery :activeUser="currentUser" />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <ProductData
      v-if="currentUser"
      ref="productData"
      :url="url"
      :location="this.currentUser"
      ><template v-slot:tableTitle>
        <h3>My Fridge</h3>
        <v-icon large class="pl-3" color="blue">mdi-fridge</v-icon>
      </template></ProductData
    >
  </div>
</template>
<script>
import axios from "axios";
import ProductData from "@/components/ProductData.vue";
import ListDialog from "@/components/ListDialog.vue";
import WarehouseDialog from "@/components/WarehouseDialog.vue";
import ExpirationWarning from "../components/ExpirationWarning.vue";
import BuyFromProducer from "../components/buyFromProducer.vue";
import config from "../../config";
import Delivery from "../components/Delivery.vue";
import GoShopping from '../components/GoShopping.vue';

export default {
  name: "Consumer",
  components: {
    ProductData,
    ListDialog,
    WarehouseDialog,
    ExpirationWarning,
    BuyFromProducer,
    Delivery,
    GoShopping,
  },
  data: () => ({
    // fridgeStock: ['2s'],
    expiredWarning: [],
    productDatafinishedLoad: false,
    url: `http://${config.server.address}/products`,
    chosenUser: null,
    autocomplete: null,
    elevation: 2,
    loading: false,
    dialog: false,
    selected: [],
    possibleUsers: [],
    singleSelect: false,
    snackbar: false,
    currentUser: null,
    snackbarText: "",
    currentItems: [],
    // activeUser: false,
  }),
  methods: {
    reload() {
      this.$refs.productData.getData();
    },
  },
  created() {
    axios.get(`http://${config.server.address}/users`).then((res) => {
      // this.receivedNames = [];
      this.possibleUsers = [];
      res.data.found.forEach((el) => {
        this.possibleUsers.push(el.email);
      });
    });
    setTimeout(() => {
      this.elevation = 6;
    }, "2000");
  },
  computed: {
    cardWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 150;
        case "sm":
          return 300;
        case "md":
          return 250;
        case "lg":
          return 150;
        case "xl":
          return 150;
        default:
          return 350;
      }
    },
    smallText() {
      if (this.$vuetify.breakpoint.name == `xs`) return "text-body-1";
      else return ""
    },
  },
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
    autocomplete(value) {
      // this.activeUser = true
      this.currentUser = value;
      setTimeout(() => {
        this.$refs.productData.getData();
        axios.put(`http://${config.server.address}/UpdateSLfromDS`, {
          user: this.currentUser,
        });
      }, "1");
    },
  },
};
</script>
<style></style>
