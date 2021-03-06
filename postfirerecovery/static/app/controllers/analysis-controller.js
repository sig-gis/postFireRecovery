(function () {

    'use strict';
    angular.module('postfirerecovery')
        .controller('analysisController', function (appSettings, $scope, CommonService, LandCoverService) {


            // $scope variables - common
            $scope.landCoverClasses = appSettings.landCoverClasses;
            /*$scope.landCoverClassName = [];
            for (var i = 0; i < $scope.landCoverClasses.length; i++) {
                $scope.landCoverClassName.push($scope.landCoverClasses[i].name);
            }*/
            $scope.landCoverClassesColor = {};
            for (var i = 0; i < $scope.landCoverClasses.length; i++) {
                $scope.landCoverClassesColor[$scope.landCoverClasses[i].name] = $scope.landCoverClasses[i].color;
            }

            // $scope variables for maps
            $scope.assemblageLayers = [];
            for (var j = 0; j < $scope.landCoverClasses.length; j++) {
                $scope.assemblageLayers.push(j.toString());
            }
            $scope.yearRange = CommonService.range(1985, 2020);
            $scope.leftLayer = null;
            $scope.rightLayer = null;
            $scope.leftLayerYear = 2016;
            $scope.rightLayerYear = $scope.yearRange[$scope.yearRange.length - 1];
            $scope.sideBySideControlInitialized = false;
            $scope.showMapLoader = false;

            // Mapping
            // Base Layers\
            var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                {
                    attribution: "Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, " +
                        "<a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, " +
                        "Imagery � <a href='http://mapbox.com'>Mapbox</a>", // jshint ignore:line
                    id: 'mapbox.light'
                }
            );
            var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, ' +
                    'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            });
            var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });

            var DEFAULT_ZOOM = 8,
                DEFAULT_CENTER = {
                    lng: -120.556906,
                    lat: 39.6074162
                };

            var map = L.map('change-detection-map', {
                center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
                zoom: DEFAULT_ZOOM,
                layers: [Esri_WorldImagery],
                zoomControl: false
            });

            // side-by-side control
            // define before using
            var sideBySideControl = L.control.sideBySide();

            // Map events and functions
            map.on('layeradd', function () {
                if ($scope.leftLayer && $scope.rightLayer && !$scope.sideBySideControlInitialized) {
                    sideBySideControl.setLeftLayers($scope.leftLayer);
                    sideBySideControl.setRightLayers($scope.rightLayer);
                    sideBySideControl.addTo(map);
                    $scope.sideBySideControlInitialized = true;
                }
            });

            var removeLayers = function (which) {
                if (typeof (which) === 'undefined') which = 'both';
                if (which === 'left') {
                    map.removeLayer($scope.leftLayer);
                    $scope.leftLayer = null;
                } else if (which === 'right') {
                    map.removeLayer($scope.rightLayer);
                    $scope.rightLayer = null;
                } else if (which === 'both') {
                    map.removeLayer($scope.leftLayer);
                    map.removeLayer($scope.rightLayer);
                    $scope.leftLayer = null;
                    $scope.rightLayer = null;
                }
                $scope.sideBySideControlInitialized = false;
            };

            /**
             * Controls
             */

            // layer control
            var baseLayers = {
                "Satellite Imagery": Esri_WorldImagery,
                "Grayscale": mapbox,
                "Topo Map": Esri_WorldTopoMap
            };
            L.control.layers(baseLayers, null, { position: 'bottomleft' }).addTo(map);

            // custom control
            // left layer selector control
            L.Control.SelectLeftLayerControl = L.Control.extend({
                options: {
                    position: 'topleft',
                    title: 'Select the left layer for the map'
                },
                onAdd: function (map) {
                    var div = L.DomUtil.create('div', 'info');
                    var select = L.DomUtil.create('select', 'form-control', div);
                    select.style.boxShadow = '0px 1px 5px rgba(0,0,0,0.4)';
                    for (var i = 0; i < $scope.yearRange.length; i++) {
                        select.options[i] = new Option($scope.yearRange[i], $scope.yearRange[i]);
                        if ($scope.yearRange[i] === $scope.leftLayerYear) {
                            select.options[i].selected = true;
                        }
                    }
                    L.DomEvent.addListener(select, 'change', this.onChange, this);
                    return div;
                },
                onChange: function (e) {
                    var year = parseInt(e.currentTarget.value);
                    $scope.leftLayerYear = year;
                    removeLayers('left');
                    $scope.initMap($scope.leftLayerYear, 'left');
                }
            });

            L.control.selectLeftLayerControl = function (options) {
                return new L.Control.SelectLeftLayerControl(options);
            };

            L.control.selectLeftLayerControl({
                position: 'topleft'
            }).addTo(map);

            // right layer selector control
            L.Control.SelectRightLayerControl = L.Control.extend({
                options: {
                    position: 'topright',
                    title: 'Select the right layer for the map'
                },
                onAdd: function (map) {
                    var div = L.DomUtil.create('div', 'info');
                    var select = L.DomUtil.create('select', 'form-control', div);
                    select.style.boxShadow = '0px 1px 5px rgba(0,0,0,0.4)';
                    for (var i = 0; i < $scope.yearRange.length; i++) {
                        select.options[i] = new Option($scope.yearRange[i], $scope.yearRange[i]);
                        if ($scope.yearRange[i] === $scope.rightLayerYear) {
                            select.options[i].selected = true;
                        }
                    }
                    L.DomEvent.addListener(select, 'change', this.onChange, this);
                    return div;
                },
                onChange: function (e) {
                    var year = parseInt(e.currentTarget.value);
                    $scope.rightLayerYear = year;
                    removeLayers('right');
                    $scope.initMap($scope.rightLayerYear, 'right');
                }
            });

            L.control.selectRightLayerControl = function (options) {
                return new L.Control.SelectRightLayerControl(options);
            };

            L.control.selectRightLayerControl({
                position: 'topright'
            }).addTo(map);

            // Legend control
            L.Control.LegendControl = L.Control.extend({
                options: {
                    position: 'bottomright'
                },
                onAdd: function (map) {
                    var div = L.DomUtil.create('div', 'info-legend legend'),
                        labels = [];

                    for (var i = 0; i < $scope.landCoverClasses.length; i++) {

                        labels.push(
                            '<p><i style="background:' + $scope.landCoverClasses[i].color + '"></i> ' + $scope.landCoverClasses[i].name + '</p>'
                        );
                    }

                    //div.innerHTML = labels.join('<br>');
                    div.innerHTML = labels.join('<br>');
                    return div;
                }
            });

            L.control.legendControl = function (options) {
                return new L.Control.LegendControl(options);
            };

            L.control.legendControl({
                position: 'bottomright'
            }).addTo(map);

            // Zoom control
            L.control.zoom({
                position: 'bottomright'
            }).addTo(map);

            /* Updates the image based on the current control panel config. */
            var loadMap = function (type, data) {
                // var mapType = MapService.getMapType(type, data.eeMapURL);
                // $scope[type + 'Layer'] = L.tileLayer('https://earthengine.googleapis.com/map/' + data.eeMapId + '/{z}/{x}/{y}?token=' + data.eeMapToken);
                $scope[type + 'Layer'] = L.tileLayer(data.eeMapURL);
                $scope[type + 'Layer'].setZIndex(99);
                $scope[type + 'Layer'].addTo(map);
                $scope.showMapLoader = false;
            };

            // Area filter
            $scope.hucUnits = appSettings.hucUnits;
            $scope.fireParameters = appSettings.fireParameters;
            $scope.listFireNames = appSettings.listFireNames;
            $scope.selectors = appSettings.selectors;
            $scope.hucName = [];
            $scope.parameterName = [];
            $scope.fireName = [];

            /**
             * Starts the Google Earth Engine application. The main entry point.
             */
            $scope.initMap = function (year, side) {
                $scope.showMapLoader = true;
                if (side === 'right') {
                    $scope.rightLayerYear = year;
                } else if (side === 'left') {
                    $scope.leftLayerYear = year;
                }

                var parameters = {
                    primitives: $scope.assemblageLayers,
                    year: year
                };

                LandCoverService.getLandCoverMap(parameters)
                    .then(function (data) {
                        loadMap(side, data);
                    }, function (error) {
                        $scope.showAlert('danger', error.error);
                        console.log(error);
                    });
            };

            /*
            * Select Options for Variables
            **/
            $scope.showSelectors = false;
            $scope.populateSelectors = function (option) {
                $scope.showSelectors = true;
                if (option.value === 'hucUnit') {
                    $scope.selectorOptions = $scope.hucUnits;
                } else if (option.value === 'burnSeverity') {
                    $scope.selectorOptions = $scope.fireParameters;
                } else if (option.value === 'fireName') {
                    $scope.selectorOptions = $scope.listFireNames;
                }
            };

            /*
            * load selectors
            **/
            var loadHUC = function (name) {
                $scope.hucName = name;
                $scope.fireName = [];
                $scope.parameterName = [];
            };

            var loadFireParameter = function (name) {
                $scope.hucName = [];
                $scope.fireName = [];
                $scope.parameterName = name;
            };

            var loadFireName = function (name) {
                $scope.hucName = [];
                $scope.parameterName = [];
                $scope.fireName = name;
            };

            $scope.loadSelectors = function (name) {
                if ($scope.selectorOptions === $scope.hucUnits) {
                    loadHUC(name);
                } else if ($scope.selectorOptions === $scope.fireParameters) {
                    loadFireParameter(name);
                } else if ($scope.selectorOptions === $scope.listFireNames) {
                    loadFireName(name);
                }
            };

            // Table statistics
            $scope.showtableLoader = false;
            $scope.tableYear = $scope.yearRange[$scope.yearRange.length - 1];
            $scope.tableData = [];

            var calculatePercentage = function () {
                var sum = 0;

                for (var i = 0; i < $scope.tableData.length; ++i) {
                    sum += $scope.tableData[i].area;
                }

                for (var j = 0; j < $scope.tableData.length; ++j) {
                    $scope.tableData[j].percentage = CommonService.getPercent($scope.tableData[j].area, sum);
                }
                $scope.showtableLoader = false;
            };

            $scope.getTableStats = function () {
                $scope.showtableLoader = true;
                var parameters = {
                    primitives: $scope.assemblageLayers,
                    year: $scope.tableYear,
                    hucName: $scope.hucName,
                    parameter: $scope.parameterName,
                    fireName: $scope.fireName
                };

                LandCoverService.getStats(parameters)
                    .then(function (data) {
                        $scope.tableData = [];
                        for (var key in data) {
                            var classData = { 'name': key, 'area': data[key] };
                            $scope.tableData.push(classData);
                        }
                        calculatePercentage();
                    }, function (error) {
                        console.log(error);
                    });
            };

            $scope.changeTableYear = function (year) {
                $scope.tableYear = year;
                $scope.getTableStats();
            };

            // Pie Chart Statistics
            $scope.showPieLoader = false;
            $scope.pieYear = $scope.yearRange[$scope.yearRange.length - 1];
            $scope.pieData = [];

            $scope.getPieStats = function () {
                $scope.showPieLoader = true;
                var parameters = {
                    primitives: $scope.assemblageLayers,
                    year: $scope.pieYear,
                    hucName: $scope.hucName,
                    parameter: $scope.parameterName,
                    fireName: $scope.fireName
                };

                LandCoverService.getStats(parameters)
                    .then(function (data) {

                        var pieData = [];
                        for (var key in data) {
                            // multiply by 2.471 to convert to Acre
                            pieData.push({ name: key, y: (data[key] * 2.471), color: $scope.landCoverClassesColor[key] });
                        }
                        var options = {
                            data: pieData,
                            div: 'landcover-piechart',
                            title: '',
                            showDataLabels: true,
                            exportButtonPosition: 'left',
                            pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>',
                            dataLabelFormat: '<b>{point.name}</b>: {point.percentage:.2f} %',
                            seriesName: 'Area (Acre)'
                        };
                        CommonService.buildPieChart(options);
                        $scope.showPieLoader = false;
                    }, function (error) {
                        console.log(error);
                    });
            };

            $scope.changePieYear = function (year) {
                $scope.pieYear = year;
                $scope.getPieStats();
            };

            // Column Statistics
            $scope.showColumnLoader = false;
            // hard-coded; dont want to be computationally expensive
            $scope.columnStartYear = 2016;
            $scope.columnEndYear = $scope.yearRange[$scope.yearRange.length - 1];

            $scope.loadColumnStats = function () {
                if ($scope.columnStartYear >= $scope.columnEndYear) {
                    alert('start year must be less than end year');
                } else {
                    $scope.showColumnLoader = true;
                    var years = CommonService.range($scope.columnStartYear, $scope.columnEndYear);

                    var parameters = {
                        primitives: $scope.assemblageLayers,
                        hucName: $scope.hucName,
                        parameter: $scope.parameterName,
                        fireName: $scope.fireName
                    };

                    LandCoverService.getColumnStatData(parameters, years)
                        .then(function (response) {
                            var evergreen = {
                                name: 'Evergreen Forest',
                                data: [],
                                color: '#38814e'
                            };
                            var scrub = {
                                name: 'Shrub/Scrub',
                                data: [],
                                color: '#dcca8f'
                            };
                            var barren = {
                                name: 'Barren Land (Rock/Sand/Clay)',
                                data: [],
                                color: '#9c792a'
                            };
                            var developed = {
                                name: 'Developed',
                                data: [],
                                color: '#ff0000'
                            };
                            var grassland = {
                                name: 'Grassland/Herbaceous',
                                data: [],
                                color: '#fde9aa'
                            };
                            var water = {
                                name: 'Open Water',
                                data: [],
                                color: '#5475a8'
                            };
                            var deciduous = {
                                name: 'Deciduous Forest',
                                data: [],
                                color: '#85c77e'
                            };
                            var woody = {
                                name: 'Woody Wetlands',
                                data: [],
                                color: '#c8e6f8'
                            };

                            response.forEach(function (_data) {
                                // The responses are in order as those are chained in order
                                for (var key in _data) {
                                    switch (key) {
                                        case 'Barren Land (Rock/Sand/Clay)':
                                            barren.data.push(_data[key]);
                                            break;
                                        case 'Deciduous Forest':
                                            deciduous.data.push(_data[key]);
                                            break;
                                        case 'Developed':
                                            developed.data.push(_data[key]);
                                            break;
                                        case 'Evergreen Forest':
                                            evergreen.data.push(_data[key]);
                                            break;
                                        case 'Grassland/Herbaceous':
                                            grassland.data.push(_data[key]);
                                            break;
                                        case 'Open Water':
                                            water.data.push(_data[key]);
                                            break;
                                        case 'Shrub/Scrub':
                                            scrub.data.push(_data[key]);
                                            break;
                                        case 'Woody Wetlands':
                                            woody.data.push(_data[key]);
                                            break;
                                    }
                                }
                            });

                            var options = {
                                categories: years,
                                data: [
                                    evergreen,
                                    scrub,
                                    barren,
                                    developed,
                                    grassland,
                                    water,
                                    deciduous,
                                    woody
                                ],
                                container: 'landcover-column',
                                yAxisTitle: 'Area (Hectare)',
                                toolTipUnit: 'Hectare',
                                dataLabels: false
                            };
                            CommonService.buildColumnChart(options);
                            $scope.showColumnLoader = false;
                        }, function (error) {
                            console.log(error);
                        });
                }
            };
        });

})();
