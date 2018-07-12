var chartjsdefaults = (function() {

    var shooting_stats = {};
    var player_stats = {};

    var linechartData = {
        labels: [],
            datasets : [
            {
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
            }
        ],
    };
    var linechartOptions = {
        scales: {
        xAxes: [{
            ticks: {
            autoSkip: true,
            maxTicksLimit: 20
            }
        }]
        }
    };

    var barchartData = {
        labels: ["< 5 ft", "5-9 ft", "10-14 ft", "15-19 ft", "20-24 ft", "25-29 ft", "30-34 ft", "35-39 ft", "40+ ft", "Overall"],
        datasets : [
            {
                label: "Shot Frequency",
                backgroundColor: "red",
                data: [],
            },
            {
                label: "Shot Percentage",
                backgroundColor: "blue",
                data: [],
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
    };

    //setters
    function set_shooting(stats) { shooting_stats = stats; }
    function set_playerstats(stats) { player_stats = stats; }
    //getters
    function get_shooting() { return shooting_stats; }
    function get_playerstats() { return player_stats; }

    return {
        set_shooting: set_shooting,
        set_playerstats: set_playerstats,
        get_shooting: get_shooting,
        get_playerstats: get_playerstats,
        linechartData: linechartData,
        linechartOptions: linechartOptions,
        barchartData: barchartData,
        barchartOptions: barchartOptions,
    };
})();