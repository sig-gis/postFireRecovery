# -*- coding: utf-8 -*-

import os
from os.path import isfile, join

os.path.dirname(os.path.dirname(__file__))
path = os.path.join(os.getcwd() ,'../postfirerecovery/static/data/fire_area_by_name/geojson')
path = os.path.abspath(path)

files = [f.split('.geo.json')[0] for f in os.listdir(path) if isfile(join(path, f))]

f = open('fireareaname', 'w')
f.write(str(files))
f.close()
