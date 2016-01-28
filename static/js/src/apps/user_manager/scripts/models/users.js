/**
 * Data collection model for users, admin only
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'apps/user_manager/scripts/models/user'
], function ($, _, Backbone, UserModel) {
  "use strict";

  var UserCollection = Backbone.Collection.extend({

    url: '/admin/users/all',

    model: UserModel,

    parse: function (data) {
      return data.data;
    }

  });

  return UserCollection;
});
