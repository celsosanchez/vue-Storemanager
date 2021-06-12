<template>
  <v-data-table
    @pagination="counter"
    :headers="headers"
    :items="items"
    sort-by="Image"
    class="elevation-1"
  >
    <template v-slot:[`top`]>
      <v-toolbar flat>
        <v-toolbar-title>Stock Products</v-toolbar-title> 
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="showingImage" max-width="500px">
          <v-card>
            <v-card-title>{{ showingImageName }}</v-card-title>
            <v-img  contain  max-height="70vh" :src="showingImageUrl" />
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.Image`]="{ item }">
      <v-btn icon @click="showImage(item)">
        <v-icon color="grey">
          mdi-image
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon medium class="mr-2" @click="item.Amount += 1">
        mdi-plus
      </v-icon>

      <v-icon v-if="item.Amount > 1" medium @click="item.Amount -= 1">
        mdi-minus
      </v-icon>
      <v-icon v-else color="red" medium @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";

export default {
  props: ["activeUser"],
  data: () => ({
    dialog: false,
    searchCounter: 0,
    dialogDelete: false,
    showingImage: false,
    showingImageUrl: null,
    showingImageName: null,
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
      },
      { text: "Amount (Units)", value: "Amount" },
      { text: "Image", value: "Image", sortable: false },
      { text: "Producer", value: "Producer" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    items: [],
  }),
  
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    this.getData();
  },

  methods: {
    counter(pagination) {
      this.searchCounter = pagination.itemsLength;
    },
    getData() {
        this.items = [];
      if (this.activeUser) {
        this.loading = true;
        axios.get(`http://192.168.31.175:3000/users`).then((res) => {
          var data = res.data.found;
          this.items = data.find(
            (element) => element.email == this.activeUser
          ).desiredStock;
        });
      }
    },
     deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.items.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
    },

    showImage(item) {
      this.showingImage = true;
      this.showingImageName = item.name;
      this.showingImageUrl = item.Image;
    },
  },
};
</script>
