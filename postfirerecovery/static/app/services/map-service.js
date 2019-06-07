(function() {

    'use strict';

    angular.module('postfirerecovery')
    .service('MapService', function () {

        var service = this;

        service.DEFAULT_ZOOM = 9;
        service.DEFAULT_CENTER = {
            lng: -120.376589, lat: 39.9380701
        };

        service.init = function (center, zoom) {

            var DEFAULT_CENTER = service.DEFAULT_CENTER;
            if (center && center.lat && center.lng) {
                DEFAULT_CENTER = {
                    lng: center.lng,
                    lat: center.lat
                };
            }

            var DEFAULT_ZOOM = service.DEFAULT_ZOOM;
            if (zoom) {
                DEFAULT_ZOOM = zoom;
            }

            // Global Variables
            var MAX_ZOOM = 25,
                // Map options
                mapOptions = {
                    center: DEFAULT_CENTER,
                    zoom: DEFAULT_ZOOM,
                    maxZoom: MAX_ZOOM,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER
                    },
                    mapTypeId: 'roadmap',
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    },
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_BOTTOM
                    },
                    scaleControl: true,
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER
                    }
                };

            // Map variable
            return new google.maps.Map(document.getElementById('map'), mapOptions);

        };

        /**
         * GeoJson
         **/

        service.loadGeoJson = function (options) {
            var map        = options.map,
                name       = options.name,
                type       = options.type,
                clickInfo  = options.clickInfo || false;

            if (typeof(clickInfo) === 'undefined') clickInfo = false;

            if (name) {
                if (type === 'huc') {
                    map.data.loadGeoJson(
                        '/static/data/watersheds/geojson/' + name + '.geo.json'
                    );
                } else if (type === 'fireParameter') {
                    map.data.loadGeoJson(
                        '/static/data/vegetation_burn_severity/geojson/' + name + '.geo.json'
                    );
                } else if (type === 'fireName') {
                    map.data.loadGeoJson(
                        '/static/data/fire_area_by_name/geojson/' + name + '.geo.json'
                    );
                }
                map.data.setStyle({
                    fillOpacity: 0,
                    //strokeWeight: 2,
                    clickable: clickInfo,
                    strokeColor: 'yellow'
                });
            }
        };

        service.addGeoJson = function (map, geojson) {
            map.data.addGeoJson(geojson);

            map.data.setStyle({
                fillOpacity: 0,
                //fillColor: 'red',
                strokeColor: 'yellow',
                //strokeWeight: 2,
                clickable: false
            });
        };

        service.removeGeoJson = function (map) {
            map.data.forEach(function (feature) {
                map.data.remove(feature);
            });
        };

        /**
         * Process each point in a Geometry, regardless of how deep the points may lie.
         * @param {google.maps.Data.Geometry} geometry The structure to process
         * @param {function(google.maps.LatLng)} callback A function to call on each
         *     LatLng point encountered (e.g. Array.push)
         * @param {Object} thisArg The value of 'this' as provided to 'callback' (e.g.
         *     myArray)
         */
        service.processPoints = function (geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function (g) {
                    service.processPoints(g, callback, thisArg);
                });
            }
        };

        service.clearLayer = function (map, name) {
            map.overlayMapTypes.forEach(function (layer, index) {
                if (layer && layer.name === name) {
                    map.overlayMapTypes.removeAt(index);
                }
            });
        };

        // Remove the Drawing Manager Polygon
        service.clearDrawing = function (overlay) {
            if (overlay) {
                overlay.setMap(null);
            }
        };

        /*service.loadWMS = function (name, wmsURL, map) {
			var eeMapOptions = {
				getTileUrl: function (coord, zoom) {
                    var proj = map.getProjection();
                    var zfactor = Math.pow(2, zoom);
                    // get Long Lat coordinates
                    var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
                    var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));
    
                    //create the Bounding box string
                    var bbox = (top.lng().toFixed(2)) + ',' +
                               (bot.lat().toFixed(2)) + ',' +
                               (bot.lng().toFixed(2)) + ',' +
                               (top.lat().toFixed(2));
					return wmsURL += '&BBOX=' + bbox;
				},
				tileSize: new google.maps.Size(256, 256),
				name: name,
                opacity: 1.0,
                isPng: true
			};
			return new google.maps.ImageMapType(eeMapOptions);
        };*/
    
        service.getMapType = function (mapId, mapToken, type) {
            var eeMapOptions = {
                getTileUrl: function (tile, zoom) {
                    var url = 'https://earthengine.googleapis.com/map/';
                    url += [mapId, zoom, tile.x, tile.y].join('/');
                    url += '?token=' + mapToken;
                    return url;
                },
                tileSize: new google.maps.Size(256, 256),
                opacity: 1.0,
                name: type
            };
            return new google.maps.ImageMapType(eeMapOptions);
        };

        service.getPolygonBoundArray = function (array) {
            var geom = [];
            for (var i = 0; i < array.length; i++) {
                var coordinatePair = [array[i].lng().toFixed(2), array[i].lat().toFixed(2)];
                geom.push(coordinatePair);
            }
            return geom;
        };

        service.computePolygonArea = function (path) {
            return google.maps.geometry.spherical.computeArea(path) / 1e6;
        };

        service.getRectangleBoundArray = function (bounds) {
            var start = bounds.getNorthEast();
            var end = bounds.getSouthWest();
            return [Number(start.lng().toFixed(2)), Number(start.lat().toFixed(2)), Number(end.lng().toFixed(2)), Number(end.lat().toFixed(2))];
        };

        service.computeRectangleArea = function (bounds) {
            if (!bounds) {
                return 0;
            }

            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            var southWest = new google.maps.LatLng(sw.lat(), sw.lng());
            var northEast = new google.maps.LatLng(ne.lat(), ne.lng());
            var southEast = new google.maps.LatLng(sw.lat(), ne.lng());
            var northWest = new google.maps.LatLng(ne.lat(), sw.lng());
            return google.maps.geometry.spherical.computeArea([northEast, northWest, southWest, southEast]) / 1e6;
        };

        service.getCircleCenter = function (overlay) {
            return [overlay.getCenter().lng().toFixed(2), overlay.getCenter().lat().toFixed(2)];
        };

        service.getCircleRadius = function (overlay) {
            return overlay.getRadius().toFixed(2);
        };

        service.computeCircleArea = function (overlay) {
            return Math.PI * Math.pow(overlay.getRadius() / 1000, 2);
        };

        service.getDrawingManagerOptions = function(type) {
            if (!type) {
                return {};
            }

            var typeOptions;

            if (type === 'rectangle') {
                typeOptions = 'rectangleOptions';
            } else if (type === 'circle') {
                typeOptions = 'circleOptions';
            } else if (type === 'polygon') {
                typeOptions = 'polygonOptions';
            }

            var drawingManagerOptions = {
                'drawingControl': false
            };
            drawingManagerOptions.drawingMode = type;
            drawingManagerOptions[typeOptions] = {
                'strokeColor': '#ff0000',
                'strokeWeight': 5,
                'fillColor': 'yellow',
                'fillOpacity': 0,
                'editable': true
            };

            return drawingManagerOptions;
        };

    });

})();
