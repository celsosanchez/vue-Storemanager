<template>
  <v-card>
    <v-card-title>
      Shopping instances
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon=" mdi-magnify "
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:[`item.TotalExpenses`]="{ item }">
        <v-row>
          <v-col>
            {{ item.TotalExpenses }}
            <v-icon small>mdi-currency-eur</v-icon>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: " ClientID ",
          align: " start ",
          sortable: false,
          value: "ID",
        },
        { text: " Visit.No ", value: "VisitNo" },
        { text: " Products ", value: "products" },
        { text: " Carbs (g) ", value: "carbs" },
        { text: " Protein (g) ", value: "protein" },
        { text: " TotalExpenses ", value: "TotalExpenses" },
      ],
      items: [],
      search: "",
    };
  },
  methods: {
    generateProducts() {
        this.items = []
      const types = [
        " hamburger meat ",
        " tropical fruit ",
        " other vegetables ",
        " chocolate ",
        " citrus fruit ",
        " root vegetables ",
        " whole milk ",
        " domestic eggs ",
        " pip fruit ",
        " yogurt ",
        " curd ",
        " butter ",
        " beef ",
        " whipped/sour cream ",
      ];

      for (let index = 0; index < 15; index++) {
        let products = [];
        const count = Math.floor(Math.random() * 30);
        for (let index = 0; index < count; index++) {
          products.push(types[Math.floor(Math.random() * types.length)]);
        }

        this.items.push({
          ID: Math.floor(Math.random() * 999999999),
          VisitNo: Math.floor(Math.random() * 9999),
          products: products,
          carbs: products.length * 24,
          protein: (products.length * 4.3).toFixed(2),
          //   total: (Math.random() * 200).toFixed(2),
          TotalExpenses: (Math.random() * products.length * 20).toFixed(2),
        });
      }
    },
    getData(){
         this.generateProducts();
    }
  },
  created() {
    this.getData()
    
  },
};
</script>

<style></style>
