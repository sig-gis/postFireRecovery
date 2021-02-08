# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from .core import Classification
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import bleach
import json

PUBLIC_METHODS = [
    'landcovermap',
    'composite',
    'get-download-url',
    'get-stats',
    'dataset'
]


@csrf_exempt
@require_POST
def api(request):
    post = json.loads(request.body).get
    get = request.GET.get
    action = get('action', '')

    if action and action in PUBLIC_METHODS:
        year = post('year', 2018)
        shape = post('shape', '')
        geom = post('geom', '')
        radius = post('radius', '')
        center = post('center', '')
        huc_name = post('hucName', '')
        parameter = post('parameter', '')
        fire_name = post('fireName', '')
        type = post('type', 'landcover')
        report_area = True if get('report-area') == 'true' else False
        primitives = post('primitives', range(0, len(Classification.CLASSES)))
        dataset = post('name', '')

        # sanitize
        # using older version of bleach to keep intact with the django cms
        file_name = bleach.clean(post('fileName', ''))

        # gamma = post('gamma', 1)
        season = post('season', 'fall')
        visualize = post('visualize', 'rgb')
        red_band = post('redBand')
        green_band = post('greenBand')
        blue_band = post('blueBand')
        grayscale_band = post('grayscaleBand')
        palette = post('palette')

        core = Classification(huc_name, parameter, fire_name, shape, geom, radius, center)

        if action == 'landcovermap':
            if isinstance(primitives, str):
                try:
                    primitives = primitives.split(',')
                    primitives = [int(primitive) for primitive in primitives]
                except Exception as e:

                    return JsonResponse({'error': e.message()})
            elif isinstance(primitives, list):
                # Do nothing
                pass
            else:
                return JsonResponse({'error': 'We accept comma-separated string!'})

            data = core.get_landcover(primitives=primitives, year=year)

        elif action == 'composite':
            data = core.get_composite(year=year,
                                      # gamma = gamma,
                                      season=season,
                                      visualize=visualize,
                                      red_band=red_band,
                                      green_band=green_band,
                                      blue_band=blue_band,
                                      grayscale_band=grayscale_band,
                                      palette=palette)

        elif action == 'dataset':
            data = Classification.get_dataset(year=year, name=dataset)

        elif action == 'get-download-url':
            data = core.get_download_url(type=type,
                                         year=year,
                                         primitives=primitives,
                                         # gamma = gamma,
                                         season=season,
                                         visualize=visualize,
                                         red_band=red_band,
                                         green_band=green_band,
                                         blue_band=blue_band,
                                         grayscale_band=grayscale_band,
                                         palette=palette,
                                         )

        elif action == 'get-stats':
            if isinstance(primitives, str):
                try:
                    primitives = primitives.split(',')
                    primitives = [int(primitive) for primitive in primitives]
                except Exception as e:

                    return JsonResponse({'error': e.message()})
            elif isinstance(primitives, list):
                # Do nothing
                pass
            else:
                return JsonResponse({'error': 'We accept comma-separated string!'})

            data = core.get_stats(year=year, primitives=primitives)

        if 'error' in data:
            return JsonResponse(data, status=500)
        # success response
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Method not allowed!'}, status=405)
