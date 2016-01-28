var devEnviron = 'development',
    urlRoot = 'http://localhost:5001';

define("local_config", function(){});

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

define("index", function(){});

/* globals define */

/**
 * Common scripts for our backbone application
 */


define('common',['require','backbone'],function (require) {
   //  Create a parent object to store child objects
  var
      Backbone = require('backbone'),
      bbCRM = {};

    /**
     * Custom config backbone here rather than globally.
     */

    Backbone.Model.prototype.parseDates = function () {
      /**
       * This function translates epoch time to human readable
       * time string
       */
      this.attributes.created_at = (new Date(this.attributes.created_at)).toLocaleString();
      this.attributes.updated_at = (new Date(this.attributes.updated_at)).toLocaleString();

      return this;
    };


    Backbone.Model.prototype.rollback = function () {
      /**
       * Extend backbone model so that it can rollback to previous
       * values if user decides not to make the change.
       */
      this.attributes = this.previousAttributes();

      return this;
    };


    Backbone.Model.prototype.applyChanges = function () {
      /**
       * Extend backbone model so that it can apply changedAttributes
       * even when current attributes are rolled back.
       */
      var changedAttributes = this.changedAttributes();

      for (var attr in changedAttributes) {
        this.attributes[attr] = changedAttributes[attr];
      }

      return this;
    };


    Backbone.View.prototype.close = function(){
      this.remove();
      this.unbind();
      if (this.onClose){
        this.onClose();
      }
    };


    Backbone.View.prototype.hide = function () {
      this.$el.hide();
    };

    return bbCRM;
 });


define('text!apps/user_manager/templates/user_list_item.html',[],function () { return '<!-- User list item template -->\n<td>{{userData.fullname}}</td>\n<td>{{userData.email}}</td>\n<td>{{userData.type}}</td>\n<td>{{userData.organization}}</td>\n<td>{{userData.date_creation}}</td>\n<td>\n  <a class="btn btn-xs btn-default view-details">Details</a>\n</td>\n';});


define('text!apps/user_manager/templates/users.html',[],function () { return '<h1>User List</h1>\n<table id="user-table" class="user-table sortable-table data-table ui table celled">\n  <thead>\n    <tr>\n      <th class="fullname sort-asc">\n        <span class="header-text">Fullname</span>\n        <i class="fa fa-sort-alpha-asc"></i>\n        <i class="fa fa-sort-alpha-desc"></i>\n      </th>\n      <th class="email sort-asc">\n        <span class="header-text">Email</span>\n        <i class="fa fa-sort-alpha-asc"></i>\n        <i class="fa fa-sort-alpha-desc"></i>\n      </th>\n      <th class="type sort-asc">\n        <span class="header-text">Type</span>\n        <i class="fa fa-sort-alpha-asc"></i>\n        <i class="fa fa-sort-alpha-desc"></i>\n      </th>\n      <th class="organization sort-asc">\n        <span class="header-text">Organization</span>\n        <i class="fa fa-sort-alpha-asc"></i>\n        <i class="fa fa-sort-alpha-desc"></i>\n      </th>\n      <th class="created_at sorting sort-desc">\n        <span class="header-text">Registered Date</span>\n        <i class="fa fa-sort-numeric-asc"></i>\n        <i class="fa fa-sort-numeric-desc"></i>\n      </th>\n      <th>&nbsp;</th>\n    </tr>\n  </thead>\n\n  <tbody class="table-data"></tbody>\n</table>\n';});


define('text!apps/user_manager/templates/user_details.html',[],function () { return '<!-- Tempalte for file editor for admin.  -->\n<h1>User Details</h1>\n<form name="user-details-form" class="form">\n\n  <div class="message-container">\n    <p class="text-{{message_type}}">{{message_content}}</p>\n  </div>\n\n  <div class="form-group">\n    <label class="col-xs-4 col-md-8 col-sm-4">User name</label>\n    <p class="col-xs-8 col-md-4 col-sm-8">{{fullname}}</p>\n  </div>\n\n  <div class="form-group">\n    <label class="col-xs-4 col-md-8 col-sm-4">User Email</label>\n    <p class="col-xs-8 col-md-4 col-sm-8">{{email}}</p>\n  </div>\n\n  <div class="form-group">\n    <label class="col-xs-4 col-md-8 col-sm-4">User Type</label>\n    <p class="editable col-xs-8 col-md-4 col-sm-8">{{type}}</p>\n    <!-- TODO: decide whether to show a drop-down here or have a master "edit button" -->\n    <div class="col-xs-8 col-md-4 col-sm-8">\n      <select id="user-types" class="editing">\n        <option {{userSelected}} value="user">User</option>\n        <option {{demouserSelected}} value="demo_user">Demo User</option>\n        <option {{customerSelected}} value="customer">Customer</option>\n        <option {{adminSelected}} value="admin">Admin</option>\n      </select>\n    </div>\n  </div>\n\n  <div class="form-group">\n    <label class="col-xs-4 col-md-8 col-sm-4">Organization</label>\n    <p class="editable col-xs-8 col-md-4 col-sm-8">{{organization}}</p>\n    <!-- TODO: same as above -->\n    <!-- TODO: Maybe having a list of recommended/available organizations? -->\n    <div class="col-xs-8 col-md-4 col-sm-8">\n      <input id="organization-name" class="editing form-control" value="{{organization}}"/>\n    </div>\n  </div>\n\n  <div class="form-group">\n    <div class="btn-group">\n      <div class="edit editable btn btn-default btn-sm">Edit</div>\n      <div class="close-view editable btn btn-default btn-sm">Close</div>\n      <div class="cancel editing btn btn-default btn-sm">Cancel</div>\n      <div class="save editing btn btn-primary btn-sm" type="submit">Save</div>\n      <div class="delete editing btn btn-danger btn-sm">Delete</div>\n    </div>\n  </div>\n</form>\n';});


define('text!templates/confirmation_dialog.html',[],function () { return '<div class="confirmation-dialog pop-up-dialog">\n  <p class="message title">Please Confirm</p>\n  <div class="detailed-content">\n    <p class="details">\n      {{data.confirmationMessage}}\n    </p>\n    <p class="details">\n      <b>{{data.messageContent}}</b>\n    </p>\n    <div class="additional-content"></div>\n  </div>\n\n  <div class="button-group">\n    <span class="confirm btn btn-sm btn-primary">Confirm</span>\n    <span class="cancel btn btn-sm btn-default">Cancel</span>\n  </div>\n</div>\n';});

/* globals define */

/**
 * This file exports dialog modules like:
 * confirmation, alert, etc.
 */

define('views/partials/dialog',['require','jquery','underscore','backbone','handlebars','text!templates/confirmation_dialog.html','bootstrapOverlay'],function(require) {
  'use strict';

  var
      $  = require('jquery'),
      _ = require('underscore'),
      Backbone = require('backbone'),
      Handlebars = require('handlebars'),
      confDialogTpl = require('text!templates/confirmation_dialog.html');


      require('bootstrapOverlay');

  var ConfirmationDialog = Backbone.View.extend({

    className: 'modal',

    events: {
      'click .confirm': 'confirmOperation',
      'click .cancel':  'cancelOperation'
    },

    template: Handlebars.compile(confDialogTpl),

    render: function () {
      this.$el.html(this.template({data: this.data}));

      this.$el.modal('show');

      return this;
    },

    loadData: function (conf_message, conf_content, callback) {
      this.data = {
        confirmationMessage: conf_message,
        messageContent: conf_content
      };

      this.callback = callback;
    },

    confirmOperation: function () {
      this.callback();
      this.$el.modal('hide');
    },

    cancelOperation: function () {
      this.$el.modal('hide');
    }
  });

  return {
    confirmationDialog: new ConfirmationDialog()
  };

 });

/* globals define */

/**
 * Data model for users (admin only)
 */
define('apps/user_manager/scripts/models/user',['require','backbone'],function (require) {
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

/**
 * Data collection model for users, admin only
 */
define('apps/user_manager/scripts/models/users',[
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

/* globals define */

/**
 * This is the user management app, it contains all functionalities to
 * perform user-related CRUD.
 */


define( 'apps/user_manager/scripts/views/user_manager',['require','jquery','backbone','handlebars','text!apps/user_manager/templates/user_list_item.html','text!apps/user_manager/templates/users.html','text!apps/user_manager/templates/user_details.html','views/partials/dialog','common','apps/user_manager/scripts/models/users'],function (require) {

  var
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    userListItemTpl = require('text!apps/user_manager/templates/user_list_item.html'),
    userListTpl = require('text!apps/user_manager/templates/users.html'),
    userDetailsTpl = require('text!apps/user_manager/templates/user_details.html'),
    Dialogs = require('views/partials/dialog'),
    bbCRM = require('common'),
    UserCollection = require('apps/user_manager/scripts/models/users');


  var UserManager = Backbone.View.extend({

    className: 'user-manager',

    events: {
      'click .fullname':     function () {this.sortByAttributeName('fullname');},
      'click .email':        function () {this.sortByAttributeName('email');},
      'click .type':         function () {this.sortByAttributeName('type');},
      'click .organization': function () {this.sortByAttributeName('organization');},
      'click .created_at':   function () {this.sortByAttributeName('created_at');}
    },

    initialize: function () {
      this.collection = new UserCollection();
    },

    render: function () {
      var _this = this;

      this.$el.html(userListTpl);
      this.delegateEvents();

      this.collection.fetch({
        success: function (data) {
          var models = data.models,
              cachedDom = [];
          models.sort(function (a, b) {
            if (a.attributes['created_at'] > b.attributes['created_at']) {
              return -1;
            }
            else if (a.attributes['created_at'] < b.attributes['created_at']) {
              return 1;
            } else {
            return 0;
            }
          });

          for (var i = 0, length = models.length, model, itemView; i < length; i++) {
            model = models[i];
            itemView = new UserListItemView({model: model});
            cachedDom.push(itemView.el);
          }

          _this.$el.find('.table-data').append(cachedDom);

          return _this;
        },
        error: function (req, status, err) {
          console.log(err.message);
        }
      });

      return this;
    },

    sortByAttribute: function (attrName, sortDirection) {
      var _this = this,
          attrName = attrName,
          sortDirection = sortDirection,
          userModels = this.collection.models,
          len = userModels.length,
          tempData = [];

          userModels.sort(function (a, b) {
            if (a.attributes[attrName] > b.attributes[attrName]) {
              if (sortDirection === 'desc') {
                return -1;
              }
              return 1;
            }
            else if (a.attributes[attrName] < b.attributes[attrName]) {
              if (sortDirection === 'desc') {
                return 1;
              }
              return -1;
            } else {
            return 0;
            }
          });

          for (var k = 0, model, itemView; k < len; k++) {
            model = userModels[k];
            itemView = new UserListItemView({model: model});
            tempData.push(itemView.el);
          }
          _this.$el.find('.table-data').html(tempData);
          return _this;
    },

    sortByAttributeName: function (attrName) {
      var attrName = attrName,
          curHead = $('.' + attrName),
          flagSorting = curHead.hasClass('sorting');

      if (!flagSorting) {
        curHead.addClass('sorting');
        this.sortByAttribute(attrName, 'asc');
      } else if (flagSorting && curHead.hasClass('sort-asc')) {
        curHead.addClass('sort-desc').removeClass('sort-asc');
        this.sortByAttribute(attrName, 'desc');
      } else if (flagSorting && curHead.hasClass('sort-desc')) {
        curHead.addClass('sort-asc').removeClass('sort-desc');
        this.sortByAttribute(attrName, 'asc');
      }
    }
  });


  var UserListItemView = Backbone.View.extend({

    className: 'user-list-item',

    tagName: 'tr',

    template: Handlebars.compile(userListItemTpl),

    events: {
      'click .view-details': 'viewUserDetails'
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      var userData = this.model.attributes;
      userData.date_creation = (new Date(userData.created_at)).toLocaleString();

      this.$el.html(this.template({userData: userData}));

      return this;
    },

    viewUserDetails: function () {
      var userDetailsView = new UserDetailsView({model: this.model});
      userDetailsView.render();
    }
  });


  var UserDetailsView = Backbone.View.extend({

    className: 'user-details-view',

    template: Handlebars.compile(userDetailsTpl),

    events: {
      'click .edit':          'editUserInfo',
      'click .cancel':        'cancelEditing',
      'click .close-view':    'closeView',
      'click .save':          'saveUserInfo',
      'click .delete':        'deleteUser'
    },

    render: function () {
      // TODO: scroll to the top

      $(document).scrollTop(0);

      var formData = this.model.attributes;

      switch (formData.type.toLowerCase().split(' ').join('_')) {
        case 'user':
          formData.userSelected = "selected";
          break;
        case 'demo_user':
          formData.demouserSelected = "selected";
          break;
        case 'customer':
          formData.customerSelected = "selected";
          break;
        case 'admin':
          formData.adminSelected = "selected";
          break;
        default:
          formData.userSelected = "selected";
      }

      // TODO: adjust the call sequence and see if it makes a difference
      bbCRM.userManager.$el.html(this.el);

      this.$el.html(this.template(formData));
      this.delegateEvents();

      return this;
    },

    cancelEditing: function () {
      this.$el.removeClass('editing-mode');
    },

    closeView: function () {
      this.close();
      bbCRM.userManager.render();
    },

    deleteUser: function () {
      var _this = this;

      var cb = function () {
        _this.model.save(null, {
          url: '/admin/users/' + _this.model.attributes.uid,
          type: 'DELETE',
          success: function () {
            console.log('user deleted');
          },
          error: function (req, status, err) {
            console.log(err.message);
          }
        });
        _this.closeView();
      };

      Dialogs.confirmationDialog.loadData(
        'Are you sure you want to delete this user?',
        'All data related to this user will be swiped from the database.',
        cb
      );
      Dialogs.confirmationDialog.render();

    },

    editUserInfo: function () {
      this.$el.addClass('editing-mode');
    },

    saveUserInfo: function () {
      /**
       * At the moment we only have two editable fields
       */
      var _this = this,
          newData = {
            "type": $('#user-types').val(),
            "organization": $('#organization-name').val()
          };

      this.model.set(newData);

      this.model.save(null, {
        url: '/admin/users/' + this.model.attributes.uid,
        success: function () {
          _this.cancelEditing();
          _this.render();
        },
        error: function (req, status, err) {
          console.log(err.message);
        }
      });

    }
  });

  bbCRM.userManager = new UserManager();

  // $(document.body).html(bbCRM.userManager.render().el);

  return bbCRM.userManager;
});

/* globals define */


define('app',['require','jquery','common','apps/user_manager/scripts/views/user_manager'],function (require) {
  var
      $ = require('jquery'),
      bbCRM = require('common'),
      userManager = require('apps/user_manager/scripts/views/user_manager');

  $('#app-container').html(bbCRM.userManager.render().el);
});
