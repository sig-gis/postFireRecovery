# -*- coding: utf-8 -*-

"""
Django settings for postfirerecovery project.
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import ee  # isort:skip
import json
import oauth2client
import os

gettext = lambda s: s

DATA_DIR = os.path.dirname(os.path.dirname(__file__))

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

print('DATA_DIR', DATA_DIR)
print('BASE_DIR', BASE_DIR)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_6kf5*%0%uf%nok@x&(17vswmoxj6on&_kfi$1gzka&%pw)_p&'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

#ALLOWED_HOSTS = ['44.204.54.199', 'localhost']
ALLOWED_HOSTS = ['*']

INTERNAL_IPS = (
    '127.0.0.1',
)

# Application definition

ROOT_URLCONF = 'postfirerecovery.urls'

WSGI_APPLICATION = 'postfirerecovery.wsgi.application'

# Celery

CELERY_BROKER_URL = 'amqp://localhost'

CELERY_RESULT_BACKEND = 'amqp'

CELERY_ACCEPT_CONTENT = ['pickle']

USE_CELERY = False

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postfirerecovery',
        'USER': 'postfirerecovery',
        'PASSWORD': 'postfirerecovery',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en'

TIME_ZONE = 'America/Los_Angeles'

USE_I18N = True

USE_L10N = True

USE_TZ = True

SITE_ID = 1

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(DATA_DIR, 'media')

STATIC_ROOT = os.path.join(DATA_DIR, 'static')

print(STATIC_ROOT)

# STATICFILES_DIRS = (
#    os.path.join(BASE_DIR, 'landcoverportal', 'static'),
# )


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'static', 'dist'), os.path.join(BASE_DIR, 'postfirerecovery', 'templates') ],
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.template.context_processors.csrf',
                'django.template.context_processors.tz',
                'sekizai.context_processors.sekizai',
                'django.template.context_processors.static',
                'postfirerecovery.context_processor.variable_settings',
                'cms.context_processors.cms_settings'
            ],
            'loaders': [
                'django.template.loaders.filesystem.Loader',
                'django.template.loaders.app_directories.Loader',
                'django.template.loaders.eggs.Loader'
            ],
        },
    },
]

MIDDLEWARE_CLASSES = (
    'cms.middleware.utils.ApphookReloadMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware'
)

INSTALLED_APPS = (
    'djangocms_admin_style',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.admin',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'cms',
    'menus',
    'sekizai',
    'treebeard',
    'djangocms_text_ckeditor',
    'filer',
    'easy_thumbnails',
    'djangocms_link',
    #'cmsplugin_filer_file',
    #'cmsplugin_filer_folder',
    #'cmsplugin_filer_image',
    #'cmsplugin_filer_utils',
    'djangocms_style',
    #'djangocms_snippet',
    'djangocms_googlemap',
    'djangocms_video',
    'corsheaders',
    'rest_framework',
    'users',
    'core',
    #'virtual_rain',
    #'rain_gauge',
    # 'stream_gauge',
    #'stream_gauge.apps.StreamGaugeConfig',
)

LANGUAGES = (
    ## Customize this
    ('en', gettext('en')),
)

CMS_LANGUAGES = {
    ## Customize this
    'default': {
        'public': True,
        'hide_untranslated': False,
        'redirect_on_fallback': True,
    },
    1: [
        {
            'public': True,
            'code': 'en',
            'hide_untranslated': False,
            'name': gettext('en'),
            'redirect_on_fallback': True,
        },
    ],
}

CMS_TEMPLATES = (
    ## Customize this
    ('method.html', 'Method'),
)

CMS_PERMISSION = True

CMS_PLACEHOLDER_CONF = {}

MIGRATION_MODULES = {

}

# Allows CORS
CORS_ORIGIN_ALLOW_ALL = True

THUMBNAIL_PROCESSORS = (
    'easy_thumbnails.processors.colorspace',
    'easy_thumbnails.processors.autocrop',
    'filer.thumbnail_processors.scale_and_crop_with_subject_location',
    'easy_thumbnails.processors.filters'
)

import os
STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
print(STATIC_ROOT)

SERVICE_ACCOUNT = 'pfs-835@servir-ee.iam.gserviceaccount.com'

EE_CREDENTIALS = ee.ServiceAccountCredentials(SERVICE_ACCOUNT, os.path.join(BASE_DIR, 'credentials/service-account.json'))

GOOGLE_MAPS_API_KEY = 'AIzaSyBCaqvIckPRhmI3hwyG_XR3Fi-y_6mWexM'

GOOGLE_ANALYTICS_ID = 'UA-29286089-2'

# Frequency to poll for export EE task completion (seconds)
EE_TASK_POLL_FREQUENCY = 10

#GOOGLE_OAUTH2_CLIENT_SECRETS_JSON = os.path.join(BASE_DIR, 'credentials/client_secret.json')

#GOOGLE_OAUTH2_WEB_CLIENT_SECRETS_JSON = os.path.join(BASE_DIR, 'credentials/web_client.json')
#with open(GOOGLE_OAUTH2_WEB_CLIENT_SECRETS_JSON) as f:
#    google_oauth = json.load(f)

#GOOGLE_OAUTH2_CLIENT_ID = google_oauth['web']['client_id']
#GOOGLE_OAUTH2_CLIENT_SECRET = google_oauth['web']['client_secret']

