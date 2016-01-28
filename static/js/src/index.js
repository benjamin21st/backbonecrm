/* globals require */
/**
 * This is the require JS entry point, the
 * main JS loaded on all pages.
 */

require.config({
  baseUrl: 'static/js/build/',

  paths: {
    jquery:     '../vendor/jquery-2.1.3.min',
    underscore: '../vendor/lodash',
    backbone:   '../vendor/backbone',
    bootstrapOverlay:  '../vendor/bootstrapOverlay',
    handlebars: '../vendor/handlebars',
    semantic:   '../vendor/semantic',
    text:       '../vendor/text',
    highcharts: '../vendor/highstock.src',
    numberJumper: '../vendor/number_jump',
    templates:  'templates/'
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    bootstrapOverlay: {
      deps: [
        'jquery'
      ],
      exports: 'bootstrapOverlay'
    },
    handlebars: {
      exports: 'Handlebars'
    }
  }
});
