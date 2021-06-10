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
            min-width="300"
            min-height="150"
            class="mb-8"
          >
            <v-card-title>
              Desired stock
            </v-card-title>
            <v-card-actions>
              <warehouse-dialog
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
            min-width="300"
            min-height="150"
            class="mb-8"
          >
            <v-card-title>
              Shopping List
            </v-card-title>
            <v-card-actions>
              <list-dialog :activeUser="currentUser" />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
      <v-col class="d-flex justify-center">
        <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
          <v-card
            :elevation="hover ? 12 : 2"
            min-width="300"
            min-height="150"
            class="mb-8"
          >
            <v-card-title>
              Expiration Warning!
            </v-card-title>
            <v-card-actions>
              <expiration-warning :warningList="expiredWarning" />
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <ProductData
      v-if="currentUser"
      ref="productData"
      :url="`http://192.168.31.175:3000/products`"
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
import ExpirationWarning from '../components/ExpirationWarning.vue';

export default {
  name: "Consumer",
  components: {
    ProductData,
    ListDialog,
    WarehouseDialog,
    ExpirationWarning,
  },
  data: () => ({
    // fridgeStock: ['2s'],
    expiredWarning: [],
    productDatafinishedLoad: false,
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
  methods: {},
  created() {
    axios.get(`http://192.168.31.175:3000/users`).then((res) => {
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
  mounted() {},
  computed: {},
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
      console.log(this.expiredWarning);
    },
    autocomplete(value) {
      // this.activeUser = true
      this.currentUser = value;
      setTimeout(() => {
        this.$refs.productData.getData();
      }, "1");
    },
  },
};
</script>
<style></style>
