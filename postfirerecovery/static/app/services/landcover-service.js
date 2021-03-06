(function () {

    'use strict';

    angular.module('postfirerecovery')
    .service('LandCoverService', function ($http, $q) {

        var service = this;

        service.getLandCoverMap = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;
            var parameter = options.parameter;
            var fireName = options.fireName;

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

            if (hucName && hucName.length > 0) {
                req.data.hucName = hucName;
            } else if (parameter && parameter.length > 0) {
              req.data.parameter = parameter;  
            } else if (fireName && fireName.length > 0) {
                req.data.fireName = fireName;
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

        service.getStats = function (options) {

            var primitives = options.primitives;
            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;
            var parameter = options.parameter;
            var fireName = options.fireName;

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

            if (hucName && hucName.length > 0) {
                req.data.hucName = hucName;
            } else if (parameter && parameter.length > 0) {
              req.data.parameter = parameter;  
            } else if (fireName && fireName.length > 0) {
                req.data.fireName = fireName;
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

        service.getCompositeMap = function (options) {

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
            var parameter = options.parameter;
            var fireName = options.fireName;

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

            if (hucName && hucName.length > 0) {
                req.data.hucName = hucName;
            } else if (parameter && parameter.length > 0) {
              req.data.parameter = parameter;  
            } else if (fireName && fireName.length > 0) {
                req.data.fireName = fireName;
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

        service.getDownloadURL = function (options) {

            // Common params
            var year = options.year;
            var shape = options.shape;
            var hucName = options.hucName;
            var parameter = options.parameter;
            var fireName = options.fireName;
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

            if (hucName && hucName.length > 0) {
                req.data.hucName = hucName;
            } else if (parameter && parameter.length > 0) {
              req.data.parameter = parameter;  
            } else if (fireName && fireName.length > 0) {
                req.data.fireName = fireName;
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

        service.getColumnStatData = function (options, years) {
            var promises = [];
            years.forEach(function (year) {
                options.year = year;
                promises.push(service.getStats(options));
            });
            var promise = $q.all(promises)
            .then(function (results) {
                return results;
                /*results.forEach(function(data, status, headers, config) {
                    return data;
                });*/
            });
            return promise;
        };

        service.getDataset = function (options) {

            var name = options.name;
            var year = options.year;

            var req = {
                method: 'POST',
                url: '/api/landcover/',
                data: {
                    name: name,
                    year: year
                },
                params: {
                    action: 'dataset'
                }
            };

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
