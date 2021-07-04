<template>
  <div id="chart">
    <apexchart
      type="pie"
      width="470"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          width: 450,
          type: "pie",
        },
        labels: [
          "Beverages",
          "Vegetables",
          "Meats & Fish",
          "Cereal Derivates",
          "Dairy products",
        ],
        colors: ["#93C3EE", "#94A74A", "#F48FB1", "#E5C6A0", "#FFD54F"],
        fill: {
          type: "image",
          opacity: 0.85,
          image: {
            src: [
              "https://choconnuts.com/image/cache/catalog/categories%20images/beverages-200x200.jpg",
              `https://www.agri-resources.com/wp-content/uploads/2020/12/fruits-500x500-1.png`,
              "https://www.ecoandbeyond.co/wp-content/uploads/2019/11/Riverford-Meat-500x500-c-default.jpg",
              "https://www.cotorico.com/assets/MarketplaceShop/Image/_resampled/CropboxedImageWzUwMCw1MDBd/Pains-Baguettes-Sandwich-Tradition-Mornant-boulangerie-2.jpg",
              `https://5.imimg.com/data5/KD/RH/MY-3966004/milk-products-500x500.jpg`,
            ],
            width: 300,
            imagedHeight: 500,
          },
        },
        stroke: {
          width: 4,
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#111"],
          },
          background: {
            enabled: true,
            foreColor: "#fff",
            borderWidth: 0,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    rndm() {
      return Math.floor(Math.random() * 100);
    },
    getData(){
        this.series = []
        var len = 5;
    while (len--) {
    //   console.log(this.series);
      this.series.push(this.rndm());
    }
    }
  },
  computed: {},
  created() {
    this.getData()
  },
};
</script>

<style></style>
