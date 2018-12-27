var settings = {
    menus: [
        {
            'name': 'About',
            'url': '#',
            'show': true
        },
        {
            'name': 'Contact Us',
            'url': '#',
            'show': true
        }
    ],
    applicationName: 'Post Fire Recovery',
    partnersHeader: [
        {
            'alt': 'The National Aeronautics and Space Administration',
            'url': 'https://www.nasa.gov/',
            'src': 'images/nasa.png',
            'className': 'nasa'
        },
        {
            'alt': 'Spatial Infomatics Group',
            'url': 'https://sig-gis.com/',
            'src': 'images/sig.png',
            'className': 'sig'
        }
    ],
    seasons: ['Fall', 'Summer'],
    bands: ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'],
    bandSelector: [
        {
            'value': 'grayscale',
            'name': '1 band (Grayscale)'
        },
        {
            'value': 'rgb',
            'name': '3 bands (RGB)'
        }
    ],
    // this list is generated from python script at /scripts/list-huc.py
    hucUnits: ['City of Reno-Truckee River', 'Downie River', 'Lemmon Valley', 'Little Truckee River', 'Lower North Yuba River', 'Middle Middle Fork Feather River', 'Middle North Yuba River', 'Middle Yuba River', 'Sierra Valley', 'Smithneck Creek', 'South Fork Feather River', 'Upper Long Valley Creek', 'Upper Middle Fork Feather River', 'Upper North Yuba River'],
    landCoverClasses: [
        {
            'name': 'Evergreen Forest',
            'value': '0',
            'color': '#7c9c60'
        },
        {
            'name': 'Shrub/Scrub',
            'value': '1',
            'color': '#4d949c'
        },
        {
            'name': 'Barren Land (Rock/Sand/Clay)',
            'value': '2',
            'color': '#9c792a'
        },
        {
            'name': 'Developed',
            'value': '3',
            'color': '#919c91'
        },
        {
            'name': 'Grassland/Herbaceous',
            'value': '4',
            'color': '#26d062'
        },
        {
            'name': 'Open Water',
            'value': '5',
            'color': '#11d0c7'
        },
        {
            'name': 'Deciduous Forest',
            'value': '6',
            'color': '#ffa400'
        },
        {
            'name': 'Woody Wetlands',
            'value': '7',
            'color': '#b341e2'
        }
    ]
};

angular.module('postfirerecovery')
.constant('appSettings', settings);
