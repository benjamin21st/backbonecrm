/* globals define */
/**
 *
 */
'use strict';

define(function (require) {

  var
    Backbone = require('backbone'),
    Subtypes = require('models/subtypes'),
    UserModel = require('apps/user_manager/scripts/models/user');

  var UserCollection = Subtypes.SortableCollection.extend({

    url: '/admin/users/all',

    model: UserModel,

    parse: function (data) {
      return data.data;
    }

  });

  return UserCollection;
});
