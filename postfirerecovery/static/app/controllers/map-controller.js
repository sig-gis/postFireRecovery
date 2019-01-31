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

        // Init
        // get tooltip activated
        $('.js-tooltip').tooltip();
        // selectpicker
        $timeout(function () {
            $('.selectpicker').selectpicker();
        });

        // Download link
        $scope.typologyCSV = '/static/data/typology_value.csv';
        $scope.highVegetationBurn = '/static/data/vegetation_burn_severity/high.severity.zip';
        $scope.lowVegetationBurn = '/static/data/vegetation_burn_severity/low.severity.zip';
        $scope.moderateVegetationBurn = '/static/data/vegetation_burn_severity/moderate.severity.zip';
        $scope.unchangedVegetation = '/static/data/vegetation_burn_severity/unchanged.zip';

        // areas and overlay params
        // available overlays are
        // 1. landcovermap 2. composite 3. user drawn polygon 4. predefined area
        $scope.overlays = {};
        $scope.shape = {};
        $scope.selectors = appSettings.selectors;
        $scope.hucUnits = appSettings.hucUnits;
        $scope.fireParameters = appSettings.fireParameters;
        $scope.listFireNames = appSettings.listFireNames;
        $scope.hucName = null;
        $scope.parameterName = null;
        $scope.fireName = null;
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

        /*
         * Layer Legend
         */
        $scope.landcoverOpacity = 1;
        $scope.compositeOpacity = 1;
        $scope.predefinedAreaOpacity = 1;

        var initializeLayerSlider = function (className, overlayType) {
            var layerSlider = $('.' + className).slider({
                formatter: function (value) {
                    return value;
                },
                //tooltip: 'always'
            })
            .on('slideStart', function (event) {
                switch (overlayType) {
                    case 'landcovermap':
                        $scope.landcoverOpacity = $(this).data('slider').getValue();
                        break;
                    case 'composite':
                        $scope.compositeOpacity = $(this).data('slider').getValue();
                        break;
                    case 'predefined':
                        $scope.predefinedAreaOpacity = $(this).data('slider').getValue();
                        break;
                }
            })
            .on('slideStop', function (event) {
                var value;
                switch (overlayType) {
                    case 'landcovermap':
                        value = $(this).data('slider').getValue();
                        if (value !== $scope.landcoverOpacity) {
                            $scope.overlays.landcovermap.setOpacity(value);
                        }
                        break;
                    case 'composite':
                        value = $(this).data('slider').getValue();
                        if (value !== $scope.compositeOpacity) {
                            $scope.overlays.composite.setOpacity(value);
                        }
                        break;
                    case 'preload':
                        value = $(this).data('slider').getValue();
                        if (value !== $scope.predefinedAreaOpacity) {
                            map.data.setStyle({
                                fillOpacity: value,
                                fillColor: 'red',
                                strokeWeight: 2,
                                clickable: false
                            });
                        }
                        break;
                }
            });
        };

        var createLayerContainer = function (overlayType) {

            var overlayName = {
                'landcovermap': 'Land Cover Map for ' + $scope.sliderYear,
                'composite'   : 'Composite Map for ' + $scope.sliderYear,
                'polygon'     : 'User Defined Area',
                'preload'     : 'Pre-defined Area'
            };

            var toggleLayerSlider = function () {
                if ($(this).hasClass('closed')) {
                    $(this).removeClass('closed');
                    $('#layer-opacity-slider-' + overlayType).removeClass('display-none-imp');
                } else {
                    $(this).addClass('closed');
                    $('#layer-opacity-slider-' + overlayType).addClass('display-none-imp');
                }
            };

            var toggleLayerOpacity = function () {
                if ($(this).hasClass('fa-eye')) {
                    $(this).removeClass('fa-eye').addClass('fa-eye-slash');
                    $('#layer-opacity-slider-' + overlayType).addClass('display-none-imp');
                    switch (overlayType) {
                        case 'landcovermap':
                            $scope.overlays.landcovermap.setOpacity(0);
                            break;
                        case 'composite':
                            $scope.overlays.composite.setOpacity(0);
                            break;
                        case 'polygon':
                            $scope.overlays.polygon.setVisible(false);
                            break;
                        case 'preload':
                            map.data.forEach(function (feature) {
                                map.data.setStyle({
                                    visible: false
                                });
                            });
                            break;
                    }
                } else {
                    $(this).removeClass('fa-eye-slash').addClass('fa-eye');
                    $('#layer-opacity-slider-' + overlayType).removeClass('display-none-imp');
                    switch (overlayType) {
                        case 'landcovermap':
                            $scope.overlays.landcovermap.setOpacity(1);
                            break;
                        case 'composite':
                            $scope.overlays.composite.setOpacity(1);
                            break;
                        case 'polygon':
                            $scope.overlays.polygon.setVisible(true);
                            break;
                        case 'preload':
                            map.data.forEach(function (feature) {
                                map.data.setStyle({
                                    fillOpacity: $scope.predefinedAreaOpacity,
                                    visible: true,
                                    fillColor: 'red',
                                    strokeWeight: 2,
                                    clickable: false
                                });
                            });
                            break;
                    }
                }
            };

            var _container = document.createElement('div');
            _container.setAttribute('class', 'leaflet-bar leaflet-html-legend');
            _container.setAttribute('id', 'layer-control-' + overlayType);

            var legendBlock = document.createElement('div');
            legendBlock.setAttribute('class', 'legend-block layer-control');

            var layerHeading = document.createElement('h4');
            layerHeading.setAttribute('class', 'inline-block-display');
            var legendCaret = document.createElement('div');
            legendCaret.setAttribute('class', 'legend-caret');
            var spanInHeading = document.createElement('span');
            spanInHeading.appendChild(document.createTextNode(overlayName[overlayType]));
            layerHeading.appendChild(legendCaret);
            layerHeading.appendChild(spanInHeading);

            var toggleLayer = document.createElement('i');
            toggleLayer.setAttribute('class', 'far fa-eye float-right');
            toggleLayer.style.cursor = 'pointer';
            toggleLayer.addEventListener('click', toggleLayerOpacity);

            var opacitySliderContainer = document.createElement('span');
            opacitySliderContainer.setAttribute('class', 'opacity-slider');
            opacitySliderContainer.setAttribute('id', 'layer-opacity-slider-' + overlayType);
            var sliderLabel = document.createElement('span');
            sliderLabel.setAttribute('class', 'slider-label');
            sliderLabel.appendChild(document.createTextNode('Transparency:'));
            var opacitySlider = document.createElement('input');
            opacitySlider.setAttribute('id', 'layer-opacity-slider');
            opacitySlider.setAttribute('class', 'layer-opacity-slider-' + overlayType);
            opacitySlider.setAttribute('data-slider-id', 'layer-opacity-slider');
            opacitySlider.setAttribute('type', 'text');
            opacitySlider.setAttribute('data-slider-min', '0');
            opacitySlider.setAttribute('data-slider-max', '1');
            opacitySlider.setAttribute('data-slider-step', '0.1');
            opacitySliderContainer.appendChild(sliderLabel);
            opacitySliderContainer.appendChild(opacitySlider);

            layerHeading.addEventListener('click', toggleLayerSlider);

            legendBlock.appendChild(layerHeading);
            legendBlock.appendChild(toggleLayer);
            legendBlock.appendChild(opacitySliderContainer);
            _container.appendChild(legendBlock);

            $('#layer-tab').append(_container);

            if (overlayType === 'polygon') {
                legendBlock.removeChild(opacitySliderContainer);
                layerHeading.removeChild(legendCaret);
            }

            return _container;
        };

        var addLayer = function (overlayType) {
            if ($('#layer-tab #layer-control-' + overlayType).length > 0) {
                $('#layer-tab #layer-control-' + overlayType).remove();
            }
            var response = createLayerContainer(overlayType);
            if (overlayType !== 'polygon') {
                initializeLayerSlider('layer-opacity-slider-' + overlayType, overlayType);
            }
        };

        var removeLayer = function (overlayType) {
            if ($('#layer-tab #layer-control-' + overlayType).length > 0) {
                $('#layer-tab #layer-control-' + overlayType).remove();
            }
        };

        /**
         * UI
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
                fireName: $scope.fireName,
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
                addLayer('composite');
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
            $timeout(function () {
                $('.selectpicker').selectpicker('refresh');
            });
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
            $scope.fireName = null;
            MapService.loadGeoJson(map, name, 'huc');
        };

        var loadFireParameter = function (name) {
            //$scope.showLoader = true;
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            $scope.shape = {};
            $scope.hucName = null;
            $scope.parameterName = name;
            $scope.fireName = null;
            //MapService.loadGeoJson(map, name, 'fireParameter');
        };

        var loadFireName = function (name) {
            MapService.clearDrawing($scope.overlays.polygon);
            MapService.removeGeoJson(map);
            $scope.shape = {};
            $scope.hucName = null;
            $scope.parameterName = null;
            $scope.fireName = name;
            MapService.loadGeoJson(map, name, 'fireName');
        };

        $scope.loadSelectors = function (name) {
            removeLayer('polygon');
            if ($scope.selectorOptions === $scope.hucUnits) {
                loadHUC(name);
                removeLayer('preload');
                addLayer('preload');
            } else if ($scope.selectorOptions === $scope.fireParameters) {
                loadFireParameter(name);
                removeLayer('preload');
            } else if ($scope.selectorOptions === $scope.listFireNames) {
                loadFireName(name);
                removeLayer('preload');
                addLayer('preload');
            }
        };

        // Default the administrative area selection
        var clearSelectedArea = function () {
            $scope.hucName = null;
            $scope.parameterName = null;
            $scope.fireName = null;
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
                parameter: $scope.parameterName,
                fireName: $scope.fireName
            };
            LandCoverService.getLandCoverMap(parameters)
            .then(function (data) {
                var mapType = MapService.getMapType(data.eeMapId, data.eeMapToken, type);
                loadMap(type, mapType);
                addLayer(type);
                $timeout(function () {
                    $scope.showAlert('info', 'The map data shows the landcover data for ' + $scope.sliderYear);
                }, 3500);
            }, function (error) {
                $scope.showAlert('danger', error.error);
                console.log(error);
            });
        };

        var verifyBeforeDownload = function (type) {
            if (typeof(type) === 'undefined') type = 'landcover';
            var polygonCheck = true,
                compositeCheck = true;

            var hasPolygon = (['polygon', 'circle', 'rectangle'].indexOf($scope.shape.type) > -1);
            if (!hasPolygon && !$scope.hucName && !$scope.parameterName && !$scope.fireName) {
                $scope.showAlert('danger', 'Please draw a polygon or select HUC or severity index before proceding to download!');
                polygonCheck = false;
            }

            if (type === 'composite') {
                if (!$scope.overlays.composite) {
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
            removeLayer('preload');
            addLayer('polygon');
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
            //MapService.removeGeoJson(map);
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
                    fireName: $scope.fireName,
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

    });

})();
