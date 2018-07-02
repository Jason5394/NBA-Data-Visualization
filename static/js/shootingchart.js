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

    function updateBarChart(chart) {
        var attempts = shooting_stats.FGA;
        var makes = shooting_stats.FGM;
        frequency = calcShotFrequency(attempts);
        frequency.push(1.0);
        percentage = calcShotPercentage(makes, attempts);
        percentage.push(makes.reduce(addarray)/attempts.reduce(addarray));
        chart.data.datasets[0].data = frequency;
        chart.data.datasets[1].data = percentage;
        chart.update();
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

    var addarray = function(acc, curval) {
        return acc + curval;
    }

    function calcShotFrequency(attempts) {
        var arrayLen = attempts.length;
        var total_attempts = attempts.reduce(addarray);
        var sol = [];
        for (let i = 0; i < arrayLen; ++i) {
            sol.push(attempts[i]/total_attempts);
        }
        return sol;
    }

    function calcShotPercentage(makes, attempts) {
        if (makes.len != attempts.len) { return undefined; }
        var arrayLen = makes.length;
        var sol = [];
        for (let i = 0; i < arrayLen; ++i) {
            sol.push(makes[i]/attempts[i]);
        }
        return sol;
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