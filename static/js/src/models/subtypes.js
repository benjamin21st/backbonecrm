/* globals define, console */
define(function (require) {
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone');

  var SortableCollection = Backbone.Collection.extend({
      initialize: function (props) {
        console.log('This is a sortable collection. ');

        for (var key in props) {
          this[key] = props[key];
        }

        this.sortCriteria = null;
        this.sortOrder= 1;
      },
      comparator: function (model1, model2) {
        var value1 = model1.get(this.sortCriteria),
            value2 = model2.get(this.sortCriteria),
            result;

        if (typeof value1 === typeof value2 && typeof value1 === 'string') {
          value1 = value1.toLowerCase();
          value2 = value2.toLowerCase();
        } else if (typeof value1 === typeof value2 && typeof value1 === undefined) {
          value1 = value2 = -Infinity;
        } else if (typeof value1 !== typeof value2) {
          /**
           * If two values are of different types, then return 0 (do nothing)
           */
          return 0;
        }

        if (value1 < value2 ) {
          result = -1;
        } else if (value1 > value2) {
          result = 1;
        } else {
          result = 0;
        }

        return result * (this.sortOrder);
      },
      sortByAttribute: function (attrName, order) {
        this.sortCriteria = attrName;
        this.sortOrder = order;

        this.sort(this.comparator);

        return this;
      }
  });


  var SortableTableView = Backbone.View.extend({
    events: {
      'click .SortableHead': 'sortByAttribute'
    },

    initialize: function () {
      console.log('Initialzed a sortable table view.');
    },

    sortByAttribute: function(e) {
      var target = e.currentTarget,
          isSorting = $(target).hasClass('sorting'),
          attrName = $(target).attr('data-name');

      if (!isSorting) {
        $(target).addClass('sorting');
        this.collection.sortByAttribute(attrName, 1);
      } else {
        if ($(target).hasClass('sort-asc')) {
          $(target).removeClass('sort-asc').addClass('sort-desc');
          this.collection.sortByAttribute(attrName, -1);
        } else if ($(target).hasClass('sort-desc')) {
          $(target).removeClass('sort-desc').addClass('sort-asc');
          this.collection.sortByAttribute(attrName, 1);
        }
      }

      return this.reloadTableData();
    },

    reloadTableData: function (options) {
      var _this = this;

      this.collection.fetch({
        success: function (collection) {

        /**
         * This allows passing in a pre-determined order for data
         */
        if (options && 'sortBy' in options) {
          var attrName = options.sortBy,
              order = options.order;

          return _this.reloadView(collection.sortByAttribute(attrName, order));
        }

          return _this.reloadView(collection);
        },
        error: function () {

          return _this.reloadView(this.collection);
        }
      });
    },

    reloadView: function (collection) {
      var models = collection.models,
          len = models.length,
          model,
          itemView,
          cachedDom = [];

      for (var  i = 0; i < len; i++) {
        model = models[i].parseDates();
        itemView = new this.childView({model: model});

        cachedDom.push(itemView.el);
      }

      this.$el.find('.table-data').html(cachedDom);

      return this;
    }

  });


  return {
    'SortableCollection': SortableCollection,
    'SortableTableView':  SortableTableView
  };

});