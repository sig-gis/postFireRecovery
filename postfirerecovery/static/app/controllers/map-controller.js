(function () {

    'use strict';
    angular.module('postfirerecovery')
    .controller('mapController', function (appSettings, $rootScope, $scope, $sanitize, $timeout, CommonService, LandCoverService, MapService) {

        var DEFAULT_ZOOM = 9.5,
            DEFAULT_CENTER = {
                lng: -120.376589,
                lat: 39.9380701
            };

        // Global Variables
        var map = MapService.init();

        // Download link
        $scope.typologyCSV = '/static/data/typology_value.csv';
        $scope.highVegetationBurn = '/static/data/vegetation_burn_severity/high.geo.json';
        $scope.lowVegetationBurn = '/static/data/vegetation_burn_severity/low.geo.json';
        $scope.moderateVegetationBurn = '/static/data/vegetation_burn_severity/moderate.geo.json';
        $scope.unchangedVegetation = '/static/data/vegetation_burn_severity/unchanged.geo.json';

        // areas and overlay params
        $scope.overlays = {};
        $scope.shape = {};
        $scope.selectors = appSettings.selectors;
        $scope.hucUnits = appSettings.hucUnits;
        $scope.fireParameters = appSettings.fireParameters;
        $scope.hucName = null;
        $scope.parameterName = null;
        $scope.shownGeoJson = null;
        $scope.seasons = appSettings.seasons;
        $scope.bands = appSettings.bands;
        $scope.bandSelector = appSettings.bandSelector;

        //$scope.showAreaVariableSelector = false;
        $scope.alertContent = '';
        $scope.toolControlClass = 'glyphicon glyphicon-eye-open';
        $scope.showTabContainer = true;
        $scope.showLoader = false;

        // Slider params
        $scope.yearRange = CommonService.range(1985, 2018);
        $scope.sliderYear = $scope.yearRange[$scope.yearRange.length - 1];
        $scope.sliderStartYear = $scope.yearRange[0];
        $scope.sliderEndYear = $scope.yearRange[$scope.yearRange.length - 1];

        // classes and assemblage params
        $scope.landCoverClasses = appSettings.landCoverClasses;
        $scope.landCoverClassesColor = {};
        for (var i = 0; i < $scope.landCoverClasses.length; i++) {
            $scope.landCoverClassesColor[$scope.landCoverClasses[i].name] = $scope.landCoverClasses[i].color;
        }
        $scope.assemblageLayers = [];
        for (var j = 0; j < $scope.landCoverClasses.length; j++) {
            $scope.assemblageLayers.push(j.toString());
        }

        var setDefaultView = function () {
            map.setZoom(DEFAULT_ZOOM);
            map.setCenter(DEFAULT_CENTER);
        };

        /**
         * Alert
         */
        $scope.closeAlert = function () {
            $('.custom-alert').addClass('display-none');
            $scope.alertContent = '';
        };

        $scope.showAlert = function (className, alertContent) {
            var alertClass = ['info', 'success', 'danger'];
            var index = alertClass.indexOf(className);
            if (index > -1) {
                alertClass.splice(index, 1);
            }
            $scope.alertContent = alertContent;
            $('.custom-alert').removeClass('display-none').removeClass('alert-' + alertClass[0]).removeClass('alert-' + alertClass[1]).addClass('alert-' + className);
        };

        /* Updates the image based on the current control panel config. */
        var loadMap = function (type, mapType) {
            map.overlayMapTypes.push(mapType);
            $scope.overlays[type] = mapType;
            $scope.showLoader = false;
        };

        /**
         * Start with UI
         */

        // Band selector
        $scope.showGrayscaleBandSelector = false;
        $scope.showRGBBandSelector = true;

        $scope.compositeParams = {};
        $scope.compositeParams.bandVisualize = $scope.bandSelector[1];

        $scope.compositeParams.season = $scope.seasons[0];
        $scope.compositeParams.redBand = $scope.bands[0];
        $scope.compositeParams.greenBand = $scope.bands[1];
        $scope.compositeParams.blueBand = $scope.bands[2];
        $scope.compositeParams.grayscaleBand = $scope.bands[0];
        //$scope.compositeParams.gamma = 1.00;
        $scope.compositeParams.palette = '';

        $scope.showBandSelector = function (option) {
            if (option.value === 'grayscale') {
                $scope.showRGBBandSelector = false;
                $scope.showGrayscaleBandSelector = true;
            } else if (option.value === 'rgb') {
                $scope.showGrayscaleBandSelector = false;
                $scope.showRGBBandSelector = true;
            } else {
                console.log('invalid selection');
            }
        };

        $scope.mapHasCompositeLayer = false;
        $scope.updateComposite = function () {

            $scope.showLoader = true;

            var parameters = {
                year: $scope.sliderYear,
                shape: $scope.shape,
                hucName: $scope.hucName,
                parameter: $scope.parameterName,
                season: $scope.compositeParams.season.toLowerCase(),
                //gamma: $scope.compositeParams.gamma
            };

            if ($scope.showRGBBandSelector) {
                parameters.visualize = 'rgb';
                parameters.redBand = $scope.compositeParams.redBand;
                parameters.greenBand = $scope.compositeParams.greenBand;
                parameters.blueBand = $scope.compositeParams.blueBand;
            } else {
                parameters.visualize = 'grayscale';
                parameters.grayscaleBand = $scope.compositeParams.grayscaleBand;
                parameters.palette = $scope.compositeParams.palette;
            }

            // Clear before adding
            MapService.clearLayer(map, 'composite');
            $scope.mapHasCompositeLayer = false;
            $scope.compositeDownloadURL = '';
            $scope.showCompositeDownloadURL = false;

            LandCoverService.getCompositeMap(parameters)
            .then(function (data) {
                var type = 'composite';
                var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, type);
                loadMap(type, mapType);
                $scope.mapHasCompositeLayer = true;
                $timeout(function () {
                    $scope.showAlert('info', 'Showing composite for ' + $scope.sliderYear);
                }, 2000);
            }, function (error) {
                $scope.showLoader = true;
                $scope.showAlert('danger', error.error);
                console.log(error);
            });
        };

        // Analysis Tool Control
        $scope.toggleToolControl = function () {
            if ($('#analysis-tool-control span').hasClass('glyphicon-eye-open')) {
                $('#analysis-tool-control span').removeClass('glyphicon glyphicon-eye-open large-icon').addClass('glyphicon glyphicon-eye-close large-icon');
                $scope.showTabContainer = false;
            } else {
                $('#analysis-tool-control span').removeClass('glyphicon glyphicon-eye-close large-icon').addClass('glyphicon glyphicon-eye-open large-icon');
                $scope.showTabContainer = true;
            }
            $scope.$apply();
        };

        var analysisToolControlDiv = document.getElementById('tool-control-container');
        var analysisToolControlUI = new CommonService.AnalysisToolControl(analysisToolControlDiv);
        // Setup the click event listener
        analysisToolControlUI.addEventListener('click', function () {
            $scope.toggleToolControl();
        });
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(analysisToolControlDiv);

        /**
         * Tab
         */
        $('.tab-tool .btn-pref .btn').click(function () {
            $('.tab-tool .btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
            // $(".tab").addClass("active"); // instead of this do the below
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        $('.tab-tool .btn-pref-inner .btn').click(function () {
            $('.tab-tool .btn-pref-inner .btn').removeClass('btn-primary').addClass('btn-default');
            $(this).removeClass('btn-default').addClass('btn-primary');
        });

        $rootScope.$on('$includeContentLoaded', function() {
            $('#sidebar-tab .btn-pref .btn').click(function () {
                $('#sidebar-tab .btn-pref .btn').removeClass('btn-primary').addClass('btn-default');
                // $(".tab").addClass("active"); // instead of this do the below
                $(this).removeClass('btn-default').addClass('btn-primary');
            });
            $('.js-tooltip').tooltip();
        });

        // get tooltip activated
        $('.js-tooltip').tooltip();

        /**
         * Slider
         */
        // Landcover opacity slider
        $scope.landcoverOpacity = 1;
        $scope.showLandcoverOpacitySlider = true;
        /* slider init */
        $timeout(function () {
            var landcoverSlider = $('#landcover-opacity-slider').slider({
                formatter: function (value) {
                    return value;
                },
                tooltip: 'always'
            })
            .on('slideStart', function (event) {
                $scope.landcoverOpacity = $(this).data('slider').getValue();
            })
            .on('slideStop', function (event) {
                var value = $(this).data('slider').getValue();
                if (value !== $scope.landcoverOpacity) {
                    $scope.overlays.landcovermap.setOpacity(value);
                }
            });
        }, 1500);

        // Composite opacity slider
        $scope.compositeOpacity = 1;
        /* slider init */
        $timeout(function () {
            var compositeSlider = $('#composite-opacity-slider').slider({
                formatter: function (value) {
                    return value;
                },
                tooltip: 'always'
            })
            .on('slideStart', function (event) {
                $scope.compositeOpacity = $(this).data('slider').getValue();
            })
            .on('slideStop', function (event) {
                var value = $(this).data('slider').getValue();
                if (value !== $scope.compositeOpacity) {
                    $scope.overlays.composite.setOpacity(value);
                }
            });
        }, 2500);

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
            }
        };

        /*
        * load selectors
        **/
        var loadHUC = function (name) {
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            $scope.shape = {};
            $scope.hucName = name;
            $scope.parameterName = null;
            MapService.loadGeoJson(map, name, 'huc');
        };

        var loadFireParameter = function (name) {
            //$scope.showLoader = true;
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            $scope.shape = {};
            $scope.hucName = null;
            $scope.parameterName = name;
            //MapService.loadGeoJson(map, name, 'fireParameter');
        };

       $scope.loadSelectors = function (name) {
            if ($scope.selectorOptions === $scope.hucUnits) {
                loadHUC(name);
            } else if ($scope.selectorOptions === $scope.fireParameters) {
                loadFireParameter(name);
            }
        };

        // Default the administrative area selection
        var clearSelectedArea = function () {
            $scope.hucName = null;
            $scope.parameterName = null;
            $scope.$apply();
        };

        /**
         * Starts the Google Earth Engine application. The main entry point.
         */
        $scope.initMap = function (year, type) {
            $scope.showLoader = true;

            var parameters = {
                primitives: $scope.assemblageLayers,
                year: year,
                shape: $scope.shape,
                hucName: $scope.hucName,
                parameter: $scope.parameterName
            };
            LandCoverService.getLandCoverMap(parameters)
            .then(function (data) {
                var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, type);
                loadMap(type, mapType);
                $timeout(function () {
                    $scope.showAlert('info', 'The map data shows the landcover data for ' + $scope.sliderYear);
                }, 3500);
            }, function (error) {
                $scope.showAlert('danger', error.error);
                console.log(error);
            });
        };

        /**
         *  Graphs and Charts
         */
        // Get stats for the graph
        $scope.getStats = function () {
            $('#report-tab').html('<h4>Please wait while I generate chart for you...</h4>');
            var parameters = {
                primitives: $scope.assemblageLayers,
                year: $scope.sliderYear,
                shape: $scope.shape,
                hucName: $scope.hucName,
                parameter: $scope.parameterName
            };
            LandCoverService.getStats(parameters)
            .then(function (data) {
                var graphData = [];
                for (var key in data) {
                    graphData.push({ name: key, y: data[key], color: $scope.landCoverClassesColor[key] });
                }
                CommonService.buildPieChart(graphData, 'report-tab', 'Landcover types for ' + $scope.sliderYear, false);
            }, function (error) {
                console.log(error);
            });
        };

        var verifyBeforeDownload = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            var polygonCheck = true,
                compositeCheck = true;

            var hasPolygon = (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1);
            if (!hasPolygon && !$scope.hucName && !$scope.parameterName) {
                $scope.showAlert('danger', 'Please draw a polygon or select HUC or severity index before proceding to download!');
                polygonCheck = false;
            }

            if (type === 'composite') {
                if (!$scope.mapHasCompositeLayer) {
                    $scope.showAlert('danger', 'No composite layer displayed!');
                    compositeCheck = false;
                }
            }
            return polygonCheck && compositeCheck;
        };

        $scope.copyToClipBoard = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            // Function taken from https://codepen.io/nathanlong/pen/ZpAmjv?editors=0010
            var btnCopy = $('.' + type + 'CpyBtn');
            var copyTest = document.queryCommandSupported('copy');
            var elOriginalText = btnCopy.attr('data-original-title');

            if (copyTest) {
                var copyTextArea = document.createElement('textarea');
                copyTextArea.value = $scope[type + 'DownloadURL'];
                document.body.appendChild(copyTextArea);
                copyTextArea.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'Copied!' : 'Whoops, not copied!';
                    btnCopy.attr('data-original-title', msg).tooltip('show');
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                document.body.removeChild(copyTextArea);
                btnCopy.attr('data-original-title', elOriginalText);
            } else {
                // Fallback if browser doesn't support .execCommand('copy')
                window.prompt("Copy to clipboard: Ctrl+C or Command+C");
            }
        };

        /**
         * Drawing Tool Manager
         **/

        var drawingManager = new google.maps.drawing.DrawingManager();

        var stopDrawing = function () {
            drawingManager.setDrawingMode(null);
        };

        $scope.drawShape = function (type) {
            drawingManager.setOptions(MapService.getDrawingManagerOptions(type));
            drawingManager.setMap(map);
        };

        // Drawing Tool Manager Event Listeners
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
            // Clear Layer First
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            clearSelectedArea();

            var overlay = event.overlay;
            $scope.overlays.polygon = overlay;
            $scope.shape = {};

            var drawingType = event.type;
            $scope.shape.type = drawingType;
            if (drawingType === 'rectangle') {
                $scope.shape.geom = MapService.getRectangleBoundArray(overlay.getBounds());
                // Change event
                google.maps.event.addListener(overlay, 'bounds_changed', function () {
                    $scope.shape.geom = MapService.getRectangleBoundArray(event.overlay.getBounds());
                });
            } else if (drawingType === 'circle') {
                $scope.shape.center = MapService.getCircleCenter(overlay);
                $scope.shape.radius = MapService.getCircleRadius(overlay);
                // Change event
                google.maps.event.addListener(overlay, 'radius_changed', function () {
                    $scope.shape.radius = MapService.getCircleRadius(event.overlay);
                });
                google.maps.event.addListener(overlay, 'center_changed', function () {
                    $scope.shape.center = MapService.getCircleCenter(event.overlay);
                });
            } else if (drawingType === 'polygon') {
                var path = overlay.getPath();
                $scope.shape.geom = MapService.getPolygonBoundArray(path.getArray());
                // Change event
                google.maps.event.addListener(path, 'insert_at', function () {
                    var insert_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(insert_path.getArray());
                });
                google.maps.event.addListener(path, 'remove_at', function () {
                    var remove_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(remove_path.getArray());
                });
                google.maps.event.addListener(path, 'set_at', function () {
                    var set_path = event.overlay.getPath();
                    $scope.shape.geom = MapService.getPolygonBoundArray(set_path.getArray());
                });
            }
            stopDrawing();
        });

        // Geojson listener
        map.data.addListener('addfeature', function (event) {
            if ('FIRE_YEAR' in event.feature.l) {
                setDefaultView();
            } else {
                $scope.shownGeoJson = event.feature;
                var bounds = new google.maps.LatLngBounds();
                var _geometry = event.feature.getGeometry();
                MapService.processPoints(_geometry, bounds.extend, bounds);
                map.fitBounds(bounds);
            }
        });

        map.data.addListener('removefeature', function (event) {
            $scope.shownGeoJson = null;
        });

        /**
         * Upload Area Button
         **/
        var readFile = function (e) {

            var files = e.target.files;
            if (files.length > 1) {
                $scope.showAlert('danger', 'upload one file at a time');
                $scope.$apply();
            } else {
                MapService.removeGeoJson(map);

                var file = files[0];
                var reader = new FileReader();
                reader.readAsText(file);

                reader.onload = function (event) {

                    var textResult = event.target.result;
                    var addedGeoJson;

                    if ((['application/vnd.google-earth.kml+xml', 'application/vnd.google-earth.kmz'].indexOf(file.type) > -1)) {

                        var kmlDoc;

                        if (window.DOMParser) {
                            var parser = new DOMParser();
                            kmlDoc = parser.parseFromString(textResult, 'text/xml');
                        } else { // Internet Explorer
                            kmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                            kmlDoc.async = false;
                            kmlDoc.loadXML(textResult);
                        }
                        addedGeoJson = toGeoJSON.kml(kmlDoc);
                    } else {
                        try {
                            addedGeoJson = JSON.parse(textResult);
                        } catch (e) {
                            $scope.showAlert('danger', 'we only accept kml, kmz and geojson');
                            $scope.$apply();
                        }
                    }

                    if (((addedGeoJson.features) && (addedGeoJson.features.length === 1)) || (addedGeoJson.type === 'Feature')) {

                        var geometry = addedGeoJson.features ? addedGeoJson.features[0].geometry : addedGeoJson.geometry;

                        if (geometry.type === 'Polygon') {
                            MapService.addGeoJson(map, addedGeoJson);
                            // Convert to Polygon
                            var polygonArray = [];
                            var _coord = geometry.coordinates[0];

                            for (var i = 0; i < _coord.length; i++) {
                                var coordinatePair = [(_coord[i][0]).toFixed(2), (_coord[i][1]).toFixed(2)];
                                polygonArray.push(coordinatePair);
                            }

                            if (polygonArray.length > 500) {
                                $scope.showAlert('info', 'Complex geometry will be simplified using the convex hull algorithm!');
                                $scope.$apply();
                            }

                            clearSelectedArea();
                            $scope.shape.type = 'polygon';
                            $scope.shape.geom = polygonArray;
                        } else {
                            $scope.showAlert('danger', 'multigeometry and multipolygon not supported yet!');
                            $scope.$apply();
                        }
                    } else {
                        $scope.showAlert('danger', 'multigeometry and multipolygon not supported yet!');
                        $scope.$apply();
                    }
                };
            }
        };

        // upload area change event
        $('#file-input-container #file-input').change(function (event) {
            $scope.showLoader = true;
            $scope.$apply();
            MapService.clearDrawing($scope.overlays.polygon);
            readFile(event);
            $(this).remove();
            $("<input type='file' class='hide' id='file-input' accept='.kml,.kmz,.json,.geojson,application/json,application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz'>").change(readFile).appendTo($('#file-input-container'));
            $scope.showLoader = false;
        });

        // Update Assemblage Map
        $scope.updateAssemblageProduct = function () {
            $scope.showLoader = true;
            $scope.closeAlert();
            $scope.assemblageLayers = [];
            $('input[name="assemblage-checkbox"]').each(function () {
                if ($(this).prop('checked')) {
                    $scope.assemblageLayers.push($(this).val());
                }
            });
            MapService.clearLayer(map, 'landcovermap');
            $scope.initMap($scope.sliderYear, 'landcovermap');
            $scope.getStats();
            MapService.removeGeoJson(map);
        };

        // Time Slider
        $timeout(function () {
            $('#slider-year-selector').ionRangeSlider({
                skin: 'round',
                grid: true,
                min: $scope.sliderStartYear,
                max: $scope.sliderEndYear,
                from: $scope.sliderEndYear,
                force_edges: true,
                grid_num: $scope.sliderEndYear - $scope.sliderStartYear,
                prettify_enabled: false,
                onFinish: function (data) {
                    if ($scope.sliderYear !== data.from) {
                        $scope.sliderYear = data.from;
                        if ($('#land-cover-classes-tab').hasClass('active')) {
                            $scope.updateAssemblageProduct();
                        } else if ($('#composite-tab').hasClass('active')) {
                            $scope.updateComposite();
                        }
                    }
                }
            });
        }, 500);

        /*
         * Download URL
         */

        // Landcover
        $scope.landcoverDownloadURL = '';
        $scope.showLandcoverDownloadURL = false;
        // Composite
        $scope.showCompositeDownloadURL = false;
        $scope.compositeDownloadURL = '';

        $scope.getDownloadURL = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            if (verifyBeforeDownload(type)) {
                $scope['show' + CommonService.capitalizeString(type) + 'DownloadURL'] = false;
                $scope.showAlert('info', 'Preparing Download Link...');

                var parameters = {
                    // Common params
                    year: $scope.sliderYear,
                    shape: $scope.shape,
                    hucName: $scope.hucName,
                    parameter: $scope.parameterName,
                    type: type,
                    // Land cover params
                    primitives: $scope.assemblageLayers,
                    // Composite params
                    season: $scope.compositeParams.season.toLowerCase(),
                    //gamma: $scope.compositeParams.gamma
                };

                if ($scope.showRGBBandSelector) {
                    parameters.visualize = 'rgb';
                    parameters.redBand = $scope.compositeParams.redBand;
                    parameters.greenBand = $scope.compositeParams.greenBand;
                    parameters.blueBand = $scope.compositeParams.blueBand;
                } else {
                    parameters.visualize = 'grayscale';
                    parameters.grayscaleBand = $scope.compositeParams.grayscaleBand;
                }

                LandCoverService.getDownloadURL(parameters)
                .then(function (data) {
                    var message = 'Your Download Link is ready!';
                    if ($scope.parameterName) {
                        message += '<br/>Please get the exact severity boundary from the Download Button';
                    }
                    $scope.showAlert('success', message);
                    $scope[type + 'DownloadURL'] = data.downloadUrl;
                    $scope['show' + CommonService.capitalizeString(type) + 'DownloadURL'] = true;
                }, function (error) {
                    $scope.showAlert('danger', error.error);
                    console.log(error);
                });
            }
        };

        // Google Download
        $scope.showLandcoverGDriveFileName = false;

        $scope.showGDriveFileName = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            if (verifyBeforeDownload(type)) {
                $scope['show' + CommonService.capitalizeString(type) + 'GDriveFileName'] = true;
            }
        };

        $scope.hideGDriveFileName = function (type) {
            $scope['show' + CommonService.capitalizeString(type) + 'GDriveFileName'] = false;
        };

        $scope.saveToDrive = function (options) {
            var type = options.type || 'landcover';
            var v1 = options.v1;
            if (verifyBeforeDownload(type)) {
                // Check if filename is provided, if not use the default one
                var fileName = $sanitize($('#' + type + 'GDriveFileName').val() || '');
                $scope.showAlert('info', 'Please wait while I prepare the download link for you. This might take a while!');
                
                var parameters = {
                    primitives: $scope.assemblageLayers,
                    year: $scope.sliderYear,
                    shape: $scope.shape,
                    hucName: $scope.hucName,
                    parameter: $scope.parameterName,
                    v1: v1,
                    type: type,
                    index: $scope.primitiveIndex,
                    fileName: fileName
                };
            }
        };

    });

})();
