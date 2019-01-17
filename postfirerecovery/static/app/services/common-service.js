(function() {

    'use strict';

    angular.module('postfirerecovery')
    .service('CommonService', function () {

        var service = this;

        service.capitalizeString = function (string) {
            return string.replace(/(^|\s)([a-z])/g, function (m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };

        service.range = function (start, end) {
            var foo = [];
            for (var i = start; i <= end; i++) {
                foo.push(i);
            }
            return foo;
        };

        service.getPercent = function (part, sum) {
            return (part / sum * 100).toFixed(2);
        };

        service.AnalysisToolControl = function (controlDiv) {
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.setAttribute('class', 'tool-control text-center');
            controlUI.setAttribute('id', 'analysis-tool-control');
            controlUI.title = 'Toogle Tools Visibility';
            controlUI.innerHTML = "<span class='glyphicon glyphicon-eye-open large-icon' aria-hidden='true'></span>";
            controlDiv.appendChild(controlUI);
            return controlUI;
        };

        service.buildPieChart = function (data, div, title, showDataLabels, exportButtonPosition) {

            if (typeof(exportButtonPosition) === 'undefined') exportButtonPosition = 'right';

            var pieChartOptions = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: title
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        /*dataLabels: {
                            enabled: false
                        },*/
                        dataLabels: {},
                        showInLegend: true
                    }
                },
                series: [
                    {
                        name: 'Area (hectare)',
                        coloyByPoint: true,
                        data: data
                    }
                ],
                credits: {
                    enabled: false
                },
                exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: [
                            "printChart",
                            "separator",
                            "downloadPNG",
                            "downloadJPEG",
                            "downloadPDF",
                            "downloadSVG",
                            "separator",
                            "downloadCSV",
                            "downloadXLS",
                            //"viewData",
                            //"openInCloud"
                        ],
                        align: exportButtonPosition,
                        symbol: 'menuball'
                      }
                    }
                }
            };

            if (showDataLabels) {
                pieChartOptions.plotOptions.pie.dataLabels.enabled = true;
                pieChartOptions.plotOptions.pie.dataLabels.format = '<b>{point.name}</b>: {point.percentage:.1f} %';
                pieChartOptions.plotOptions.pie.dataLabels.style = {};
                pieChartOptions.plotOptions.pie.dataLabels.style.color = (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black';
            } else {
                pieChartOptions.plotOptions.pie.dataLabels.enabled = false;
            }

            // build the chart
            Highcharts.chart(div, pieChartOptions);
        };

        service.buildColumnChart = function (options) {

            var categories = options.categories;
            var title = options.title;
            var subtitle = options.subtitle;
            var yAxisTitle = options.yAxisTitle;
            var data = options.data;
            var container = options.container;
            var toolTipUnit = options.toolTipUnit;
            var exportButtonPosition = options.exportButtonPosition || 'right';
            var dataLabels = options.dataLabels || false;

            var chartOptions = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: title
                },
                subtitle: {
                    text: subtitle
                },
                xAxis: {
                    categories: categories,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: yAxisTitle
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                 '<td style="padding:0"><b>{point.y:.2f} ' + toolTipUnit + '</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: dataLabels
                        }
                    }
                },
                series: data,
                credits: {
                    enabled: false
                },
                exporting: {
                    buttons: {
                      contextButton: {
                        menuItems: [
                            "printChart",
                            "separator",
                            "downloadPNG",
                            "downloadJPEG",
                            "downloadPDF",
                            "downloadSVG",
                            "separator",
                            "downloadCSV",
                            "downloadXLS",
                            //"viewData",
                            //"openInCloud"
                        ],
                        align: exportButtonPosition,
                        symbol: 'menuball'
                      }
                    }
                }
            };

            Highcharts.chart(container, chartOptions);
        };

    });

})();
