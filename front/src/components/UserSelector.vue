<template>
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
</template>

<script>
import axios from "axios";
import config from "../../config";
export default {
  data: () => ({
    // fridgeStock: ['2s'],
    // expiredWarning: [],
    // productDatafinishedLoad: false,
    url: `http://${config.server.address}/products`,
    fetchedUsers: [],
    autocomplete: null,
    elevation: 2,
    loading: false,
    // dialog: false,
    // selected: [],
    possibleUsers: [],
    singleSelect: false,
    loading_Recommendation: false,
    currentUser: null,
    // snackbarText: "",
    recommendations: [],
    // activeUser: false,
  }),
  methods: {
    reload() {
      //   this.$refs.productData.getData();
    },
    getRecommendations() {
      console.log(`getting recommendations for ${JSON.stringify(this.currentUser.email)}`)
      this.loading_Recommendation = true;
      this.recommendations = [];
      setTimeout(() => {
        let lh = this.currentUser.shoppingList;
        console.log(this.currentUser);
        let lh_products = [];
        lh.forEach((lh) => {
          if (lh.Categories) {
            let processing = lh.Categories;
            // console.log(lh.Categories)
            processing = processing.replaceAll(",", " ").split(" ");
            processing.forEach((element) => {
              element = element.slice(0, -1);
              if (!lh_products.find((item) => item == element)) {
                lh_products.push(element);
              }
            });
          }
        });
        lh_products.forEach((element) => {
          let productsData = [];
          productsData.push(element);
          console.log(productsData)
          axios
            .post(`http://recommend:5000/api/associations`, productsData)
            .then((res) => {
              if (res.data.data[0] != "" && res.data.data[0] != undefined) {
                if (
                  !this.recommendations.find((item) => item == res.data.data[0])
                ) {
                  let words = res.data.data[0];
                  if (words.includes(",")) {
                    words = words.split(",");
                    words.forEach((word) => {
                      if (!this.recommendations.find((item) => item == word))
                        this.recommendations.push(word);
                    });
                  } else {
                    this.recommendations.push(words);
                  }
                }
              }
            });
        });
        this.loading_Recommendation = false;
      }, "500");
    },
  },
  created() {
    axios.get(`http://${config.server.address}/users`).then((res) => {
      // this.receivedNames = [];
      this.possibleUsers = [];
      res.data.found.forEach((el) => {
          this.fetchedUsers.push(el)
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
          return 450;
        case "xl":
          return 230;
        default:
          return 350;
      }
    },
    reactiveTitles() {
      if (this.$vuetify.breakpoint.name != `xs`) return true;
      else return false;
    },
  },
  watch: {
    productDatafinishedLoad() {
      //   this.currentItems = this.$refs.productData.items;
      //   this.expiredWarning = [];
      //   this.currentItems.forEach((element) => {
      //     var expiration = new Date(element.expiration_datetime);
      //     element.expirationIn = Math.round((expiration - Date.now()) / 86400000);
      //     if (element.expirationIn < 3) {
      //       const soonExpires = {
      //         name: element.product_name,
      //         producer: element.brands,
      //         expirationOn: element.expirationIn,
      //         image_url: element.image_url,
      //       };
      //       this.expiredWarning.push(soonExpires);
      //     }
      //   });
    },
    autocomplete(value) {
      this.activeUser = true;

      console.log(value);

    //   axios.get(`http://${config.server.address}/users`).then((res) => {
        //   console.log(res.data.found)

        for (let user of this.fetchedUsers) {
          if (user.email == value) this.currentUser = user;
        // }
        }
        this.getRecommendations();
    //   });
      //   setTimeout(() => {
      //     this.$refs.productData.getData();
      //     axios.put(`http://${config.server.address}/UpdateSLfromDS`, {
      //       user: this.currentUser,
      //     });
      //   }, "1");
    },
  },
};
</script>

<style></style>
