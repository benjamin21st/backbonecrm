/* globals define */

/**
 * This file exports dialog modules like:
 * confirmation, alert, etc.
 */

define(function(require) {
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
