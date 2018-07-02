Chart.defaults.global.responsive = false;

(function($, urls){

//cached player stats
var player_stats = {};

//stats dropdown jQuery object
var statsselection = $("#statsselection");
var curstatsselection = statsselection.find("option:selected");

//search button object
var playersearch = $("form.searchbtn");

// define the chart data
var linechartData = {
  //labels : player_stats.labels,
  datasets : [{
      //label: curstatsselection.text(),
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
      //data : player_stats.PTS,
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

// get chart canvas
var ctx = $("#line_chart")[0].getContext("2d");

// create the chart using the chart canvas
var line_chart = new Chart(ctx, {
  type: 'line',
  data: linechartData,
  options: linechartOptions
});

function updateLineChart(chart, curselected) {
    var statstype = curselected.val();
    var label = curselected.text();
    console.log("updating chart...");
    console.log("data:" + player_stats[statstype]);
    chart.data.labels = player_stats.labels;
    chart.data.datasets[0].data = player_stats[statstype];
    chart.data.datasets[0].label = label;
    chart.update();
}

//function to request player stats
function getPlayerStats(ctx) {
  console.log("get request: " + urls.player_stats);
  var player = ctx.find("input").val();
  var jqxhr = $.get(urls.player_stats, {"player": player}, function(res) {
      console.log(res);
      player_stats = res; //set player_stats object
      updateLineChart(line_chart, curstatsselection);
  }, "json")
  .fail(function(data) {
      console.log(data.message);
  })
}

//event handler for stats dropdown
statsselection.on("change", function(){
    curstatsselection = $(this).find("option:selected");
    updateLineChart(line_chart, curstatsselection);
});

//event handler for search button
playersearch.on("submit", function (e) {
  getPlayerStats($(this));
  e.preventDefault();
});

})(window.jQuery, window.urls);