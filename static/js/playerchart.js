Chart.defaults.global.responsive = false;

(function($, context_vars){

//stats dropdown jQuery object
var statsselection = $("#statsselection");
var curstatsselection = statsselection.find("option:selected");

// define the chart data
var linechartData = {
  labels : context_vars.labels,
  datasets : [{
      label: curstatsselection.text(),
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
var linechartOptions = {
  scales: {
    xAxes: [{
      ticks: {
        autoSkip: true,
        maxTicksLimit: 20
      }
    }]
  }
}

function updateLineChart(chart, curselected) {
    var statstype = curselected.val();
    var label = curselected.text();
    console.log("updating chart...");
    console.log("data:" + context_vars[statstype]);
    chart.data.datasets[0].data = context_vars[statstype];
    chart.data.datasets[0].label = label;
    chart.update();
}

// get chart canvas
var ctx = $("#line_chart")[0].getContext("2d");

// create the chart using the chart canvas
var line_chart = new Chart(ctx, {
  type: 'line',
  data: linechartData,
  options: linechartOptions
});

//event handlers
statsselection.on("change", function(){
    curstatsselection = $(this).find("option:selected");
    updateLineChart(line_chart, curstatsselection);
});

})(window.jQuery, window.context_vars);