<template>
  <v-row align="center">
    <v-item-group v-model="window" mandatory>
      <v-item v-for="n in length" :key="n" v-slot="{ active, toggle }">
        <div>
          <v-btn
            class="mt-5 ml-1"
            :color="active ? `blue` : `grey`"
            icon
            large
            @click="
              toggle();
              reload(n);
            "
          >
            <v-icon>{{ icons[n] }}</v-icon>
          </v-btn>
        </div>
      </v-item>
    </v-item-group>

    <v-col>
      <v-window v-model="window" class="elevation-1" vertical>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text> </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <v-avatar color="grey" class="mr-4"></v-avatar>
                <strong class="text-h6">{{ store }}'s Sheleves</strong>
                <v-spacer></v-spacer>
                <!-- <v-btn icon> -->
                <!-- <v-icon>mdi-warning</v-icon> -->
               
                <!-- </v-btn> -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <product-data
                :url="`http://192.168.31.175:3000/products`"
                :location="store"
                ref="productData"
                ><template v-slot:tableTitle>
                  <h3>{{ store }} Storage</h3>
                  <v-icon large class="pl-3" color="blue"
                    >mdi-package-variant-closed</v-icon
                  >
                   <expiration-warning
                  :activeUser="store"
                  :warningList="expiredWarning"
                />
                </template></product-data
              >
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <v-avatar color="grey" class="mr-4"></v-avatar>
                <strong class="text-h6">{{ store }}'s Orders</strong>
                <!-- <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn> -->
              </v-row>
            </v-card-text>
            <GmapMap
              :center="{ lat: 46.083333, lng: 6.416667 }"
              :zoom="6"
              map-type-id="roadmap"
              style="width: 300px; height: 300px"
              :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                disableDefaultUI: true,
              }"
            >
              <GmapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="{ lat: 46.083333, lng: 6.416667 }"
                :clickable="false"
                :draggable="false"
                @click="center = m.position"
              />
            </GmapMap>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <v-icon large color="blue" class="mr-4">mdi-warehouse</v-icon>
                <strong class="text-h6">{{ store }}'s Providers</strong>
                <!-- <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn> -->
              </v-row>
              <producer-buy
                :url="url"
                :location="`Producer`"
                :activeUser="store"
              />
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>

<script>
import ExpirationWarning from "./ExpirationWarning.vue";
import ProducerBuy from "./ProducerBuy.vue";
import ProductData from "./ProductData.vue";
import config from "../../config"
export default {
  components: { ProducerBuy, ProductData, ExpirationWarning },
  name: "storeWindows",
  props: ["store"],
  data: () => ({
    expiredWarning: [],
    productDatafinishedLoad: false,
    url: `http://${config.server.address}/products`,
    length: 5,
    icons: [
      ``,
      `mdi-store`,
      `mdi-library-shelves`,
      `mdi-package-variant-closed`,
      `mdi-truck`,
      `mdi-warehouse`,
    ],
    window: 0,
    markers: [
      {
        position: {
          lat: 10.0,
          lng: 10.0,
        },
      },
      {
        position: {
          lat: 11.0,
          lng: 11.0,
        },
      },
    ],
  }),
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
  },
  methods: {
    reload(n) {
      if (n == 3) {
        if (this.$refs.productData) this.$refs.productData.getData();
      }
    },
  },
};
</script>

<style></style>
