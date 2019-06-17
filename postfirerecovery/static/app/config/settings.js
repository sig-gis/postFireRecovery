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
            'url': '/data/',
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
    listFireNames: ['25_Fire_2008', '51_2006', '60_B_2011', 'Alder_2016', 'American_2000', 'American_2013', 'Ananda_2004', 'Angora_2007', 'Antelope_Cmplx_2007', 'Applegate_2014', 'Assist_Pnf_1987', 'Athens_2007', 'Athens_2008', 'Athens_2015', 'Athens_2016', 'Auburn_2007', 'Auburn_2016', 'Axel_2017', 'Bacchi_2003', 'Bake_2004', 'Baltic_2002', 'Baltic_2013', 'Bangor_2007', 'Bangor_2016', 'Bar_2010', 'Bar_2013', 'Baseline_2007', 'Baseline_2008', 'Baseline_2009', 'Baseline_2010', 'Baseline_2011', 'Baseline_2018', 'Bassetts_2006', 'Baxter_2015', 'Bayne_2007', 'Beale_2004', 'Beale_2009', 'Beale_2011', 'Beale_2012', 'Beale_2015', 'Beale_2016', 'Beale_2017', 'Beale_Afb_Beale_2013', 'Beale_Afb_Grass_Valley_Ga_2013', 'Beale_Assist_1998', 'Beale_Escape_2016', 'Bean_1999', 'Bean_2002', 'Bear_2008', 'Belden_2008', 'Berry_2008', 'Big_Mt_Rx_Escape_1999', 'Blackford_2017', 'Blacksmith_2011', 'Black_2002', 'Black_2010', 'Bloomer_1999', 'Blue_Oaks_2001', 'Bottle_2008', 'Boulder_Cmplx_2006', 'Braden_2005', 'Brewer_2012', 'Brewer_2014', 'Brewer_2016', 'Brewer_2017', 'Bridgeport_1994', 'Bridge_Incident_2010', 'Brown_2008', 'Bucks_1999', 'Bullards_2008', 'Bullards_Incident_2010', 'Bumper_2018', 'Burnett_2015', 'Butcher_2004', 'Buttes_1990', 'Camp_2018', 'Capnf00000282_1988', 'Capps_2008', 'Carson_2002', 'Cascade_2017', 'Catlett_2017', 'Catoi00000031_1984', 'Celina_2008', 'Chalk_Fire_2011', 'Chamberlin_Fire_2010', 'Chicken_2016', 'China_2017', 'Chips_2012', 'Chuck_2016', 'Clark_1987', 'Codfish_2003', 'Cold_2008', 'Colgate_2002', 'Collins_2012', 'Columbia_Hill_1996', 'Cooks_1996', 'Cook_2015', 'Cool_2008', 'Cottonwood_1994', 'Cottonwood_2004', 'Country_2015', 'County_2012', 'Cowboy_2002', 'Craig_2008', 'Crosby_2007', 'Cross_2005', 'Crystal_1994', 'Cub_2008', 'Cutter_2003', 'Daguerra_Point_2002', 'Deadwood_2000', 'Del_2008', 'Devilsgap_1999', 'Dobbins_Incident_2010', 'Dogbar_2014', 'Doolittle_2013', 'Doolittle_2015', 'Douglas_2016', 'Dredge_2002', 'Drivers_2000', 'Dunstone_1999', 'Dyer2_Incident_2010', 'Dyer_2009', 'Dyer_2012', 'Dyer_Incident_2010', 'D_Agostini_2002', 'Eagle_1989', 'Elephant_2009', 'Ethel_2001', 'Eureka_2017', 'Fall_2008', 'Feather_Falls_2008', 'Fiddyment_2007', 'Fiddyment_2009', 'Fiddyment_2011', 'Fiddyment_2012', 'Field_2002', 'Finley_2008', 'Forbestown_2008', 'Foresthill_2006', 'Foresthill_2008', 'Foresthill_2009', 'Forest_2006', 'Fork_2005', 'Forty_Nine_2009', 'Fountain_2015', 'Francis_2015', 'Freds_2004', 'French_2001', 'French_2017', 'Friend_Darnell_2008', 'Gap_2001', 'Garden_2002', 'Garden_2003', 'Garden_2005', 'Garden_2007', 'Garden_2008', 'Garden_2017', 'Gilardi_2008', 'Gladding_2008', 'Gladding_2013', 'Gold_1996', 'Gold_2017', 'Gondola_2002', 'Government_2008', 'Granite_2007', 'Granite_Ii_2002', 'Grant_2018', 'Grease_2006', 'Greengulch_1984', 'Greenhorn_1990', 'Greenhorn_2017', 'Greenstone_2002', 'Greenwood_2002', 'Greyhorse_2011', 'Grimy_2015', 'Grizzly_2017', 'Groovy_2011', 'Halcon_2002', 'Hammonton_2012', 'Hammonton_2013', 'Hammonton_2016', 'Harding_2005', 'Hartman_2008', 'Hazel_2012', 'Helester_1995', 'Henry_2013', 'Hickok_1997', 'Hickok_2002', 'Hill_2009', 'Horizon_2001', 'Horton2_1999', 'Hungry_1996', 'Hunter_2002', 'Hutto_2014', 'Ice_2017', 'Indian_1987', 'Indian_2011', 'Iowa_2014', 'Jasper_2007', 'Jasper_2017', 'Joines_2016', 'Kelsey_1994', 'Kibbe_2002', 'King_2014', 'Krista_2011', 'Kyburz_1996', 'Kyburz_2013', 'Kyburz_2015', 'Lakeview_2008', 'Lawyer_2_1997', 'Layman_1989', 'Lesvos_2015', 'Lincoln_City_Asst_2001', 'Lindsey_2007', 'Little_2008', 'Lobo_2017', 'Locust_2015', 'Loma_Rica____La_Porte_2007', 'Longjohn_2011', 'Long_2017', 'Lookout_1999', 'Loon_4_2002', 'Loon_5_2002', 'Lowell_2004', 'Lowell_2015', 'Lumpkin_2015', 'Maddalena_1996', 'Magnolia_2009', 'Mammoth_2009', 'Manzanita_2009', 'Marshal_2003', 'Martin_Ranch__1_1996', 'Marysville_2006', 'Maverick_2017', 'Maybert_1997', 'Mccourtney_2009', 'Mccourtney_2013', 'Mccourtney_2015', 'Mccourtney_2017', 'Mcdaniel_2013', 'Mcganney_2013', 'Mcoulloh_2015', 'Meadowlark_Incident_2010', 'Meadow_2015', 'Middle_2017', 'Milford_Grade_2009', 'Mill_1995', 'Miners_1995', 'Minerva5_2017', 'Mitchell_2004', 'Monument_2014', 'Mooney_2007', 'Moonlight_2007', 'Moore_2016', 'Mosquito_2011', 'Mountain_2005', 'Mule_2006', 'Murphy_2001', 'Mutton_2002', 'Myers_2018', 'Nader2_Incident_2010', 'Nader_2007', 'Nelson_2009', 'Nelson_2013', 'Nelson_2018', 'Nevada_2003', 'Newton_2018', 'Nicolaus_2008', 'Nicolaus_2018', 'Nicolaus_Westland_2013', 'Noodles_2011', 'North_2008', 'North_2018', 'Oak_2018', 'Old_2008', 'Olive_2015', 'Omega_2018', 'Onyx_2011', 'Ore_2006', 'Orr_Incident_2010', 'Palladay_2016', 'Palmer_1987', 'Parks_2003', 'Payen_2001', 'Peak_2012', 'Peavine_2008', 'Pendola_1999', 'Peoria_2004', 'Perimerter_2014', 'Peterson_2007', 'Pfe_2013', 'Pfe_2014', 'Phillips_2007', 'Phoenix_2016', 'Phyllip_2008', 'Pidgen_1999', 'Pines_2003', 'Pit_2008', 'Placerville_2007', 'Pleasant_2017', 'Plum_2002', 'Ponderosa_2001', 'Ponderosa_2002', 'Ponderosa_2017', 'Prairie_2007', 'Purdon_2006', 'Quail_1995', 'Rack_1989', 'Ralston_2007', 'Ranch_2017', 'Ravine_2008', 'Reedy_2014', 'Rex_2017', 'Rich_2008', 'Ridge_2018', 'Ridge_Heights_2013', 'Rifle_2008', 'Riosa2_Incident_2010', 'Riosa_2008', 'Riosa_2015', 'Riosa_Incident_2010', 'Robbers_2012', 'Robbs_2002', 'Rocklin_Clover_Incident_2010', 'Rock_Creek_2001', 'Rollins_2006', 'Sacred_2016', 'Saddle_1999', 'Saddle_2009', 'Sand_2014', 'Sand_Ridge_2005', 'Sankey_2018', 'Scotchman_2008', 'Scotch_2008', 'Scott_1996', 'Scott_2004', 'Scott_2011', 'Serenity_2005', 'Shields_Camp_1996', 'Shooting_2008', 'Sierra_2002', 'Sierra_2003', 'Sierra_2008', 'Sierra_2013', 'Silva_2001', 'Silver_1996', 'Silver_2009', 'Simmons_2018', 'Sixty_Five_2007', 'Sixty_Five_2_2007', 'Skunk_2006', 'Sky_Pilot_1997', 'Sliger_2018', 'Smartsville_2017', 'Smartville_2007', 'Smartville_2011', 'Smart_1998', 'Soldier_1994', 'Soldier_2008', 'South_1999', 'South_Beale_2007', 'South_Frey_2008', 'Spenceville_2007', 'Spenceville_2008', 'Spenceville_2011', 'Spenceville_2013', 'Spenceville_2017', 'Spence_2018', 'Spring_1996', 'Spring_2009', 'Stagecoach_2017', 'Stag_1999', 'Star_2001', 'Star_2012', 'Stevens_2004', 'Storksbill_2016', 'Storrie_2000', 'Stream_2001', 'St_Pauli_2002', 'Sunset_2008', 'Sunset_2009', 'Sunset_2016', 'Sunset_2018', 'Swedes_2013', 'Swedes_2015', 'Tanner_2015', 'Tells_1_2002', 'Tells_2_2002', 'Tells_3_2002', 'Thousand_2018', 'Thousand_Oaks_2013', 'Tobin_2016', 'Trailhead_2016', 'Trauner_1994', 'Treasure_2001', 'Twenty_2008', 'Twenty_2012', 'Twin_Bridges_2010', 'Tyler_2013', 'Uncle_Toms_1999', 'Union_1999', 'Union_2002', 'Union_2004', 'Unnamed_1994', 'Usfs_Assist3_1988', 'Valley_2003', 'Valley_2007', 'Vista_2016', 'Vista_2017', 'Volcano_2013', 'Waldo2_2016', 'Waldo_2007', 'Waldo_2011', 'Waldo_2012', 'Waldo_2013', 'Waldo_2016', 'Waldo_2_2007', 'Walegra_2016', 'Walker_1990', 'Walker_2014', 'Wall_1994', 'Wall_2017', 'Waltz_2012', 'Web_2015', 'Westville_2008', 'West_2017', 'West_Wise_2009', 'West_Wise_Fire_2011', 'White_2002', 'White__2_2002', 'Whitney_2001', 'Williams_1997', 'Wilson_2007', 'Wise_2008', 'Wolf_2015', 'Woodleaf_2006', 'Yeager_Incident_2011', 'Yuba_2009', 'Ziebright_2005'],
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
