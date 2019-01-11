var settings = {
    menus: [
        {
            'name': 'About',
            'url': '#',
            'show': true
        },
        {
            'name': 'How to Use',
            'url': '#',
            'show': true
        },
        {
            'name': 'Contact Us',
            'url': 'contact_us',
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
    hucUnits: ['Baxter Creek-Frontal Honey Lake', 'Butt Creek', 'City of Reno-Truckee River', 'Deer Creek', 'Downie River', 'East Branch North Fork Feather River', 'Greenhorn Creek', 'Hamilton Branch', 'Headwaters North Fork Feather River', 'Last Chance Creek', 'Lemmon Valley', 'Lights Creek', 'Little Last Chance Creek', 'Little Truckee River', 'Lower Indian Creek', 'Lower Long Valley Creek-Frontal Honey Lake', 'Lower Middle Fork Feather River', 'Lower North Fork Feather River', 'Lower North Yuba River', 'Lower Susan River-Frontal Honey Lake', 'Middle Middle Fork Feather River', 'Middle North Fork Feather River', 'Middle North Yuba River', 'Middle Yuba River', 'Mill Creek', 'Red Clover Creek', 'Sierra Valley', 'Smithneck Creek', 'South Fork Feather River', 'Spanish Creek', 'Upper Butte Creek', 'Upper Indian Creek', 'Upper Long Valley Creek', 'Upper Middle Fork Feather River', 'Upper North Fork Feather River', 'Upper North Yuba River', 'Upper Susan River', 'West Branch Feather River', 'Wolf Creek', 'Yellow Creek'],
    landCoverClasses: [
        {
            'name': 'Evergreen Forest',
            'value': '0',
            'color': '#7c9c60',
            'tooltip': 'Evergreen Forest'
        },
        {
            'name': 'Shrub/Scrub',
            'value': '1',
            'color': '#4d949c',
            'tooltip': 'Shrub/Scrub'
        },
        {
            'name': 'Barren Land (Rock/Sand/Clay)',
            'value': '2',
            'color': '#9c792a',
            'tooltip': 'Barren Land (Rock/Sand/Clay)'
        },
        {
            'name': 'Developed',
            'value': '3',
            'color': '#919c91',
            'tooltip': 'Developed'
        },
        {
            'name': 'Grassland/Herbaceous',
            'value': '4',
            'color': '#26d062',
            'tooltip': 'Grassland/Herbaceous'
        },
        {
            'name': 'Open Water',
            'value': '5',
            'color': '#11d0c7',
            'tooltip': 'Open Water'
        },
        {
            'name': 'Deciduous Forest',
            'value': '6',
            'color': '#ffa400',
            'tooltip': 'Deciduous Forest'
        },
        {
            'name': 'Woody Wetlands',
            'value': '7',
            'color': '#b341e2',
            'tooltip': 'Woody Wetlands'
        }
    ]
};

angular.module('postfirerecovery')
.constant('appSettings', settings);
