/* globals define */
'use strict';

define(function (require) {
  var
      $ = require('jquery'),
      bbCRM = require('common'),
      userManager = require('apps/user_manager/scripts/views/user_manager');

  $('#app-container').html(bbCRM.userManager.render().el);
});