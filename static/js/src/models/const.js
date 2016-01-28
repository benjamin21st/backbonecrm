/* globals define, getUserType */
/**
 * Data model for files (both user and admin)
 */
define(function (require) {
  'use strict';

  /**
   * TODO: have a setting somewhere, and under different conditions,
   * return different value combinations.
   * like:

   */

  // Add a global getUserType to
  var userType = getUserType() || 'user';

  var Const = {};

  function compare(a, b) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  }

  /**
   * [baseSidebarData an array that stores the basic side bar elements visible to all users.]
   * @type {Array}
   */
  var baseSidebarData = [
      {
        order: 1,
        name: 'Home',
        icon: 'fa fa-home',
        customClassNames: 'tab-home active',
        url: '#'
      },
      {
        order: 2,
        name: 'SipDiff',
        icon: 'fa fa-area-chart',
        customClassNames: 'tab-sipdiff',
        url: '#sipdiff'
      },
      {
        order: 9,
        name: 'Settings',
        icon: 'fa fa-cog',
        customClassNames: 'tab-settings',
        url: '#settings'
      }];

  var userSidebarData = [
    {
      order: 4,
      name: 'Resources',
      url: '#resources',
      icon: 'fa fa-folder-open',
      customClassNames: 'tab-resources'
    }
  ];

  var customerSidebarData = [
    {
      order: 5,
      name: 'Manage Licenses',
      url: '#licenses',
      icon: 'fa fa-copyright',
      customClassNames: 'tab-licenses'
    }
    // {
    //   name: 'Manage Builds',
    //   icon: 'fa fa-cogs',
    //   customClassNames: 'tab-builds'
    // },
  ];

  var demoUserSidebarData = [
    {
      order: 5,
      name: 'Manage Licenses',
      icon: 'fa fa-copyright',
      customClassNames: 'tab-licenses'
    }
  ];

  var adminSideBarData = [
    {
      order: 3,
      name: 'Users',
      url: '#users',
      icon: 'fa fa-users',
      customClassNames: 'tab-users'
    },
    {
      order: 4,
      name: 'Files',
      url: '#files',
      icon: 'fa fa-files-o',
      customClassNames: 'tab-files'
    },
    {
      order: 4,
      name: 'Requests',
      url: '#requests',
      icon: 'fa fa-info-circle',
      customClassNames: 'tab-requests'
    },
    {
      order: 5,
      name: 'Features',
      url: '#features',
      icon: 'fa fa-cubes',
      customClassNames: 'tab-features'
    }
  ];

  var baseWidgetData = [
    // {
    //   'name':       'show-inbox',
    //   'title':      'unread messages',
    //   'icon':       'fa fa-inbox',
    //   'value':      10
    // },
    {
      order:      3,
      name:       'launch-sipdiff',
      title:      'Launch SipDiff',
      titleType:  'heading',
      icon:       'fa fa-line-chart'
    },
    {
      order:      10,
      name:       'show-settings',
      title:      'Settings',
      titleType:  'heading',
      icon:       'fa fa-cog'
    }
  ];

  var customerWidgetData = [
    {
      order:      4,
      name:       'show-licenses',
      title:      'Licenses',
      titleType:  'heading',
      icon:       'fa fa-copyright'
    }
  ];

  var userWidgetData = [
    {
      order:      4,
      name:       'show-resources',
      title:      'Resources',
      value:      0,
      icon:       'fa fa-hdd-o',
      tagId:      'resources',
      // temp
      titleType:  'heading'
    }
  ];

  var adminWidgetData = [
    {
      order: 0,
      name: 'show-users',
      value: 0,
      title: 'users',
      icon: 'fa fa-users',
      tagId: 'users'
    },
    {
      order: 1,
      name: 'show-requests',
      title: 'pending requests',
      value: 0,
      icon: 'fa fa-info-circle',
      tagId:'requests'
    },
    {
      order:      4,
      name:       'show-files',
      title:      'Files',
      value:      0,
      icon:       'fa fa-hdd-o',
      tagId:      'files',
      // temp
      titleType:  'heading'
    },
    {
      order: 5,
      name: 'show-features',
      title: 'features',
      value: 0,
      icon: 'fa fa-cubes',
      tagId:'features'
    }
  ];


  Const.iconURLs = {
    'dir': 'fa fa-folder-o',
    'txt': 'fa fa-file-text-o',
    'pdf': 'fa fa-file-pdf-o',
    'jpg': 'fa fa-file-image-o',
    'png': 'fa fa-file-image-o',
    'zip': 'fa fa-file-archive-o',
    'xls': 'fa fa-file-excel-o',
    'xlsx': 'fa fa-file-excel-o',
    'doc': 'fa fa-file-word-o',
    'docx': 'fa fa-file-word-o',
    'ppt': 'fa fa-file-powerpoint-o',
    'pptx': 'fa fa-file-powerpoint-o',

    'default': 'fa fa-file-o'
  };


  if (userType === 'admin') {
    Const.sidebarMenuData = baseSidebarData.concat(adminSideBarData);
    Const.widgetData = baseWidgetData.concat(adminWidgetData);
  } else if (userType === 'customer') {
    Const.sidebarMenuData = baseSidebarData.concat(userSidebarData).concat(customerSidebarData);
    Const.widgetData = baseWidgetData.concat(userWidgetData).concat(customerWidgetData);
  } else if (userType === 'demo_user') {
    Const.sidebarMenuData = baseSidebarData.concat(userSidebarData).concat(customerSidebarData);
    Const.widgetData = baseWidgetData.concat(userWidgetData).concat(customerWidgetData);
  } else {
    Const.sidebarMenuData = baseSidebarData.concat(userSidebarData);
    Const.widgetData = baseWidgetData.concat(userWidgetData);
  }

  Const.sidebarMenuData.sort(compare);
  Const.widgetData.sort(compare);

  return Const;
});
