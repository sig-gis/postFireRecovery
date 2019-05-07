var settings = {
    menus: [
        {
            'name': 'Map',
            'url': 'map',
            'show': true,
            'sref': true
        },
        {
            'name': 'Analysis',
            'url': 'analysis',
            'show': true,
            'sref': true
        },
        {
            'name': 'Data',
            'url': '/static/data/',
            'show': true,
            'sref': false
        },
        /*{
            'name': 'How To Use',
            'url': 'https://goo.gl/sD9QLo',
            'show': true,
            'sref': false
        },*/
        {
            'name': 'Contact Us',
            'url': 'contact_us',
            'show': true,
            'sref': true
        }
    ],
    applicationName: 'Post Fire Vegetation Monitoring System',
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
    selectors: [
        {
            'value': 'fireName',
            'name': 'Fire Name'
        },
        {
            'value': 'hucUnit',
            'name': 'Hydrological Unit'
        },
        {
            'value': 'burnSeverity',
            'name': 'Vegetation Burn Severity'
        }
    ],
    fireDatasets: [
        {
            'name'       : 'NASA FIRMS T21',
            'datasetName': 'NASA_FIRMS',
            'url'        : 'https://developers.google.com/earth-engine/datasets/catalog/FIRMS'
        },
        {
            'name'       : 'Terra Thermal MaxFRP',
            'datasetName': 'TERRA_THERMAL',
            'url'        : 'https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MOD14A1'
        },
        {
            'name'       : 'Aqua Thermal MaxFRP',
            'datasetName': 'AQUA_THERMAL',
            'url'        : 'https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MYD14A1'
        }
        /*{
            'name' : 'FIRMS MODIS Terra 7 Days',
            'wms'  : 'https://firms.modaps.eosdis.nasa.gov/wms/?REQUEST=GetMap&layers=fires_terra_7&WIDTH=1024&HEIGHT=512&BBOX=-180,-90,180,90&MAP_KEY=fa826d02e3ba2a61a559efad46da25b0'
        }*/
    ],
    fireParameters: ['High', 'Low', 'Moderate', 'Unchanged'],
    // this list is generated from python script at /scripts/list-firenames.py
    listFireNames: ['Antelope_Cmplx_2007', 'Assist_Pnf_1987', 'Bar_2010', 'Bassetts_2006', 'Bear_2008', 'Belden_2008', 'Boulder_Cmplx_2006', 'Bucks_1999', 'Buttes_1990', 'Capnf00000282_1988', 'Catoi00000031_1984', 'Celina_2008', 'Chips_2012', 'Clark_1987', 'Cold_2008', 'Cooks_1996', 'Cottonwood_1994', 'Cottonwood_2004', 'Crystal_1994', 'Cub_2008', 'Devilsgap_1999', 'Eagle_1989', 'Elephant_2009', 'Eureka_2017', 'Grease_2006', 'Greengulch_1984', 'Greenhorn_1990', 'Harding_2005', 'Hartman_2008', 'Horton2_1999', 'Indian_1987', 'Layman_1989', 'Little_2008', 'Lookout_1999', 'Maddalena_1996', 'Milford_Grade_2009', 'Minerva5_2017', 'Moonlight_2007', 'Palmer_1987', 'Peak_2012', 'Pidgen_1999', 'Pit_2008', 'Rack_1989', 'Rich_2008', 'Ridge_Heights_2013', 'Rock_Creek_2001', 'Scotch_2008', 'Silver_2009', 'Stag_1999', 'Storrie_2000', 'Stream_2001', 'Tobin_2016', 'Treasure_2001', 'Usfs_Assist3_1988', 'Walker_1990'],
    // this list is generated from python script at /scripts/list-huc.py
    hucUnits: ['Baxter Creek-Frontal Honey Lake', 'Butt Creek', 'City of Reno-Truckee River', 'Deer Creek', 'Downie River', 'East Branch North Fork Feather River', 'Greenhorn Creek', 'Hamilton Branch', 'Headwaters North Fork Feather River', 'Last Chance Creek', 'Lemmon Valley', 'Lights Creek', 'Little Last Chance Creek', 'Little Truckee River', 'Lower Indian Creek', 'Lower Long Valley Creek-Frontal Honey Lake', 'Lower Middle Fork Feather River', 'Lower North Fork Feather River', 'Lower North Yuba River', 'Lower Susan River-Frontal Honey Lake', 'Middle Middle Fork Feather River', 'Middle North Fork Feather River', 'Middle North Yuba River', 'Middle Yuba River', 'Mill Creek', 'Red Clover Creek', 'Sierra Valley', 'Smithneck Creek', 'South Fork Feather River', 'Spanish Creek', 'Upper Butte Creek', 'Upper Indian Creek', 'Upper Long Valley Creek', 'Upper Middle Fork Feather River', 'Upper North Fork Feather River', 'Upper North Yuba River', 'Upper Susan River', 'West Branch Feather River', 'Wolf Creek', 'Yellow Creek'],
    landCoverClasses: [
        {
            'name': 'Evergreen Forest',
            'value': '0',
            'color': '#38814e',
            'tooltip': 'Evergreen Forest'
        },
        {
            'name': 'Shrub/Scrub',
            'value': '1',
            'color': '#dcca8f',
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
            'color': '#ff0000',
            'tooltip': 'Developed'
        },
        {
            'name': 'Grassland/Herbaceous',
            'value': '4',
            'color': '#fde9aa',
            'tooltip': 'Grassland/Herbaceous'
        },
        {
            'name': 'Open Water',
            'value': '5',
            'color': '#5475a8',
            'tooltip': 'Open Water'
        },
        {
            'name': 'Deciduous Forest',
            'value': '6',
            'color': '#85c77e',
            'tooltip': 'Deciduous Forest'
        },
        {
            'name': 'Woody Wetlands',
            'value': '7',
            'color': '#c8e6f8',
            'tooltip': 'Woody Wetlands'
        }
    ]
};

angular.module('postfirerecovery')
.constant('appSettings', settings);
