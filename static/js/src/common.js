/* globals define */

/**
 * Common scripts for our backbone application
 */
'use strict';

define(function (require) {
   //  Create a parent object to store child objects
  var
      $ = require('jquery'),
      Backbone = require('backbone'),
      bbCRM = {
        loadApp: function (appEl) {
          $('#app-container').html(appEl);
        }
      };

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
