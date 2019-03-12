# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.conf import settings
from utils.utils import get_unique_string, transfer_files_to_user_drive

import ee, json, os, time

# -----------------------------------------------------------------------------
class Classification():
    '''
        Google Earth Engine API
    '''

    ee.Initialize(settings.EE_CREDENTIALS)

    AOI = ee.FeatureCollection('users/biplov/postfirerecovery/AOI/sierra_plus_plumas')
    GEOMETRY = AOI.geometry()

    # burn parameters
    BURN_PARAMETERS = {
        'all': ee.FeatureCollection('users/biplov/postfirerecovery/FireSeverity/all'),
        'high': ee.FeatureCollection('users/biplov/postfirerecovery/FireSeverity/high'),
        'low': ee.FeatureCollection('users/biplov/postfirerecovery/FireSeverity/low'),
        'moderate': ee.FeatureCollection('users/biplov/postfirerecovery/FireSeverity/moderate'),
        'unchanged': ee.FeatureCollection('users/biplov/postfirerecovery/FireSeverity/unchanged'),
    }
    FIRE_NAME_COLLECTION = ee.FeatureCollection('users/biplov/postfirerecovery/FireName/allArea')
    WATERSHEDS = ee.FeatureCollection('users/biplov/postfirerecovery/watershed/watershed')

    LANDCOVERMAP = ee.ImageCollection('users/TEST/CAFire/RandomForest/RF_classification_v2')
    COMPOSITE_FALL = ee.ImageCollection('users/TEST/CAFire/SeasonComposites/Fall_Full')
    COMPOSITE_SUMMER = ee.ImageCollection('users/TEST/CAFire/SeasonComposites/Summer_Full')

    # other datasets
    NASA_FIRMS = ee.ImageCollection('FIRMS')
    TERRA_THERMAL = ee.ImageCollection('MODIS/006/MOD14A1')
    AQUA_THERMAL = ee.ImageCollection('MODIS/006/MYD14A1')

    # Class and Index
    CLASSES = [
        {
            'name': 'Evergreen Forest',
            'value': '0',
            'color': '38814e'
        },
        {
            'name': 'Shrub/Scrub',
            'value': '1',
            'color': 'dcca8f'
        },
        {
            'name': 'Barren Land (Rock/Sand/Clay)',
            'value': '2',
            'color': '9c792a'
        },
        {
            'name': 'Developed',
            'value': '3',
            'color': 'ff0000'
        },
        {
            'name': 'Grassland/Herbaceous',
            'value': '4',
            'color': 'fde9aa'
        },
        {
            'name': 'Open Water',
            'value': '5',
            'color': '5475a8'
        },
        {
            'name': 'Deciduous Forest',
            'value': '6',
            'color': '85c77e'
        },
        {
            'name': 'Woody Wetlands',
            'value': '7',
            'color': 'c8e6f8'
        }
    ]

    INDEX_CLASS = {}
    for _class in CLASSES:
        INDEX_CLASS[int(_class['value'])] = _class['name']

    # -------------------------------------------------------------------------
    def __init__(self, huc_name, parameter, fire_name, shape, geom, radius, center):

        self.geom = geom
        self.radius = radius
        self.center = center
        self.parameter_type = None
        self.band_names = Classification.COMPOSITE_FALL.first().bandNames().getInfo()
        if shape:
            self.geometry = self.get_geometry_from_shape(shape)
        elif huc_name:
            if isinstance(huc_name, (str, unicode)):
                huc_name = [huc_name]
            self.geometry = Classification.WATERSHEDS.filter(ee.Filter.inList('name', huc_name)).geometry()
        elif parameter:
            self.parameter_type = True
            #self.geometry = self.parameter_type.geometry().bounds()
            if isinstance(parameter, (str, unicode)):
                parameter = [parameter]
            self.clipAOI = ee.FeatureCollection([])
            for severity in parameter:
                self.clipAOI = self.clipAOI.merge(Classification.BURN_PARAMETERS[severity.lower()])
            # check the geom; maybe use the gdal to clip out area later
            self.geometry = self.AOI.geometry()
        elif fire_name:
            #self.geometry = Classification.FIRE_NAME_COLLECTION.filterMetadata('name', 'equals', fire_name)
            if isinstance(fire_name, (str, unicode)):
                fire_name = [fire_name]
            self.geometry = Classification.FIRE_NAME_COLLECTION.filter(ee.Filter.inList('name', fire_name)).geometry()
            #self.geometry = ee.FeatureCollection('users/biplov/postfirerecovery/FireName/{}'.format(fire_name))
        else:
            self.geometry = Classification.GEOMETRY

    # -------------------------------------------------------------------------
    def get_geometry_from_shape(self, shape):

        if shape:
            if shape == 'rectangle':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                return ee.Geometry.Rectangle(coor_list)
            elif shape == 'circle':
                _geom = self.center.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                return ee.Geometry.Point(coor_list).buffer(float(self.radius))
            elif shape == 'polygon':
                _geom = self.geom.split(',')
                coor_list = [float(_geom_) for _geom_ in _geom]
                if len(coor_list) > 500:
                    return ee.Geometry.Polygon(coor_list).convexHull()
                return ee.Geometry.Polygon(coor_list)

        return Classification.GEOMETRY

    # -------------------------------------------------------------------------
    @staticmethod
    def get_dataset(year, name):

        if year:
            year = str(year)

        if name == 'NASA_FIRMS':
            image = Classification.NASA_FIRMS.filterDate(year + '-01-01', year + '-12-31').select(['T21'])
            map_id = image.getMapId({
                'min'    : '300',
                'max'    : '500',
                'palette': 'green,orange,yellow,red'
            })
        elif name == 'TERRA_THERMAL':
            image_collection = Classification.TERRA_THERMAL.filterDate(year + '-01-01', year + '-12-31')
            map_id = image_collection.getMapId({
                'min': '0.0',
                'max': '6000.0',
                'bands': ['MaxFRP', 'FireMask', 'FireMask']
            })
        elif name == 'AQUA_THERMAL':
            image_collection = Classification.AQUA_THERMAL.filterDate(year + '-01-01', year + '-12-31')
            map_id = image_collection.getMapId({
                'min': '0.0',
                'max': '6000.0',
                'bands': ['MaxFRP', 'FireMask', 'FireMask']
            })
        else:
            return {'error': 'The requested dataset is not available. The available options are' + 
                             'NASA_FIRMS, TERRA_THERMAL, AQUA_THERMAL'
            }

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_landcover(self, primitives=range(0, 8), year=2018, download=False):

        image = ee.Image(self.LANDCOVERMAP.filterDate('%s-01-01' % year,
                                                      '%s-12-31' % year).mean())

        # Start with creating false boolean image
        masked_image = image.eq(ee.Number(100))

        # mask image
        for index in primitives:
            _mask = image.eq(ee.Number(int(index)))
            masked_image = masked_image.add(_mask)

        palette = []
        for _class in Classification.CLASSES:
            palette.append(_class['color'])

        palette = ','.join(palette)

        image = image.updateMask(masked_image)

        if self.parameter_type:
            image = image.clipToCollection(self.clipAOI)
        else:
            image = image.clip(self.geometry)

        if download:
            return image

        map_id = image.getMapId({
            'min': '0',
            'max': str(len(Classification.CLASSES) - 1),
            'palette': palette
        })

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }

    # -------------------------------------------------------------------------
    def get_composite(self,
                      year = 2018,
                      #gamma = 1,
                      season = 'fall',
                      visualize = 'rgb',
                      red_band = None,
                      green_band = None,
                      blue_band = None,
                      grayscale_band = None,
                      download = False,
                      palette = None,
                      ):

        visualization_parameters = {
            #'gamma': '{}'.format(gamma),
            'min'  : '40',
            'max'  : '2500'
        }

        if visualize == 'rgb':
            if not red_band:
                red_band = self.band_names[0]
            if not green_band:
                green_band = self.band_names[1]
            if not blue_band:
                blue_band = self.band_names[2]

            #visualization_parameters['bands'] = '{},{},{}'.format(red_band, green_band, blue_band)
            visualization_parameters['bands'] = ['{}'.format(red_band),'{}'.format(green_band),'{}'.format(blue_band)]

        elif visualize == 'grayscale':
            if not grayscale_band:
                grayscale_band = self.band_names[0]
            visualization_parameters['bands'] = ['{}'.format(grayscale_band)]

            if palette:
                visualization_parameters['palette'] = palette

        if season == 'fall':
            image = ee.Image(Classification.COMPOSITE_FALL.filterDate('%s-01-01' % year,
                                                                      '%s-12-31' % year).mean())
        elif season == 'summer':
            image = ee.Image(Classification.COMPOSITE_SUMMER.filterDate('%s-01-01' % year,
                                                                        '%s-12-31' % year).mean())

        if self.parameter_type:
            image = image.clipToCollection(self.geometry)
        else:
            image = image.clip(self.geometry)

        if download:
            #return image.select(red_band).addBands(image.select(green_band)).addBands(image.select(blue_band))
            #return ee.Image.rgb(image.select(red_band), image.select(green_band), image.select(blue_band))
            #return image.select(['{}'.format(red_band),'{}'.format(green_band),'{}'.format(blue_band)])
            return image.clip(self.geometry).visualize(
                bands = visualization_parameters['bands'],
                min = visualization_parameters['min'],
                max = visualization_parameters['max'],
                #gamma = visualization_parameters['gamma'],
                palette = visualization_parameters['palette'] if palette else None
            )

        map_id = image.getMapId(visualization_parameters)

        return {
            'eeMapId': str(map_id['mapid']),
            'eeMapToken': str(map_id['token'])
        }
        

    # -------------------------------------------------------------------------
    def get_download_url(self,
                         type = 'landcover',
                         year = 2018,
                         primitives = range(0, 8),
                         #gamma = 1,
                         season = 'fall',
                         visualize = 'rgb',
                         red_band = None,
                         green_band = None,
                         blue_band = None,
                         grayscale_band = None,
                         palette = None,
                         ):

        if type == 'landcover':
            image = self.get_landcover(primitives=primitives, year=year, download=True)
        elif type == 'composite':
            image = self.get_composite(year = year,
                                       #gamma = gamma,
                                       season = season,
                                       visualize = visualize,
                                       red_band = red_band,
                                       green_band = green_band,
                                       blue_band = blue_band,
                                       grayscale_band = grayscale_band,
                                       download = True,
                                       palette = palette)

        try:
            if self.parameter_type:
                image = image.clipToCollection(self.clipAOI)
            else:
                image = image.clip(self.geometry)

            download_parameters = {
                'name': type,
                'scale': 30,
                'region': self.geometry.bounds().getInfo()['coordinates']
            }

            url = image.getDownloadURL(download_parameters)
            return {'downloadUrl': url}
        except Exception as e:
            return {'error': '{} Try using download to drive options for larger area!'.format(e.message)}

    # -------------------------------------------------------------------------
    def download_to_drive(self,
                          type = 'landcover',
                          year = 2018,
                          primitives=range(0, 8),
                          index = 0,
                          file_name = '',
                          user_email = None,
                          user_id = None,
                          oauth2object = None,
                          ):

        if not (user_email and user_id and oauth2object):
            return {'error': 'something wrong with the google drive api!'}

        if type == 'landcover':
            image = self.get_landcover(primitives = primitives, year=year, download=True)

        temp_file_name = get_unique_string()

        if not file_name:
            file_name = temp_file_name + '.tif'
        else:
            file_name = file_name + '.tif'

        try:
            task = ee.batch.Export.image.toDrive(
                image = image,
                description = 'Export for the Post Fire Recovery',
                fileNamePrefix = temp_file_name,
                scale = 30,
                region = self.geometry.bounds().getInfo()['coordinates'],#self.geometry.getInfo()['coordinates'],
                skipEmptyTiles = True,
                maxPixels = 1E13
            )
        except Exception as e:
            return {'error': e.message}

        task.start()

        i = 1
        while task.active():
            print ('past %d seconds' % (i * settings.EE_TASK_POLL_FREQUENCY))
            i += 1
            time.sleep(settings.EE_TASK_POLL_FREQUENCY)
        
        # Make a copy (or copies) in the user's Drive if the task succeeded
        state = task.status()['state']
        if state == ee.batch.Task.State.COMPLETED:
            try:
                link = transfer_files_to_user_drive(temp_file_name,
                                                    user_email,
                                                    user_id,
                                                    file_name,
                                                    oauth2object)
                return {'driveLink': link}
            except Exception as e:
                print (str(e))
                return {'error': str(e)}
        else:
            print ('Task failed (id: %s) because %s.' % (task.id, task.status()['error_message']))
            return {'error': 'Task failed (id: %s) because %s.' % (task.id, task.status()['error_message'])}

    # -------------------------------------------------------------------------
    def get_stats(self, year=2018, primitives=range(0, 8)):

        image = self.get_landcover(primitives=primitives, year=year, download=True)

        stats = image.reduceRegion(reducer = ee.Reducer.frequencyHistogram(),
                                   geometry = self.geometry,
                                   crs = 'EPSG:3310', #'EPSG:6418',
                                   scale = 100,
                                   maxPixels = 1E13
                                   )

        data = stats.getInfo()['Mode']
        # converting to meter square by multiplying with scale value i.e. 100*100
        # and then converting to hectare multiplying with 0.0001
        # area = reducer.getInfo()['Mode'] * 100 * 100 * 0.0001 # in hectare
        # meaning we can use the value directly as the hectare
        return {self.INDEX_CLASS[int(float(k))]:float('{0:.2f}'.format(v)) for k,v  in data.items()}
