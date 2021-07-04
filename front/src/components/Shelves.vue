<template>
  <v-row no-gutters>
    <v-progress-circular
      v-if="dataLoading"
      indeterminate
      color="green"
    ></v-progress-circular>
    <v-col
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="3"
      xl="2"
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

      <draggable
        class="list-group"
        :list="list[index].Items"
        group="people"
        @change="log"
      >
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
              <v-row justfy="center" align="center">
                <v-card-title class="text-h7">
                  <v-sheet
                    class="mr-2 "
                    color="indigo lighten-5"
                    elevation="5"
                    height="30"
                    rounded
                    width="30"
                    >{{ el.Amount }}</v-sheet
                  >{{ el.name }}
                </v-card-title>
              </v-row>
              <v-row no-gutters justfy="center">
                <v-col>
                  <v-img
                    contain
                    class="ma-3"
                    max-width="200"
                    max-height="150"
                    :src="el.Image"
                  ></v-img>
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
          <v-row justify="center">
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
      dataLoading: false,
      snackbar: false,
      snackbarText: `All the items in the shelf must be removed before deleting it.`,
      list: [],
    };
  },
  methods: {
    log() {
      axios.post(`http://${config.server.address}/store`, {
        storeName: this.store,
        list: this.list,
      });
    },
    getData(store = this.store) {
      if (!this.dataLoading) {
        this.dataLoading = true;
        // this.list = [];
        axios
          .get(`http://${config.server.address}/store`, {
            params: { storeName: store },
          })
          .then((res) => {
            if (res.data.found[0]){this.list=[]; this.list = res.data.found[0].Shelves;}
            else this.list = [];
            this.dataLoading = false;
          })
          .catch((err) => console.log(err));
      }
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
      axios.post(`http://${config.server.address}/store`, {
        storeName: this.store,
        list: this.list,
      });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
<style></style>
