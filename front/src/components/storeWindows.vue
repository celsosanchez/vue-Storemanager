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
            @click="toggle(); reload(n)"
            
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
            <v-card-text>
              
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <v-avatar color="grey" class="mr-4"></v-avatar>
                <strong class="text-h6">{{ store }}'s Sheleves</strong>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn>
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
                  <h3>{{store}} Storage</h3>
                  <v-icon large class="pl-3" color="blue">mdi-package-variant-closed</v-icon>
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
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>
        <v-window-item>
          <v-card flat min-height="70vh">
            <v-card-text>
              <v-row class="mb-4" align="center">
                <v-icon large color="blue" class="mr-4">mdi-warehouse</v-icon>
                <strong class="text-h6">{{ store }}'s Providers</strong>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-account</v-icon>
                </v-btn>
              </v-row>
              <producer-buy
                :url="`http://192.168.31.175:3000/products`"
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
import ProducerBuy from "./ProducerBuy.vue";
import ProductData from "./ProductData.vue";
export default {
  components: { ProducerBuy, ProductData },
  name: "storeWindows",
  props: ["store"],
  data: () => ({
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
  }),
  watch: {
  },
  methods:{
      reload(n){
          if(n == 3){
              if(this.$refs.productData)
          this.$refs.productData.getData();
          }
      }
  },
};
</script>

<style></style>
