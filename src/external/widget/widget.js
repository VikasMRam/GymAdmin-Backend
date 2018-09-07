(function () {
  // IE polyfill for classList
  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    }
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }

  function addClass(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else if (!hasClass(el, className)) {
      el.className += " " + className;
    }
  }

  function removeClass(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }

  function getParams(scriptName) {
    // find all script tags
    var scripts = document.getElementsByTagName('script');
    // look through them trying to find script having src scriptName
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src.indexOf(scriptName) > -1) {
        // get an array of key=value strings of params
        var pa = scripts[i].src.split('?').pop().split('&');
        // split each key=value into array, then construct js object
        var p = {};
        for (var j = 0; j < pa.length; j++) {
          var kv = pa[j].split('=');
          p[kv[0]] = kv[1];
        }
        return p;
      }
    }
    // no scripts match
    return null;
  }

  function getURLParams() {
    // find all script tags
    if (document.location && document.location.search) {
      var qs =  document.location.search;
      var pa = qs.split('?').pop().split('&');
      // split each key=value into array, then construct js object
      var p = {};
      for (var j = 0; j < pa.length; j++) {
        var kv = pa[j].split('=');
        p[kv[0]] = kv[1];
      }
      return p;
    }
    // no match
    return {};
  }

  var Seniorly = {
    cssId: 'seniorly-widget-style',
    context: {
      cssFileUrl: process.env.EXTERNAL_ASSET_URL + '/widget.css',
      jsFileUrl: process.env.EXTERNAL_ASSET_URL + '/widget.js',
      iframeUrl: process.env.EXTERNAL_WIZARDS_ROOT_URL,
      env: process.env.SLY_ENV,
      version: process.env.VERSION
    },
    config: {},
    widgetClassName: {
      badge: 'seniorly-badge-widget',
      overlay: 'seniorly-overlay-widget',
      closeOverlay: 'seniorly-close-overlay-widget',
      closeOverlayButton: 'seniorly-close-overlay-button-widget',
      popup: 'seniorly-popup-widget'
    },
    altClassNames: {
      scrollLocked: 'seniorly-page-scroll-locked',
      popupOnClickorInline: 'seniorly-popup-or-inline-widget'
    },
    validWidgetConfig: {
      type: ['badge', 'popupOnClickorInline']
    },
    defaultWidgetConfig: {
      type: 'popupOnClickorInline'
    },
    widgetConfigAttributes: {
      type: 'data-seniorly-widget',
      state: 'data-seniorly-state',
      city: 'data-seniorly-city',
      utm_campaign: 'data-seniorly-campaign',
      utm_source: 'data-seniorly-source',
      utm_medium: 'data-seniorly-medium',
      pixel: 'data-seniorly-pixel'
    },
    configQueryParamKeys: {
      type: 'widget_type'
    },
    log: {
      prefix: '[Seniorly Widget]',
      error: function(msg) {
        // eslint-disable-next-line no-console
        console.error(Seniorly.log.prefix + ' ' + msg);
      },
      warn: function(msg) {
        // eslint-disable-next-line no-console
        console.warn(Seniorly.log.prefix + ' ' + msg);
      },
      debug: function(msg) {
        if (Seniorly.context.env === 'development') {
          // eslint-disable-next-line no-console
          console.log(Seniorly.log.prefix + ' ' + msg);
        }
      }
    },
    // for storing references to instances of widgets. is a hash having widget type
    // as key and array of instances as value
    widgetInstances: {},

    populateContextAndConfig: function() {
      Seniorly.context.pageRoot = document.getElementsByTagName('html')[0];

      var params = getParams(Seniorly.context.jsFileUrl);
      Seniorly.config.type = Seniorly.defaultWidgetConfig.type;
      if (params) {
        Seniorly.config.type =
          params[Seniorly.configQueryParamKeys.type] || Seniorly.defaultWidgetConfig.type;
      }
    },

    validateConfig: function() {
      var hasError = false;
      Object.keys(Seniorly.config).forEach(function(config) {
        if (!Seniorly.validWidgetConfig[config] ||
          Seniorly.validWidgetConfig[config].indexOf(Seniorly.config[config]) === -1) {
          Seniorly.log.error('Invalid config value: ' + Seniorly.config[config] + ' for config key: ' + config);
          hasError = true;
        }
      });
      return hasError;
    },

    injectStyles: function() {
      if (!document.getElementById(Seniorly.cssId)) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = Seniorly.cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = Seniorly.context.cssFileUrl;
        link.media = 'all';
        head.appendChild(link);
      }
    },

    initWidget: function() {
      Seniorly.populateContextAndConfig();
      var hasError = Seniorly.validateConfig();
      if (hasError) {
        Seniorly.log.warn('Failed to initialize Seniorly widget');
      } else {
        Seniorly.injectStyles();
        var widget = Seniorly.widgets[Seniorly.config.type]();
        widget.build();
        widget.insert();
      }
    }
  };
  // the public object available in global scope
  this.SeniorlyWidget = {
    version: Seniorly.context.version,
    created: new Date().toString(),
    config: Seniorly.config
  };

  /*
    SeniorlyWidget base object from which widgets are created.
    anything that is injected to third party site is a widget.eg: popup, badge
    A SeniorlyWidget will have build, buildContent, insert and destroy lifecylce methods.
      * build - creates widget dom elements. this calls buildContent to fetch widget dom node.
      * buildContent - where widget's dom elements can be created. The function can return a dom node
                       that's appended to document body. optionally this can also choose to not return anything
                       if nothing new needs to be added, for eg only attach some event handlers to existing dom
                       nodes.
      * insert - where widget is added to document body.
      * destroy - removes widget from document body. returns the removed node object.
  */
  var SeniorlyWidget = function(type, options) {
    this.widget = null;
    this.type = type;
    this.options = options || {};
  };
  SeniorlyWidget.prototype.build = function() {
    var childContent = this.buildContent(this.type);
    if (childContent || Seniorly.widgetClassName[this.type]) {
      this.widget = document.createElement('div');
      this.widget.className = 'seniorly-widget ' + Seniorly.widgetClassName[this.type];
      this.widget.onclick = this.options.onClick;
      if (childContent) {
        this.widget.appendChild(childContent);
      }
    }
    return this.widget;
  };
  SeniorlyWidget.prototype.buildContent = function() {};
  SeniorlyWidget.prototype.insert = function(parent) {
    var newNode = null;
    if (this.widget) {
      newNode = parent ? parent.appendChild(this.widget) :
      document.body.insertBefore(this.widget, document.body.firstChild);
      if (!Seniorly.widgetInstances[this.type]) {
        Seniorly.widgetInstances[this.type] = [];
      }
      Seniorly.widgetInstances[this.type].push(this);
    }
    if (this.options.afterInsert) {
      this.options.afterInsert();
    }
    return newNode;
  };
  SeniorlyWidget.prototype.destroy = function() {
    var oldNode = null;
    if (this.widget) {
      oldNode = document.body.removeChild(this.widget);
    }
    // find this instance and remove it from active instances
    for (var i = 0; i < Seniorly.widgetInstances[this.type].length; i++) {
      // comparison by reference is exactly what we want here
      if (Seniorly.widgetInstances[this.type][i] === this) {
        Seniorly.widgetInstances[this.type].splice(i, 1);
        break;
      }
    }
    if (this.options.afterDestory) {
      this.options.afterDestory();
    }
    return oldNode;
  };

  Seniorly.helpers = {
    serialize: function(obj) {
      var str = [];
      for (var p in obj) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
      return str.join('&');
    },
    generateIframe: function(widgetType, params) {
      var t = document.createElement('iframe');
      var qs = Seniorly.helpers.serialize(params);
      t.src = Seniorly.context.iframeUrl + '/caw?fromWidgetType=' + widgetType +
        (qs.length ? '&' + qs : '');
      t.width = '100%';
      t.height = '100%';
      t.frameBorder = '0';
      return t;
    }
  };

  Seniorly.widgets = {
    badge: function() {
      var w = new SeniorlyWidget('badge', {
        onClick: function() {
          var w = Seniorly.widgets.popup();
          w.build();
          w.insert(document.getElementsByClassName(Seniorly.widgetClassName.overlay)[0]);
        }
      });
      w.buildContent = function() {
        var t = document.createElement('span');
        t.innerHTML = 'Care Assesment Wizard<br>Powered by Seniorly';
        return t;
      };
      return w;
    },
    popupOnClickorInline: function() {
      var w = new SeniorlyWidget('popupOnClickorInline');
      w.buildContent = function() {
        var matches = document.querySelectorAll('[' + Seniorly.widgetConfigAttributes.type + ']');
        // old browsers don't have forEach method on Nodelist so...
        Array.prototype.forEach.call(matches, function(match) {
          var skipAttributes = ['type'];
          var type = match.getAttribute(Seniorly.widgetConfigAttributes.type);
          var params = getURLParams();
          Object.keys(Seniorly.widgetConfigAttributes).forEach(function(attr) {
            if (skipAttributes.indexOf(attr) === -1) {
              var av = match.getAttribute(Seniorly.widgetConfigAttributes[attr]);
              if (av) {
                params[attr] = av;
              }
            }
          });

          if (type === 'modal') {
            match.onclick = function() {
              var w = Seniorly.widgets.popup(params);
              w.build();
              w.insert(document.getElementsByClassName(Seniorly.widgetClassName.overlay)[0]);
            };
          } else if (type === 'inline') {
            var i = Seniorly.helpers.generateIframe('popupOnClickorInline', params);
            match.innerHTML = '';
            match.appendChild(i);
            addClass(match, Seniorly.altClassNames.popupOnClickorInline);
          }
        });
      };
      return w;
    },
    overlay: function() {
      var w = new SeniorlyWidget('overlay', {
        afterInsert: function() {
          addClass(Seniorly.context.pageRoot, Seniorly.altClassNames.scrollLocked);
        },
        afterDestory: function() {
          removeClass(Seniorly.context.pageRoot, Seniorly.altClassNames.scrollLocked);
        }
      });
      return w;
    },
    closeOverlay: function() {
      return new SeniorlyWidget('closeOverlay', {
        onClick: function() {
          // it's a fair assumption that only one instance of overlay widget will be active
          Seniorly.widgetInstances['overlay'][0].destroy();
        }
      });
    },
    closeOverlayButton: function() {
      var w = new SeniorlyWidget('closeOverlayButton', {
        onClick: function() {
          // it's a fair assumption that only one instance of overlay widget will be active
          Seniorly.widgetInstances['overlay'][0].destroy();
        }
      })
      w.buildContent = function() {
        var t = document.createElement('button');
        t.type = 'button';
        t.innerHTML = process.env.CLOSE_ICON_SVG;
        return t;
      };
      return w;
    },
    popup: function(params) {
      var options = {
        iframeParams: params
      };
      var w = new SeniorlyWidget('popup', options);
      w.buildContent = function() {
        var w2 = Seniorly.widgets.overlay();
        w2.build();
        w2.insert();
        w2 = Seniorly.widgets.closeOverlay();
        w2.build();
        w2.insert(document.getElementsByClassName(Seniorly.widgetClassName.overlay)[0]);
        w2 = Seniorly.widgets.closeOverlayButton();
        w2.build();
        w2.insert(document.getElementsByClassName(Seniorly.widgetClassName.overlay)[0]);
        return Seniorly.helpers.generateIframe('popup', w.options.iframeParams);
      };
      return w;
    }
  };

  Seniorly.startListeningForMessages = function() {
    // create IE + others compatible event handler
    var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

    eventer(messageEvent, Seniorly.processMessages, false);
  };
  Seniorly.processMessages = function(e) {
    // don't even try to process messages sent from unknown sources
    if (Seniorly.context.iframeUrl.indexOf(e.origin) === -1) {
      return;
    }

    // since some old browsers support only string messages try decoding messsge.
    // if decoding fails log and continue
    try {
      var message = JSON.parse(e.data);
      switch(message.action) {
        case 'closePopup':
          if (Seniorly.widgetInstances['overlay'] &&
            Seniorly.widgetInstances['overlay'].length) {
            Seniorly.widgetInstances['overlay'].pop().destroy();
          }
          break;
        default:
          Seniorly.log.debug('Unknown action in message from popup');
      }
    } catch (e) {
      Seniorly.log.warn('Failed to decode message from popup');
      Seniorly.log.debug('Got error ' + e);
    }
  };

  document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
      Seniorly.initWidget();
      Seniorly.startListeningForMessages();
    }
  };
}).call(this);
