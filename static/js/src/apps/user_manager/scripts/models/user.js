/* globals define */

/**
 * Data model for users (admin only)
 */
define(function (require) {
  'use strict';

  var
      Backbone = require('backbone');


  var UserModel = Backbone.Model.extend({

    defaults: {
      fullname: '',
      email: '',
      type: 'user',
      organization: '',
      created_at: '',
      org_name: '',
      em_frequency: 7,
      em_frequency_txt: 'weekly'
    },

    parse: function (data) {
      var returnData = data.data ? data.data : data;

      switch (returnData.em_frequency) {
        case 1:
          returnData.em_daily = 'selected';
          returnData.em_frequency_txt = 'daily';
          break;
        case 7:
          returnData.em_weekly = 'selected';
          returnData.em_frequency_txt = 'weekly';
          break;
        case 30:
          returnData.em_monthly = 'selected';
          returnData.em_frequency_txt = 'monthly';
          break;
        case 0:
          returnData.em_never = 'selected';
          returnData.em_frequency_txt = 'never';
          break;
        default:
          returnData.em_weekly = 'selected';
          returnData.em_frequency_txt = 'weekly';
      }
    return returnData;
   }
  });

  return UserModel;
});
