/* globals define, console, document */
'use strict';

define(function (require) {

  /**
   * For development ONLY, comment out before building for
   * production.
   */
  var dependencies = require('index');

  var
      bbCRM = require('common'),
      userManager = require('apps/user_manager/scripts/views/user_manager');

  bbCRM.loadApp(bbCRM.userManager.render().el);

});