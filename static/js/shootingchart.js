(function ($, urls) {
    var playersearch = $("form.searchbtn");
    //stats dropdown jQuery object
    var statsselection = $("#statsselection");
    //var curstatsselection = statsselection.find("option:selected");

    //var to hold bar chart data
    var shooting_stats = {};

    var barchartData = {
        labels: ["< 5 ft", "5-9 ft", "10-14 ft", "15-19 ft", "20-24 ft", "25-29 ft", "30-34 ft", "35-39 ft", "40+ ft", "Overall"],
        datasets : [
            {
                label: "Shot Frequency",
                backgroundColor: "red",
                //data: calcShotFrequency(shooting_stats.FGM, shooting_stats.FGA)
            },
            {
                label: "Shot Percentage",
                backgroundColor: "blue",
                //data: calcShotPercentage(shooting_stats.FGM, shooting_stats.FGA)
            }
        ]
    };

    var barchartOptions = {
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem["yLabel"].toFixed(2);
                },
                afterLabel: function(tooltipItem) {
                    curindex = tooltipItem["index"];
                    tot_attempts = shooting_stats["total_attempts"];
                    tot_makes = shooting_stats["total_makes"];
                    //for frequency
                    if (tooltipItem["datasetIndex"] == 0) {
                        if (tooltipItem["xLabel"] != "Overall") {
                            return shooting_stats.FGA[curindex] + '-' + tot_attempts;
                        }
                        else {
                            return tot_attempts + '-' + tot_attempts;
                        }
                    }
                    //for percentage
                    else if (tooltipItem["datasetIndex"] == 1) {
                        if (tooltipItem["xLabel"] != "Overall") {
                            return shooting_stats.FGM[curindex] + '-' + shooting_stats.FGA[curindex];
                        }
                        else {
                            return tot_makes + '-' + tot_attempts;
                        }
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
    };

    // get chart canvas
    var ctx = $("#shooting_chart")[0].getContext("2d");

    // create the chart using the chart canvas
    var shooting_chart = new Chart(ctx, {
      type: 'bar',
      data: barchartData,
      options: barchartOptions
    });

    var addarray = function(acc, curval) {
        return acc + curval;
    }

    function updateBarChart(chart) {
        frequency = calcShotFrequency(shooting_stats);
        frequency.push(1.0);
        percentage = calcShotPercentage(shooting_stats);
        percentage.push(shooting_stats.total_makes/shooting_stats.total_attempts);
        chart.data.datasets[0].data = frequency;
        chart.data.datasets[1].data = percentage;
        chart.update();
    }

    function getShootingSplits(ctx) {
        console.log("get request: " + urls.shooting_splits);
        var player = ctx.find("input").val();
        var jqxhr = $.get(urls.shooting_splits, {"player": player}, function(res) {
            console.log(res);
            updateShootingStats(res);
            updateBarChart(shooting_chart);
        }, "json")
        .fail(function(data) {
            console.log(data.message);
        })
    }

    function updateShootingStats(newData) {
        shooting_stats = newData;
        shooting_stats.total_attempts = newData.FGA.reduce(addarray);
        shooting_stats.total_makes = newData.FGM.reduce(addarray);
    }

    //event handler for stats dropdown
    statsselection.on("change", function(){
        curstatsselection = $(this).find("option:selected");
        updateBarChart(shooting_chart);
    });

    playersearch.on("submit", function(e) {
        getShootingSplits($(this));
        e.preventDefault();
    });
})(window.jQuery, window.urls);