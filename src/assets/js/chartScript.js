"use strict";
//exports.__esModule = true;

var createChart = function(chartElement, type, labels, data, options) {

    new Chart(chartElement, {
        type: type,
        data: {
            labels: labels,
            datasets: data
        },
        options: options
    });
}
var createChart2 = function(chartElement, type, labels, data, options) {

    new Chart(chartElement, {
        type: type,
        data: {
            labels: labels,
            datasets: data
        },
        options: options
    });
}
exports.createChart = createChart;
exports.createChart2 = createChart2;