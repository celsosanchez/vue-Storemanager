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
          <v-card :elevation="hover ? 12 : 2" min-width="400" min-height="150" class="mb-8">
            <v-card-title>
             Groceries List
            </v-card-title>
            <v-card-actions>
            <list-dialog  :activeUser="currentUser"/>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <ProductData
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

export default {
  components: {
    ProductData,
    ListDialog,
  },
  data: () => ({
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
    // activeUser: false,
  }),
  methods: {},
  created() {
    axios.post(`http://192.168.31.175:3000/users`).then((res) => {
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
