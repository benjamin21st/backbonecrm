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
