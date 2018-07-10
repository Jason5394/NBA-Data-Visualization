Chart.defaults.global.responsive = false;

(function($, urls, chartDefaults){

//data to be plotted to charts
var player_stats = {};
var shooting_stats = {};

//stats dropdown jQuery object
var statsselection = $("#statsselection");
var curstatsselection = statsselection.find("option:selected");

//search button object
var playersearch = $("form.searchbtn");

// get chart canvas
var ctx_stats = $("#line_chart")[0].getContext("2d");
var ctx_shooting = $("#shooting_chart")[0].getContext("2d");

// create the charts using the chart canvas
var line_chart = new Chart(ctx_stats, {
  type: 'line',
  data: chartDefaults.linechartData,
  options: chartDefaults.linechartOptions
});

var shooting_chart = new Chart(ctx_shooting, {
  type: 'bar',
  data: chartDefaults.barchartData,
  options: chartDefaults.barchartOptions
});

function updateBarChart(chart) {
  frequency = shooting_stats.frequency;
  percentage = shooting_stats.percentage;
  chart.data.datasets[0].data = frequency;
  chart.data.datasets[1].data = percentage;
  chart.update();
}

function updateLineChart(chart, curselected) {
  var statstype = curselected.val();
  var label = curselected.text();
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

function getShootingSplits(ctx) {
  console.log("get request: " + urls.shooting_splits);
  var player = ctx.find("input").val();
  var jqxhr = $.get(urls.shooting_splits, {"player": player}, function(res) {
    console.log(res);
    shooting_stats = res;
    updateBarChart(shooting_chart);
  }, "json")
  .fail(function(data) {
    console.log(data.message);
  })
}

//event handler for stats dropdown
statsselection.on("change", function(){
    curstatsselection = $(this).find("option:selected");
    updateLineChart(line_chart, curstatsselection);
    updateBarChart(shooting_chart);
});

//event handler for search button
playersearch.on("submit", function (e) {
  getPlayerStats($(this));
  getShootingSplits($(this));
  e.preventDefault();
});

})(window.jQuery, window.urls, window.chartjsdefaults);