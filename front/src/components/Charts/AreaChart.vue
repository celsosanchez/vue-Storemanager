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
export default {
  data() {
    return {
      series: [
        {
          name: "Lidl",
          data: this.generateDayWiseTimeSeries(
            new Date("05 Jan 2021 GMT").getTime(),
            200,
            {
              min: 10,
              max: 60,
            }
          ),
        },
        {
          name: "Carrefour",
          data: this.generateDayWiseTimeSeries(
            new Date("05 Feb 2021 GMT").getTime(),
            200,
            {
              min: 10,
              max: 20,
            }
          ),
        },
        {
          name: "Leclerc",
          data: this.generateDayWiseTimeSeries(
            new Date("05 Mar 2021 GMT").getTime(),
            200,
            {
              min: 10,
              max: 15,
            }
          ),
        },
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: 350,
          stacked: true,
          events: {
            selection: function(chart, e) {
              console.log(new Date(e.xaxis.min));
            },
          },
        },
        colors: ["#008FFB", "#00E396", "#CED4DC"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
        xaxis: {
          type: "datetime",
        },
      },
    };
  },
  methods: {
    generateDayWiseTimeSeries(baseval, count, yrange) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = baseval;
        var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
      }
    //   console.log(series[1])
      return series;
    },
  },
};
</script>

<style></style>
