Chart.defaults.global.responsive = false;

(function($, urls){

window.onload = function() {

var shooting_stats;
var player_stats;

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
  data:
  {
    labels: [],
    datasets : [{
      label: "",
      data: [],
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
      spanGaps: false
    }],
  },
  options: 
  {
    scales: {
      xAxes: [{
        ticks: {
        autoSkip: true,
        maxTicksLimit: 20
        }
      }]
    }
  },
});

var shooting_chart = new Chart(ctx_shooting, {
  type: 'bar',
  data: 
  {
    labels: ["< 5 ft", "5-9 ft", "10-14 ft", "15-19 ft", "20-24 ft", "25-29 ft", "30-34 ft", "35-39 ft", "40+ ft", "Overall"],
    datasets : [
      {
        data: [],
        label: "Shot Frequency",
        backgroundColor: "red",
      },
      {
        data: [],
        label: "Shot Percentage",
        backgroundColor: "blue",
      }
    ]
  },

  options: 
  {
    tooltips: {
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem["yLabel"].toFixed(2);
        },
        afterLabel: function(tooltipItem) {
          curindex = tooltipItem["index"];
          tot_FGA = shooting_stats["tot_FGA"];
          //for frequency
          if (tooltipItem["datasetIndex"] == 0) {
            return shooting_stats["tooltip"]["FGA"][curindex] + '-' + tot_FGA + ' FGA';
          }
          //for percentage
          else if (tooltipItem["datasetIndex"] == 1) {
            return shooting_stats["tooltip"]["FGM"][curindex] + '-' + shooting_stats["tooltip"]["FGA"][curindex] + ' FGM-FGA';
          }
          else return "";
        }
      }
    },
    yAxes: [{
      ticks: {
        min: 0,
        max: 1.0,
      }
    }]
  },
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
  var stats = player_stats;
  chart.data.datasets[0].label = label;
  if (typeof stats !== "undefined") {
    chart.data.labels = player_stats.labels;
    chart.data.datasets[0].data = player_stats[statstype];
  }
  chart.update();
}

//function to request player stats
function getPlayerStats(ctx) {
  console.log("get request: " + urls.player_stats);
  var player = ctx.find("input").val();
  var jqxhr = $.get(urls.player_stats, {"player": player}, function(res) {
      console.log(res);
      player_stats = res; //set player_stats object
      //cd.player_stats = res;
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
    //cd.shooting_stats = res;
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
});

//event handler for search button
playersearch.on("submit", function (e) {
  getPlayerStats($(this));
  getShootingSplits($(this));
  e.preventDefault();
});

//Initialize default values for charts
//line_chart.data.datasets[0].label = curstatsselection;
//line_chart.update();
updateLineChart(line_chart, curstatsselection);

}
})(window.jQuery, window.urls);