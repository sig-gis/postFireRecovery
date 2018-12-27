'use strict';

module.exports = {
    client: {
        css: [
            'postfirerecovery/static/css/*.css',
        ],
        js: [
            'postfirerecovery/static/app/*.js',
            'postfirerecovery/static/app/**/*.js'
        ],
        views: [
            'postfirerecovery/templates/*.html',
            'postfirerecovery/templates/**/*.html',
        ],
        templates: ['static/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js']
    }
};
