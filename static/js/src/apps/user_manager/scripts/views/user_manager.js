/* globals define */

/**
 * This is the user management app, it contains all functionalities to
 * perform user-related CRUD.
 */
'use strict';

define( function (require) {

  var
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),

    localConfig = require('local_config'),

    userListItemTpl = require('text!apps/user_manager/templates/user_list_item.html'),
    userListTpl = require('text!apps/user_manager/templates/users.html'),
    userDetailsTpl = require('text!apps/user_manager/templates/user_details.html'),
    Dialogs = require('views/partials/dialog'),
    bbCRM = require('common'),

    Subtypes = require('models/subtypes'),
    UserCollection = require('apps/user_manager/scripts/models/users');


  var UserManager = Subtypes.SortableTableView.extend({

    className: 'user-manager',

    initialize: function () {
      /**
       * [baseCollection description]
       * As a temporary solution, create a baseCollection and reuse
       * it later when we need.
       *
       * @type {[type]}
       */
      this.baseCollection = UserCollection;
      this.collection = new UserCollection();
      this.childView = UserListItemView;
    },

    render: function () {
      var _this = this;

      this.$el.html(userListTpl);
      this.delegateEvents();

      this.collection.fetch({
        success: function (data) {
          data.sortByAttribute('created_at', -1);

          var models = data.models,
              cachedDom = [];

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
    }
  });


  var UserListItemView = Backbone.View.extend({

    className: 'user-list-item table-row',

    tagName: 'tr',

    template: Handlebars.compile(userListItemTpl),

    events: {
      'click': 'viewUserDetails'
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
          url: localConfig.urlRoot + '/users/' + _this.model.attributes.uid,
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
        url: localConfig.urlRoot + '/users/' + this.model.attributes.uid,
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
