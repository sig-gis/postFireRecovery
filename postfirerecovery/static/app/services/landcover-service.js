(function () {

    'use strict';

    angular.module('postfirerecovery')
    .service('LandCoverService', function ($http) {

        this.getLandCoverMap = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    year: year,
                    primitives: primitives.toString()
                },
                params: {
                    action: 'landcovermap'
                }
            };

            if (hucName) {
                req.data.hucName = hucName;
            } else if (shape) {
                var shapeType = shape.type;
                if (shapeType === 'rectangle' || shapeType === 'polygon') {
                    req.data.shape = shapeType;
                    req.data.geom = shape.geom.toString();
                } else if (shapeType === 'circle') {
                    req.data.shape = shapeType;
                    req.data.radius = shape.radius;
                    req.data.center = shape.center.toString();
                }
            }

            var promise = $http(req)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.getStats = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    year: year,
                    primitives: primitives.toString()
                },
                params: {
                    action: 'get-stats'
                }
            };

            if (hucName) {
                req.data.hucName = hucName;
            } else if (shape) {
                var shapeType = shape.type;
                if (shapeType === 'rectangle' || shapeType === 'polygon') {
                    req.data.shape = shapeType;
                    req.data.geom = shape.geom.toString();
                } else if (shapeType === 'circle') {
                    req.data.shape = shapeType;
                    req.data.radius = shape.radius;
                    req.data.center = shape.center.toString();
                }
            }

            var promise = $http(req)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.getCompositeMap = function (options) {

            // Params for visualization
            var season = options.season;
            //var gamma = options.gamma;
            var visualize = options.visualize;
            var redBand = options.redBand;
            var greenBand = options.greenBand;
            var blueBand = options.blueBand;
            var grayscaleBand = options.grayscaleBand;
            var palette = options.palette;

            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    year: year,
                    season: season,
                    //gamma: gamma,
                    visualize: visualize,
                    redBand: redBand,
                    greenBand: greenBand,
                    blueBand: blueBand,
                    grayscaleBand: grayscaleBand,
                    palette: palette
                },
                params: {
                    action: 'composite'
                }
            };

            if (hucName) {
                req.data.hucName = hucName;
            } else if (shape) {
                var shapeType = shape.type;
                if (shapeType === 'rectangle' || shapeType === 'polygon') {
                    req.data.shape = shapeType;
                    req.data.geom = shape.geom.toString();
                } else if (shapeType === 'circle') {
                    req.data.shape = shapeType;
                    req.data.radius = shape.radius;
                    req.data.center = shape.center.toString();
                }
            }

            var promise = $http(req)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.getDownloadURL = function (options) {

            // Common params
            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;
            var type = options.type;
            // Land cover params
            var primitives = options.primitives;
            // Composite params
            var season = options.season;
            //var gamma = options.gamma;
            var visualize = options.visualize;
            var redBand = options.redBand;
            var greenBand = options.greenBand;
            var blueBand = options.blueBand;
            var grayscaleBand = options.grayscaleBand;
            var palette = options.palette;

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    year: year,
                    type: type,
                    primitives: primitives.toString(),
                    season: season,
                    //gamma: gamma,
                    visualize: visualize,
                    redBand: redBand,
                    greenBand: greenBand,
                    blueBand: blueBand,
                    grayscaleBand: grayscaleBand,
                    palette: palette
                },
                params: {
                    action: 'get-download-url'
                }
            };

            if (hucName) {
                req.data.hucName = hucName;
            } else if (shape) {
                var shapeType = shape.type;
                if (shapeType === 'rectangle' || shapeType === 'polygon') {
                    req.data.shape = shapeType;
                    req.data.geom = shape.geom.toString();
                } else if (shapeType === 'circle') {
                    req.data.shape = shapeType;
                    req.data.radius = shape.radius;
                    req.data.center = shape.center.toString();
                }
            }

            var promise = $http(req)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;
        };

        this.saveToDrive = function (type, shape, areaSelectFrom, areaName, year, primitives, fileName, index, serviceType) {

            var url = '/api/landcover/';
            if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-fra/';
            } else if (serviceType === 'myanmar-fra') {
                url = '/api/myanmar-ipcc';
            }

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    year: year,
                    type: type,
                    primitives: primitives.toString(),
                    fileName: fileName,
                    index: index
                },
                params: {
                    action: 'download-to-drive'
                }
            };

            if (areaSelectFrom && areaName) {
                req.data.areaSelectFrom = areaSelectFrom;
                req.data.areaName = areaName;
            } else {
                var shapeType = shape.type;
                if (shapeType === 'rectangle' || shapeType === 'polygon') {
                    req.data.shape = shapeType;
                    req.data.geom = shape.geom.toString();
                } else if (shapeType === 'circle') {
                    req.data.shape = shapeType;
                    req.data.radius = shape.radius;
                    req.data.center = shape.center.toString();
                }
            }

            var promise = $http(req)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    console.log('Error: ', e);
                    throw e.data;
                });
            return promise;

        };

    });

})();
