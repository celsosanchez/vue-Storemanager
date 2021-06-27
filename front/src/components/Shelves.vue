<template>
  <v-row no-gutters>
    <v-col
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="3"
      class="pl-1 mt-1 pr-1"
      v-for="(element, index) in list"
      :key="element.Shelf"
    >
      <v-card
        :class="
          list[index].Shelf == `Unclassified`
            ? `blue lighten-3`
            : `teal lighten-5`
        "
      >
        <h3 class="pa-1 mt-1">{{ list[index].Shelf }}</h3>
      </v-card>

      <draggable class="list-group" :list="list[index].Items" group="people" @change="log">
        <div
          class="list-group-item"
          v-for="el in list[index].Items"
          :key="el.name"
        >
          <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
            <v-card
              class="ma-2 rounded-lg "
              :elevation="hover ? 12 : 2"
              tile
              outlined
              align="center"
            >
              <v-row class="ma-1">
                <v-col cols="9"> Name: {{ el.name }} </v-col>
                <v-col cols="3"> Count: {{ el.Amount }} </v-col>
              </v-row>
              <v-row no-gutters justfy="center">
                <v-col cols="10">
                  <v-img
                    contain
                    class="mb-4"
                    max-width="200"
                    max-height="150"
                    :src="el.Image"
                  ></v-img>
                </v-col>
                <v-col cols="2">
                  <v-row>
                    <v-btn icon class="ma-1" @click="el.Amount += 1">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row>
                    <v-btn
                      v-show="el.Amount > 1"
                      icon
                      class="ma-1"
                      @click="el.Amount -= 1"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <v-btn
                      v-show="el.Amount < 2"
                      icon
                      class="ma-1"
                      @click="removeItem(index, el)"
                    >
                      <v-icon color="red">mdi-cancel</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row>
                    <v-btn icon class="ma-1">
                      <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </div>
      </draggable>
      <v-hover close-delay="189" open-delay="191" v-slot="{ hover }">
        <v-card
          color="teal lighten-5"
          class="mt-3 rounded-lg"
          :elevation="hover ? 12 : 2"
          tile
          outlined
          align="center"
        >
          <v-row>
            <v-col cols="6">
              <v-btn icon @click="showList">
                <v-icon color="green">mdi-plus</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn icon @click="removeShelf(index)">
                <v-icon color="red">mdi-cancel</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-hover>
      <v-snackbar v-model="snackbar" timeout="3000">
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>

  <!-- <rawDisplayer class="col-3" :value="list1" title="List 1" />
    <rawDisplayer class="col-3" :value="list2" title="List 2" /> -->
</template>
<script>
import draggable from "vuedraggable";
import config from "../../config";
import axios from "axios";
export default {
  name: "Shelves",
  props: ["store"],
  display: "Shelves",
  order: 1,
  components: {
    draggable,
  },
  data() {
    return {
      snackbar: false,
      snackbarText: `All the items in the shelf must be removed before deleting it.`,
      list: [
        {
          Shelf: "Deals",
          Items: [
            {
              name: "asf",
              Amount: 11,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "gey",
              Amount: 2,
              Image:
                "https://static.openfoodfacts.org/images/products/327/323/026/9531/front_fr.5.200.jpg",
              ids: ["123"],
            },
            {
              name: "qtw",
              Amount: 3,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "vxc",
              Amount: 4,
              Image:
                "https://static.openfoodfacts.org/images/products/327/444/000/8989/front_fr.7.200.jpg",
              ids: ["123"],
            },
          ],
        },
        {
          Shelf: "Beverages",
          Items: [
            {
              name: "asf",
              Amount: 1,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "gey",
              Amount: 2,
              Image:
                "https://static.openfoodfacts.org/images/products/327/323/026/9531/front_fr.5.200.jpg",
              ids: ["123"],
            },
            {
              name: "qtw",
              Amount: 3,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "vxc",
              Amount: 4,
              Image:
                "https://static.openfoodfacts.org/images/products/327/444/000/8989/front_fr.7.200.jpg",
              ids: ["123"],
            },
          ],
        },
        {
          Shelf: "Meats",
          Items: [
            {
              name: "asf",
              Amount: 1,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "gey",
              Amount: 2,
              Image:
                "https://static.openfoodfacts.org/images/products/327/323/026/9531/front_fr.5.200.jpg",
              ids: ["123"],
            },
            {
              name: "qtw",
              Amount: 3,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "vxc",
              Amount: 4,
              Image:
                "https://static.openfoodfacts.org/images/products/327/444/000/8989/front_fr.7.200.jpg",
              ids: ["123"],
            },
          ],
        },
        {
          Shelf: "Unclassified",
          Items: [
            {
              name: "asf",
              Amount: 1,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "gey",
              Amount: 2,
              Image:
                "https://static.openfoodfacts.org/images/products/327/323/026/9531/front_fr.5.200.jpg",
              ids: ["123"],
            },
            {
              name: "qtw",
              Amount: 3,
              Image:
                "https://static.openfoodfacts.org/images/products/327/362/582/7667/front_fr.4.200.jpg",
              ids: ["123"],
            },
            {
              name: "vxc",
              Amount: 4,
              Image:
                "https://static.openfoodfacts.org/images/products/327/444/000/8989/front_fr.7.200.jpg",
              ids: ["123"],
            },
          ],
        },
      ],
    };
  },
  methods: {
      log() {
      axios.post(`http://${config.server.address}/store`,{storeName:this.store,list:this.list});
    },
    getData(store = this.store) {
      axios
        .get(`http://${config.server.address}/store`, {
          params: { storeName: store },
        })
        .then((res) => {
          // console.log(res.data.found[0].Shelves);
          this.list = res.data.found[0].Shelves;
        });
    },
    addShelf(name) {
      name = name[0].toUpperCase() + name.slice(1, name.length);
      this.list.push({ Shelf: name, Items: [] });
    },

    showList() {
      // console.log(this.list);
    },
    removeShelf(index) {
      if (this.list[index].Items.length == 0) {
        this.list.splice(index, 1);
      } else {
        this.snackbar = true;
      }
    },
    removeItem(index, el) {
      this.list[index].Items.splice(this.list[index].Items.indexOf(el), 1);
    },
  },
  watch: {
    list() {
       axios.post(`http://${config.server.address}/store`,{storeName:this.store,list:this.list});
    },
  },
  mounted() {
    this.getData();
  },
  
};
</script>
<style></style>
