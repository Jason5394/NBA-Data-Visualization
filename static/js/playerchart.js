Chart.defaults.global.responsive = false;

// define the chart data
var chartData = {
  labels : context_vars.labels,
  datasets : [{
      label: context_vars.legend,
      fill: true,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data : context_vars.PTS,
      spanGaps: false
  }],
}
var chartOptions = {
  scales: {
    xAxes: [{
      ticks: {
        autoSkip: true,
        maxTicksLimit: 20
      }
    }]
  }
}

// get chart canvas
var ctx = document.getElementById("line_chart").getContext("2d");

// create the chart using the chart canvas
var line_chart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: chartOptions
});

(function() {
    console.log("started function");
    $("#statsselection").on("change", function(){
        alert($(this).find("option:selected").text());
    });
})();