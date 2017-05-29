document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Maps = global.Maps || {})));
}(this, (function (exports) { 'use strict';

var $$1 = window.jQuery;

var createSearchBox = function createSearchBox(map, mapWrapper) {
	var localMap = map;
	// Create search box and link it to UI
	var $input = $$1(mapWrapper).find('input.shiftmap-input');
	var input = $input.get(0);
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
						v: "0 0 430.62 648.23"
				},
				// icon_3: {
				// 		p: "M241.3,0c12.56,2.49,4.41,4.38,16.79,7.58,35.11,9.1,65.15,27.29,90.44,53.07C377.3,90,395.68,125,403.15,165.51q12.58,68.25-18.92,130.11c-59.1,115.94-156.37,352.6-156.37,352.6H204s-2.5-4.14-3.42-5.93C141.23,526,80.74,410.27,23,293.17-14.94,216.08-5.45,141.32,47.72,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,187.49,0Z M244.31,0C256.87,2.49,269.59,4.38,282,7.58c35.11,9.1,65.15,27.29,90.44,53.07C401.19,90,419.56,125,427,165.51q12.58,68.25-18.92,130.11Q319.47,469.54,230.64,643.36c-.73,1.42-1.59,2.78-2.79,4.87-1.41-2.43-2.5-4.14-3.42-5.93C165.11,526,104.62,410.27,46.93,293.17,8.94,216.08,18.43,141.32,71.6,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,211.37,0Z",
				// 		v: "0 0 96.16 150.38"
				// },
				// icon_5: {
				// 		p: "M61.54,29.21V27.83H56.11V29.2H49.65l-.09,43.55h2l-.12,3,28,0V72.79h2.39l.09-43.54-12.81,0h0l-7.59-.16Zm7.08,43.58v0l10.81,0Z",
				// 		v: "0 0 107.73 131.7"
				// },
				icon_6: {
						p: "M71.87,79.17H43.4V41.59c0-5.18,2.49-5.38,5.15-5.38H71.87 M74,79.17h28.47V41.59c0-5.18-2.48-5.38-5.14-5.38H74 M78.68,28.16a6.81,6.81,0,1,1-13.62,0Z M72,23.91A11.73,11.73,0,0,0,83.75,12.23a11.59,11.59,0,0,0-.94-4.59,11.69,11.69,0,0,0-22.65,4.25,12.08,12.08,0,0,0,.26,2.49A11.76,11.76,0,0,0,72,23.91Z M102.59,50.47V41.61c0-5.18-2.48-5.38-5.14-5.38h-2V30.68H91.28v5.55H87.75V28h-4.3v.16H56.75v8H54.41V30.66H47.57v5.57c-2.12.17-4.09,1.07-4.09,5.39v8.86H38V131.7h5.45v-14h16.7v1.89h6.41v-1.89h1.75v-3.21H66.58v-7.59h1.75v-.14h1v-4.16h-1V87.28h7.54v15.48H74.77v4.16h2.89v7.59H75.21v3.21h2.45v1.89h6.41v-1.89h18.21v14h5.45V50.47ZM71.95,72.95h2.17v5.44H71.95ZM60.17,114.52H43.48V87.28H58.36v15.34h-.79v4.16h.79v.14h1.82Zm23.89,0v-7.59h2.45v-4.16h-.66V87.28h16.41v27.23Z",
						v: "0 0 94.7 159.43"
				},
				icon_24: {
						p: "M73.74,20.48c9.5-12.65-4.62-26.95-17.1-17.32C47.11,15.81,61.25,30.14,73.74,20.48Z M91.18,63.43a5,5,0,0,1-9.59-2.62 M73.73,20.51c9.5-12.65-4.62-26.95-17.1-17.32C47.1,15.85,61.25,30.17,73.73,20.51Z M93.31,64l-6-1.64V30.47H82.38V61.06l-.79-.22h0l-1.65-.45V29.47H75.13V27.71H70.32v1.75H60.17V27.71H55.36v1.76H50.56V70.58h-.06l.06,2.29v43.88H51.8l.3,10.5h-.63v3.56h3v15.24h5.69V130.82h3v-3.56h-1l.59-42H66.6l1.58,42H67.06v3.56h2.73v15h5.69v-15h2.73v-3.56h-.74l.46-10.5h2V72.5l3,.81v2h3.91v-.91l3.44.94ZM64.62,70.85h5.7V71Z",
						v: "0 0 89.2 155.32"
				},
				icon_28: {
						p: "M61,11.54A11.6,11.6,0,1,0,49.43,23.19,11.6,11.6,0,0,0,61,11.54Z M58.73,55.65c0-2-3.21-3.57-7.16-3.57H46.67c-3.94,0-7.13,1.6-7.13,3.57V87.12c0,2,3.2,3.57,7.13,3.57h4.91c3.95,0,7.16-1.6,7.16-3.57Z M43.28,54.66c-15.41,1.47-8.76-9.41-22.39-7.22 M56,54.66c15.41,1.47,8.76-9.41,22.39-7.22 M64.37,76.27c0-.91-2.32-1.65-5.19-1.65H39.07c-2.87,0-5.19.74-5.19,1.65v15.4c0,.91,2.32,1.64,5.19,1.64H59.18c2.87,0,5.19-.74,5.19-1.64Z M59.18,155.83a5.93,5.93,0,0,1-6,5.86H45.07a5.93,5.93,0,0,1-6-5.86V102.77a5.92,5.92,0,0,1,6-5.86h8.12a5.93,5.93,0,0,1,6,5.86Z M59.18,57.67a9.61,9.61,0,1,0-9.62,9.61A9.62,9.62,0,0,0,59.18,57.67Z M49.56,69.87a12.21,12.21,0,1,1,12.22-12.2A12.22,12.22,0,0,1,49.56,69.87Zm0-19.23a7,7,0,1,0,7,7A7,7,0,0,0,49.56,50.64Z M57,28.32a7.45,7.45,0,0,1-14.9,0Z M61,11.6H37.77A11.6,11.6,0,1,1,61,11.6Z M40,4.64c-.12.16-.25.32-.36.49s-.25.41-.38.62-.14.22-.2.33-.27.54-.39.81l-.09.2c-.13.3-.24.62-.34.94l0,.13c-.1.31-.18.64-.25,1l0,.15c-.06.29-.1.59-.13.88,0,.09,0,.18,0,.27s0,.47,0,.7,0,.31,0,.47h0s0,0,0,0a11.59,11.59,0,0,0,.49,3.27V25.29h1.27V17.71a11.57,11.57,0,0,0,19.69,0v3.16h-.51v3.49h2.36V20.85h-.57v-6a11.6,11.6,0,0,0,.47-3.26h0v-.06c0-.18,0-.35,0-.52s0-.43,0-.64,0-.31-.07-.46-.06-.47-.11-.69-.07-.25-.1-.38-.12-.49-.19-.73-.08-.21-.12-.31S60,7.29,59.91,7l-.11-.23c-.12-.27-.24-.53-.38-.78l-.09-.14c-.16-.28-.32-.55-.5-.81l0-.07c-.2-.28-.4-.56-.63-.83h0A11.61,11.61,0,0,0,52.64.51h0C52.26.4,51.9.3,51.53.23l-.21,0C51,.14,50.71.09,50.39.06l-.46,0c-.23,0-.46,0-.69,0h0l-.46,0c-.24,0-.48,0-.72,0l-.23,0c-.31,0-.63.08-.93.15h0a11.55,11.55,0,0,0-5,2.43l0,0c-.27.23-.53.46-.77.71l-.18.19c-.19.2-.39.41-.57.63S40.07,4.51,40,4.64Z M53.06,96.91H44.94a5.92,5.92,0,0,0-6,5.86v53.06a5.93,5.93,0,0,0,6,5.86h8.12a5.93,5.93,0,0,0,6-5.86V102.77A5.93,5.93,0,0,0,53.06,96.91Z M93.07,45.6,73.31,28.32l-3.7,4.23,13,11.34L75,42.65l-.32,2c-4.55.1-6.69,2-8.71,4.38-.31.36-.62.71-.94,1l-.1-21.87-31.59.14.1,21.06L33.11,49c-2-2.36-4.21-4.32-8.87-4.38l-.32-2-7.58,1.24,13-11.34-3.7-4.23L5.85,45.6l-5.43.89,1.39,8.67,23.51-3.84-.26-1.59c2.13.22,3,1.22,4.2,2.6a14.37,14.37,0,0,0,4.2,3.57l.1,20.49h.19V91.67c0,.91,2.32,1.64,5.19,1.64H59.06c2.87,0,5.19-.74,5.19-1.64V76.27a0,0,0,0,0,0,0l.92,0-.1-20.06a13.69,13.69,0,0,0,4.75-3.84c1.16-1.34,2-2.32,4-2.58l-.25,1.57,23.51,3.84,1.39-8.67Z",
						v: "0 0 94.31 144.68"
				},
				icon_32: {
						p: "M72.11,11.55a11.41,11.41,0,1,0-22.81,0,11.41,11.41,0,1,0,22.81,0Z M55.12,26h3.41a.66.66,0,0,1,.66.66v3.76a.66.66,0,0,1-.66.66h-6a.66.66,0,0,1-.66-.66V29.31A3.29,3.29,0,0,1,55.12,26Z M62.22,26l4.16-.09A3.13,3.13,0,0,1,69.58,29v2.05H62.22Z M76.07,29.08l-1.62-.26.14-.57,0-.69,0-.69,0-.69.07-.69-.49-.55-.1-.78-.64-.41-.49-.65-.63-.48-.71-.33-1,.49L70,22.29,69.25,22l-.81.12-.61-.76-.86.46-.52-.33a11.4,11.4,0,1,0-12-.31l-.4.27-.84-.35-.64.78-.81-.14-.69.4-.93-.49-.56.79-.77.12H48l-.55.63-.6.47-.54.52-.56.53-.42.76.75.69-.42.69.24.69-.59.69.91.42.47.2-1.36.21,0,24-1,17.33v1.9h4.4l1.83,52.41.31,20h5.85l.66-21.31,2.9-46.32h.9l3.82,48.88.58,18.79h5.84l.43-27.58,1.07-44.83h4.31v-1.9L76.19,54Z",
						v: "0 0 84.95 144.74"
				},
				icon_33: {
						p: "M65.81,30.57c0,3.79-5.39,6.87-5.39,6.87S55,34.36,55,30.57Z M56.17,34s-1.88-2.35-1.88-3.43V29l-1.67,1.52Z M64,34s1.88-2.35,1.88-3.43V29l1.67,1.52Z M71.79,11.51a11.36,11.36,0,1,0-22.72,0,11.36,11.36,0,1,0,22.72,0Z M67.52,29v1.52H55.23l.08-3.74L51,30.57H45.53v18.1h0v1h0V60.61h0v1h0V85.79h2.92l1.36,38.95.31,20H56l.66-21.31L59,85.79h2.13l3.14,40.16.58,18.79h5.84l.43-27.58.75-31.37H75V30.57H69.18Z",
						v: "0 0 92.58 145.06"
				},
				icon_41: {
						p: "M72.29,75h-24V38.66c0-5,1.8-5.2,3.74-5.2H72.29 M70.57,75H91.23V38.65c0-5-1.8-5.2-3.73-5.2H70.57 M76.07,26.87a6.59,6.59,0,0,1-13.17,0Z M92.26,36.54h1.55V29.29H87.19v4.2H84.87V26.91h-30v6.59H52.71v-4.2H46.09v7.24h1.32V62.66H42.14v63h5.27V112.36h9.27v1.8h6.2v-1.8h4.61v-3.07H62.88V102h1.69v-.13h.95v-4h-.95V83.3H75.32V98.19H74.25v4H77v7.13H71.37v3.07H77v1.92h6.2v-1.92h9v13.33h5.27v-63H92.26ZM56.69,109.29H47.41v-26h7.52V97.94h-.76v4h.76V102h1.76Zm26.55,0v-7.13H85.6v-4H85V83.3h7.29v26Z",
						v: "0 0 115.16 311.08"
				},
				icon_43: {
						p: "M45.24,92.21l2.6,2.66-.76.76-3.34-3.43H39.6V88l-6.05-6.2-2,2-2.31-2.38,3.93,0-3.57-3.66.76-.76,3.82,3.91,2-2.1,2.35,2.34-4.12,0,5.14,5.27v-2.8h-.45l.1-47.5h7l-.1,47.51h-.85l0,8.56Zm19.89-64.4a12,12,0,0,0,0-24,11.92,11.92,0,0,0-11.87,12A11.92,11.92,0,0,0,65.13,27.81Zm27.05,7.89h-7L85,83.21h.5l0,8.43h5.74l0-8.44h.8ZM53.66,148.18l.46,0v6l7.11,0v-6.3l.88,0,1.4-54.09h3.34l3.28,55,.3,0v5.52h7.11v-6.66l.27,0,.56-64.35-25.66-.41ZM79.41,33,73,31.85l-1.5-1.69-.12.06-.06-.06-2.2,1.08V30.19L66.7,31.84h-3.1l-2.47-1.65v.7l-1.52-.73-1.48,1.67L51.78,33l.06.05H49.49L49.4,77.29l32.27.07.09-44.29H79.29ZM28.17,71.43l-3.7,3.87L28.29,79,32,75.18Z",
						v: "0 0 92.39 163.76"
				},
				icon_44: {
						p: "M39.44,36.9l6.93,0-.14,56.91H39.3Zm46.11,0-.13,56.91h6.84l.14-56.91Zm-19.91-7A12.31,12.31,0,1,0,53.52,17.61,12.23,12.23,0,0,0,65.64,29.94ZM49.53,72.11h0v9.37H82.62V77.55h0l.08-44.31-33.1-.07ZM81.38,86.23H78.49l-26.88-.34L54.34,95h.12l0,24h-.07v9.49h.05l-.05,26.13h.13v0h7.17v-3.87l0-22.27h.09V119h-.07l0-17.16s0,0,0,0h9.45l0,17.12h-.07v9.49h.05l-.05,26.18,7.3,0v-.06h0V151l0-22.56h.09V119h-.07l.05-24Z M63.56,12.82c.25,1.46.9,2,2.1,1.92s1.81-.69,1.81-1.94a3.13,3.13,0,0,0,3.27-.6A3.24,3.24,0,0,0,71.59,9a4.44,4.44,0,0,1,1.29,2.82,16.3,16.3,0,0,0,.46,3.08,6.83,6.83,0,0,1,.12,2.34,2.86,2.86,0,0,1-3,2.31H70a8.69,8.69,0,0,1,.22,1.6,9.15,9.15,0,0,1-.36,1.62c1.37,1.09.77,3.79-.84,4.55a9,9,0,0,1-4.61.63,6.76,6.76,0,0,1-2.52-.69c-1.41-.68-2.09-3.44-.64-4.58a2.93,2.93,0,0,1-.11-3.08c-.35,0-.68-.06-1-.12q-3.13-.61-2.6-3.82c.25-1.53.52-3.06.79-4.59a4.05,4.05,0,0,1,1.14-2.11,3.19,3.19,0,0,0,.87,3.28A3,3,0,0,0,63.56,12.82Zm2.08,9.58a21.21,21.21,0,0,0,2.31-.46c.69-.21.86-.71.57-1.39a6.62,6.62,0,0,0-2-2.66,1.44,1.44,0,0,0-2,0,6.91,6.91,0,0,0-2,2.64c-.39.83-.22,1.26.67,1.49S64.78,22.27,65.64,22.4ZM62,17.66a2.09,2.09,0,0,0,2.2-1.51c.18-.51.08-.91-.42-1a28.59,28.59,0,0,0-3.57-.62c-.62-.06-1.17.61-1.25,1.27a1.21,1.21,0,0,0,.92,1.44C60.56,17.41,61.28,17.51,62,17.66Zm8.47-3.28c-1,.21-2,.39-3,.63-.39.1-.76.32-.69.86a2.09,2.09,0,0,0,1.52,1.61,5.58,5.58,0,0,0,3.08-.36A1.2,1.2,0,0,0,72,15.51,1.59,1.59,0,0,0,70.46,14.38ZM65.5,24v0C65,24,64.52,24,64,24a5,5,0,0,0-1.3.12.78.78,0,0,0-.43.58c0,.16.25.37.43.51a.8.8,0,0,0,.44.09c1.29,0,2.57.09,3.86.09a5.35,5.35,0,0,0,1.39-.23.59.59,0,0,0,.35-.44.83.83,0,0,0-.31-.53.88.88,0,0,0-.53-.15C67.13,24,66.32,24,65.5,24Z M65.64,22.4c-.86-.13-1.64-.19-2.38-.39s-1.07-.66-.67-1.49a6.91,6.91,0,0,1,2-2.64,1.44,1.44,0,0,1,2,0,6.62,6.62,0,0,1,2,2.66c.29.68.11,1.18-.57,1.39A21.21,21.21,0,0,1,65.64,22.4Z M62,17.66c-.71-.15-1.43-.25-2.12-.45A1.21,1.21,0,0,1,59,15.77c.08-.66.63-1.33,1.25-1.27a28.59,28.59,0,0,1,3.57.62c.5.12.6.52.42,1A2.09,2.09,0,0,1,62,17.66Z M70.46,14.38A1.59,1.59,0,0,1,72,15.51a1.2,1.2,0,0,1-.66,1.62,5.58,5.58,0,0,1-3.08.36,2.09,2.09,0,0,1-1.52-1.61c-.08-.54.29-.76.69-.86C68.45,14.77,69.46,14.58,70.46,14.38Z M65.5,24c.81,0,1.62,0,2.43,0a.88.88,0,0,1,.53.15.83.83,0,0,1,.31.53.59.59,0,0,1-.35.44,5.35,5.35,0,0,1-1.39.23c-1.29,0-2.57-.05-3.86-.09a.8.8,0,0,1-.44-.09c-.18-.14-.45-.35-.43-.51a.78.78,0,0,1,.43-.58A5,5,0,0,1,64,24c.49,0,1,0,1.47.07Z M81.21,86.46l-2.89,8.85c-3.68,0-7.28,2.19-7.29,6.81H61.57c0-5.48-2.64-6.85-7.41-6.85l-2.73-9.15,26.88.34",
						v: "0 0 162.12 159.69"
				},
				icon_45: {
						p: "M81.91,111.45h5.78v43.13H81.91Zm25.85-54.73h0V46h-.1l-.06-11.2H78.22l0,11.2h-.07V56.72h0l0,14.75H77.9l.23,7.8V80l.73,31.27H90.44l0-23.33h4.44L95,111.3l2.79,0v43.08h5.77V111.22H100l6.36-.1.91-19.84.59-10.88ZM70.31,51.34V82.93h4V37.41h-4ZM115,37.41v-.24h-4v.24h0V56.72h0v26h4v-26h0V37.41ZM91.69,2.71c-8.3,0-11.72,8-12.41,13.64l1.85-.17c-1.85,10.27,9.82,19.59,19.67,12a14.55,14.55,0,0,0,3.11-8.57c1.86.29,3,0,3-1.81A15.17,15.17,0,0,0,91.69,2.71Z M101.67,27.39C111.32,14.54,97,0,84.31,9.8,74.62,22.65,89,37.2,101.67,27.39Z M107.74,57.05H78.06V46.3a38.77,38.77,0,0,1,14.73,3.25s7.74-3.25,14.95-3.25Z M106.3,16.34l-13.51-.52a109.11,109.11,0,0,0-13.51.52,13.51,13.51,0,1,1,27,0Z M113.34,129.55a24.39,24.39,0,1,1,24.4,24.71A24.58,24.58,0,0,1,113.34,129.55Zm2.46,0a21.94,21.94,0,1,0,21.94-22.23A22.1,22.1,0,0,0,115.79,129.55Z M23.2,129.55a24.4,24.4,0,1,1,24.4,24.71A24.58,24.58,0,0,1,23.2,129.55Zm2.46,0a21.94,21.94,0,1,0,21.94-22.23A22.1,22.1,0,0,0,25.66,129.55Z M58.58,95.63l.5-2.39c-4.2-.9-6.45-2.92-6.18-5.53S55.64,82.8,58,82.8H71.73L69.05,89l2.21,1,4.15-9.63H58c-3.61,0-7.12,3.32-7.51,7.11C50.34,88.94,50.47,93.89,58.58,95.63Z M48,131.16c1.7,0,6.22-.8,9.66-8.65l14-32.39-2.87-1.27-14,32.38c-3.19,7.27-6.85,6.77-6.89,6.76l-.58,3.12A3.69,3.69,0,0,0,48,131.16Z M90.2,131.63a9.57,9.57,0,1,1,9.57,9.7A9.65,9.65,0,0,1,90.2,131.63Zm4.15,0a5.42,5.42,0,1,0,5.42-5.49A5.46,5.46,0,0,0,94.35,131.63Z M132.18,129.58a5.54,5.54,0,1,1,5.55,5.6A5.59,5.59,0,0,1,132.18,129.58Zm4.92,0c0,.67,1.23.69,1.23,0a.61.61,0,0,0-.61-.62A.62.62,0,0,0,137.11,129.58Z",
						v: "0 0 117.55 159.69"
				},
				icon_46: {
						p: "M94.19,147.49h6.32v10.6H94.19ZM113.67,40.22v-.07h-4.93v20.4l-1.2-.06L107.26,66l1.48.07V90H109v.27h4.35v-9h-.19l.17-15,1.51.08.27-5.51-1.72-.09Zm-42.48.2H66l.65,20.14-1.34-.07L65.07,66l1.84.09,0,15.21h0v9h4.35V66.31l1.5.08L73,60.87l-1.77-.09Zm28.81-3-4-2.12-1.2,2.29H83.3l-1.2-2.29-4,2.12.09.17H73.58l2.09,67.11h.91l1.61,42.73h.65v10.6h6.33v-10.6h.56l.42-42.73h6.61l1,42.71h7.31l1.4-42.71h1.43L106,37.64H99.91ZM101.5,14V1.6H79v12c-10.41,2.44-17.77,7.79-17.77,9.63s7.07-.26,17.16-1.42a11.85,11.85,0,0,0,23.68.18c9.31,1.18,15.72,3,15.72,1.24S111.13,16.57,101.5,14Z M96.28,37.56a6.76,6.76,0,1,1-13.51,0Z M117.55,23.18c0,2.42-12.66-2.11-28.28-2.11S61,25.61,61,23.18,73.65,12.29,89.27,12.29,117.55,20.76,117.55,23.18Z",
						v: "0 0 88.67 156.15"
				},
				icon_49: {
						p: "M94.89,39.44V87H93.42v7.81H87.79V87H86.33V39.44ZM39.82,82.05v5h1.46v7.41h5.63V87h1.47V39.44H39.82Zm40,4.46v-.34H54.69v4.92h.08l1,59.23.45,0v5.87h7V150l.87,0,1.26-53h3.28l3.32,53.91.3,0v5.41h7v-6.54l.27,0,.38-58.52h0V86.51ZM76.59,26.93h-.13A11.77,11.77,0,0,0,78,17.69h0l0-.06A11.76,11.76,0,0,0,76,13.49L72.2,5.3H60.57L49.63,25.94a2.59,2.59,0,0,0-1.25-.33,2.67,2.67,0,1,0,1.91.83l4.89-4.72A11.78,11.78,0,0,0,57,26.95V37.39H51.41V82.05H83.05V37.39H76.59Z M134.16,79.07A6.64,6.64,0,0,1,136,74.47h0l1.21-2.09,1.13-2.2h.15l2.22-3.83,2.46,3.83h0l1.39,2.16h0l1.37,2.13h-.51a6.59,6.59,0,1,1-11.23,4.61Zm-7.8,34.54v3h.25v4.74h3.17v-4.74h.48v-3l0-23.33h-3.89Zm29.25-.19,0-23.34h-3.89l-.05,23.33H152v.43h-.34v2.74H152V121h3.18v-4.44h.39v-2.74h-.38v-.42Zm-8.14-24.83-1.82-1.49L144.1,88.6h-6l-1.54-1.51-1.82,1.49H132l0,17.24h0v4h0v4l17.84,0,0-25.25h-2.43Zm-6.33,27.62h-.46v-.11H133v15a3.71,3.71,0,0,0,1-.16l.3,21.33h.26v3.31h3.93v-3.48l.49,0,.78-29.9h1.85l1.81,30.4.17,0v3.05h3.93v-3.68l.15,0,.18-20.94a3.65,3.65,0,0,0,.9.14v-15h-7.67Z M136.22,93.08a5.62,5.62,0,0,1-1.37-4.49l1.82-1.49,4.72,4.62S139.19,96.14,136.22,93.08Z M146.15,93.08a5.62,5.62,0,0,0,1.37-4.49l-1.82-1.49L141,91.71S143.17,96.14,146.15,93.08Z M140.74,116.09s-1.45,15-7.67,15v-15Z M141.18,116.09s1.45,15,7.67,15v-15Z",
						v: "0 0 155.71 167.4"
				},
				icon_51: {
						p: "M95.79,90.55l29.76.25,9.33-75.67h-7.31S124,92,95.79,90.55Z M56.45,112.5s-11.85,13.37-5,39.86 M122.92,99.88c.33-1.58.65-3.16,1-4.74a4.26,4.26,0,0,1,.18-.62h-5A9.51,9.51,0,0,0,116.4,101a10.23,10.23,0,0,0,6-.09Z M113.8,109.72s.12-8.75-8.75-8.37c0,0-4.24.88-4.12,4.25a5,5,0,0,0,4.25,3.5C108.8,109.72,110.55,110.72,113.8,109.72Z M146.3,12.06,146,12c-3.48-1.17-5.06-2.42-8.42-1.92a10.43,10.43,0,0,0-.06,2Z M66.62,113.8a8,8,0,0,0-6.34,2.14c.05,2.21.21,4.42.35,6.63,1.79,0,3.4-.6,5.86-1a5,5,0,0,0,4.25-3.5C70.87,114.67,66.62,113.8,66.62,113.8Z M83,128.21a4.71,4.71,0,0,0,2.21-2.77c.12-3.37-4.12-4.25-4.12-4.25-6.66-.28-9.47,4.25-9.85,6.69Z M102.52,172.47v6.93a4.8,4.8,0,0,0,2.87-3.1A4.12,4.12,0,0,0,102.52,172.47Z M96.24,94.69h0a39.69,39.69,0,0,0-5,.68c-1.33.53-2.65,1.07-4,1.52.75,2.74,3.36,5.43,5.54,5a6.29,6.29,0,0,0,5.1-4.65,4.83,4.83,0,0,0-.61-2.6Z M79.67,99.48a4,4,0,0,1-.66.3c-4.78,1.67-9.58,3.27-14.23,5.25,1.26,4.16,5.67,8.26,9.33,7.63,7.31-1.26,8.58-7.06,8.58-7.06A7.18,7.18,0,0,0,79.67,99.48Z M115,125.08a40.23,40.23,0,0,1,2-6.59,12.83,12.83,0,0,0-1.67-.5c-11-.47-11.34,6.07-8.23,10.85h6.75A31.73,31.73,0,0,0,115,125.08Z M109,142.24a14.44,14.44,0,0,0-6.49,1V155c1.88,2,4.32,3.26,6.48,2.89h0Z M60.14,159.56v10.6a9.24,9.24,0,0,0,3-4.54A7.17,7.17,0,0,0,60.14,159.56Z M93.68,112.23s4.79,1.08,4.64,5.27a5.89,5.89,0,0,1-4.79,4.35C89.46,122.62,83.69,111.76,93.68,112.23Z M66.76,137.77c-8.61.06-3.91,9.47,0,9.66Z M131.83,1.86c1.07,1.31,2.49,2.18,3.75,1.94a6,6,0,0,0,3.72-2.19C136.8-.05,134.56.44,131.83,1.86Z M95.8,90.81l29.76.25,9.33-75.67h-7.31S124,92.31,95.8,90.81Z M130.16,59c.21-2.27.42-4.55.66-6.81a4.85,4.85,0,0,1,.19-.92v0c-3.92,2.24-3.86,7.34-3.86,7.34A8.69,8.69,0,0,0,130.16,59Z M127.46,20.53a68.55,68.55,0,0,1-.8,9,6.8,6.8,0,0,0,3.61-4.23A5.33,5.33,0,0,0,127.46,20.53Z M114.86,75.6c-1.5,2.88-4,5-6.14,7.58a10.3,10.3,0,0,0-1.08,1.71c1.46,1.52,3.34,2.51,5,2.22,5.7-1,6.68-5.5,6.68-5.5C119.47,78.23,116.81,76.45,114.86,75.6Z M127.27,79.52c.59-2.05,1.07-4.13,1.53-6.22.09-.82.17-1.64.26-2.46V66.52C121,68.07,123,75.58,127.27,79.52Z M127.84,37.55s3.21.73,3.11,3.54A3.94,3.94,0,0,1,127.74,44C125,44.52,121.14,37.24,127.84,37.55Z",
						v: "0 0 153.57 184.56"
				},
				icon_52: {
						p: "M199.19,193.41s-17.21-160-37.64,0V204h46.24Z M64.76,163.18v-.07C151.33,138.92,172.84,5.57,208.87.1c12.37-1.17,19.36,8.7,19.36,8.7l22,10.75L232,19l19.2,6.32c-16.51,7.66-38,3.78-38,3.78s34.11,187-73.15,142.15c0,0-30.42-11.83-74.8,2.46l-.45.26C17.71,185.82,0,150.74,0,150.74S24.22,175.85,64.76,163.18Z M199.19,193.41s-17.21-160-37.64,0V204h46.24Z M231.45,84.61s-59.15-19.89-10.22,9.14l19.36-4.65S255.64,73.32,231.45,84.61Z",
						v: "0 0 251.18 204"
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
	zoom: 3,
	center: null,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	styles: mapStyles,
	minZoom: 3
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
			listArray.push('<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-' + user.userID + '">\n\t\t\t\t<div class="shiftmap-clusterize-user-cell">\n\t\t\t\t\t<div class="shiftmap-clusterize-avatar">\n\t\t\t\t\t\t<img src="' + user.url + '" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="shiftmap-clusterize-content">\n\t\t\t\t\t\t<h3 class="shiftmap-clusterize-user-name">' + user.userName + '</h3>\n\t\t\t\t\t\t<button class="shiftmap-clusterize-user-button" name="follow">Follow</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>');
		}

		// Dsiplay user info on sidebar 
		var showUserInfo = function showUserInfo() {
			clusterize.clear();
			clusterize.update(['\n\t\t\t\t\t<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-single">\n\t\t\t\t\t\t<div class="shiftmap-clusterize-user-cell">\n\t\t\t\t\t\t\t<div class="shiftmap-clusterize-avatar">\n\t\t\t\t\t\t\t\t<img src="' + user.url + '" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="shiftmap-clusterize-content">\n\t\t\t\t\t\t\t\t User: ' + user.userName + '\n\t\t\t\t\t\t\t\t City: ' + user.city + '\n\t\t\t\t\t\t\t\t Country: ' + user.country + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t']);
			clusterize.refresh();
		};

		// On marker clikc user info is displayed
		google.maps.event.addDomListener(user, 'click', showUserInfo);
	});

	console.log(listArray.length);
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
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
  }

  var panes = this.getPanes();
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

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})(window);

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

var $$2 = jQuery;

var fetchData = function fetchData(map, data, markers, url, domElement) {
	var localMap = map;
	var listArray = [];
	var avatarURL = url;
	var localData = void 0;

	if (typeof data === 'array') {
		localData = JSON.parse(data);
	} else if (typeof data !== 'string') {
		localData = '/datasets/' + data.toString();
	} else {
		localData = '/datasets/' + data;
	}

	var scrollElement = $$2(domElement).find(".shiftmap-map-clusterise-wrapper").get(0);
	var contentElement = $$2(domElement).find(".shiftmap-clusterize-content-wrapper").get(0);

	// create list
	var clusterize$$1 = new clusterize({
		rows: null,
		rows_in_block: 2,
		scrollElem: scrollElement,
		contentElem: contentElement
	});

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
						url: avatarURL[0] + 'luke-siedle' + avatarURL[1]
					});
					markers.push(marker);
				}
			});
			// Create MarkerClusterer
			var markerCluster = new MarkerClusterer(localMap, markers, clusterOptions);
			// Updates list when viewport changes
			google.maps.event.addListener(localMap, 'bounds_changed', function () {
				setTimeout(function () {
					buildList(clusterize$$1, listArray, markers, localMap);
				}, 200);
			});
			google.maps.event.addListener(map, "idle", function () {
				setTimeout(function () {
					google.maps.event.trigger(map, 'resize');
				}, 200);
			});
		}).catch(function (err) {
			if (err) throw err;
		});
	}
};

var template = "<div class=\"shiftmap-wrapper\">\r\n\t<div class=\"shiftmap-map-clusterise-user-panel\">\r\n\t\t<div class=\"shiftmap-map-clusterise-wrapper\">\r\n\t\t\t<div class=\"shiftmap-input-wrapper\">\r\n\t\t\t\t<input type=\"text\" placeholder=\"Search the map\" class=\"shiftmap-input\">\r\n\t\t\t</div>\r\n\t\t\t<div class=\"shiftmap-clusterize\">\r\n\t\t\t\t<div class=\"shiftmap-clusterize-scroll\">\r\n\t\t\t\t\t<div class=\"shiftmap-clusterize-user-table\">\r\n\t\t\t\t\t\t<div class=\"shiftmap-clusterize-content-wrapper\"></div>\r\n\t\t\t\t\t\t<div class=\"shiftmap-clusterize-no-data\" style=\"display:none\">\r\n\t\t\t\t\t\t\t<div>Zoom to display user data…</div>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"shiftmap-map-toggle-panel\"></div>\r\n\t</div>\r\n\r\n\t<div class=\"shiftmap-map-wrapper\">\r\n\t\t<div class=\"shiftmap-map\"></div>\r\n\t</div>\r\n</div>";

var createMap = function createMap(domElement) {
	var $ = window.jQuery;
	var $wrapper = $(domElement).html(template);
	var $map = $wrapper.find('.shiftmap-map');
	return new google.maps.Map($map.get(0), mapOptions);
};

var defineCenter = function defineCenter(lat, lng) {
  return new google.maps.LatLng(parseFloat(lat).toFixed(6), parseFloat(lng).toFixed(6));
};

var svgList = [
// 'icon_3',
// 'icon_5',
'icon_6', 'icon_24', 'icon_28', 'icon_32', 'icon_33', 'icon_41', 'icon_43', 'icon_44', 'icon_45', 'icon_46', 'icon_49', 'icon_51', 'icon_52'];

var pngs = {
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
	'person-045': [37, 65],
	'dinosaur': [105, 85],
	'giraffe': [64, 77]
};

var pngList = pngs;

var placeCharacters = function placeCharacters(map) {
	var icons = [];
	var j = 0;
	var localMap = map;
	fetch("./datasets/capitals.json").then(function (response) {
		return response.json();
	}).then(function (capitals) {
		for (var i = 0; i < capitals.length; i++, j++) {
			if (j === svgList.length) {
				j = 0;
			}

			var pngs = Object.keys(pngList);
			var img = pngs[j] || pngs[0];
			var imgSize = pngList[img];

			// Character object 
			var character = {
				position: new google.maps.LatLng(capitals[i].longitude, capitals[i].latitude),
				icon: {
					url: '../img/' + img + '.png', //Symbol(svgList[j], 100, 100, '#000000'),
					size: new google.maps.Size(imgSize[0], imgSize[1]),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(imgSize[0], imgSize[1])
				}
			};
			// Add a marker for each character
			var marker = new google.maps.Marker({
				position: character.position,
				map: localMap,
				icon: character.icon
			});

			icons.push(character);
		}
	}).catch(function (err) {
		console.log(err);
	});
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
var map = void 0;

// Search Box
var sBox = void 0;

// const setMaps = (apiKey) => {
// 	setGoogleMaps(apiKey);
// };

var $ = window.jQuery;

var initialize = function initialize(domElement, data, avatarURL) {

	map = createMap(domElement);

	sBox = createSearchBox(map, domElement);

	// fetch dataset
	fetchData(map, data, markers, avatarURL, domElement);

	// Create Search Box
	searchBox(map, places, sBox, placeMarkers, icon, setIcon);

	bindEvents(domElement);

	// Add characters SVGs
	setTimeout(function () {
		placeCharacters(map);
	}, 100);
};

var changeMapLocation = function changeMapLocation(lat, lng) {
	var location = defineCenter(lat, lng);

	map.panTo(location);
	console.log('Map moved to: ', location);
};

var onMapReady = function onMapReady(callback) {
	if (typeof callback === 'function') {
		google.maps.event.addListener(map, 'load', callback);
	} else {
		console.error('provide a callback function');
	}
};

var onMapChangeLocation = function onMapChangeLocation(callback) {
	if (typeof callback === 'function') {
		google.maps.event.addListener(map, 'idle', callback);
	} else {
		console.error('provide a callback function');
	}
};

var defineURL = function defineURL(url, imgFormat) {
	return [url.toString(), imgFormat.toString()];
};

var bindEvents = function bindEvents(domElement) {
	var $panel = $(domElement).find('.shiftmap-map-clusterise-user-panel');
	$panel.find('.shiftmap-map-toggle-panel').click(function () {
		$panel.toggleClass('closed');
	});
};

// const setHeight = (height) => {
// 	let mapElement = document.getElementById('map');
// 	mapElement.style='height:' + height.toString() + ' !important;';

// 		google.maps.event.addListenerOnce(map, 'idle', function() {
// 			google.maps.event.trigger(map, 'resize'); 
// 			console.log('map height resized to: ', height)
// 		});
// };

// const setWidth = (width) => {
// 	let mapElement = document.getElementById('map');
// 	mapElement.style='height:' + width.toString() + ' !important;';

// 		google.maps.event.addListenerOnce(map, 'idle', function() {
// 			google.maps.event.trigger(map, 'resize'); 
// 			console.log('map height resized to: ', width)
// 		});
// };

var setWidthHeight = function setWidthHeight(width, height) {
	$('.shiftmap-wrapper').width(width).height(height);
	$('.shiftmap-map').width(width).height(height);
	var map = $('.shiftmap-map').get(0);
	google.maps.event.trigger(map, 'resize');
	google.maps.event.addListenerOnce(map, 'idle', function () {
		google.maps.event.trigger(map, 'resize');
	});
};

exports.initialize = initialize;
exports.setWidthHeight = setWidthHeight;
exports.onMapReady = onMapReady;
exports.onMapChangeLocation = onMapChangeLocation;
exports.defineURL = defineURL;
exports.changeMapLocation = changeMapLocation;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=maps.bundle.js.map
