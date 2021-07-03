<template>
  <div id="chart">
    <apexchart
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import dates from "./dates";

export default {
  props: {},
  data() {
    return {
      dates: [],
      color: 0,
      series: [
        {
          name: "Number of Clients",
          data: dates,
        },
      ],
      chartOptions: {
        chart: {
          type: "area",
          stacked: false,
          height: 350,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: "zoom",
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        // title: {
        //   text: this.title,
        //   align: "left",
        // },
        colors: [""],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
            // colors: ['#F44336', '#E91E63', '#9C27B0']
          },
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return (val / 1000000).toFixed(0);
            },
          },
          title: {
            text: "Amount",
          },
        },
        xaxis: {
          type: "datetime",
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function(val) {
              return (val / 1000000).toFixed(0);
            },
          },
        },
      },
    };
  },
  computed: {},
  methods: {
    colorGrid(val) {
      switch (val) {
        case 0:
          this.chartOptions.colors = ["#F44336"];
          break;
        case 1:
          this.chartOptions.colors = ["#E91E63"];
          break;
        case 2:
          this.chartOptions.colors = ["#9C27B0"];
          break;
        default:
          this.chartOptions.colors = ["#03A9F4"];
      }
    },
    getData() {
      this.colorGrid(Math.floor(Math.random() * 4));
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style></style>
