var chartjsdefaults = (function() {
    var linechartData = {
        datasets : [{
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
            },
            {
                label: "Shot Percentage",
                backgroundColor: "blue",
            }
        ]
    };
    var barchartOptions = {
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem["yLabel"].toFixed(2);
                },
                afterLabel: function(tooltipItem, data) {
                    curindex = tooltipItem["index"];
                    //for frequency
                    if (tooltipItem["datasetIndex"] == 0) {
                        return data;
                    }
                    //for percentage
                    else if (tooltipItem["datasetIndex"] == 1) {
                        return data;
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

    return {
        linechartData: linechartData,
        linechartOptions: linechartOptions,
        barchartData: barchartData,
        barchartOptions: barchartOptions,
    };
})();