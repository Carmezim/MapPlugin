document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Maps = global.Maps || {})));
}(this, (function (exports) { 'use strict';

var $$2 = window.jQuery;

var createSearchBox = function createSearchBox(map, mapWrapper) {
	var localMap = map;
	// Create search box and link it to UI
	var $input = $$2(mapWrapper).find('input.shiftmap-input');
	var input = $input.get(0);
	var searchBox = new google.maps.places.SearchBox(input);
	return searchBox;
};

// Cluster markers SVG
var _Symbol = function _Symbol(id, width, height, fill) {
	var marker_svg = {
		marker: {
			p: 'M244.31,0C256.87,2.49,269.59,4.38,282,7.58c35.11,9.1,65.15,27.29,90.44,53.07C401.19,90,419.56,125,427,165.51q12.58,68.25-18.92,130.11Q319.47,469.54,230.64,643.36c-.73,1.42-1.59,2.78-2.79,4.87-1.41-2.43-2.5-4.14-3.42-5.93C165.11,526,104.62,410.27,46.93,293.17,8.94,216.08,18.43,141.32,71.6,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,211.37,0Z',
			v: "0 0 430.62 648.23"
		}
	};
	return 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" height="' + height + '" viewBox="0 0 430.62 648.23" width="' + width + '" ><g><path fill="' + fill + '" d="' + marker_svg[id].p + '" /></g></svg>');
};

// Map colors
var land = "#EEEFF1";
var water = "#71CAF2";

var mapStyles = [{
	"elementType": "labels",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "administrative",
	"elementType": "geometry",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "administrative.land_parcel",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "administrative.neighborhood",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "landscape.man_made",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "landscape.natural",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "landscape.natural.landcover",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "landscape.natural.terrain",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "poi",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "road",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "road",
	"elementType": "labels.icon",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "transit",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "water",
	"stylers": [{
		"color": water
	}]
}];

var mapDetailStyles = [{
	"featureType": "road.arterial",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "road.highway",
	"elementType": "labels",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "road.local",
	"stylers": [{
		"visibility": "off"
	}]
}, {
	"featureType": "water",
	"stylers": [{
		"color": water
	}]
}, {
	"featureType": "landscape.man_made",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "landscape.natural",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "landscape.natural.landcover",
	"stylers": [{
		"color": land
	}]
}, {
	"featureType": "landscape.natural.terrain",
	"stylers": [{
		"color": land
	}]
}];

var defineCenter = function defineCenter(lat, lng) {
  return new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
};

var options = {};
var clusterOptions = {};

// Map options
var getMapOptions = function getMapOptions() {
	$.extend(options, {
		zoom: 3,
		center: defineCenter(51.521723, -0.134581),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false,
		styles: mapStyles,
		minZoom: 2
	});

	return options;
};

// Cluster markers style
var clusterStyles = [{
	anchor: [17, 35],
	textColor: 'white',
	textSize: '16',
	url: './img/icons/icon-2.svg',
	height: 75,
	width: 75
}, {
	anchor: [25, 42],
	textColor: 'white',
	textSize: '18',
	url: './img/icons/icon-2.svg',
	height: 100,
	width: 100
}, {
	anchor: [32, 42],
	textColor: 'white',
	textSize: '26',
	url: './img/icons/icon-2.svg',
	height: 125,
	width: 125
}];

// Cluster options
var getClusterOptions = function getClusterOptions() {
	$.extend(clusterOptions, {
		maxZoom: 12,
		gridSize: 75,
		styles: clusterStyles
	});
	return clusterOptions;
};

// Set new icon
var getIconPlace = function getIconPlace() {
	return {
		url: _Symbol('marker', 50, 50, '#77bf2f'),
		size: new google.maps.Size(50, 50),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(25, 50)
	};
};

var confirmLocationContent = "<div class=\"shiftmap-confirm-location\">\r\n\t<button class=\"shiftmap-promo-area-button\" type=\"button\" value=\"Change your location\">Confirm location</button>\r\n</div>";

var searchBox = function searchBox(map, places, sBox, placeMarkers, getIcon$$1, setIcon$$1) {

	// Bias searchbox results towards current map's viewport
	map.addListener('bounds_changed', function () {
		sBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	sBox.addListener('places_changed', function () {

		var isPlotSearch = $('.shiftmap-promo-area.in').length;

		places = sBox.getPlaces();
		if (places.length == 0) {
			return;
		} else {
			// Only one result
			places = [places[0]];
		}

		// Clear out the old markers.
		placeMarkers.forEach(function (marker) {
			marker.setMap(null);
		});
		placeMarkers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function (place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}

			var marker = void 0;

			if (isPlotSearch) {

				marker = new google.maps.Marker({
					map: map,
					icon: getIconPlace,
					title: place.name,
					position: place.geometry.location,
					optimized: false,
					zindex: 2,
					class: 'shiftms-map-cluster-location-icon'
				});

				placeMarkers.push(marker);
			}

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}

			map.fitBounds(bounds);

			google.maps.event.addListenerOnce(map, "idle", function () {
				if (isPlotSearch) {
					var infoWindow = createInfoWindow(map, marker, place);
				}
			});
		});

		google.maps.event.addListenerOnce(map, "idle", function () {

			// Disable zoom, as infowindow handles this automatically
			if (!isPlotSearch) {
				map.setZoom(6);
			}
		});
	});
};
var createInfoWindow = function createInfoWindow(map, marker, place) {
	var html = $(confirmLocationContent);
	var infowindow = new google.maps.InfoWindow({
		content: ''
	});

	infowindow.setContent(html.get(0));

	html.find("button").click(function () {
		google.maps.event.trigger(map, 'shiftms_plotted_location', place, marker);
		infowindow.close();
		$('html').removeClass('map-plotting-active');
		$('.shiftmap-promo-area').removeClass('in');
	});

	infowindow.open(map, marker);

	return infowindow;
};

var promoHtml = "<div class=\"shiftmap-promo-area\">\r\n\t<h3 class=\"shitfmap-promo-area-text\">Relocation, relocation, relocation...</h3>\r\n\t<button class=\"shiftmap-promo-area-button\" type=\"button\" value=\"Change your location\">Change your location</button><img width=\"70\" height=\"70\" src=\"%assetspath%/icons/icon-2.svg\" class=\"shiftmap-promo-area-icon\">\r\n\t<div class=\"shiftmap-promo-area-tooltip\">\r\n\t\tSearch the map for a landmark to place your marker... don't use your own physical address!\r\n\t\t<a href=\"javascript:;\">Cancel</a>\r\n\t</div>\r\n</div>";

var promoArea = function promoArea(insertMarker, assetsPath) {
	var html = promoHtml;
	html = $(promoHtml.replace('%assetspath%', assetsPath));

	var userPanel = $('.shiftmap-map-clusterise-wrapper');
	userPanel.prepend(html);
	html.find('button').click(insertMarker).click(function () {
		html.addClass('in');
		$('html').addClass('map-plotting-active');
		var input = userPanel.find("input.shiftmap-input").one('blur', function () {});
		setTimeout(function () {
			input.focus();
		}, 100);
	});

	html.find('a').click(function () {
		html.removeClass('in');
		$('html').removeClass('map-plotting-active');
	});
};

var promoHtml$1 = "<div class=\"shiftmap-promo-area\">\r\n\t<h3 class=\"shitfmap-promo-area-text\">There are currently %total% people on the map</h3>\r\n\t<button class=\"shiftmap-promo-area-button\" type=\"button\" value=\"Add your marker\">Add your marker</button>\r\n\t<img width=\"70\" height=\"70\" src=\"%assetspath%/icons/icon-2.svg\" class=\"shiftmap-promo-area-icon\">\r\n\t<div class=\"shiftmap-promo-area-tooltip\">\r\n\t\tSearch the map for a landmark to place your marker... don't use your own physical address!\r\n\t\t<a href=\"javascript:;\">Cancel</a>\r\n\t</div>\r\n</div>";

var promoArea$1 = function promoArea(insertMarker, numUsers, assetsPath) {
	var html = promoHtml$1;
	html = $(promoHtml$1.replace('%total%', numUsers).replace('%assetspath%', assetsPath));

	var userPanel = $('.shiftmap-map-clusterise-wrapper');
	userPanel.prepend(html);
	html.find('button').click(insertMarker).click(function () {
		html.addClass('in');
		$('html').addClass('map-plotting-active');
		var input = userPanel.find("input.shiftmap-input").one('blur', function () {
			// setTimeout(() => html.removeClass('in'), 500 );
		});
		setTimeout(function () {
			input.focus();
		}, 100);
	});

	html.find('a').click(function () {
		html.removeClass('in');
		$('html').removeClass('map-plotting-active');
	});
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var clusterize = createCommonjsModule(function (module) {
  /*! Clusterize.js - v0.17.6 - 2017-03-05
  * http://NeXTs.github.com/Clusterize.js/
  * Copyright (c) 2015 Denis Lukov; Licensed GPLv3 */

  (function (name, definition) {
    module.exports = definition();
  })('Clusterize', function () {
    "use strict";

    // detect ie9 and lower
    // https://gist.github.com/padolsey/527683#comment-786682

    var ie = function () {
      for (var v = 3, el = document.createElement('b'), all = el.all || []; el.innerHTML = '<!--[if gt IE ' + ++v + ']><i><![endif]-->', all[0];) {}
      return v > 4 ? v : document.documentMode;
    }(),
        is_mac = navigator.platform.toLowerCase().indexOf('mac') + 1;
    var Clusterize = function Clusterize(data) {
      if (!(this instanceof Clusterize)) return new Clusterize(data);
      var self = this;

      var defaults = {
        rows_in_block: 50,
        blocks_in_cluster: 4,
        tag: null,
        show_no_data_row: true,
        no_data_class: 'clusterize-no-data',
        no_data_text: 'No data',
        keep_parity: true,
        callbacks: {}
      };

      // public parameters
      self.options = {};
      var options = ['rows_in_block', 'blocks_in_cluster', 'show_no_data_row', 'no_data_class', 'no_data_text', 'keep_parity', 'tag', 'callbacks'];
      for (var i = 0, option; option = options[i]; i++) {
        self.options[option] = typeof data[option] != 'undefined' && data[option] != null ? data[option] : defaults[option];
      }

      var elems = ['scroll', 'content'];
      for (var i = 0, elem; elem = elems[i]; i++) {
        self[elem + '_elem'] = data[elem + 'Id'] ? document.getElementById(data[elem + 'Id']) : data[elem + 'Elem'];
        if (!self[elem + '_elem']) throw new Error("Error! Could not find " + elem + " element");
      }

      // tabindex forces the browser to keep focus on the scrolling list, fixes #11
      if (!self.content_elem.hasAttribute('tabindex')) self.content_elem.setAttribute('tabindex', 0);

      // private parameters
      var rows = isArray(data.rows) ? data.rows : self.fetchMarkup(),
          cache = {},
          scroll_top = self.scroll_elem.scrollTop;

      // append initial data
      self.insertToDOM(rows, cache);

      // restore the scroll position
      self.scroll_elem.scrollTop = scroll_top;

      // adding scroll handler
      var last_cluster = false,
          scroll_debounce = 0,
          pointer_events_set = false,
          scrollEv = function scrollEv() {
        // fixes scrolling issue on Mac #3
        if (is_mac) {
          if (!pointer_events_set) self.content_elem.style.pointerEvents = 'none';
          pointer_events_set = true;
          clearTimeout(scroll_debounce);
          scroll_debounce = setTimeout(function () {
            self.content_elem.style.pointerEvents = 'auto';
            pointer_events_set = false;
          }, 50);
        }
        if (last_cluster != (last_cluster = self.getClusterNum())) self.insertToDOM(rows, cache);
        if (self.options.callbacks.scrollingProgress) self.options.callbacks.scrollingProgress(self.getScrollProgress());
      },
          resize_debounce = 0,
          resizeEv = function resizeEv() {
        clearTimeout(resize_debounce);
        resize_debounce = setTimeout(self.refresh, 100);
      };
      on('scroll', self.scroll_elem, scrollEv);
      on('resize', window, resizeEv);

      // public methods
      self.destroy = function (clean) {
        off('scroll', self.scroll_elem, scrollEv);
        off('resize', window, resizeEv);
        self.html((clean ? self.generateEmptyRow() : rows).join(''));
      };
      self.refresh = function (force) {
        if (self.getRowsHeight(rows) || force) self.update(rows);
      };
      self.update = function (new_rows) {
        rows = isArray(new_rows) ? new_rows : [];
        var scroll_top = self.scroll_elem.scrollTop;
        // fixes #39
        if (rows.length * self.options.item_height < scroll_top) {
          self.scroll_elem.scrollTop = 0;
          last_cluster = 0;
        }
        self.insertToDOM(rows, cache);
        self.scroll_elem.scrollTop = scroll_top;
      };
      self.clear = function () {
        self.update([]);
      };
      self.getRowsAmount = function () {
        return rows.length;
      };
      self.getScrollProgress = function () {
        return this.options.scroll_top / (rows.length * this.options.item_height) * 100 || 0;
      };

      var add = function add(where, _new_rows) {
        var new_rows = isArray(_new_rows) ? _new_rows : [];
        if (!new_rows.length) return;
        rows = where == 'append' ? rows.concat(new_rows) : new_rows.concat(rows);
        self.insertToDOM(rows, cache);
      };
      self.append = function (rows) {
        add('append', rows);
      };
      self.prepend = function (rows) {
        add('prepend', rows);
      };
    };

    Clusterize.prototype = {
      constructor: Clusterize,
      // fetch existing markup
      fetchMarkup: function fetchMarkup() {
        var rows = [],
            rows_nodes = this.getChildNodes(this.content_elem);
        while (rows_nodes.length) {
          rows.push(rows_nodes.shift().outerHTML);
        }
        return rows;
      },
      // get tag name, content tag name, tag height, calc cluster height
      exploreEnvironment: function exploreEnvironment(rows, cache) {
        var opts = this.options;
        opts.content_tag = this.content_elem.tagName.toLowerCase();
        if (!rows.length) return;
        if (ie && ie <= 9 && !opts.tag) opts.tag = rows[0].match(/<([^>\s/]*)/)[1].toLowerCase();
        if (this.content_elem.children.length <= 1) cache.data = this.html(rows[0] + rows[0] + rows[0]);
        if (!opts.tag) opts.tag = this.content_elem.children[0].tagName.toLowerCase();
        this.getRowsHeight(rows);
      },
      getRowsHeight: function getRowsHeight(rows) {
        var opts = this.options,
            prev_item_height = opts.item_height;
        opts.cluster_height = 0;
        if (!rows.length) return;
        var nodes = this.content_elem.children;
        var node = nodes[Math.floor(nodes.length / 2)];
        opts.item_height = node.offsetHeight;
        // consider table's border-spacing
        if (opts.tag == 'tr' && getStyle('borderCollapse', this.content_elem) != 'collapse') opts.item_height += parseInt(getStyle('borderSpacing', this.content_elem), 10) || 0;
        // consider margins (and margins collapsing)
        if (opts.tag != 'tr') {
          var marginTop = parseInt(getStyle('marginTop', node), 10) || 0;
          var marginBottom = parseInt(getStyle('marginBottom', node), 10) || 0;
          opts.item_height += Math.max(marginTop, marginBottom);
        }
        opts.block_height = opts.item_height * opts.rows_in_block;
        opts.rows_in_cluster = opts.blocks_in_cluster * opts.rows_in_block;
        opts.cluster_height = opts.blocks_in_cluster * opts.block_height;
        return prev_item_height != opts.item_height;
      },
      // get current cluster number
      getClusterNum: function getClusterNum() {
        this.options.scroll_top = this.scroll_elem.scrollTop;
        return Math.floor(this.options.scroll_top / (this.options.cluster_height - this.options.block_height)) || 0;
      },
      // generate empty row if no data provided
      generateEmptyRow: function generateEmptyRow() {
        var opts = this.options;
        if (!opts.tag || !opts.show_no_data_row) return [];
        var empty_row = document.createElement(opts.tag),
            no_data_content = document.createTextNode(opts.no_data_text),
            td;
        empty_row.className = opts.no_data_class;
        if (opts.tag == 'tr') {
          td = document.createElement('td');
          // fixes #53
          td.colSpan = 100;
          td.appendChild(no_data_content);
        }
        empty_row.appendChild(td || no_data_content);
        return [empty_row.outerHTML];
      },
      // generate cluster for current scroll position
      generate: function generate(rows, cluster_num) {
        var opts = this.options,
            rows_len = rows.length;
        if (rows_len < opts.rows_in_block) {
          return {
            top_offset: 0,
            bottom_offset: 0,
            rows_above: 0,
            rows: rows_len ? rows : this.generateEmptyRow()
          };
        }
        var items_start = Math.max((opts.rows_in_cluster - opts.rows_in_block) * cluster_num, 0),
            items_end = items_start + opts.rows_in_cluster,
            top_offset = Math.max(items_start * opts.item_height, 0),
            bottom_offset = Math.max((rows_len - items_end) * opts.item_height, 0),
            this_cluster_rows = [],
            rows_above = items_start;
        if (top_offset < 1) {
          rows_above++;
        }
        for (var i = items_start; i < items_end; i++) {
          rows[i] && this_cluster_rows.push(rows[i]);
        }
        return {
          top_offset: top_offset,
          bottom_offset: bottom_offset,
          rows_above: rows_above,
          rows: this_cluster_rows
        };
      },
      renderExtraTag: function renderExtraTag(class_name, height) {
        var tag = document.createElement(this.options.tag),
            clusterize_prefix = 'clusterize-';
        tag.className = [clusterize_prefix + 'extra-row', clusterize_prefix + class_name].join(' ');
        height && (tag.style.height = height + 'px');
        return tag.outerHTML;
      },
      // if necessary verify data changed and insert to DOM
      insertToDOM: function insertToDOM(rows, cache) {
        // explore row's height
        if (!this.options.cluster_height) {
          this.exploreEnvironment(rows, cache);
        }
        var data = this.generate(rows, this.getClusterNum()),
            this_cluster_rows = data.rows.join(''),
            this_cluster_content_changed = this.checkChanges('data', this_cluster_rows, cache),
            top_offset_changed = this.checkChanges('top', data.top_offset, cache),
            only_bottom_offset_changed = this.checkChanges('bottom', data.bottom_offset, cache),
            callbacks = this.options.callbacks,
            layout = [];

        if (this_cluster_content_changed || top_offset_changed) {
          if (data.top_offset) {
            this.options.keep_parity && layout.push(this.renderExtraTag('keep-parity'));
            layout.push(this.renderExtraTag('top-space', data.top_offset));
          }
          layout.push(this_cluster_rows);
          data.bottom_offset && layout.push(this.renderExtraTag('bottom-space', data.bottom_offset));
          callbacks.clusterWillChange && callbacks.clusterWillChange();
          this.html(layout.join(''));
          this.options.content_tag == 'ol' && this.content_elem.setAttribute('start', data.rows_above);
          callbacks.clusterChanged && callbacks.clusterChanged();
        } else if (only_bottom_offset_changed) {
          this.content_elem.lastChild.style.height = data.bottom_offset + 'px';
        }
      },
      // unfortunately ie <= 9 does not allow to use innerHTML for table elements, so make a workaround
      html: function html(data) {
        var content_elem = this.content_elem;
        if (ie && ie <= 9 && this.options.tag == 'tr') {
          var div = document.createElement('div'),
              last;
          div.innerHTML = '<table><tbody>' + data + '</tbody></table>';
          while (last = content_elem.lastChild) {
            content_elem.removeChild(last);
          }
          var rows_nodes = this.getChildNodes(div.firstChild.firstChild);
          while (rows_nodes.length) {
            content_elem.appendChild(rows_nodes.shift());
          }
        } else {
          content_elem.innerHTML = data;
        }
      },
      getChildNodes: function getChildNodes(tag) {
        var child_nodes = tag.children,
            nodes = [];
        for (var i = 0, ii = child_nodes.length; i < ii; i++) {
          nodes.push(child_nodes[i]);
        }
        return nodes;
      },
      checkChanges: function checkChanges(type, value, cache) {
        var changed = value != cache[type];
        cache[type] = value;
        return changed;
      }
    };

    // support functions
    function on(evt, element, fnc) {
      return element.addEventListener ? element.addEventListener(evt, fnc, false) : element.attachEvent("on" + evt, fnc);
    }
    function off(evt, element, fnc) {
      return element.removeEventListener ? element.removeEventListener(evt, fnc, false) : element.detachEvent("on" + evt, fnc);
    }
    function isArray(arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
    function getStyle(prop, elem) {
      return window.getComputedStyle ? window.getComputedStyle(elem)[prop] : elem.currentStyle[prop];
    }

    return Clusterize;
  });
});

var zoomingOnSingle = false;
var buildList = function buildList(clusterize, listArray, markers, localMap, domElement) {

	if (zoomingOnSingle) {
		return;
	}

	listArray = [];
	clusterize.clear();

	markers.map(function (user) {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push('<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-' + user.userID + '">\n\t\t\t\t<div class="shiftmap-clusterize-user-cell">\n\t\t\t\t\t<div class="shiftmap-clusterize-avatar">\n\t\t\t\t\t\t<div style="background-image:url(\'' + user.url + '\')"></div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="shiftmap-clusterize-content">\n\t\t\t\t\t\t<h3 class="shiftmap-clusterize-user-name">' + user.userName + '</h3>\n\t\t\t\t\t\t<div class="active">Last active 2 weeks ago</div>\n\t\t\t\t\t\t<button class="shiftmap-clusterize-user-button" data-clickuser="' + user.userID + '">Follow</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>');
		}

		// Dsiplay user info on sidebar 
		var showUserInfo = function showUserInfo() {
			$(domElement).trigger('openpanel');
			clusterize.clear();
			clusterize.update(['\n\t\t\t\t<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-single">\n\t\t\t\t\t<div class="shiftmap-clusterize-user-cell">\n\t\t\t\t\t\t<div class="shiftmap-clusterize-avatar">\n\t\t\t\t\t\t\t<div style="background-image:url(\'' + user.url + '\')"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="shiftmap-clusterize-content">\n\t\t\t\t\t\t\t <div class="visible"><span data-clickuser="' + user.userID + '">User:</span> ' + user.userName + '</div>\n\t\t\t\t\t\t\t <div class="' + (user.city && 'visible') + '"><span>City:</span> ' + user.city + '</div>\n\t\t\t\t\t\t\t <div class="' + (user.country && 'visible') + '"><span>Country:</span> ' + user.country + '</div>\n\t\t\t\t\t\t\t <div class="' + ((user.active || true) && 'visible active') + '">Last active 2 weeks ago</div>\n\t\t\t\t\t\t\t <div class="visible">\n\t\t\t\t\t\t\t \t<button class="shiftmap-clusterize-user-button" data-clickuser="' + user.userID + '">Follow</button>\n\t\t\t\t\t\t\t </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t']);
			clusterize.refresh();
		};

		// On marker clikc user info is displayed
		if (!user.clickEventBound) {
			google.maps.event.addDomListener(user, 'click', function () {
				zoomingOnSingle = true;
				showUserInfo();

				if (localMap.getZoom() < 8) {
					localMap.setZoom(8);
				}

				localMap.setCenter(user.getPosition());

				setTimeout(function () {
					zoomingOnSingle = false;
				}, 1000);
			});
			user.clickEventBound = true;
		}
	});

	clusterize.update(listArray);
	clusterize.refresh();
};

var checkData = function checkData(dataset) {
	try {
		JSON.stringify(dataset);
		return true;
	} catch (err) {
		console.error('Data is not JSON format!');
		return false;
	}
};

// Generate random numbers between a min and a max values
var getRandom = function getRandom(min, max) {
	return Math.random() * (max - min) + min;
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3_3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0.1
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'imagePath': (string) The base URL where the images representing
 *                  clusters will be found. The full URL will be:
 *                  {imagePath}[1-5].{imageExtension}
 *                  Default: '../images/m'.
 *     'imageExtension': (string) The suffix for images URL representing
 *                       clusters will be found. See _imagePath_ for details.
 *                       Default: 'png'.
 *     'averageCenter': (boolean) Whether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
  // MarkerClusterer implements google.maps.OverlayView interface. We use the
  // extend function to extend MarkerClusterer with google.maps.OverlayView
  // because it might not always be available when the code is defined so we
  // look for it at the last possible moment. If it doesn't exist now then
  // there is no point going ahead :)
  this.extend(MarkerClusterer, google.maps.OverlayView);
  this.map_ = map;

  /**
   * @type {Array.<google.maps.Marker>}
   * @private
   */
  this.markers_ = [];

  /**
   *  @type {Array.<Cluster>}
   */
  this.clusters_ = [];

  this.sizes = [53, 56, 66, 78, 90];

  /**
   * @private
   */
  this.styles_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.ready_ = false;

  var options = opt_options || {};

  /**
   * @type {number}
   * @private
   */
  this.gridSize_ = options['gridSize'] || 60;

  /**
   * @private
   */
  this.minClusterSize_ = options['minimumClusterSize'] || 2;

  /**
   * @type {?number}
   * @private
   */
  this.maxZoom_ = options['maxZoom'] || null;

  this.styles_ = options['styles'] || [];

  /**
   * @type {string}
   * @private
   */
  this.imagePath_ = options['imagePath'] || this.MARKER_CLUSTER_IMAGE_PATH_;

  /**
   * @type {string}
   * @private
   */
  this.imageExtension_ = options['imageExtension'] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;

  /**
   * @type {boolean}
   * @private
   */
  this.zoomOnClick_ = true;

  if (options['zoomOnClick'] != undefined) {
    this.zoomOnClick_ = options['zoomOnClick'];
  }

  /**
   * @type {boolean}
   * @private
   */
  this.averageCenter_ = false;

  if (options['averageCenter'] != undefined) {
    this.averageCenter_ = options['averageCenter'];
  }

  this.setupStyles_();

  this.setMap(map);

  /**
   * @type {number}
   * @private
   */
  this.prevZoom_ = this.map_.getZoom();

  // Add the map event listeners
  var that = this;
  google.maps.event.addListener(this.map_, 'zoom_changed', function () {
    // Determines map type and prevent illegal zoom levels
    var zoom = that.map_.getZoom();
    var minZoom = that.map_.minZoom || 0;
    var maxZoom = Math.min(that.map_.maxZoom || 100, that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom);
    zoom = Math.min(Math.max(zoom, minZoom), maxZoom);

    if (that.prevZoom_ != zoom) {
      that.prevZoom_ = zoom;
      that.resetViewport();
    }
  });

  google.maps.event.addListener(this.map_, 'idle', function () {
    that.redraw();
  });

  // Finally, add the markers
  if (opt_markers && (opt_markers.length || Object.keys(opt_markers).length)) {
    this.addMarkers(opt_markers, false);
  }
}

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = '../images/m';

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';

/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function (obj1, obj2) {
  return function (object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }.apply(obj1, [obj2]);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function () {
  this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function () {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function () {
  if (this.styles_.length) {
    return;
  }

  for (var i = 0, size; size = this.sizes[i]; i++) {
    this.styles_.push({
      url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
      height: size,
      width: size
    });
  }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function () {
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }

  this.map_.fitBounds(bounds);
};

/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function (styles) {
  this.styles_ = styles;
};

/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function () {
  return this.styles_;
};

/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function () {
  return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function () {
  return this.averageCenter_;
};

/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function () {
  return this.markers_;
};

/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function () {
  return this.markers_.length;
};

/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
  this.maxZoom_ = maxZoom;
};

/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function () {
  return this.maxZoom_;
};

/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function (markers, numStyles) {
  var index = 0;
  var count = markers.length;
  var dv = count;
  while (dv !== 0) {
    dv = parseInt(dv / 10, 10);
    index++;
  }

  index = Math.min(index, numStyles);
  return {
    text: count,
    index: index
  };
};

/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function (calculator) {
  this.calculator_ = calculator;
};

/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function () {
  return this.calculator_;
};

/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
  if (markers.length) {
    for (var i = 0, marker; marker = markers[i]; i++) {
      this.pushMarkerTo_(marker);
    }
  } else if (Object.keys(markers).length) {
    for (var marker in markers) {
      this.pushMarkerTo_(markers[marker]);
    }
  }
  if (!opt_nodraw) {
    this.redraw();
  }
};

/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
  marker.isAdded = false;
  if (marker['draggable']) {
    // If the marker is draggable add a listener so we update the clusters on
    // the drag end.
    var that = this;
    google.maps.event.addListener(marker, 'dragend', function () {
      marker.isAdded = false;
      that.repaint();
    });
  }
  this.markers_.push(marker);
};

/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
  this.pushMarkerTo_(marker);
  if (!opt_nodraw) {
    this.redraw();
  }
};

/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function (marker) {
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        index = i;
        break;
      }
    }
  }

  if (index == -1) {
    // Marker is not in our list of markers.
    return false;
  }

  marker.setMap(null);

  this.markers_.splice(index, 1);

  return true;
};

/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {
  var removed = this.removeMarker_(marker);

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  } else {
    return false;
  }
};

/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {
  // create a local copy of markers if required
  // (removeMarker_ modifies the getMarkers() array in place)
  var markersCopy = markers === this.getMarkers() ? markers.slice() : markers;
  var removed = false;

  for (var i = 0, marker; marker = markersCopy[i]; i++) {
    var r = this.removeMarker_(marker);
    removed = removed || r;
  }

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  }
};

/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function (ready) {
  if (!this.ready_) {
    this.ready_ = ready;
    this.createClusters_();
  }
};

/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function () {
  return this.clusters_.length;
};

/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function () {
  return this.map_;
};

/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function (map) {
  this.map_ = map;
};

/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function () {
  return this.gridSize_;
};

/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function (size) {
  this.gridSize_ = size;
};

/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function () {
  return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function (size) {
  this.minClusterSize_ = size;
};

/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
  var projection = this.getProjection();

  // Turn the bounds into latlng.
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = projection.fromDivPixelToLatLng(trPix);
  var sw = projection.fromDivPixelToLatLng(blPix);

  // Extend the bounds to contain the new bounds.
  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};

/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
  return bounds.contains(marker.getPosition());
};

/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function () {
  this.resetViewport(true);

  // Set the markers a empty array.
  this.markers_ = [];
};

/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function (opt_hide) {
  // Remove all the clusters
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    cluster.remove();
  }

  // Reset the markers to not be added and to be invisible.
  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    marker.isAdded = false;
    if (opt_hide) {
      marker.setMap(null);
    }
  }

  this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function () {
  var oldClusters = this.clusters_.slice();
  this.clusters_.length = 0;
  this.resetViewport();
  this.redraw();

  // Remove the old clusters.
  // Do it in a timeout so the other clusters have been drawn first.
  window.setTimeout(function () {
    for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
      cluster.remove();
    }
  }, 0);
};

/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function () {
  this.createClusters_();
};

/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
*/
MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
  var distance = 40000; // Some large number
  var clusterToAddTo = null;
  var pos = marker.getPosition();
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    var center = cluster.getCenter();
    if (center) {
      var d = this.distanceBetweenPoints_(center, marker.getPosition());
      if (d < distance) {
        distance = d;
        clusterToAddTo = cluster;
      }
    }
  }

  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
    clusterToAddTo.addMarker(marker);
  } else {
    var cluster = new Cluster(this);
    cluster.addMarker(marker);
    this.clusters_.push(cluster);
  }
};

/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function () {
  if (!this.ready_) {
    return;
  }

  // Get our current map view bounds.
  // Create a new bounds object so we don't affect the map.
  var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
  var bounds = this.getExtendedBounds(mapBounds);

  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
      this.addToClosestCluster_(marker);
    }
  }
};

/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
  this.markerClusterer_ = markerClusterer;
  this.map_ = markerClusterer.getMap();
  this.gridSize_ = markerClusterer.getGridSize();
  this.minClusterSize_ = markerClusterer.getMinClusterSize();
  this.averageCenter_ = markerClusterer.isAverageCenter();
  this.center_ = null;
  this.markers_ = [];
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function (marker) {
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) != -1;
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function (marker) {
  if (this.isMarkerAlreadyAdded(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } else {
    if (this.averageCenter_) {
      var l = this.markers_.length + 1;
      var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  this.markers_.push(marker);

  var len = this.markers_.length;
  if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
    // Min cluster size not reached so show the marker.
    marker.setMap(this.map_);
  }

  if (len == this.minClusterSize_) {
    // Hide the markers that were showing.
    for (var i = 0; i < len; i++) {
      this.markers_[i].setMap(null);
    }
  }

  if (len >= this.minClusterSize_) {
    marker.setMap(null);
  }

  this.updateIcon();
  return true;
};

/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function () {
  return this.markerClusterer_;
};

/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function () {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }
  return bounds;
};

/**
 * Removes the cluster
 */
Cluster.prototype.remove = function () {
  this.clusterIcon_.remove();
  this.markers_.length = 0;
  delete this.markers_;
};

/**
 * Returns the number of markers in the cluster.
 *
 * @return {number} The number of markers in the cluster.
 */
Cluster.prototype.getSize = function () {
  return this.markers_.length;
};

/**
 * Returns a list of the markers in the cluster.
 *
 * @return {Array.<google.maps.Marker>} The markers in the cluster.
 */
Cluster.prototype.getMarkers = function () {
  return this.markers_;
};

/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function () {
  return this.center_;
};

/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function () {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};

/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
  return this.bounds_.contains(marker.getPosition());
};

/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function () {
  return this.map_;
};

/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function () {
  var zoom = this.map_.getZoom();
  var mz = this.markerClusterer_.getMaxZoom();

  if (mz && zoom > mz) {
    // The zoom is greater than our max zoom so show all the markers in cluster.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
      marker.setMap(this.map_);
    }
    return;
  }

  if (this.markers_.length < this.minClusterSize_) {
    // Min cluster size not yet reached.
    this.clusterIcon_.hide();
    return;
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
  this.clusterIcon_.setCenter(this.center_);
  this.clusterIcon_.setSums(sums);
  this.clusterIcon_.show();
};

/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.cluster_ = cluster;
  this.center_ = null;
  this.map_ = cluster.getMap();
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;

  this.setMap(this.map_);
}

/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function () {
  var markerClusterer = this.cluster_.getMarkerClusterer();

  // Trigger the clusterclick event.
  google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

  if (markerClusterer.isZoomOnClick()) {
    // Zoom into the cluster.
    this.map_.fitBounds(this.cluster_.getBounds());
  }
};

/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function () {
  this.div_ = document.createElement('DIV');
  var panes = this.getPanes();
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
    if (this.sums_.text) {
      panes.overlayMouseTarget.classList.add('shiftms-map-cluster-icon');
      if (this.sums_.text > 1000) {
        this.div_.classList.add('shiftms-map-cluster-icon-large-num');
      }

      if (this.sums_.text > 0) {
        this.div_.classList.add('shiftms-map-cluster-icon-is-cluster');
      }
    }
  }

  panes.overlayMouseTarget.appendChild(this.div_);

  var that = this;
  google.maps.event.addDomListener(this.div_, 'click', function () {
    that.triggerClusterClick();
  });
};

/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
  pos.x -= parseInt(this.width_ / 2, 10);
  pos.y -= parseInt(this.height_ / 2, 10);
  return pos;
};

/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function () {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + 'px';
    this.div_.style.left = pos.x + 'px';
  }
};

/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function () {
  if (this.div_) {
    this.div_.style.display = 'none';
  }
  this.visible_ = false;
};

/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function () {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.style.display = '';
  }
  this.visible_ = true;
};

/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function () {
  this.setMap(null);
};

/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function () {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function (sums) {
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }

  this.useStyle();
};

/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function () {
  var index = Math.max(0, this.sums_.index - 1);
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style['url'];
  this.height_ = style['height'];
  this.width_ = style['width'];
  this.textColor_ = style['textColor'];
  this.anchor_ = style['anchor'];
  this.textSize_ = style['textSize'];
  this.backgroundPosition_ = style['backgroundPosition'];
};

/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function (center) {
  this.center_ = center;
};

/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function (pos) {
  var style = [];
  style.push('background-image:url(' + this.url_ + ');');
  var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
  style.push('background-position:' + backgroundPosition + ';');

  if (_typeof$1(this.anchor_) === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 && this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) + 'px; padding-top:' + this.anchor_[0] + 'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 && this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) + 'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  var txtColor = this.textColor_ ? this.textColor_ : 'black';
  var txtSize = this.textSize_ ? this.textSize_ : 11;

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' + pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' + txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
  return style.join('');
};

// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
window['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] = MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] = MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] = MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] = MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] = MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] = MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] = MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] = MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] = MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] = MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] = MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] = MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] = MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] = MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;

Object.keys = Object.keys || function (o) {
  var result = [];
  for (var name in o) {
    if (o.hasOwnProperty(name)) result.push(name);
  }
  return result;
};

var pngsList = {
	'person-001': [40, 63],
	'person-002': [38, 63],
	'person-003': [45, 43],
	'person-004': [40, 62],
	'person-005': [39, 63],
	'person-006': [41, 63],
	'person-007': [38, 63],
	'person-008': [40, 63],
	'person-009': [37, 62],
	'person-010': [37, 62],
	'person-011': [38, 63],
	'person-012': [37, 61],
	'person-013': [36, 63],
	'person-014': [37, 63],
	'person-015': [39, 62],
	'person-016': [38, 62],
	'person-017': [37, 61],
	'person-018': [37, 63],
	'person-019': [36, 61],
	'person-020': [39, 61],
	'person-021': [37, 61],
	'person-022': [37, 60],
	'person-023': [41, 68],
	'person-024': [40, 61],
	'person-025': [36, 61],
	'person-026': [38, 61],
	'person-027': [38, 60],
	'person-028': [36, 60],
	'person-029': [37, 65],
	'person-030': [35, 61],
	'person-031': [37, 63],
	'person-032': [44, 53],
	'person-033': [39, 63],
	'person-034': [39, 63],
	'person-035': [68, 65],
	'person-036': [37, 60],
	'person-037': [37, 60],
	'person-038': [37, 60],
	'person-039': [36, 61],
	'person-040': [57, 62],
	'person-041': [65, 63],
	'person-042': [40, 63],
	'person-043': [40, 63],
	'person-044': [49, 66],
	'person-045': [37, 65]
};

var $$3 = jQuery;
var mapDragging = false;

var fetchData = function fetchData(map, data, markers, url, domElement, assetsPath) {

	var clusterOptions = getClusterOptions();

	var localMap = map;
	var listArray = [];
	var avatarURL = url;
	var j = 0;

	var pngs = Object.keys(pngsList);
	var maxZoomLevel = 13;
	var scrollElement = $$3(domElement).find(".shiftmap-map-clusterise-wrapper").get(0);
	var contentElement = $$3(domElement).find(".shiftmap-clusterize-content-wrapper").get(0);

	// Create list
	var clusterize$$1 = new clusterize({
		rows: null,
		rows_in_block: 2,
		scrollElem: scrollElement,
		contentElem: contentElement,
		no_data_text: 'No users within range'
	});

	// Add markers
	if (checkData(data)) {
		data.map(function (markerPosition) {
			if (!markerPosition.latitude || !markerPosition.longitude) {
				console.warn('Could not find coordinates on data provided from userID: ', markerPosition.user_id);
			} else {
				if (j === pngs.length) {
					j = 0;
				}

				var randKey = Math.floor(Math.random() * 1000 / 10 * (pngs.length / 100));
				var img = pngs[randKey] || pngs[0];
				var imgSize = pngsList[img];

				var icon = {
					url: '' + assetsPath + img + '.png',
					size: new google.maps.Size(imgSize[0], imgSize[1]),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(imgSize[0], imgSize[1])
				};

				var location = new google.maps.LatLng({
					lat: markerPosition.latitude + getRandom(0, 0.5),
					lng: markerPosition.longitude + getRandom(0, 0.5)
				});

				var marker = new google.maps.Marker({
					position: location,
					map: localMap,
					icon: icon,
					optimized: false,
					zindex: 0,
					userID: markerPosition.user_id,
					userName: markerPosition.full_name,
					country: markerPosition.country,
					city: markerPosition.city,
					url: markerPosition.avatar || './img/person-example.png'
				});
				markers.push(marker);
				j++;
			}
		});

		// Create MarkerClusterer
		var markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);

		// Updates list when viewport changes
		google.maps.event.addListener(localMap, 'bounds_changed', function () {
			setTimeout(function () {
				buildList(clusterize$$1, listArray, markers, localMap, domElement);
			}, 200);
		});

		google.maps.event.addListener(map, "idle", function () {
			setTimeout(function () {
				google.maps.event.trigger(map, 'resize');
			}, 200);
		});

		google.maps.event.addListener(map, "drag", function () {
			mapDragging = true;
		});

		google.maps.event.addListener(map, "dragend", function () {
			setTimeout(function () {
				return mapDragging = false;
			}, 50);
		});

		// Limit the zoom level
		google.maps.event.addListener(map, 'zoom_changed', function () {
			if (map.getZoom() > maxZoomLevel) map.setZoom(maxZoomLevel);
		});

		bindListeners(map, markerCluster);
	}
};

var bindListeners = function bindListeners(map, markerCluster) {
	google.maps.event.addListener(markerCluster, "clusterclick", function (cluster) {
		// Stops event propagation
		// Ugly but can't find event.preventDefault
		if (mapDragging) {
			throw "Cannot click while dragging";
		}
	});
};

var template = "<div class=\"shiftmap-wrapper\">\r\n\t<div class=\"shiftmap-airballoon\">\r\n\t\t<a href=\"javascript:;\" class=\"balloon-dismiss\"></a>\r\n\t\t<img class=\"shiftmap-airballoon-image\" width=\"160\" height=\"200\">\r\n\t</div>\r\n\t<div class=\"shiftmap-map-clusterise-user-panel\">\r\n\t\t<div class=\"shiftmap-map-clusterise-wrapper\">\r\n\t\t\t<div class=\"shiftmap-input-wrapper\">\r\n\t\t\t\t<input type=\"text\" placeholder=\"Search the map\" class=\"shiftmap-input\">\r\n\t\t\t</div>\r\n\t\t\t<div class=\"shiftmap-showmap-wrapper\">\r\n\t\t\t\t<span class=\"shiftmap-showmap\">\r\n\t\t\t\t\tShow me the whole world\r\n\t\t\t\t</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"shiftmap-clusterize\">\r\n\t\t\t\t<div class=\"shiftmap-clusterize-scroll\">\r\n\t\t\t\t\t<div class=\"shiftmap-clusterize-user-table\">\r\n\t\t\t\t\t\t<div class=\"shiftmap-clusterize-content-wrapper\"></div>\r\n\t\t\t\t\t\t<div class=\"shiftmap-clusterize-no-data\" style=\"display:none\">\r\n\t\t\t\t\t\t\t<div>Zoom to display user data…</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"shiftmap-map-toggle-panel alert-user\">\r\n\t\t\t\r\n\t\t</div>\r\n\t</div>\r\n\r\n\t<div class=\"shiftmap-map-wrapper\">\r\n\t\t<div class=\"shiftmap-map\"></div>\r\n\t</div>\r\n</div>";

var createMap = function createMap(domElement) {
	var $ = window.jQuery;
	var $wrapper = $(domElement).html(template);
	var $map = $wrapper.find('.shiftmap-map');
	var opt = getMapOptions();
	return new google.maps.Map($map.get(0), opt);
};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var promise = createCommonjsModule(function (module) {
  (function (root) {

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function noop() {}

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }

    function Promise(fn) {
      if (_typeof$2(this) !== 'object') throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      this._state = 0;
      this._handled = false;
      this._value = undefined;
      this._deferreds = [];

      doResolve(fn, this);
    }

    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }
      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }
      self._handled = true;
      Promise._immediateFn(function () {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }
        var ret;
        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }
        resolve(deferred.promise, ret);
      });
    }

    function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && ((typeof newValue === 'undefined' ? 'undefined' : _typeof$2(newValue)) === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (newValue instanceof Promise) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }

    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }

    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise._immediateFn(function () {
          if (!self._handled) {
            Promise._unhandledRejectionFn(self._value);
          }
        });
      }

      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }
      self._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
      var done = false;
      try {
        fn(function (value) {
          if (done) return;
          done = true;
          resolve(self, value);
        }, function (reason) {
          if (done) return;
          done = true;
          reject(self, reason);
        });
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }

    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
      var prom = new this.constructor(noop);

      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };

    Promise.all = function (arr) {
      var args = Array.prototype.slice.call(arr);

      return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
          try {
            if (val && ((typeof val === 'undefined' ? 'undefined' : _typeof$2(val)) === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise.resolve = function (value) {
      if (value && (typeof value === 'undefined' ? 'undefined' : _typeof$2(value)) === 'object' && value.constructor === Promise) {
        return value;
      }

      return new Promise(function (resolve) {
        resolve(value);
      });
    };

    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };

    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };

    // Use polyfill for setImmediate for performance gains
    Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
      setImmediate(fn);
    } || function (fn) {
      setTimeoutFunc(fn, 0);
    };

    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
      }
    };

    /**
     * Set the immediate function to execute callbacks
     * @param fn {function} Function to execute
     * @deprecated
     */
    Promise._setImmediateFn = function _setImmediateFn(fn) {
      Promise._immediateFn = fn;
    };

    /**
     * Change the function to execute on unhandled rejection
     * @param {function} fn Function to execute on unhandled rejection
     * @deprecated
     */
    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
      Promise._unhandledRejectionFn = fn;
    };

    if ('object' !== 'undefined' && module.exports) {
      module.exports = Promise;
    } else if (!root.Promise) {
      root.Promise = Promise;
    }
  })(commonjsGlobal);
});

if (!window.Promise) {
  window.Promise = promise;
}

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : undefined);

var placeCharacters = function placeCharacters(map, assetsPath) {

	// DISABLED for now
	return true;

	var airportsMarkers = [];
	var icons = [];
	var localMap = map;
	var pngs = Object.keys(pngsList);
	var j = 0;

	fetch("./datasets/airports.json").then(function (response) {
		return response.json();
	}).then(function (airports) {
		airports.map(function (airport) {
			if (j === pngs.length) {
				j = 0;
			}
			var randKey = Math.floor(Math.random() * 1000 / 10 * (pngs.length / 100));
			var img = pngs[randKey] || pngs[0];
			var imgSize = pngsList[img];

			// Character object 
			var character = {
				position: new google.maps.LatLng(airport.latitude, airport.longitude),
				icon: {
					url: '' + assetsPath + img + '.png',
					size: new google.maps.Size(imgSize[0], imgSize[1]),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(imgSize[0], imgSize[1])
				}
			};
			// Add a marker for each character
			airportsMarkers.push(new google.maps.Marker({
				position: character.position,
				map: localMap,
				icon: character.icon,
				visible: false
			}));
			icons.push(character);
			j++;
		});

		// Shuffle the markers
		shuffle(airportsMarkers);

		// Initial visibility
		setVisibleMarkers(localMap.getZoom());
	}).catch(function (err) {
		console.log(err);
	});

	//	Change markers on zoom
	google.maps.event.addListener(localMap, 'zoom_changed', function () {
		setVisibleMarkers(localMap.getZoom());
		var zoom = localMap.getZoom();
	});

	function setVisibleMarkers(zoom) {
		var maxZoom = 8;
		var max = airportsMarkers.length * (zoom / maxZoom / 20);
		var y = 0;
		airportsMarkers.map(function (marker, i) {
			marker.setVisible(i < max);
			i < max && y++;
		});
		console.log(y + ' markers display at ' + zoom + ' with max at ' + max);
	}
};

function shuffle(a) {
	for (var i = a.length; i; i--) {
		var j = Math.floor(Math.random() * i);
		var _ref = [a[j], a[i - 1]];
		a[i - 1] = _ref[0];
		a[j] = _ref[1];
	}
}

var checkAssetsPath = function checkAssetsPath(assetsPath) {

	if (RegExp('^(/[^/ ]*)+/$').test(assetsPath)) {
		return true;
	} else {
		console.error('Please provide the icons directory as in "/path/to/icons/"');
	}
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*eslint-disable */
var $$1 = window.jQuery;

if (!$$1) {
	throw 'jQuery is required for this map plugin';
}

var Map = function () {
	function Map(settings) {
		_classCallCheck(this, Map);

		$$1.extend(this, settings);
		this.markers = this.markers || [];
		this.placeMarkers = this.placeMarkers || [];
		this.init();
	}

	Map.prototype.init = function init() {
		this.listeners = [];
		this.wrapper = this.domElement;
		this.map = createMap(this.wrapper);
		this.sBox = createSearchBox(this.map, this.domElement);
		this.avatarURL = this.avatarURL || defineURL('https://github.com/identicons/', '.png');

		panelClosedOnLoad(this.domElement);
		bindEvents(this.domElement, this.map);
		bindClickEvent(this.domElement, this.data, this.listeners);

		// Other initiliasation
		this.initFetchData();
		this.initSearchBox();
		this.initPromoAreas();
		this.placeCharacters();
		this.initMapFullDisplay();
		this.initMapGenericBehaviour();
	};

	Map.prototype.initFetchData = function initFetchData() {
		fetchData(this.map, this.data, this.markers, this.avatarURL, this.domElement, this.assetsPath);
	};

	Map.prototype.initSearchBox = function initSearchBox() {
		searchBox(this.map, this.places, this.sBox, this.placeMarkers, this.getIcon, this.setIcon);
	};

	Map.prototype.initPromoAreas = function initPromoAreas() {
		// Render promo area
		if (this.isLoggedIn) {
			promoArea(function () {
				console.log('change your location clicked');
			}, this.assetsPath);
		} else {
			promoArea$1(function () {
				console.log('Add your marker clicked!');
			}, this.markers.length, this.assetsPath);
		}

		// Display air balloon
		airBalloon(this.domElement, this.isLoggedIn, this.assetsPath);
	};

	Map.prototype.placeCharacters = function placeCharacters$$1() {
		var _this = this;

		// Add characters
		setTimeout(function () {
			if (checkAssetsPath(_this.assetsPath)) {
				placeCharacters(_this.map, _this.assetsPath);
			}
		}, 100);
	};

	Map.prototype.initMapFullDisplay = function initMapFullDisplay() {
		// Show whole map on click
		showMap(this.domElement, this.map);
	};

	Map.prototype.initMapGenericBehaviour = function initMapGenericBehaviour() {
		// Open panel on zoom
		google.maps.event.addListenerOnce(this.map, 'zoom_changed', function () {
			var $panel = $$1(this.domElement).find('.shiftmap-map-clusterise-user-panel');
			$panel.removeClass('default');
		});
	};

	// Returns an object of public events
	// Used for manipulating the map after load
	// Or listening to events


	Map.prototype.public = function _public() {
		var _this2 = this;

		var self = this;

		return {
			enablePlotLocationMode: function enablePlotLocationMode() {
				_enablePlotLocationMode(_this2.domElement);
			},
			setWidthHeight: function setWidthHeight(width, height) {
				_setWidthHeight(width, height, _this2.map);
			},
			setMapLocation: function setMapLocation(lat, lng) {
				changeMapLocation(lat, lng, _this2.map);
			},
			onMapReady: function onMapReady(callback) {
				_onMapReady(callback, _this2.map);
			},
			onAirBalloonClick: function onAirBalloonClick(callback) {
				_onAirBalloonClick(_this2.domElement, callback);
			},
			onMapChangeLocation: function onMapChangeLocation(callback) {
				_onMapChangeLocation(callback, _this2.map);
			},
			onPlotLocation: function onPlotLocation(callback) {
				_onPlotLocation(_this2.map, callback);
			},
			onClickUser: function onClickUser(callback) {
				_onClickUser(callback, null, _this2.listeners);
			},
			insertMarker: function insertMarker(lat, lng, imgURL, clickEvent) {
				_insertMarker(lat, lng, imgURL, clickEvent, _this2.map);
			}
		};
	};

	return Map;
}();

var initialize = function initialize(settings) {
	var map = new Map(settings);
	return map.public();
};

// Plot location listener
var _onPlotLocation = function _onPlotLocation(map, callback) {
	google.maps.event.addListener(map, 'shiftms_plotted_location', callback);
};

// Air Balloon
var airBalloon = function airBalloon(domElement, logged, assetsPath) {
	var balloon = $$1(domElement).find('.shiftmap-airballoon-image');
	var dismiss = $$1(domElement).find('.balloon-dismiss');
	$$1(dismiss).click(function (e) {
		$$1(balloon).remove();
	});
	if (logged) {
		balloon.remove();
		//balloon.attr('src', `${assetsPath}promo/map-hot-air-balloon.png`);
	} else {
		balloon.attr('src', assetsPath + 'promo/map-hot-air-balloon.png?v=1');
	}
};

// Balloon click listener
var _onAirBalloonClick = function _onAirBalloonClick(domElement, callback) {
	var balloon = $$1(domElement).find('.shiftmap-airballoon-image');
	balloon.click(callback);
};

// Insert markers after map is loaded
var _insertMarker = function _insertMarker(lat, lng, imgURL, clickEvent, map) {
	lat = lat || null;
	lng = lng || null;
	imgURL = imgURL.toString() || null;
	clickEvent = clickEvent || function () {};

	if (typeof clickEvent !== 'function') {
		throw 'Click event must be a function!';
	}

	if (typeof lat !== 'number' || typeof lng !== 'number') {
		throw 'Coordinates must be numbers!';
	}

	var img = new Image();
	img.onload = function () {
		var imgWidth = Math.abs(img.width / 2) || null;
		var imgHeight = Math.abs(img.height / 2) || null;

		google.maps.event.addListener(map, 'idle', function () {
			var location = new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
			var icon = {
				url: '' + imgURL,
				size: new google.maps.Size(imgWidth, imgHeight),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(imgWidth / 2, imgHeight),
				scaledSize: new google.maps.Size(imgWidth, imgHeight)
			};
			var marker = new google.maps.Marker({
				position: location,
				icon: icon,
				map: map,
				// optimized: false,
				// zindex: 0,
				url: ''
			}).addListener('click', function () {
				clickEvent(marker, imgURL);
			});
		});
	};

	img.src = imgURL;
};

// Panel closed on page load
var panelClosedOnLoad = function panelClosedOnLoad(domElement) {
	var $panel = $$1(domElement).find('.shiftmap-map-clusterise-user-panel');
	$panel.toggleClass('default');
};

// Move map to specified coordinates , dk why i built this though
var changeMapLocation = function changeMapLocation(lat, lng, map) {
	var location = defineCenter(lat, lng);
	map.panTo(location);
};

// Detects when map is loaded
var _onMapReady = function _onMapReady(callback, map) {
	if (typeof callback === 'function') {
		google.maps.event.addListenerOnce(map, 'idle', callback);
	} else {
		console.error('provide a callback function');
	}
};

// Fires event when map changes locations
var _onMapChangeLocation = function _onMapChangeLocation(callback, map) {
	if (typeof callback === 'function') {
		google.maps.event.addListener(map, 'idle', callback);
	} else {
		console.error('provide a callback function');
	}
};

// Builds assets URL in acceptable format
var defineURL = function defineURL(url, imgFormat) {
	return [url.toString(), imgFormat.toString()];
};

// Display zoomed out map 
var showMap = function showMap(domElement, map) {
	var showMapButton = $$1(domElement).find('.shiftmap-showmap');
	var topLeft = new google.maps.LatLng(68.870136, -160.789405);
	var bottomRight = new google.maps.LatLng(-44.879507, 178.880419);
	var bounds = new google.maps.LatLngBounds(topLeft, bottomRight);

	var onClick = function onClick() {
		showMapButton.click(function () {
			map.fitBounds(bounds);
		});
	};
	google.maps.event.addListener(map, 'idle', onClick);
};

var bindEvents = function bindEvents(domElement, map) {
	var $panel = $$1(domElement).find('.shiftmap-map-clusterise-user-panel');

	$panel.find('.shiftmap-map-toggle-panel').click(function () {
		$$1(this).removeClass('alert-user');
		if ($panel.hasClass('default')) {
			$panel.removeClass('default');
		} else {
			$panel.toggleClass('closed');
		}
	});

	//	Change markers on zoom
	google.maps.event.addListener(map, 'zoom_changed', function () {
		var zoom = map.getZoom();
		if (zoom > 7) {
			map.setOptions({ styles: mapDetailStyles });
		} else {
			map.setOptions({ styles: mapStyles });
		}
	});

	$$1(domElement).on('openpanel', function () {
		$panel.removeClass('closed');
	});

	google.maps.event.addListenerOnce(map, 'idle', function () {
		geolocationAPI(map);
	});
};

// Define map dimensions
var _setWidthHeight = function _setWidthHeight(width, height, map) {
	$$1('.shiftmap-wrapper').width(width).height(height);
	$$1('.shiftmap-map').width(width).height(height);
	google.maps.event.trigger(map, 'resize');
	google.maps.event.addListenerOnce(map, 'idle', function () {
		google.maps.event.trigger(map, 'resize');
	});
};

var _onClickUser = function _onClickUser(fn, args, listeners) {
	if (fn) {
		listeners.push(fn);
	} else {
		listeners.map(function (e) {
			return e(args);
		});
	}
};

var bindClickEvent = function bindClickEvent(domElement, data, listeners) {
	$$1(domElement).on('click', '[data-clickuser]', function () {
		var id = $$1(this).data('clickuser');
		var find = void 0;
		data.map(function (e) {
			if (e.user_id === id) {
				find = e;
			}
		});
		listeners.map(function (fn) {
			return fn(find);
		});
	});
};

var geolocationAPI = function geolocationAPI(map) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
			map.setZoom(5);
		});
	}
};

var _enablePlotLocationMode = function _enablePlotLocationMode(wrapper) {
	$$1(wrapper).find('.shiftmap-promo-area').addClass('in');
	$$1(wrapper).find('.shiftmap-map-clusterise-user-panel').removeClass('default closed');
};



/*
	insertMarker,
	setWidthHeight,
	onMapReady,
	onMapChangeLocation,
	defineURL,
	changeMapLocation,
	onClickUser,
	onPlotLocation,
	onAirBalloonClick,
	enablePlotLocationMode
*/

exports.initialize = initialize;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=maps.bundle.js.map
