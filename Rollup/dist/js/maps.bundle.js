document.write('<script src="http://'+(location.host||"localhost").split(":")[0]+':35729/livereload.js?snipver=1"><\/script>'),function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.Maps=t.Maps||{})}(this,function(t){"use strict";function e(t,e){return e={exports:{}},t(e,e.exports),e.exports}function r(t,e,o){this.extend(r,google.maps.OverlayView),this.map_=t,this.markers_=[],this.clusters_=[],this.sizes=[53,56,66,78,90],this.styles_=[],this.ready_=!1;var n=o||{};this.gridSize_=n.gridSize||60,this.minClusterSize_=n.minimumClusterSize||2,this.maxZoom_=n.maxZoom||null,this.styles_=n.styles||[],this.imagePath_=n.imagePath||this.MARKER_CLUSTER_IMAGE_PATH_,this.imageExtension_=n.imageExtension||this.MARKER_CLUSTER_IMAGE_EXTENSION_,this.zoomOnClick_=!0,void 0!=n.zoomOnClick&&(this.zoomOnClick_=n.zoomOnClick),this.averageCenter_=!1,void 0!=n.averageCenter&&(this.averageCenter_=n.averageCenter),this.setupStyles_(),this.setMap(t),this.prevZoom_=this.map_.getZoom();var i=this;google.maps.event.addListener(this.map_,"zoom_changed",function(){var t=i.map_.getZoom(),e=i.map_.minZoom||0,r=Math.min(i.map_.maxZoom||100,i.map_.mapTypes[i.map_.getMapTypeId()].maxZoom);t=Math.min(Math.max(t,e),r),i.prevZoom_!=t&&(i.prevZoom_=t,i.resetViewport())}),google.maps.event.addListener(this.map_,"idle",function(){i.redraw()}),e&&(e.length||Object.keys(e).length)&&this.addMarkers(e,!1)}function o(t){this.markerClusterer_=t,this.map_=t.getMap(),this.gridSize_=t.getGridSize(),this.minClusterSize_=t.getMinClusterSize(),this.averageCenter_=t.isAverageCenter(),this.center_=null,this.markers_=[],this.bounds_=null,this.clusterIcon_=new n(this,t.getStyles(),t.getGridSize())}function n(t,e,r){t.getMarkerClusterer().extend(n,google.maps.OverlayView),this.styles_=e,this.padding_=r||0,this.cluster_=t,this.center_=null,this.map_=t.getMap(),this.div_=null,this.sums_=null,this.visible_=!1,this.setMap(this.map_)}var i=window.jQuery,s=function(t,e){var r=i(e).find("input.shiftmap-input"),o=r.get(0);return new google.maps.places.SearchBox(o)},a=function(t,e,r,o,n,i){t.addListener("bounds_changed",function(){r.setBounds(t.getBounds())}),r.addListener("places_changed",function(){if(e=r.getPlaces(),0!=e.length){o.forEach(function(t){t.setMap(null)}),o=[];var s=new google.maps.LatLngBounds;e.forEach(function(e){if(!e.geometry)return void console.log("Returned place contains no geometry");var r={url:e.icon,size:n.size,origin:n.origin,anchor:n.anchor,scaledSize:n.scaledSize},a=i(r);o.push(new google.maps.Marker({map:t,icon:a,title:e.name,position:e.geometry.location,setMap:t})),e.geometry.viewport?s.union(e.geometry.viewport):s.extend(e.geometry.location)}),t.fitBounds(s)}})},p="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},l=e(function(t){!function(e,r){t.exports=function(){function t(t,e,r){return e.addEventListener?e.addEventListener(t,r,!1):e.attachEvent("on"+t,r)}function e(t,e,r){return e.removeEventListener?e.removeEventListener(t,r,!1):e.detachEvent("on"+t,r)}function r(t){return"[object Array]"===Object.prototype.toString.call(t)}function o(t,e){return window.getComputedStyle?window.getComputedStyle(e)[t]:e.currentStyle[t]}var n=function(){for(var t=3,e=document.createElement("b"),r=e.all||[];e.innerHTML="\x3c!--[if gt IE "+ ++t+"]><i><![endif]--\x3e",r[0];);return t>4?t:document.documentMode}(),i=navigator.platform.toLowerCase().indexOf("mac")+1,s=function o(n){if(!(this instanceof o))return new o(n);var s=this,a={rows_in_block:50,blocks_in_cluster:4,tag:null,show_no_data_row:!0,no_data_class:"clusterize-no-data",no_data_text:"No data",keep_parity:!0,callbacks:{}};s.options={};for(var p,l=["rows_in_block","blocks_in_cluster","show_no_data_row","no_data_class","no_data_text","keep_parity","tag","callbacks"],h=0;p=l[h];h++)s.options[p]=void 0!==n[p]&&null!=n[p]?n[p]:a[p];for(var u,c=["scroll","content"],h=0;u=c[h];h++)if(s[u+"_elem"]=n[u+"Id"]?document.getElementById(n[u+"Id"]):n[u+"Elem"],!s[u+"_elem"])throw new Error("Error! Could not find "+u+" element");s.content_elem.hasAttribute("tabindex")||s.content_elem.setAttribute("tabindex",0);var d=r(n.rows)?n.rows:s.fetchMarkup(),f={},m=s.scroll_elem.scrollTop;s.insertToDOM(d,f),s.scroll_elem.scrollTop=m;var g=!1,y=0,_=!1,v=function(){i&&(_||(s.content_elem.style.pointerEvents="none"),_=!0,clearTimeout(y),y=setTimeout(function(){s.content_elem.style.pointerEvents="auto",_=!1},50)),g!=(g=s.getClusterNum())&&s.insertToDOM(d,f),s.options.callbacks.scrollingProgress&&s.options.callbacks.scrollingProgress(s.getScrollProgress())},w=0,b=function(){clearTimeout(w),w=setTimeout(s.refresh,100)};t("scroll",s.scroll_elem,v),t("resize",window,b),s.destroy=function(t){e("scroll",s.scroll_elem,v),e("resize",window,b),s.html((t?s.generateEmptyRow():d).join(""))},s.refresh=function(t){(s.getRowsHeight(d)||t)&&s.update(d)},s.update=function(t){d=r(t)?t:[];var e=s.scroll_elem.scrollTop;d.length*s.options.item_height<e&&(s.scroll_elem.scrollTop=0,g=0),s.insertToDOM(d,f),s.scroll_elem.scrollTop=e},s.clear=function(){s.update([])},s.getRowsAmount=function(){return d.length},s.getScrollProgress=function(){return this.options.scroll_top/(d.length*this.options.item_height)*100||0};var k=function(t,e){var o=r(e)?e:[];o.length&&(d="append"==t?d.concat(o):o.concat(d),s.insertToDOM(d,f))};s.append=function(t){k("append",t)},s.prepend=function(t){k("prepend",t)}};return s.prototype={constructor:s,fetchMarkup:function(){for(var t=[],e=this.getChildNodes(this.content_elem);e.length;)t.push(e.shift().outerHTML);return t},exploreEnvironment:function(t,e){var r=this.options;r.content_tag=this.content_elem.tagName.toLowerCase(),t.length&&(n&&n<=9&&!r.tag&&(r.tag=t[0].match(/<([^>\s\/]*)/)[1].toLowerCase()),this.content_elem.children.length<=1&&(e.data=this.html(t[0]+t[0]+t[0])),r.tag||(r.tag=this.content_elem.children[0].tagName.toLowerCase()),this.getRowsHeight(t))},getRowsHeight:function(t){var e=this.options,r=e.item_height;if(e.cluster_height=0,t.length){var n=this.content_elem.children,i=n[Math.floor(n.length/2)];if(e.item_height=i.offsetHeight,"tr"==e.tag&&"collapse"!=o("borderCollapse",this.content_elem)&&(e.item_height+=parseInt(o("borderSpacing",this.content_elem),10)||0),"tr"!=e.tag){var s=parseInt(o("marginTop",i),10)||0,a=parseInt(o("marginBottom",i),10)||0;e.item_height+=Math.max(s,a)}return e.block_height=e.item_height*e.rows_in_block,e.rows_in_cluster=e.blocks_in_cluster*e.rows_in_block,e.cluster_height=e.blocks_in_cluster*e.block_height,r!=e.item_height}},getClusterNum:function(){return this.options.scroll_top=this.scroll_elem.scrollTop,Math.floor(this.options.scroll_top/(this.options.cluster_height-this.options.block_height))||0},generateEmptyRow:function(){var t=this.options;if(!t.tag||!t.show_no_data_row)return[];var e,r=document.createElement(t.tag),o=document.createTextNode(t.no_data_text);return r.className=t.no_data_class,"tr"==t.tag&&(e=document.createElement("td"),e.colSpan=100,e.appendChild(o)),r.appendChild(e||o),[r.outerHTML]},generate:function(t,e){var r=this.options,o=t.length;if(o<r.rows_in_block)return{top_offset:0,bottom_offset:0,rows_above:0,rows:o?t:this.generateEmptyRow()};var n=Math.max((r.rows_in_cluster-r.rows_in_block)*e,0),i=n+r.rows_in_cluster,s=Math.max(n*r.item_height,0),a=Math.max((o-i)*r.item_height,0),p=[],l=n;s<1&&l++;for(var h=n;h<i;h++)t[h]&&p.push(t[h]);return{top_offset:s,bottom_offset:a,rows_above:l,rows:p}},renderExtraTag:function(t,e){var r=document.createElement(this.options.tag);return r.className=["clusterize-extra-row","clusterize-"+t].join(" "),e&&(r.style.height=e+"px"),r.outerHTML},insertToDOM:function(t,e){this.options.cluster_height||this.exploreEnvironment(t,e);var r=this.generate(t,this.getClusterNum()),o=r.rows.join(""),n=this.checkChanges("data",o,e),i=this.checkChanges("top",r.top_offset,e),s=this.checkChanges("bottom",r.bottom_offset,e),a=this.options.callbacks,p=[];n||i?(r.top_offset&&(this.options.keep_parity&&p.push(this.renderExtraTag("keep-parity")),p.push(this.renderExtraTag("top-space",r.top_offset))),p.push(o),r.bottom_offset&&p.push(this.renderExtraTag("bottom-space",r.bottom_offset)),a.clusterWillChange&&a.clusterWillChange(),this.html(p.join("")),"ol"==this.options.content_tag&&this.content_elem.setAttribute("start",r.rows_above),a.clusterChanged&&a.clusterChanged()):s&&(this.content_elem.lastChild.style.height=r.bottom_offset+"px")},html:function(t){var e=this.content_elem;if(n&&n<=9&&"tr"==this.options.tag){var r,o=document.createElement("div");for(o.innerHTML="<table><tbody>"+t+"</tbody></table>";r=e.lastChild;)e.removeChild(r);for(var i=this.getChildNodes(o.firstChild.firstChild);i.length;)e.appendChild(i.shift())}else e.innerHTML=t},getChildNodes:function(t){for(var e=t.children,r=[],o=0,n=e.length;o<n;o++)r.push(e[o]);return r},checkChanges:function(t,e,r){var o=e!=r[t];return r[t]=e,o}},s}()}()}),h=function(t,e,r,o){var n={marker:{p:"M244.31,0C256.87,2.49,269.59,4.38,282,7.58c35.11,9.1,65.15,27.29,90.44,53.07C401.19,90,419.56,125,427,165.51q12.58,68.25-18.92,130.11Q319.47,469.54,230.64,643.36c-.73,1.42-1.59,2.78-2.79,4.87-1.41-2.43-2.5-4.14-3.42-5.93C165.11,526,104.62,410.27,46.93,293.17,8.94,216.08,18.43,141.32,71.6,74c34-43,80.17-66.6,134.87-72.86A44.62,44.62,0,0,0,211.37,0Z",v:"0 0 430.62 648.23"}};return"data:image/svg+xml;base64,"+window.btoa('<svg xmlns="http://www.w3.org/2000/svg" height="'+r+'" viewBox="0 0 430.62 648.23" width="'+e+'" ><g><path fill="'+o+'" d="'+n[t].p+'" /></g></svg>')},u="#EEEFF1",c=[{elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry",stylers:[{visibility:"off"}]},{featureType:"administrative.land_parcel",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",stylers:[{visibility:"off"}]},{featureType:"landscape.man_made",stylers:[{color:u}]},{featureType:"landscape.natural",stylers:[{color:u}]},{featureType:"landscape.natural.landcover",stylers:[{color:u}]},{featureType:"landscape.natural.terrain",stylers:[{color:u}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"road",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",stylers:[{visibility:"off"}]},{featureType:"water",stylers:[{color:"#71CAF2"}]}],d={zoom:3,center:null,mapTypeId:google.maps.MapTypeId.ROADMAP,mapTypeControl:!1,styles:c,minZoom:3},f=[{anchor:[13,35],textColor:"white",textSize:"16",url:h("marker",75,75,"#f16667"),height:75,width:75},{anchor:[20,42],textColor:"white",textSize:"18",url:h("marker",100,100,"#f16667"),height:100,width:100},{anchor:[20,43.5],textColor:"white",textSize:"24",url:h("marker",125,125,"#f16667"),height:125,width:125}],m={maxZoom:15,gridSize:75,styles:f},g=function(t){return y=t},y={url:h("marker",25,25,"#f16667"),size:new google.maps.Size(71,71),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(25,25)},_=function(t,e,r,o){e=[],t.clear(),r.map(function(r){o.getBounds().contains(r.getPosition())&&e.push('<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-'+r.userID+'">\n\t\t\t\t<div class="shiftmap-clusterize-user-cell">\n\t\t\t\t\t<div class="shiftmap-clusterize-avatar">\n\t\t\t\t\t\t<img src="'+r.url+'" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="shiftmap-clusterize-content">\n\t\t\t\t\t\t<h3 class="shiftmap-clusterize-user-name">'+r.userName+'</h3>\n\t\t\t\t\t\t<button class="shiftmap-clusterize-user-button" name="follow">Follow</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>');var n=function(){t.clear(),t.update(['\n\t\t\t\t\t<div class="shiftmap-clusterize-user-row shiftmap-clusterize-user-row-single">\n\t\t\t\t\t\t<div class="shiftmap-clusterize-user-cell">\n\t\t\t\t\t\t\t<div class="shiftmap-clusterize-avatar">\n\t\t\t\t\t\t\t\t<img src="'+r.url+'" />\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="shiftmap-clusterize-content">\n\t\t\t\t\t\t\t\t User: '+r.userName+"\n\t\t\t\t\t\t\t\t City: "+r.city+"\n\t\t\t\t\t\t\t\t Country: "+r.country+"\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t"]),t.refresh()};google.maps.event.addDomListener(r,"click",n)}),console.log(e.length),t.update(e),t.refresh()},v=function(t){try{return JSON.stringify(t),!0}catch(t){return console.error("Data is not JSON format!"),!1}},w=function(t,e){return Math.random()*(e-t)+t},b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};r.prototype.MARKER_CLUSTER_IMAGE_PATH_="../images/m",r.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_="png",r.prototype.extend=function(t,e){return function(t){for(var e in t.prototype)this.prototype[e]=t.prototype[e];return this}.apply(t,[e])},r.prototype.onAdd=function(){this.setReady_(!0)},r.prototype.draw=function(){},r.prototype.setupStyles_=function(){if(!this.styles_.length)for(var t,e=0;t=this.sizes[e];e++)this.styles_.push({url:this.imagePath_+(e+1)+"."+this.imageExtension_,height:t,width:t})},r.prototype.fitMapToMarkers=function(){for(var t,e=this.getMarkers(),r=new google.maps.LatLngBounds,o=0;t=e[o];o++)r.extend(t.getPosition());this.map_.fitBounds(r)},r.prototype.setStyles=function(t){this.styles_=t},r.prototype.getStyles=function(){return this.styles_},r.prototype.isZoomOnClick=function(){return this.zoomOnClick_},r.prototype.isAverageCenter=function(){return this.averageCenter_},r.prototype.getMarkers=function(){return this.markers_},r.prototype.getTotalMarkers=function(){return this.markers_.length},r.prototype.setMaxZoom=function(t){this.maxZoom_=t},r.prototype.getMaxZoom=function(){return this.maxZoom_},r.prototype.calculator_=function(t,e){for(var r=0,o=t.length,n=o;0!==n;)n=parseInt(n/10,10),r++;return r=Math.min(r,e),{text:o,index:r}},r.prototype.setCalculator=function(t){this.calculator_=t},r.prototype.getCalculator=function(){return this.calculator_},r.prototype.addMarkers=function(t,e){if(t.length)for(var r,o=0;r=t[o];o++)this.pushMarkerTo_(r);else if(Object.keys(t).length)for(var r in t)this.pushMarkerTo_(t[r]);e||this.redraw()},r.prototype.pushMarkerTo_=function(t){if(t.isAdded=!1,t.draggable){var e=this;google.maps.event.addListener(t,"dragend",function(){t.isAdded=!1,e.repaint()})}this.markers_.push(t)},r.prototype.addMarker=function(t,e){this.pushMarkerTo_(t),e||this.redraw()},r.prototype.removeMarker_=function(t){var e=-1;if(this.markers_.indexOf)e=this.markers_.indexOf(t);else for(var r,o=0;r=this.markers_[o];o++)if(r==t){e=o;break}return-1!=e&&(t.setMap(null),this.markers_.splice(e,1),!0)},r.prototype.removeMarker=function(t,e){var r=this.removeMarker_(t);return!(e||!r)&&(this.resetViewport(),this.redraw(),!0)},r.prototype.removeMarkers=function(t,e){for(var r,o=t===this.getMarkers()?t.slice():t,n=!1,i=0;r=o[i];i++){var s=this.removeMarker_(r);n=n||s}if(!e&&n)return this.resetViewport(),this.redraw(),!0},r.prototype.setReady_=function(t){this.ready_||(this.ready_=t,this.createClusters_())},r.prototype.getTotalClusters=function(){return this.clusters_.length},r.prototype.getMap=function(){return this.map_},r.prototype.setMap=function(t){this.map_=t},r.prototype.getGridSize=function(){return this.gridSize_},r.prototype.setGridSize=function(t){this.gridSize_=t},r.prototype.getMinClusterSize=function(){return this.minClusterSize_},r.prototype.setMinClusterSize=function(t){this.minClusterSize_=t},r.prototype.getExtendedBounds=function(t){var e=this.getProjection(),r=new google.maps.LatLng(t.getNorthEast().lat(),t.getNorthEast().lng()),o=new google.maps.LatLng(t.getSouthWest().lat(),t.getSouthWest().lng()),n=e.fromLatLngToDivPixel(r);n.x+=this.gridSize_,n.y-=this.gridSize_;var i=e.fromLatLngToDivPixel(o);i.x-=this.gridSize_,i.y+=this.gridSize_;var s=e.fromDivPixelToLatLng(n),a=e.fromDivPixelToLatLng(i);return t.extend(s),t.extend(a),t},r.prototype.isMarkerInBounds_=function(t,e){return e.contains(t.getPosition())},r.prototype.clearMarkers=function(){this.resetViewport(!0),this.markers_=[]},r.prototype.resetViewport=function(t){for(var e,r=0;e=this.clusters_[r];r++)e.remove();for(var o,r=0;o=this.markers_[r];r++)o.isAdded=!1,t&&o.setMap(null);this.clusters_=[]},r.prototype.repaint=function(){var t=this.clusters_.slice();this.clusters_.length=0,this.resetViewport(),this.redraw(),window.setTimeout(function(){for(var e,r=0;e=t[r];r++)e.remove()},0)},r.prototype.redraw=function(){this.createClusters_()},r.prototype.distanceBetweenPoints_=function(t,e){if(!t||!e)return 0;var r=(e.lat()-t.lat())*Math.PI/180,o=(e.lng()-t.lng())*Math.PI/180,n=Math.sin(r/2)*Math.sin(r/2)+Math.cos(t.lat()*Math.PI/180)*Math.cos(e.lat()*Math.PI/180)*Math.sin(o/2)*Math.sin(o/2);return 2*Math.atan2(Math.sqrt(n),Math.sqrt(1-n))*6371},r.prototype.addToClosestCluster_=function(t){for(var e,r=4e4,n=null,i=(t.getPosition(),0);e=this.clusters_[i];i++){var s=e.getCenter();if(s){var a=this.distanceBetweenPoints_(s,t.getPosition());a<r&&(r=a,n=e)}}if(n&&n.isMarkerInClusterBounds(t))n.addMarker(t);else{var e=new o(this);e.addMarker(t),this.clusters_.push(e)}},r.prototype.createClusters_=function(){if(this.ready_)for(var t,e=new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),this.map_.getBounds().getNorthEast()),r=this.getExtendedBounds(e),o=0;t=this.markers_[o];o++)!t.isAdded&&this.isMarkerInBounds_(t,r)&&this.addToClosestCluster_(t)},o.prototype.isMarkerAlreadyAdded=function(t){if(this.markers_.indexOf)return-1!=this.markers_.indexOf(t);for(var e,r=0;e=this.markers_[r];r++)if(e==t)return!0;return!1},o.prototype.addMarker=function(t){if(this.isMarkerAlreadyAdded(t))return!1;if(this.center_){if(this.averageCenter_){var e=this.markers_.length+1,r=(this.center_.lat()*(e-1)+t.getPosition().lat())/e,o=(this.center_.lng()*(e-1)+t.getPosition().lng())/e;this.center_=new google.maps.LatLng(r,o),this.calculateBounds_()}}else this.center_=t.getPosition(),this.calculateBounds_();t.isAdded=!0,this.markers_.push(t);var n=this.markers_.length;if(n<this.minClusterSize_&&t.getMap()!=this.map_&&t.setMap(this.map_),n==this.minClusterSize_)for(var i=0;i<n;i++)this.markers_[i].setMap(null);return n>=this.minClusterSize_&&t.setMap(null),this.updateIcon(),!0},o.prototype.getMarkerClusterer=function(){return this.markerClusterer_},o.prototype.getBounds=function(){for(var t,e=new google.maps.LatLngBounds(this.center_,this.center_),r=this.getMarkers(),o=0;t=r[o];o++)e.extend(t.getPosition());return e},o.prototype.remove=function(){this.clusterIcon_.remove(),this.markers_.length=0,delete this.markers_},o.prototype.getSize=function(){return this.markers_.length},o.prototype.getMarkers=function(){return this.markers_},o.prototype.getCenter=function(){return this.center_},o.prototype.calculateBounds_=function(){var t=new google.maps.LatLngBounds(this.center_,this.center_);this.bounds_=this.markerClusterer_.getExtendedBounds(t)},o.prototype.isMarkerInClusterBounds=function(t){return this.bounds_.contains(t.getPosition())},o.prototype.getMap=function(){return this.map_},o.prototype.updateIcon=function(){var t=this.map_.getZoom(),e=this.markerClusterer_.getMaxZoom();if(e&&t>e)for(var r,o=0;r=this.markers_[o];o++)r.setMap(this.map_);else{if(this.markers_.length<this.minClusterSize_)return void this.clusterIcon_.hide();var n=this.markerClusterer_.getStyles().length,i=this.markerClusterer_.getCalculator()(this.markers_,n);this.clusterIcon_.setCenter(this.center_),this.clusterIcon_.setSums(i),this.clusterIcon_.show()}},n.prototype.triggerClusterClick=function(){var t=this.cluster_.getMarkerClusterer();google.maps.event.trigger(t,"clusterclick",this.cluster_),t.isZoomOnClick()&&this.map_.fitBounds(this.cluster_.getBounds())},n.prototype.onAdd=function(){if(this.div_=document.createElement("DIV"),this.visible_){var t=this.getPosFromLatLng_(this.center_);this.div_.style.cssText=this.createCss(t),this.div_.innerHTML=this.sums_.text}this.getPanes().overlayMouseTarget.appendChild(this.div_);var e=this;google.maps.event.addDomListener(this.div_,"click",function(){e.triggerClusterClick()})},n.prototype.getPosFromLatLng_=function(t){var e=this.getProjection().fromLatLngToDivPixel(t);return e.x-=parseInt(this.width_/2,10),e.y-=parseInt(this.height_/2,10),e},n.prototype.draw=function(){if(this.visible_){var t=this.getPosFromLatLng_(this.center_);this.div_.style.top=t.y+"px",this.div_.style.left=t.x+"px"}},n.prototype.hide=function(){this.div_&&(this.div_.style.display="none"),this.visible_=!1},n.prototype.show=function(){if(this.div_){var t=this.getPosFromLatLng_(this.center_);this.div_.style.cssText=this.createCss(t),this.div_.style.display=""}this.visible_=!0},n.prototype.remove=function(){this.setMap(null)},n.prototype.onRemove=function(){this.div_&&this.div_.parentNode&&(this.hide(),this.div_.parentNode.removeChild(this.div_),this.div_=null)},n.prototype.setSums=function(t){this.sums_=t,this.text_=t.text,this.index_=t.index,this.div_&&(this.div_.innerHTML=t.text),this.useStyle()},n.prototype.useStyle=function(){var t=Math.max(0,this.sums_.index-1);t=Math.min(this.styles_.length-1,t);var e=this.styles_[t];this.url_=e.url,this.height_=e.height,this.width_=e.width,this.textColor_=e.textColor,this.anchor_=e.anchor,this.textSize_=e.textSize,this.backgroundPosition_=e.backgroundPosition},n.prototype.setCenter=function(t){this.center_=t},n.prototype.createCss=function(t){var e=[];e.push("background-image:url("+this.url_+");");var r=this.backgroundPosition_?this.backgroundPosition_:"0 0";e.push("background-position:"+r+";"),"object"===b(this.anchor_)?("number"==typeof this.anchor_[0]&&this.anchor_[0]>0&&this.anchor_[0]<this.height_?e.push("height:"+(this.height_-this.anchor_[0])+"px; padding-top:"+this.anchor_[0]+"px;"):e.push("height:"+this.height_+"px; line-height:"+this.height_+"px;"),"number"==typeof this.anchor_[1]&&this.anchor_[1]>0&&this.anchor_[1]<this.width_?e.push("width:"+(this.width_-this.anchor_[1])+"px; padding-left:"+this.anchor_[1]+"px;"):e.push("width:"+this.width_+"px; text-align:center;")):e.push("height:"+this.height_+"px; line-height:"+this.height_+"px; width:"+this.width_+"px; text-align:center;");var o=this.textColor_?this.textColor_:"black",n=this.textSize_?this.textSize_:11;return e.push("cursor:pointer; top:"+t.y+"px; left:"+t.x+"px; color:"+o+"; position:absolute; font-size:"+n+"px; font-family:Arial,sans-serif; font-weight:bold"),e.join("")},window.MarkerClusterer=r,r.prototype.addMarker=r.prototype.addMarker,r.prototype.addMarkers=r.prototype.addMarkers,r.prototype.clearMarkers=r.prototype.clearMarkers,r.prototype.fitMapToMarkers=r.prototype.fitMapToMarkers,r.prototype.getCalculator=r.prototype.getCalculator,r.prototype.getGridSize=r.prototype.getGridSize,r.prototype.getExtendedBounds=r.prototype.getExtendedBounds,r.prototype.getMap=r.prototype.getMap,r.prototype.getMarkers=r.prototype.getMarkers,r.prototype.getMaxZoom=r.prototype.getMaxZoom,r.prototype.getStyles=r.prototype.getStyles,r.prototype.getTotalClusters=r.prototype.getTotalClusters,r.prototype.getTotalMarkers=r.prototype.getTotalMarkers,r.prototype.redraw=r.prototype.redraw,r.prototype.removeMarker=r.prototype.removeMarker,r.prototype.removeMarkers=r.prototype.removeMarkers,r.prototype.resetViewport=r.prototype.resetViewport,r.prototype.repaint=r.prototype.repaint,r.prototype.setCalculator=r.prototype.setCalculator,r.prototype.setGridSize=r.prototype.setGridSize,r.prototype.setMaxZoom=r.prototype.setMaxZoom,r.prototype.onAdd=r.prototype.onAdd,r.prototype.draw=r.prototype.draw,o.prototype.getCenter=o.prototype.getCenter,o.prototype.getSize=o.prototype.getSize,o.prototype.getMarkers=o.prototype.getMarkers,n.prototype.onAdd=n.prototype.onAdd,n.prototype.draw=n.prototype.draw,n.prototype.onRemove=n.prototype.onRemove,Object.keys=Object.keys||function(t){var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r);return e};var k=jQuery,x=function(t,e,o,n,i){var s=t,a=[],p=n,h=k(i).find(".shiftmap-map-clusterise-wrapper").get(0),u=k(i).find(".shiftmap-clusterize-content-wrapper").get(0),c=new l({rows:null,rows_in_block:2,scrollElem:h,contentElem:u});if(v(e)){e.map(function(t){if(t.latitude&&t.longitude){var e=new google.maps.LatLng({lat:t.latitude+w(0,.5),lng:t.longitude+w(0,.5)}),r=new google.maps.Marker({position:e,map:s,icon:y,optimized:!1,userID:t.user_id,userName:t.full_name,country:t.country,city:t.city,url:p[0]+"luke-siedle"+p[1]});o.push(r)}else console.warn("Could not find coordinates on data provided from userID: ",t.user_id)});new r(s,o,m);google.maps.event.addListener(s,"bounds_changed",function(){setTimeout(function(){_(c,a,o,s)},200)}),google.maps.event.addListener(t,"idle",function(){setTimeout(function(){google.maps.event.trigger(t,"resize")},200)})}},M=function(t){var e=window.jQuery,r=e(t).html('<div class="shiftmap-wrapper">\n\t<div class="shiftmap-map-clusterise-user-panel">\n\t\t<div class="shiftmap-map-clusterise-wrapper">\n\t\t\t<div class="shiftmap-input-wrapper">\n\t\t\t\t<input type="text" placeholder="Search the map" class="shiftmap-input">\n\t\t\t</div>\n\t\t\t<div class="shiftmap-clusterize">\n\t\t\t\t<div class="shiftmap-clusterize-scroll">\n\t\t\t\t\t<div class="shiftmap-clusterize-user-table">\n\t\t\t\t\t\t<div class="shiftmap-clusterize-content-wrapper"></div>\n\t\t\t\t\t\t<div class="shiftmap-clusterize-no-data" style="display:none">\n\t\t\t\t\t\t\t<div>Zoom to display user data…</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="shiftmap-map-toggle-panel"></div>\n\t</div>\n\n\t<div class="shiftmap-map-wrapper">\n\t\t<div class="shiftmap-map"></div>\n\t</div>\n</div>'),o=r.find(".shiftmap-map");return new google.maps.Map(o.get(0),d)},C=function(t,e){return new google.maps.LatLng(parseFloat(t).toFixed(6),parseFloat(e).toFixed(6))},T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},S=e(function(t){!function(e){function r(){}function o(t,e){return function(){t.apply(e,arguments)}}function n(t){if("object"!==T(this))throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],h(t,this)}function i(t,e){for(;3===t._state;)t=t._value;if(0===t._state)return void t._deferreds.push(e);t._handled=!0,n._immediateFn(function(){var r=1===t._state?e.onFulfilled:e.onRejected;if(null===r)return void(1===t._state?s:a)(e.promise,t._value);var o;try{o=r(t._value)}catch(t){return void a(e.promise,t)}s(e.promise,o)})}function s(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"===(void 0===e?"undefined":T(e))||"function"==typeof e)){var r=e.then;if(e instanceof n)return t._state=3,t._value=e,void p(t);if("function"==typeof r)return void h(o(r,e),t)}t._state=1,t._value=e,p(t)}catch(e){a(t,e)}}function a(t,e){t._state=2,t._value=e,p(t)}function p(t){2===t._state&&0===t._deferreds.length&&n._immediateFn(function(){t._handled||n._unhandledRejectionFn(t._value)});for(var e=0,r=t._deferreds.length;e<r;e++)i(t,t._deferreds[e]);t._deferreds=null}function l(t,e,r){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=r}function h(t,e){var r=!1;try{t(function(t){r||(r=!0,s(e,t))},function(t){r||(r=!0,a(e,t))})}catch(t){if(r)return;r=!0,a(e,t)}}var u=setTimeout;n.prototype.catch=function(t){return this.then(null,t)},n.prototype.then=function(t,e){var o=new this.constructor(r);return i(this,new l(t,e,o)),o},n.all=function(t){var e=Array.prototype.slice.call(t);return new n(function(t,r){function o(i,s){try{if(s&&("object"===(void 0===s?"undefined":T(s))||"function"==typeof s)){var a=s.then;if("function"==typeof a)return void a.call(s,function(t){o(i,t)},r)}e[i]=s,0==--n&&t(e)}catch(t){r(t)}}if(0===e.length)return t([]);for(var n=e.length,i=0;i<e.length;i++)o(i,e[i])})},n.resolve=function(t){return t&&"object"===(void 0===t?"undefined":T(t))&&t.constructor===n?t:new n(function(e){e(t)})},n.reject=function(t){return new n(function(e,r){r(t)})},n.race=function(t){return new n(function(e,r){for(var o=0,n=t.length;o<n;o++)t[o].then(e,r)})},n._immediateFn="function"==typeof setImmediate&&function(t){setImmediate(t)}||function(t){u(t,0)},n._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)},n._setImmediateFn=function(t){n._immediateFn=t},n._setUnhandledRejectionFn=function(t){n._unhandledRejectionFn=t},t.exports?t.exports=n:e.Promise||(e.Promise=n)}(p)});window.Promise||(window.Promise=S),function(t){function e(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function r(t){return"string"!=typeof t&&(t=String(t)),t}function o(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return y.iterable&&(e[Symbol.iterator]=function(){return e}),e}function n(t){this.map={},t instanceof n?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function i(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function s(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function a(t){var e=new FileReader,r=s(e);return e.readAsArrayBuffer(t),r}function p(t){var e=new FileReader,r=s(e);return e.readAsText(t),r}function l(t){for(var e=new Uint8Array(t),r=new Array(e.length),o=0;o<e.length;o++)r[o]=String.fromCharCode(e[o]);return r.join("")}function h(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function u(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t,t)if("string"==typeof t)this._bodyText=t;else if(y.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(y.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(y.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(y.arrayBuffer&&y.blob&&v(t))this._bodyArrayBuffer=h(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!y.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!w(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=h(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):y.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},y.blob&&(this.blob=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?i(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(a)}),this.text=function(){var t=i(this);if(t)return t;if(this._bodyBlob)return p(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(l(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},y.formData&&(this.formData=function(){return this.text().then(f)}),this.json=function(){return this.text().then(JSON.parse)},this}function c(t){var e=t.toUpperCase();return b.indexOf(e)>-1?e:t}function d(t,e){e=e||{};var r=e.body;if(t instanceof d){
if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new n(t.headers)),this.method=t.method,this.mode=t.mode,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new n(e.headers)),this.method=c(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function f(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),o=r.shift().replace(/\+/g," "),n=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(o),decodeURIComponent(n))}}),e}function m(t){var e=new n;return t.split(/\r?\n/).forEach(function(t){var r=t.split(":"),o=r.shift().trim();if(o){var n=r.join(":").trim();e.append(o,n)}}),e}function g(t,e){e||(e={}),this.type="default",this.status="status"in e?e.status:200,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new n(e.headers),this.url=e.url||"",this._initBody(t)}if(!t.fetch){var y={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(y.arrayBuffer)var _=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],v=function(t){return t&&DataView.prototype.isPrototypeOf(t)},w=ArrayBuffer.isView||function(t){return t&&_.indexOf(Object.prototype.toString.call(t))>-1};n.prototype.append=function(t,o){t=e(t),o=r(o);var n=this.map[t];this.map[t]=n?n+","+o:o},n.prototype.delete=function(t){delete this.map[e(t)]},n.prototype.get=function(t){return t=e(t),this.has(t)?this.map[t]:null},n.prototype.has=function(t){return this.map.hasOwnProperty(e(t))},n.prototype.set=function(t,o){this.map[e(t)]=r(o)},n.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},n.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),o(t)},n.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),o(t)},n.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),o(t)},y.iterable&&(n.prototype[Symbol.iterator]=n.prototype.entries);var b=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];d.prototype.clone=function(){return new d(this,{body:this._bodyInit})},u.call(d.prototype),u.call(g.prototype),g.prototype.clone=function(){return new g(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new n(this.headers),url:this.url})},g.error=function(){var t=new g(null,{status:0,statusText:""});return t.type="error",t};var k=[301,302,303,307,308];g.redirect=function(t,e){if(-1===k.indexOf(e))throw new RangeError("Invalid status code");return new g(null,{status:e,headers:{location:t}})},t.Headers=n,t.Request=d,t.Response=g,t.fetch=function(t,e){return new Promise(function(r,o){var n=new d(t,e),i=new XMLHttpRequest;i.onload=function(){var t={status:i.status,statusText:i.statusText,headers:m(i.getAllResponseHeaders()||"")};t.url="responseURL"in i?i.responseURL:t.headers.get("X-Request-URL");var e="response"in i?i.response:i.responseText;r(new g(e,t))},i.onerror=function(){o(new TypeError("Network request failed"))},i.ontimeout=function(){o(new TypeError("Network request failed"))},i.open(n.method,n.url,!0),"include"===n.credentials&&(i.withCredentials=!0),"responseType"in i&&y.blob&&(i.responseType="blob"),n.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),i.send(void 0===n._bodyInit?null:n._bodyInit)})},t.fetch.polyfill=!0}}("undefined"!=typeof self?self:void 0);var E={"person-001":[40,63],"person-002":[38,63],"person-003":[45,43],"person-004":[40,62],"person-005":[39,63],"person-006":[41,63],"person-007":[38,63],"person-008":[40,63],"person-009":[37,62],"person-010":[37,62],"person-011":[38,63],"person-012":[37,61],"person-013":[36,63],"person-014":[37,63],"person-015":[39,62],"person-016":[38,62],"person-017":[37,61],"person-018":[37,63],"person-019":[36,61],"person-020":[39,61],"person-021":[37,61],"person-022":[37,60],"person-023":[41,68],"person-024":[40,61],"person-025":[36,61],"person-026":[38,61],"person-027":[38,60],"person-028":[36,60],"person-029":[37,65],"person-030":[35,61],"person-031":[37,63],"person-032":[44,53],"person-033":[39,63],"person-034":[39,63],"person-035":[68,65],"person-036":[37,60],"person-037":[37,60],"person-038":[37,60],"person-039":[36,61],"person-040":[57,62],"person-041":[65,63],"person-042":[40,63],"person-043":[40,63],"person-044":[49,66],"person-045":[37,65],dinosaur:[105,85],giraffe:[64,77]},z=function(t,e){var r=[],o=[],n=t,i=Object.keys(E),s=0;fetch("./datasets/airports.json").then(function(t){return t.json()}).then(function(t){t.map(function(t){s===i.length&&(s=0);var a=i[s]||i[0],p=E[a],l={position:new google.maps.LatLng(t.latitude,t.longitude),icon:{url:""+e+a+".png",size:new google.maps.Size(p[0],p[1]),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(17,34),scaledSize:new google.maps.Size(p[0],p[1])}};r.push(new google.maps.Marker({position:l.position,map:n,icon:l.icon,visible:!1})),o.push(l),s++})}).catch(function(t){console.log(t)}),google.maps.event.addListener(n,"zoom_changed",function(){var t=n.getZoom();r.map(function(e){e.setVisible(t>7)})})},L=function(t){if(RegExp("^(/[^/ ]*)+/$").test(t))return!0;console.error('Please provide the icons directory as in "/path/to/icons/"')},P=[],A=[],B=C(51.521723,-.134581);!function(t){d.center=t}(B);var I=void 0,R=void 0,O=window.jQuery,j=function(t,e,r,o){t=t,e=e,r=r,o=o,I=M(t),R=s(0,t),x(I,e,A,r,t),a(I,void 0,R,P,y,g),Z(t),setTimeout(function(){L(o)&&z(I,o)},100)},F=function(t,e){var r=C(t,e);I.panTo(r)},D=function(t){"function"==typeof t?google.maps.event.addListenerOnce(I,"idle",t):console.error("provide a callback function")},U=function(t){"function"==typeof t?google.maps.event.addListener(I,"idle",t):console.error("provide a callback function")},N=function(t,e){return[t.toString(),e.toString()]},Z=function(t){var e=O(t).find(".shiftmap-map-clusterise-user-panel");e.find(".shiftmap-map-toggle-panel").click(function(){e.toggleClass("closed")})},H=function(t,e){O(".shiftmap-wrapper").width(t).height(e),O(".shiftmap-map").width(t).height(e);var r=O(".shiftmap-map").get(0);google.maps.event.trigger(r,"resize"),google.maps.event.addListenerOnce(r,"idle",function(){google.maps.event.trigger(r,"resize")})};t.initialize=j,t.setWidthHeight=H,t.onMapReady=D,t.onMapChangeLocation=U,t.defineURL=N,t.changeMapLocation=F,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=maps.bundle.js.map
