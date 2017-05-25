document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Maps = global.Maps || {})));
}(this, (function (exports) { 'use strict';

var createSearchBox = function createSearchBox(map) {
	var localMap = map;
	// Create search box and link it to UI
	var input = document.getElementById('pac-input');
	localMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	var searchBox = new google.maps.places.SearchBox(input);

	return searchBox;
};

var searchBox = function searchBox(map, places, sBox, placeMarkers, icon, setIcon) {

	// Bias searchbox results towards current map's viewport
	map.addListener('bounds_changed', function () {
		sBox.setBounds(map.getBounds());
	});

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	sBox.addListener('places_changed', function () {
		places = sBox.getPlaces();
		if (places.length == 0) {
			return;
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

			var newIcon = {
				url: place.icon,
				size: icon.size,
				origin: icon.origin,
				anchor: icon.anchor,
				scaledSize: icon.scaledSize
			};

			var placeIcon = setIcon(newIcon);

			placeMarkers.push(new google.maps.Marker({
				map: map,
				icon: placeIcon,
				title: place.name,
				position: place.geometry.location,
				setMap: map
			}));

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var clusterize = createCommonjsModule(function (module) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

// Cluster markers SVG
var _Symbol = function _Symbol(id, width, height, fill) {
	var marker_svg = {
		marker: {
			p: 'M244.31,0C256.87,2.49,269.59,4.38,282,7.58c35.11,9.1,65.15,27.29,90.44,53.07C401.19,90,419.56,125,427,165.51q12.58,68.25-18.92,130.11Q319.47,469.54,230.64,643.36c-.73,1.42-1.59,2.78-2.79,4.87-1.41-2.43-2.5-4.14-3.42-5.93C165.11,526,104.62,410.27,46.93,293.17,8.94,216.08,18.43,141.32,71.6,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,211.37,0Z',
			v: '0 0 430.62 648.23'
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

// Map options
var mapOptions = {
	zoom: 4,
	center: null,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	styles: mapStyles
};

// Cluster markers style
var clusterStyles = [{
	anchor: [13, 35],
	textColor: 'white',
	textSize: '16',
	url: _Symbol('marker', 75, 75, '#f16667'),
	height: 75,
	width: 75
}, {
	anchor: [20, 42],
	textColor: 'white',
	textSize: '18',
	url: _Symbol('marker', 100, 100, '#f16667'),
	height: 100,
	width: 100
}, {
	anchor: [20, 43.5],
	textColor: 'white',
	textSize: '24',
	url: _Symbol('marker', 125, 125, '#f16667'),
	height: 125,
	width: 125
}];

// Cluster options
var clusterOptions = {
	maxZoom: 15,
	gridSize: 75,
	styles: clusterStyles
};

// Set new icon
var setIcon = function setIcon(newIcon) {
	icon = newIcon;
	return icon;
};

var addCenterToOptions = function addCenterToOptions(center) {
	mapOptions.center = center;
};

// Icon
var icon = {
	url: _Symbol('marker', 25, 25, '#f16667'),
	size: new google.maps.Size(71, 71),
	origin: new google.maps.Point(0, 0),
	anchor: new google.maps.Point(17, 34),
	scaledSize: new google.maps.Size(25, 25)
};

var buildList = function buildList(clusterize, listArray, markers, localMap) {
	listArray = [];
	clusterize.clear();
	markers.map(function (user) {
		if (localMap.getBounds().contains(user.getPosition())) {
			listArray.push('<tr id="clusterize-user-row-' + user.userID + '"><a href=""><td id="clusterize-user-cell" href=>' + '<img id="clusterize-avatar" src="' + user.url + '" height="150" width="150" >' + '<h3 id="clusterize-user-name">' + user.userName + '</h3>' + '<button id="clusterize-user-button" name="follow">Follow</button>' + '</td></tr>');
		}

		// Dsiplay user info on sidebar 
		var showUserInfo = function showUserInfo() {
			clusterize.clear();
			clusterize.update(['<tr><td>' + '<img id="clusterize-avatar" src="' + user.url + '" height="150" width="150">' + '</br> user ID: ' + user.userID + '</br> User: ' + user.userName + '</br> City: ' + user.city + '</br> Country: ' + user.country + '</td></tr>']);
			clusterize.refresh();
		};

		// On marker clikc user info is displayed
		google.maps.event.addDomListener(user, 'click', showUserInfo);
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

var getData = function getData(map, data, markers) {
	var localMap = map;
	var listArray = [];
	var localData = typeof data !== 'string' ? '/datasets/' + data.toString() : '/datasets/' + data;
	// create list
	var clusterize$$1 = new clusterize({
		rows: null,
		rows_in_block: 2,
		scrollId: 'scrollArea',
		contentId: 'contentArea'
	});

	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}

	if (checkData(localData)) {
		fetch(localData).then(function (response) {
			return response.json();
		}).then(function (dataset) {
			// Add locations
			// Check for geocoordinates in dataset
			dataset.map(function (markerPosition) {
				if (!markerPosition.latitude || !markerPosition.longitude) {
					console.log('meh');
				} else {

					var location = new google.maps.LatLng({
						lat: markerPosition.latitude + getRandom(0, 0.5),
						lng: markerPosition.longitude + getRandom(0, 0.5)
					});
					var marker = new google.maps.Marker({
						position: location,
						map: localMap,
						icon: icon,
						optimized: false,
						userID: markerPosition.user_id,
						userName: markerPosition.full_name,
						country: markerPosition.country,
						city: markerPosition.city,
						url: 'https://github.com/identicons/luke-siedle.png'
					});
					markers.push(marker);
				}
			});
			// Create MarkerClusterer
			var markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);
			// Updates list when viewport changes
			google.maps.event.addListener(localMap, 'bounds_changed', function () {
				buildList(clusterize$$1, listArray, markers, localMap);
			});
			google.maps.event.addListener(map, "idle", function () {
				google.maps.event.trigger(map, 'resize');
			});
		}).catch(function (err) {
			if (err) throw err;
		});
	}
};

var createMap = function createMap() {
  return new google.maps.Map(document.getElementById('map'), mapOptions);
};

var defineCenter = function defineCenter(lat, lng) {
  return new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
};

/*eslint-disable */
// import setGoogleMaps from './setGoogleMaps';
// Places markers
var placeMarkers = [];

// Places holder
var places = void 0;

// Markers holder
var markers = [];

// Map center
var london = defineCenter(51.521723, -0.134581);
addCenterToOptions(london);

// Map
var map = createMap();

// Search Box
var sBox = createSearchBox(map);

// const setMaps = (apiKey) => {
// 	setGoogleMaps(apiKey);
// };


var initialize = function initialize(data) {
	// fetch dataset
	getData(map, data, markers);

	// Create Search Box
	searchBox(map, places, sBox, placeMarkers, icon, setIcon);
};

var setHeight = function setHeight(height) {
	var list = document.getElementById('map');
	list.style = 'height:' + height.toString() + ';';
};

var setWidth = function setWidth(width) {
	var list = document.getElementById('map');
	list.style = 'width:' + width.toString() + ';';
};

exports.initialize = initialize;
exports.setHeight = setHeight;
exports.setWidth = setWidth;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=maps.bundle.js.map
