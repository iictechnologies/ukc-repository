var map;
var dMarker, dMarkerIcon, dMarkerX, dMarkerY;
var xteMarkersArr = [], xteIconsArr = [];
var shipMarker;
var wpArr = [], wpMarkersArr = [], wpMarkerX, wpMarkerY;
var lwpArr = [], longRouteStatus = false;
var wpAttrPopup, wpAttrPopupDiv;
var xteTooltip, xteTooltipDiv;
var drag,IsWpDragged = false, isTaptorefreshEnabled = false;
var wpClickIndex = 0 , xtePos = 0;
var dragStatus = false;
var trashDefStyle, trashHigStyle, trashVector, trashLayer;
var xteVector, xteLayer, routeLineVector, routeLineLayer, journeyLineLayer, journeyLinePoints = [], legPointsArr =[],legsLineArr = [];
var depthProfile;
var legsArr = [], tmpLegsArr = [];
var movedPos;
var TRASH_RADIUS = 105;
var SPLIT_INTERVAL = 320;
var MAX_WAYPOINT_COUNT = 100;
function loadMap(){
	
	// initialize layout, url's, date, device adjustments 
	initialSettings.init();
	
	// add event listener to date change event
	dateService.initOnDateChange();

	// initialize map
	mapService.init();
	
	// initial waypoint Pop up and add to map
	wpAttrPopupDiv = document.getElementById('popup');	
	wpAttrPopup = new ol.Overlay({
		element : wpAttrPopupDiv
	});	
	map.addOverlay(wpAttrPopup);
	// add wms layers to map
	mapService.addWMSLayer(initialSettings.backDropLayer());
	mapService.addWMSLayer(initialSettings.depthLayer());
	// add waypoint trash layer to map
	addWPTrashLayer();
	// add default waypoint marker to map
	addDefaultWPMarker();
	//add ship route marker to map
	addShipRouteMarker();	
	// add drag interaction on map
	map.getInteractions().forEach(function(interaction){
		if (interaction instanceof ol.interaction.DragPan) {
			drag = interaction;  
	  }
	});
	// initialize pointer event handler to default marker
	var dp_dragger_ = new ol.pointer.PointerEventHandler(dMarkerIcon);
	// initialize event listeners to default marker to map
	ol.events.listen(dp_dragger_, ol.pointer.EventType.POINTERDOWN,handleDraggerStart_dp);
	ol.events.listen(dp_dragger_, ol.pointer.EventType.POINTERMOVE,handleDraggerDrag_dp);
	ol.events.listen(dp_dragger_, ol.pointer.EventType.POINTERUP,handleDraggerEnd_dp);	

	// handle pointer drag event on map
	map.on('pointerdrag', function(evt) {
		wpDrag(evt);
	});
	// handle pointer up event on map
	map.on('pointerup', function(evt) {		
		wpDrop(evt);		
	});
	// handle pan or zoom event on map
	map.on('moveend', function(evt) {
		redrawDefaultWPandTrash();		
	});
	// pre-load event handle on map 
	map.once('postrender', function(event) {		
		redrawDefaultWPandTrash();
	});
	// zoom to area of interest
	zoomToAOI();
	// handle pointer up event on map
	map.on('singleclick', function(evt) {
		if(ukcGraph && !IsWpDragged && !isTaptorefreshEnabled){
			$("#taptorefreshdiv").css("display","none");	
		}		
	});	
}
/**
 * Method to add trash layer to map 
 *  
 */
function addWPTrashLayer() {
	
	// transparent color style to hide trash layer
	trashDefStyle = new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'transparent',
			width : 3
		}),
		fill : new ol.style.Fill({
			color : 'transparent'
		})
	});
	
	// red color style to show trash layer
	trashHigStyle = new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'red',
			width : 5,
			lineDash : [ 5, 10 ]
		}),
		fill : new ol.style.Fill({
			color : 'rgba(255, 0, 0, 0.1)'
		})
	});

	trashVector = new ol.source.Vector({
		projection : 'EPSG:900913'
	});

	trashLayer = new ol.layer.Vector({
		source : trashVector,
		style : trashDefStyle,
		updateWhileInteracting : true
	});
	
	// finally add trash layer with transparent style to map 
	map.addLayer(trashLayer);
}

/**
 * Add Default marker to map
 * 
 */
function addDefaultWPMarker() {
	
	// creating element with style class from map.css
	dMarkerIcon = ($('<i/>').addClass('addmarker').get(0));
	// creating overlay object
	dMarker = new ol.Overlay({
		  positioning: 'bottom-left',
		  element: dMarkerIcon,
		  stopEvent: false,
		  dragging: false,
		  offset:[0,0]		  
		});
	// add to the map
	map.addOverlay(dMarker);
}

/**
 * Add ship route marker to the map 
 * 
 */
function addShipRouteMarker(){	
	
	shipMarker = new ol.Overlay({
		  positioning: 'bottom-left',
		  element: ($('<i/>').addClass('shipmarker').get(0)),
		  stopEvent: false,
		  dragging: false		  
		});	
	// add to map
	map.addOverlay(shipMarker);	
}
/**
 *  Method to create waypoint markers with index value 
 *  Add pointer events listeners to waypoint markers
 * @param index
 */
function createWPMarker(index) {
	var element;
	
	if (index == 0 || index == 1) {
		element = ($('<i/>').attr("id", index + "m").addClass("waypointm intermediatewpm").css({"background" : "url(" + contextpath + "images/" + index + ".png)","background-repeat" : "no-repeat"}).get(0));				
	} else if (index > 1 && index <= 10) {
		element = ($('<i> <span class="badge badgeSingleDigit">' + (index - 1) + '</span> <i/>').attr("id", index + "m").addClass("intermediatewpm").css({"background-image" : "url(" + contextpath + "images/waypoint.png)"}).get(0));		
	} else if (index > 10) {
		element = ($('<i> <span class="badge badgeDoubleDigit">'+ (index - 1) + '</span> <i/>').attr("id", index + "m").addClass("intermediatewpm").css({"background-image" : "url(" + contextpath + "images/waypoint.png)"}).get(0));		
	}
	
	addWPOverlay(element);
	
	var classname = document.getElementsByClassName("intermediatewpm");
	// initialing event listeners to every waypoint with class intermediatewpm
	for (var l = 0; l < classname.length; l++) {
		var dragger_ = new ol.pointer.PointerEventHandler(classname[l]);
		ol.events.listen(dragger_, ol.pointer.EventType.POINTERDOWN,handleDraggerStart_);
		ol.events.listen(dragger_, ol.pointer.EventType.POINTERMOVE,handleDraggerDrag_);
	}
}

/**
 * Method to add waypoint to map
 * Update waypoints array
 * @param element
 */
function addWPOverlay(element) {
	
	var varMarker = new ol.Overlay({
		positioning : 'center-center',
		element : element,
		stopEvent : false,
		dragging : false
	});
	// add to map
	map.addOverlay(varMarker);
	// update waypoints array
	wpMarkersArr.push(varMarker);
}

/**
 * Method to handle dragging start event for waypoint
 * Enable dragging on map
 * Set dragging true to waypoint with returned index 
 * @param evt
 */
function handleDraggerStart_(evt) {
	
	// get clicked position of waypoint
	wpMarkerX = evt.originalEvent.layerX; 
	wpMarkerY = evt.originalEvent.layerY;
	// get waypoint index from the clciked event
	wpClickIndex = evt.originalEvent.currentTarget.attributes[0].textContent.replace("m", "");
	// enable drag on map
	drag.setActive(false);
	// enable dragging for waypoint with click index
	wpMarkersArr[wpClickIndex].set('dragging', true);
}

/**
 *  Method to handle dragging event for waypoint
 *  Update the waypoint position on map
 * @param evt
 */	
function handleDraggerDrag_(evt) {

   if(wpClickIndex != undefined)
	if (wpMarkersArr.length>0 && wpMarkersArr[wpClickIndex].get('dragging') === true) {
		wpMarkersArr[wpClickIndex].setPosition(map.getCoordinateFromPixel([evt.clientX - wpMarkerX + $(".intermediatewpm").width() / 2, evt.clientY + $(".intermediatewpm").height() - wpMarkerY]));
	}	
}

/**
 * Method to handle xte marker dragging to start
 * Enable dragging on map
 * Set dragging true to xte marker with returned index 
 * @param evt
 */
function handleXTEDraggerStart_(evt) {
	xtePos = evt.originalEvent.currentTarget.attributes[0].textContent.replace("bm","");
	drag.setActive(false);
	xteMarkersArr[xtePos].set('dragging', true);
}

/**
 * Method to handle xte marker dragging event
 * @param evt
 */
function handleXTEDraggerDrag_(evt) {
	// intentionally created this function,
	// the purpose of this function is to touch-devices pointer handler 
	// not to delete
}

/**
 * Method to handle dragging start event for default marker
 * Enable dragging on map
 * Set dragging true to default marker
 * Get the clicked x,y position of default marker
 * @param evt
 */
function handleDraggerStart_dp(evt) {
	drag.setActive(false);
	dMarker.set('dragging', true);
	dMarkerX = evt.originalEvent.layerX;
	dMarkerY = evt.originalEvent.layerY;
}

/**
 *  Method to handle dragging event for default marker
 *  Update the default marker position on map
 * @param evt
 */
function handleDraggerDrag_dp(evt) {

	if (dMarker.get('dragging') === true) {
		dMarker.setPosition(map.getCoordinateFromPixel([evt.clientX - dMarkerX + $(".addmarker").width() / 2, evt.clientY + $(".addmarker").height() - dMarkerY ]));
	}
}

/**
 * Method to handle dragging end event for defult marker
 * Disable dragging on map
 */
function handleDraggerEnd_dp(evt) {
	drag.setActive(true);
}

/**
 * Method to find whether dragged waypoint in trash or not
 * @param evt
 * @returns true if it is in trash else return false
 */
function isWPInTrash(evt) {
	return turf.inside(turf.point(evt.coordinate),turf.polygon(trashVector.getFeatures()[0].getGeometry().getCoordinates()));
}

/**
 *  Method to handle drag event for waypoint or default waypoint or xte marker 
 *  @param event
 */
function wpDrag(evt) {
	var markerCoords;
	var popupCoords;
	var popupTransCoords;
	var popupContent;
	
	// When dragging Default Waypoint marker
	if (dMarker.get('dragging') === true) {
		// Hide Default marker
		hideDMarker();
		
		// Close Popup
		closePopup();
		
		// Get moved positionn 
		movedPos = map.getCoordinateFromPixel([evt.pixel[0] - dMarkerX + $(".addmarker").width()/2, evt.pixel[1] - dMarkerY + $(".addmarker").height()]);
		
		markerCoords = map.getCoordinateFromPixel([ evt.pixel[0] - dMarkerX, evt.pixel[1] - dMarkerY ]);
		dMarker.setPosition(markerCoords);
		
		// Get Popup position
		popupCoords = map.getCoordinateFromPixel([ evt.pixel[0] - dMarkerX + $(".addmarker").width()/2, evt.pixel[1] - dMarkerY]);
		popupTransCoords = ol.proj.transform(popupCoords, 'EPSG:900913','EPSG:4326');
		
		// Get Popup content
		popupContent = getContent(popupTransCoords);
		
		// Show Popup
		showPopup(popupCoords, popupContent);	
		
		// Highlight TrashLayer
		showTrash();
	} 
	// When dragging Waypoint marker
	else if (wpMarkersArr.length>0 && wpMarkersArr[wpClickIndex].get('dragging') === true) {
		var wpObject = new wayPoint();
		
		// Get Index of dragging Waypoint
		var pointer = getWPMarkerIndex(wpClickIndex);
		
		var postionCoordinate = map.getCoordinateFromPixel([evt.pixel[0] - wpMarkerX + $(".waypointm").width()/2, evt.pixel[1] - wpMarkerY + $(".waypointm").height()]);
		
		markerCoords = map.getCoordinateFromPixel([evt.pixel[0] - wpMarkerX + $(".waypointm").width()/2 , evt.pixel[1] - wpMarkerY + $(".waypointm").height()]);	
		wpMarkersArr[wpClickIndex].setPosition(markerCoords);
		
		// Close Popup
		closePopup();
		
		// Get Popup position
		popupCoords = map.getCoordinateFromPixel([ evt.pixel[0] - wpMarkerX + $(".waypointm").width()/2, evt.pixel[1] - wpMarkerY]);
		popupTransCoords = ol.proj.transform(popupCoords, 'EPSG:900913','EPSG:4326');
		
		// Get Popup content
		popupContent = getContent(popupTransCoords);
				
		// Show Popup
		showPopup(popupCoords, popupContent);
		
		// Updating the Waypoint
		wpObject.coordinates = ol.proj.transform(postionCoordinate, 'EPSG:900913','EPSG:4326');
		wpObject.speed = wpArr[pointer].speed;
		wpObject.trn = wpArr[pointer].trn;
		wpObject.xtl = wpArr[pointer].xtl;
		wpObject.xtr = wpArr[pointer].xtr;
		wpObject.minukc = wpArr[pointer].minukc;
		wpArr[pointer] = wpObject;
		
		// Redraw Route
		drawWpRoute();
		
		//Highlight TrashLayer
		showTrash();
		IsWpDragged = true;
	}
	// When dragging XTE marker
 	else if (xteMarkersArr.length > 0 && xteMarkersArr[xtePos].get('dragging') === true) {
			xteMarkerDrag(evt, xtePos);		
		    dMarker.setPosition(undefined);
	} 
 	else {
		dMarker.setPosition(undefined);
	}	
}

/**
 * Method to handle drag end event for waypoint or deafault waypoint or xte marker
 * @param event
 */
function wpDrop(evt) {
	var positionCoordinate;
	var markerCoords;
	var wpObject = new wayPoint();
	
	// When dragging Default Waypoint marker
	if (dMarker.get('dragging') === true) {
	if(wpArr.length<=MAX_WAYPOINT_COUNT){
	// When Waypoint out of Trash, WayPoint is alive and Moved
	if(!isWPInTrash(evt) && movedPos){
			// Set Default Waypoint Marker position
		    positionCoordinate = map.getCoordinateFromPixel([20,20]);
			markerCoords = ol.proj.transform(positionCoordinate, 'EPSG:3857','EPSG:900913');
			dMarker.setPosition(markerCoords);
	
			// Get Waypoint count
			var wpCount = wpArr.length;
	
			// Create Waypoint object with default values and push to Waypoint Array
			wpObject.coordinates = ol.proj.transform(movedPos, 'EPSG:900913','EPSG:4326');
			wpArr.push(wpObject);
			
			// 0 - Starting Waypoint, 1 - Destination Waypoint
			// When Waypoint index is 0, then set its marker position
			if(wpCount==0){
				createWPMarker(0);
				wpMarkersArr[0].setPosition(ol.proj.transform(movedPos, 'EPSG:3857','EPSG:900913'));
			}
			// When Waypoint index is 1, then create Waypoint marker and set its position
			else if(wpCount==1){
				createWPMarker(1);
				wpMarkersArr[1].setPosition(ol.proj.transform(movedPos, 'EPSG:3857','EPSG:900913'));
			}
			// When Waypoint index is above 1, then create intermediate Waypoint and set its position
			else{
				createWPMarker(wpCount);		
				wpMarkersArr[wpMarkersArr.length-1].setPosition(ol.proj.transform(wpArr[wpArr.length-2].coordinates, 'EPSG:4326','EPSG:900913'));
				wpMarkersArr[1].setPosition(ol.proj.transform(wpArr[wpArr.length-1].coordinates, 'EPSG:4326','EPSG:900913'));
			}				
			
			// Close Popup
			closePopup();
			
			// Redraw Route
			drawWpRoute();
			
			showTaptoRefresh();
			showDMarker();
			
			 ga('send', 'event', $('#authusername').val(), JSON.stringify({
		    		'EventType' : 'User Added Waypoint By Dragging at : '+ ol.proj.transform(movedPos, 'EPSG:900913','EPSG:4326').toString(),
		    		'ProfileMethodValue' : $('#profilemethod').val(),
		    		'wayPoints': wpArr,
		    		'Date': initialSettings.getDate().toString()
		      }), initialSettings.getDate().toString());	     
		}
   
	}else{
	    jAlert("Maximum Waypoints count is 100");	
	    closePopup();
	    }
	// Activate map pan event
		drag.setActive(true);
	
	// Deactivate Default Waypoint dragging event
		dMarker.set('dragging', false);	
	}
	// When dragging Waypoint marker
	else if(wpMarkersArr.length> 0 && wpMarkersArr[wpClickIndex].get('dragging')=== true){
		var pointer = getWPMarkerIndex(wpClickIndex);
		// When Waypoint is trashed
		if (isWPInTrash(evt)) {
			// Update Waypoint markers
			updateWPMarkers(wpClickIndex);
		} 
		else {
			// When Waypoint is dragging
			if (dragStatus) {
				postionCoordinate = map.getCoordinateFromPixel([evt.pixel[0] - wpMarkerX+ $(".waypointm").width() / 2, evt.pixel[1] - wpMarkerY+ $(".waypointm").height()]);
				wpMarkersArr[wpClickIndex].setPosition(postionCoordinate);
				
				wpObject.coordinates = ol.proj.transform(postionCoordinate, 'EPSG:900913','EPSG:4326');
				wpObject.speed = wpArr[pointer].speed;
				wpObject.trn = wpArr[pointer].trn;
				wpObject.xtl = wpArr[pointer].xtl;
				wpObject.xtr = wpArr[pointer].xtr;
				wpObject.minukc = wpArr[pointer].minukc;
				wpArr[pointer] = wpObject;
				
			}			
		} 

		rearrangeWPMarkers();
		
		// Redraw Route
		drawWpRoute();
		
		if(IsWpDragged)
		showTaptoRefresh();	
		
		if(longRouteStatus)
		showTaptoRefresh();
		
		showAttributesPopup();

		dragStatus = false;
		drag.setActive(true);
		
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
    		'EventType' : 'User Edited Route By Dragging Waypoint',
    		'ProfileMethodValue' : $('#profilemethod').val(),
    		'wayPoints': wpArr,
    		'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
		 
	    }
		// When dragging XTE marker
	    else if(xteMarkersArr.length> 0 && xteMarkersArr[xtePos].get('dragging') === true) {
	    	showTaptoRefresh();
			removeBufferDragInteraction(xtePos);
			 ga('send', 'event', $('#authusername').val(), JSON.stringify({
		    		'EventType' : 'User Dragged XTE Marker',
		    		'ProfileMethodValue' : $('#profilemethod').val(),
		    		'wayPoints': wpArr,
		    		'Date': initialSettings.getDate().toString()
		      }), initialSettings.getDate().toString());	
		}							
	
		// Set Default Waypoint Marker position
		positionCoordinate = map.getCoordinateFromPixel([20,20]);
		markerCoords = ol.proj.transform(positionCoordinate, 'EPSG:3857','EPSG:900913');
		dMarker.setPosition(markerCoords);
		showDMarker();
		movedPos = undefined;
		hideTrash();		
}

/**
 * Method to show tap to refresh window when any change in waypoints, date or factors
 */
function showTaptoRefresh() {
	longRouteOff();
	isTaptorefreshEnabled = true;
	$("#taptorefreshdiv").css("display","block");	
}

/**
 * Method to show tap to refresh window when any change in waypoints, date or factors
 */
function hideTaptoRefresh() {
	isTaptorefreshEnabled = false;
	$("#taptorefreshdiv").css("display","none");	
}

/**
 * Method to show default marker css element when changing the zoom or pan of map
 */
function showDMarker() {
	$(".addmarkercss").css("display","block");
}
/**
 * Method to hide default marker css element when changing the zoom or pan of map
 */
function hideDMarker() {
	$(".addmarkercss").css("display","none");
}

/**
 * Method to relocate waypoint trash and default marker when changing the zoom or pan of map
 */
function redrawDefaultWPandTrash() {

	dMarker.setPosition(ol.proj.transform(map.getCoordinateFromPixel([20,20]), 'EPSG:3857','EPSG:900913'));			
	var positionCircle = ol.proj.transform(map.getCoordinateFromPixel([50,50]), 'EPSG:3857','EPSG:900913');
	var circle;	
	if(trashVector){
		var radius = map.getView().getResolution() * TRASH_RADIUS;
		circle = new ol.geom.Circle(positionCircle, radius); 	
	}
	else {
		circle = new ol.geom.Circle(positionCircle, 38.22  * TRASH_RADIUS);
	}
	
	var polycircle = ol.geom.Polygon.fromCircle(circle, 64, 90);
    var circleFeature = new ol.Feature(polycircle);	    
    trashVector.clear();
    trashVector.addFeature(circleFeature);  
    closePopup();
}

/**
 * Method to zoom the map when the users entered area of interest  
 */
function zoomToAOI() {
	var upperleft = $("#upperleft").val();
	var lowerright = $("#lowerright").val();
	
	if (upperleft == "" || lowerright == "") {
		
		jAlert("Enter Both Values");
		
	} else {
		
		var aoi = ol.proj.transformExtent([ parseFloat(upperleft.split(",")[1]),
				parseFloat(upperleft.split(",")[0]),
				parseFloat(lowerright.split(",")[1]),
				parseFloat(lowerright.split(",")[0]) ], "EPSG:4326",
				"EPSG:3857");
		map.getView().fit(aoi, map.getSize());
	}

	setTimeout(function() {
		map.getView().setZoom(map.getView().getZoom() + 0.001);
	}, 1000);	
}

/**
 * Method to close the popup
 */
function closePopup(){
	$(wpAttrPopupDiv).popover('destroy');
}

/**
 * Method to show popup with all attributes
 */
function showAttributesPopup(){
	closePopup();
	var pointer = getWPMarkerIndex(wpClickIndex);
	var popupcoordinate = ol.proj.transform(wpArr[pointer].coordinates,'EPSG:4326', 'EPSG:900913');
	var pixels = map.getPixelFromCoordinate(popupcoordinate);
	var popupCoords = map.getCoordinateFromPixel([ pixels[0],pixels[1] - $(".waypointm").height()]);
	var popupContent = getPopupContent(wpArr[pointer].coordinates);
	showPopup(popupCoords, popupContent);
}

/**
 * Method to show the popup
 * @param popupCoords
 * @param popupContent
 */
function showPopup(popupCoords, popupContent) {
	setPopupContent(popupContent);
	setPopupPosition(popupCoords);	
	$(wpAttrPopupDiv).popover('show');
}

/** 
 * Method to set the position of popup
 */
function setPopupPosition(popupCoords) {
	wpAttrPopup.setPosition(popupCoords);	
}

/**
 * Method to set the popup content
 * @param popupContent
 */
function setPopupContent(popupContent) {
	$(wpAttrPopupDiv).popover({
		'placement' : 'top',
		'animation' : false,
		'html' : true,
		'title' : '<span onclick="closePopup();">X</span>',
		'content' : popupContent
	});
}

/**
 * Logic to get the waypoint index for getting the attributes from wpArr
 * @param wpClickPos
 * @returns {Number}
 */
function getWPMarkerIndex(wpClickPos) {
	var pointer;
	if (wpClickPos == 1) {
		pointer = wpArr.length - 1;	
	} 
	else if(wpClickPos > 1){
		pointer = wpClickPos-1;
	}else{
		pointer = wpClickPos;	
	}
	return pointer;
}

/**
 * Method to change show the trash by changing the style to trash layer feature
 */
function showTrash() {
	trashVector.getFeatures()[0].setStyle(trashHigStyle);	
}

/**
 * Method to change hide the trash by changing the style to trash layer feature
 */
function hideTrash(){
	trashVector.getFeatures()[0].setStyle(trashDefStyle);
}

/**
 * Method to remove the xte tooltip from the map
 */
function closeBufferTooltip(){
	map.removeOverlay(xteTooltip);
}

/**
 * Method to remove drag interaction for xte marker
 * Disable dragging on map
 * Close xte tooltip
 * @param bufferPosition
 */
function removeBufferDragInteraction(bufferPosition){
	if(xteMarkersArr.length>0){
		drag.setActive(true);
		xteMarkersArr[bufferPosition].set('dragging', false);
		closeBufferTooltip();
	}
}

/**
 * Get the popcontent when clicked on waypoint
 * @param coord
 * @returns {String}
 */
function getPopupContent(coord){
	 var ns =  deg_to_dms_lat(coord[1]); 
	 var ew =  deg_to_dms_lon(coord[0]);
	 var position = getWPMarkerIndex(wpClickIndex);
	 var speed = "<input type='number' id='contentspeed' onblur=' return speedValidation(this.value,\"contentspeed\")' value='"+wpArr[position].speed+"' min='0' max='200'>";
	 var xtl = "<input type='number' id='contentxtl' onblur=' return xtlValidation(this.value,\"contentxtl\")' value='"+wpArr[position].xtl+"' min='0.1' max='1.5'>";
	 var xtr = "<input type='number' id='contentxtr' onblur=' return xtrValidation(this.value,\"contentxtr\")' value='"+wpArr[position].xtr+"' min='0.1' max='1.5' >";
	 var trn = "<input type='number' id='contentturnradius' onblur=' return turnradiusValidation(this.value,\"contentturnradius\")' value='"+wpArr[position].trn+"' min='0' max='360'>";
	 var minukc = "<input type='number' id='contentminukc' onblur=' return minukcValidation(this.value,\"contentminukc\")' value='"+wpArr[position].minukc+"' min='0' max='13'>";
	 return "<span>Lat : </span>"+ns+"<br><span>Lon : </span>"+ew+"<br> <span>XTL : </span>"+xtl+"<span>Speed : </span>"+speed+"<br><span>XTR : </span>"+xtr+"<span>Turn : </span>"+trn+"<br><b>Minimum UKC: </b>"+minukc; 
}

/**
 * Method to Update waypoints Array when change the value in waypoint popup
 * Redraw the route
 * @param id
 * @param value
 */
function updateWpArray(id,value){
	
	var position = getWPMarkerIndex(wpClickIndex);
	
	if(id=="contentxtl"){
		wpArr[position].xtl = value;
		
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed XTL to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
		
	}else if(id=="contentxtr"){
		wpArr[position].xtr = value;
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed XTR to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
	}else if(id=="contentturnradius"){
		wpArr[position].trn = value;
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Turn Radius to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
	}else if(id=="contentspeed"){
		wpArr[position].speed = value;
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Speed to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());	
	}else if(id=="contentminukc"){
		wpArr[position].minukc = value;	
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Minimum UKC to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
	}else if(id=="contentlondeg"){		
		var lon = $("#contentlondeg").val() * 1 + $("#contentlonmin").val()/60.0 + $("#contentlonsec").val()/3600.0;
		wpArr[position].coordinates[0] = lon;
		
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Longitude degree to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
		
	}else if(id=="contentlonmin"){
		var lon = $("#contentlondeg").val() * 1 + $("#contentlonmin").val()/60.0 + $("#contentlonsec").val()/3600.0;		
		wpArr[position].coordinates[0] = lon;
		
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Longitude Minute to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
		
	}else if(id=="contentlonsec"){
		var lon = $("#contentlondeg").val() * 1 + $("#contentlonmin").val()/60.0 + $("#contentlonsec").val()/3600.0;
		wpArr[position].coordinates[0] = lon;	
		
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Longitude Second to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
		
	}else if(id=="contentlatdeg"){
		var lat = $("#contentlatdeg").val() * 1 + $("#contentlatmin").val()/60.0 + $("#contentlatsec").val()/3600.0;		
		wpArr[position].coordinates[1] = lat;	
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Latitude Degree to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
	}else if(id=="contentlatmin"){
		var lat = $("#contentlatdeg").val() * 1 + $("#contentlatmin").val()/60.0 + $("#contentlatsec").val()/3600.0;		
		wpArr[position].coordinates[1] = lat;
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Latitude Minute to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
	}else if(id=="contentlatsec"){
		var lat = $("#contentlatdeg").val() * 1 + $("#contentlatmin").val()/60.0 + $("#contentlatsec").val()/3600.0;		
		wpArr[position].coordinates[1] = lat;	
		ga('send', 'event', $('#authusername').val(), JSON.stringify({
			'EventType' : 'User Changed Latitude Second to '+value,
			'wayPoints':wpArr,
			'profileMethod' : $("#profilemethod").val(),
			'Date': initialSettings.getDate().toString()
		}), initialSettings.getDate().toString());
	}
	
	if(id == "contentminukc"){
		
	}else{
		showTaptoRefresh();
	}
	
	rearrangeWPMarkers();
	drawWpRoute();	
	updateXTE(wpArr);
	updateXTEMarkers(wpArr);
}

/**
 * Method to show the ship marker position when mouse over movement on UKC graph
 * @param point
 */
function showShipMarker(point){ 
	
	var lat = interpolateCoordinatesArr[point][0];
	var lon = interpolateCoordinatesArr[point][1];
	
	shipMarker.setPosition(ol.proj.transform([lat,lon], 'EPSG:4326','EPSG:900913'));	
	var positions = map.getPixelFromCoordinate(ol.proj.transform([lat,lon], 'EPSG:4326','EPSG:900913'));	
	var popupCoords = map.getCoordinateFromPixel([ positions[0] , positions[1] - $(".shipmarker").height()]);	
	var popupContent = getContent([lat,lon]);
	
	closePopup();
	showPopup(popupCoords, popupContent);
}

/**
 * Method to get the Degree Minutes and Seconds for the Latitute and Longitude
 * @param coord
 * @returns {String}
 */
function getContent(coord){        	
	 var ns =  deg_to_dms(coord[1]) + "<input type='text' value='N'>"; 
	 var ew =  deg_to_dms(coord[0]) + "<input type='text' value='W'>"; 
	 return "<span>Lat:</span>"+ns+"<br><span>Lon:</span>"+ew; 
}

/**
 * Update the waypoints markers array when the waypoint dropped in trash
 * @param pos
 */
function updateWPMarkers(pos){

	dMarker.setPosition(ol.proj.transform(map.getCoordinateFromPixel([20,20]), 'EPSG:3857','EPSG:900913'));
			
	if(pos==1){
		wpArr.splice(wpArr.length-1, 1);	
	}else if(pos>1){
		var pointer = pos-1;
		wpArr.splice(pointer, 1);
	}else{
		wpArr.splice(pos, 1);
	}
	hideTrash();
	dragStatus = false;
	drag.setActive(true);
}

/**
 * Method to re arrange the waypoints on map when a change in waypoints  properties array
 */
function rearrangeWPMarkers(){
	// Remove all waypoint markers from the map
	for(var  j = 0; j< wpMarkersArr.length;j++){
		map.removeOverlay(wpMarkersArr[j]);
	}
	
	wpMarkersArr = [];
	// create waypoint markers based upon waypoint array length
	for(var  m = 0; m< wpArr.length;m++){
		createWPMarker(m);
	}
	// set the position of each waypoint
	for(var  l = 0; l< wpArr.length;l++){
		
		if(l==0){			
			wpMarkersArr[0].setPosition(ol.proj.transform(wpArr[0].coordinates, 'EPSG:4326','EPSG:900913'));		
		}else if(l==wpArr.length-1){		
			wpMarkersArr[1].setPosition(ol.proj.transform(wpArr[wpArr.length-1].coordinates, 'EPSG:4326','EPSG:900913'));
		}else {
			wpMarkersArr[l+1].setPosition(ol.proj.transform(wpArr[l].coordinates, 'EPSG:4326','EPSG:900913'));		
		}
	}
}

/**
 * Method to draw Route line with waypoints
 */
function drawWpRoute() {
	
	if (routeLineLayer) {
		map.removeLayer(routeLineLayer);
	}
	
	if (wpArr.length > 1) {

		var points = [];

		for (var i = 0; i < wpArr.length; i++) {
			points[i] = ol.proj.transform(wpArr[i].coordinates,'EPSG:4326', 'EPSG:900913');
		}
		
		var featureLine = new ol.Feature({
			geometry : new ol.geom.LineString(points)
		});

		if (routeLineLayer) {
			map.removeLayer(routeLineLayer);
		}
		routeLineVector = new ol.source.Vector({});

		routeLineVector.addFeature(featureLine);

		routeLineLayer = new ol.layer.Vector({
			source : routeLineVector,
			updateWhileInteracting: true,
			style : new ol.style.Style({
				fill : new ol.style.Fill({
					color : '#00FF00',
					weight : 4
				}),
				stroke : new ol.style.Stroke({
					color : '#00FF00',
					width : 2
				})
			})
		});
		
		map.addLayer(routeLineLayer);
	}
	
	updateXTE(wpArr);
	updateXTEMarkers(wpArr);		
}

/**
 * Update XTE Markers
 * 1. Remove all xte markers from the map
 * 2. Create xte markers according to the waypoints length
 * 3. Update xte markers array
 * 4. Set the position on xte line left and right side for each leg
 * 5. initialize the event handlers for each xte marker
 */
function updateXTEMarkers(wpArr) {
	
	// remove all xte markers from the map
	var i = 0, length = xteMarkersArr.length;
	for (i = 0; i < length; i++) {
		map.removeOverlay(xteMarkersArr[i]);
	}

	xteMarkersArr = [];
	xteIconsArr = [];
	
	// create waypoint markers based upon waypoint array length
	
	for (var i = 0; i < wpArr.length - 1; i++) {
		
			 if(i==wpArr.length-1){
				  	var p0 = turf.point(legPointsArr[legPointsArr.length-2]);
				  	var p1 = turf.point(legPointsArr[legPointsArr.length-1]);
			  }else{				  
				  	var p0 = turf.point(legPointsArr[i * 8]);
				  	var p1 = turf.point(legPointsArr[(i * 8) + 1]);
			  }
			
			var elementl = ($('<i/>').attr("id", xteMarkersArr.length + "bm").addClass("xtemarker").get(0));
			var elementr = ($('<i/>').attr("id", xteMarkersArr.length + 1 + "bm").addClass("xtemarker").get(0));
		
		var varMarkerLeft = new ol.Overlay({
			positioning : 'bottom-left',
			element : elementl,
			stopEvent : false,
			dragging : false
		});
		var varMarkerRight = new ol.Overlay({
			positioning : 'bottom-left',
			element : elementr,
			stopEvent : false,
			dragging : false
		});

		// finally add markes to map object
		map.addOverlay(varMarkerLeft);
		map.addOverlay(varMarkerRight);
		xteMarkersArr.push(varMarkerLeft);
		xteMarkersArr.push(varMarkerRight);
		xteIconsArr.push(elementl);
		xteIconsArr.push(elementr);

		var bearing = turf.bearing(p0, p1);
		var midpoint = turf.midpoint(p0, p1), 
		left = turf.midpoint(p0, midpoint), 
		right = turf.midpoint(midpoint, p1);

		var leftCoords = turf.destination(left, wpArr[i].xtl, bearing - 90,'kilometers');
		varMarkerLeft.setPosition(ol.proj.transform(leftCoords.geometry.coordinates, 'EPSG:4326', 'EPSG:900913'));
		var rightCoords = turf.destination(right, wpArr[i].xtr, bearing + 90,'kilometers');
		varMarkerRight.setPosition(ol.proj.transform(rightCoords.geometry.coordinates, 'EPSG:4326', 'EPSG:900913'));
	}
	
	var classname = document.getElementsByClassName("xtemarker");
	for (var l = 0; l < classname.length; l++) {
		var dragger_ = new ol.pointer.PointerEventHandler(classname[l]);
		ol.events.listen(dragger_, ol.pointer.EventType.POINTERDOWN,handleXTEDraggerStart_);
		ol.events.listen(dragger_, ol.pointer.EventType.POINTERMOVE,handleXTEDraggerDrag_);
	}	
}
/**
 * Metod to handle the xte marker drag event
 * @param evt
 * @param positions
 */
function xteMarkerDrag(evt,positions) {
	
	createXTEMarkerTooltip();
	var isLeft;
	if(positions % 2 == 0)
	{
		isLeft = true;		
	}
	else
	{
		isLeft = false;
	}
	
	var position = Math.floor(positions/2);
	var markerposition = turf.point(ol.proj.transform(evt.coordinate,'EPSG:900913', 'EPSG:4326'));
	var p0,p1;
	
	  if(position==wpArr.length-1){
		  	p0 = turf.point(legPointsArr[legPointsArr.length-2]);
		  	p1 = turf.point(legPointsArr[legPointsArr.length-1]);
	  }else{				  
		  	p0 = turf.point(legPointsArr[position * 8]);
		  	p1 = turf.point(legPointsArr[(position * 8) + 1]);
	  }
	   
    var midPoint = turf.midpoint(p0, p1),
       startPoint = isLeft ? turf.midpoint(p0, midPoint) : turf.midpoint(midPoint, p1),
       bearing = turf.bearing(p0, p1) + (isLeft ? -90 : 90),
       pMax = turf.destination(startPoint, 1.5, bearing, 'kilometers'),
       pMin = turf.destination(startPoint, 0.10, bearing, 'kilometers'),
       ls = pointArrayToLinestring([pMax, pMin]),
       poss = turf.pointOnLine(ls, markerposition);
       var distance = Math.round(turf.distance(poss, startPoint)* 100) / 100;
       
    if (isLeft) {
    	wpArr[position].xtl = distance;
    	if($("#contentxtl").length>0){
    		$("#contentxtl").val(distance);
    	}
    	}    
    else {
    	wpArr[position].xtr = distance;
    	if($("#contentxtr").length>0){
    		$("#contentxtr").val(distance);
    	}
    }
    	 xteMarkersArr[positions].setPosition(ol.proj.transform(poss.geometry.coordinates,'EPSG:4326', 'EPSG:900913'));	
    	 xteTooltipDiv.innerHTML = distance + " km";
 		 xteTooltip.setPosition(ol.proj.transform(poss.geometry.coordinates,'EPSG:4326', 'EPSG:900913'));
    	 updateXTE(wpArr);
}

/**
 * Update Xte based on turn radius for the respective waypoint
 * 
 */
function updateXTE(wpArr) {
	
	if (xteLayer) {
  		map.removeLayer(xteLayer); 		
  	}
	
	if (journeyLineLayer) {
  		map.removeLayer(journeyLineLayer); 		
  	}

    legsArr.length = 0;
  	
    for(var i=0; i<wpArr.length - 1; i++) {
     
    	var p0 = turf.point(wpArr[i].coordinates);
	    var p1 = turf.point(wpArr[i+1].coordinates);
	    var m2 = wpArr[i+2];
	    var bearing0 = turf.bearing(p0, p1);
	    legsArr.push([]);

      if(i == 0)
        legsArr[i].push(p0);     	
      else {
        legsArr[i].push(legsArr[i - 1][legsArr[i - 1].length-2]);
        p0 = legsArr[i - 1][legsArr[i - 1].length-2];
      }

      // Need at least 3 points to get the curve
      // Curve is based on Point 1's turn radius
      if(m2) {
        p2 = turf.point(m2.coordinates);
        bearing1 = turf.bearing(p1, p2);
        var cp;

        if(wpArr[i].trn > 0.0) cp = getCirclePoints([p0, p1, p2], [bearing0, bearing1], wpArr[i].trn);
        else cp = [p1];
        legsArr[i] = legsArr[i].concat(cp);
        legsArr[i].push(p2);
        
      } else {
        legsArr[i].push(p1);
      }       
    }
        
	  if(wpArr.length>1){
		  
		  legPointsArr = [];
		  legsLineArr = [];
		  journeyLinePoints = [];
		  
		  for (var int = 0; int < legsArr.length; int++) {
			  
			for (var int2 = 0; int2 < legsArr[int].length; int2++) {
				
				if(legsArr[int].length==9 && int2 == 8){					
				}else{
					var coordinate = ol.proj.transform(legsArr[int][int2].geometry.coordinates,'EPSG:4326', 'EPSG:900913');
					legPointsArr.push(legsArr[int][int2].geometry.coordinates);
					journeyLinePoints.push(coordinate);	
				}							
			 }												
		  }
			  
		  if(journeyLinePoints.length == 2){				  		  
				  legsLineArr.push(legPointsArr);
			  }else {
				
				  for(var p = 0; p < legsArr.length;p++){
					  
					  var pointsArr = [];
					  if(p==0){
						  for (var int2 = 0; int2 < 5; int2++) {
							  pointsArr.push(legPointsArr[int2]);
						  }
					  }else if(p==legsArr.length-1){
						  for (var int2 = legPointsArr.length-6; int2 < legPointsArr.length; int2++) {
							  pointsArr.push(legPointsArr[int2]);
						  }
					  }else{
						  for (var int2 = ( p * 8 ) - 4 ; int2 <= ( p * 8 ) + 4; int2++) {
							  pointsArr.push(legPointsArr[int2]);
						  }
					  }
					  		legsLineArr.push(pointsArr);		 
				  }				   
			  }
	
		  var featureLine = new ol.Feature({
				geometry : new ol.geom.LineString(journeyLinePoints)
			});
		  
			journeyLine = new ol.source.Vector({});
			journeyLine.addFeature(featureLine);

			journeyLineLayer = new ol.layer.Vector({
				source : journeyLine,
				updateWhileInteracting: true,
				style : new ol.style.Style({
					fill : new ol.style.Fill({
						color : '#0000FF',
						weight : 4
					}),
					stroke : new ol.style.Stroke({
						color : '#0000FF',
						width : 2
					})
				})
			});
			map.addLayer(journeyLineLayer);	
	  }
    
    if(wpArr.length > 1) {
      xtePolygons = getXTEPolygons(legsArr);
    }
    else
      xtePolygons = null;
  
    if(xtePolygons) {
      var geo = turf.merge(turf.featurecollection(xtePolygons));
      var features = new ol.format.GeoJSON().readFeatures(geo);
    
    if (xteLayer) {
  		map.removeLayer(xteLayer);
  	}
    
    xteVector = new ol.source.Vector({});
  	xteVector.addFeatures(features);
  	
    xteLayer = new ol.layer.Vector({
		source : xteVector,
		updateWhileInteracting: true,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(72,72,72,0.3)',
				weight : 0
			}),
			stroke : new ol.style.Stroke({
				color : '#FF0000',
				width : 2
			})
		})
	});    
		map.addLayer(xteLayer);
    }
  }

/**
 * Get leg polygons to merge as a single xte polygon
 * @param legsArr
 * @returns {Array} XTE Ploygons
 */
function getXTEPolygons(legsArr){
	
	var returnedPolys = []; 
	xteVector = new ol.source.Vector({});
    for(var i=0; i<legsArr.length; i++) {
		      
		      // Each section has a number of points
		      var s = legsArr[i];
		      tmpLegsArr = [];
		      for(var j=0; j<s.length-1; j++) {
		        var p0 = s[j],
		            p1 = s[j + 1],
		            bearing = turf.bearing(p0, p1);
		        
		        if(j > 6) {
		          p1 = turf.destination(p0, 0.02, bearing, 'kilometers');
		        }

		        var polygon = turf.polygon([[ol.proj.transform(p0.geometry.coordinates,'EPSG:4326', 'EPSG:900913'),		                                     
		                                     ol.proj.transform(turf.destination(p0, wpArr[i].xtr, bearing + 90, 'kilometers').geometry.coordinates,'EPSG:4326', 'EPSG:900913'),
			                                 ol.proj.transform(turf.destination(p1, wpArr[i].xtr, bearing + 90, 'kilometers').geometry.coordinates,'EPSG:4326', 'EPSG:900913'),
			                                 ol.proj.transform(turf.destination(p1, wpArr[i].xtl, bearing - 90, 'kilometers').geometry.coordinates,'EPSG:4326', 'EPSG:900913'),
			                                 ol.proj.transform(turf.destination(p0, wpArr[i].xtl, bearing - 90, 'kilometers').geometry.coordinates,'EPSG:4326', 'EPSG:900913'),
			                                 ol.proj.transform(p0.geometry.coordinates,'EPSG:4326', 'EPSG:900913'),
			                                 ol.proj.transform(p0.geometry.coordinates,'EPSG:4326', 'EPSG:900913')
			                                ]]);			   
		        tmpLegsArr.push(polygon);
		      }				
			  var toToBuffered = turf.linestring(s.map(function(coord) {return _pointToLngLat(coord); }));	
			  var buffered = turf.buffer(toToBuffered, 5000, 'kilometers'),
		          merged = turf.merge(turf.featurecollection(tmpLegsArr)),
		          points = turf.within(turf.featurecollection(polygonToPointArray(merged)), buffered),
		          final = coordinateDifference(polygonToPointArray(merged), points.features);
		      	  returnedPolys.push(pointArrayToPolygon(final));
    }
	   		return returnedPolys;
}

/**
 * Method to get Circular points between two points with turn angle and bearing
 * @param points
 * @param bearings
 * @param radius
 * @returns {Array}
 */
function getCirclePoints(points, bearings, radius) {

    var d = Math.min(turf.distance(points[1], points[0], 'kilometers'),
        turf.distance(points[1], points[2], 'kilometers')),
        a = bTa(bearings[0]),
        b = bTa(bearings[1]),
        angle = _angleDiff(a, b) / 2,
        maxR = d * Math.sin(angle * (Math.PI / 180)) * 0.95,
        radius = radius < maxR ? radius : maxR,
        length = radius / Math.sin(angle * (Math.PI / 180)),
        // Is the end point to the left or right of the bearing between the first two
        leftOrNot = isLeft(turfToLatLng(points[0]), turfToLatLng(points[1]), turfToLatLng(points[2])),
        circleBearing = leftOrNot ? aTb(b - angle) : aTb(b + angle),
        cc = turf.destination(points[1], length, circleBearing, 'kilometers'),
        circleAngle = aTb(bTa(circleBearing) + 180 % 360),
        left = circleAngle - (90 - (angle)),
        right = circleAngle + (90 - (angle));

    if (!leftOrNot) {
        var temp = left;
        left = right;
        right = temp;
    }

    // Circle points
    return [turf.destination(cc, radius, left, 'kilometers'),
        turf.destination(cc, radius, left + ((circleAngle - left) / 3), 'kilometers'),
        turf.destination(cc, radius, left + ((2 * (circleAngle - left)) / 3), 'kilometers'),
        turf.destination(cc, radius, circleAngle, 'kilometers'),
        turf.destination(cc, radius, right + ((2 * (circleAngle - right)) / 3), 'kilometers'),
        turf.destination(cc, radius, right + ((circleAngle - right) / 3), 'kilometers'),
        turf.destination(cc, radius, right, 'kilometers')];
}

/**
 * Method to create tooltip for measured xte value
 * Add tooltip popup to map
 */
function createXTEMarkerTooltip() {
	if (xteTooltipDiv) {
		xteTooltipDiv.parentNode.removeChild(xteTooltipDiv);
	}
	
	xteTooltipDiv = document.createElement('div');
	xteTooltipDiv.className = 'tooltip tooltip-measure';
	xteTooltip = new ol.Overlay({
		element : xteTooltipDiv,
		offset : [ 5, -35 ],
		positioning : 'bottom-center'
	});
	map.addOverlay(xteTooltip);
}

/**
 * Method to get Depth and Tide Profile based on the inut params passing
 * @Params
 * 1. Waypoints {Array} 
 * 2. Station Name {String}
 * 3. Profile Method {String}
 * 4. Split Interval {Number}
 * 5. LegsLine Array Geometry Coordinates {Array}
 * 6. Buffer Polygon Geometry Coordinates {Array}
 * 7. Present Time with the format YYYY-MM-DD[T]HH:mm:ss.SSS[Z]
 */
	
function getDepthAndTideProfile(wpArr){
	if(wpArr.length>1){
	if(initialSettings.getDate() != ""){
	hideLongRouteForm();	
	var stationName;
	if($("#stationname").val()){
		stationName = $("#stationname").val();
	}
	if(stationName){
		
	}else{
		stationName = "";
	}
	
	var profileMethod;
	if($("#profilemethod").val()){
		profileMethod = $("#profilemethod").val();
	}
	
	if(profileMethod){
		
	}else{
		profileMethod = "";
	}
	
	var format = new ol.format.GeoJSON();
	var xteFeatures = format.writeFeatures(xteLayer.getSource().getFeatures(),{
	        featureProjection: 'EPSG:3857',dataProjection:'EPSG:4326'
	    });				
	var xteCoordinates = JSON.parse(xteFeatures).features[0].geometry.coordinates;
	//SPLIT_INTERVAL = ($(window).width())/(wpArr.length-1);
	
	var ext = routeLineLayer.getSource().getExtent();
	
	var transformedExt =  ol.proj.transformExtent([ext[0] - 2000 , ext[1] - 2000, ext[2] + 2000, ext[3] + 2000], 'EPSG:900913', 'EPSG:4326');
	
	var parametersObj = {
			wayPointsDtos: wpArr,
			stationName : stationName,
			profileMethod : profileMethod,
			splitCount: SPLIT_INTERVAL,
			legsArr: legsLineArr,
			xtePolygon: xteCoordinates,
			presentTime : initialSettings.getDate(),
			//2017-07-11T06:32:37.156Z	
			/*aoi:{ "north":$("#upperleft").val().split(",")[0],
				 "south":$("#lowerright").val().split(",")[0],
				 "east":$("#lowerright").val().split(",")[1],
				 "west":$("#upperleft").val().split(",")[1]
				}	*/	
			aoi:{ "north":transformedExt[3],
				 "south":transformedExt[1],
				 "east":transformedExt[2],
				 "west":transformedExt[0]
				}
		};
	
	var date = new Date();
		console.log("start"+date);
		addloading();
		
		var logdata={
				'EventType':'Tap to Refresh Clicked',
				'profileMethod' : profileMethod,
	    		'Date': initialSettings.getDate().toString()
				/*'route' : journeyLine,*/
		};
		ga('send', 'event', $('#authusername').val(), JSON.stringify(logdata)+", waypoint array:"+JSON.stringify(wpArr), initialSettings.getDate().toString());
		
		$.ajax({		
			dataType: 'json',
			type: 'POST',
			url: "finddepthprofilewithtideheights",			
			data : JSON.stringify(parametersObj),			
			contentType : 'application/json',
			
	        mimeType : 'application/json',
			success : function(response) {
				if(response.status == 0) {
					jAlert(response.message);
					removeloading();
				}
				else { 
					var date = new Date();
					console.log("end"+date);
					//console.log("Station Id : "+response.stationId);
					$("#stationId").html("<b>Tidal StationId <br/> </b>"+response.stationId);
					for(var i = 0; i< response.features.length;i++)
					if(response.features[0].properties.shipwreck == 1) {
					}
					removeloading();
					IsWpDragged = false;
					displayUKCGraph(response);
					displayTideGraph(response);	
			   }	
			},
			failure : function(response) {
				if(response.status == 500) {
					jAlert("Tidal Server error while fetching Tidal Heights");
					removeloading();
				}
				else {
					jAlert(response.responseText);
					removeloading();
				}
			},
			error : function(response) {
				if(response.status == 500) {
					jAlert("Tidal Server error while fetching Tidal Heights");
					removeloading();
				}else if(response.status == 404) {
					jAlert("Tidal Station not found");
					removeloading();
				}else if(response.status == 400) {
					jAlert("Invalid duration or interval or too many predictions requested");
					removeloading();
				}else if(response.status == 405 || response.status == 200){
					//session expired
					jCustomConfirm('Your session expired, Please Sign In again','Sign In', function(confirmed){
  					  if(confirmed){
  						  window.location.href="displaylogin.htm";
  					  }
  				});
					
				}
				else {
					jAlert(response.responseText);
					removeloading();
				}
			}
	});
	}else{
		jAlert("Please select a valid date");
	}		
	}else{
		jAlert("Add atleast two Waypoints on Map");
	}	
}

var initialSettings = {
	// Get Geoserver URL
	gisServerUrl : function(){
		return $("#geoserverUrl").val();
	},
	// get Geoserver Workspace name
	gisWorkSpaceName : function(){
		return $("#geoserverWorkspace").val();
	},
	// get depth layer name
	depthLayer : function(){
		return $("#geoserverDepthPointLayer").val();
	},
	// get backdrop layer name
	backDropLayer: function(){
		return $("#geoserverBackdropLayer").val();
	},
	// Layout calculation for map,ukcgraph, date, tidegraph
	initLayOut : function(){
		 var obj={ 
	     windowHeight : $(window).height(),
		 windowWidth : $(window).width(),
		 mapHeight : $(window).height() * 56 / 100,
		 ukcGraphHeight : $(window).height() * 25 / 100,
		 dateWindowHeight : $(window).height() * 7 / 100,
		 tideGraphHeight : $(window).height() * 12 / 100		 
		 };
		 return obj;
	},
	// Apply styles for layout
	initStyles : function(){
		$("#mapdiv").css({"height": this.initLayOut().mapHeight,"top": 0});
		$("#ukcgraphdiv").css({"height": this.initLayOut().ukcGraphHeight,"top": this.initLayOut().mapHeight});
		$("#taptorefreshdiv").css({"height": this.initLayOut().ukcGraphHeight,"top": this.initLayOut().mapHeight});	
		$("#datepickerdiv").css({"height": this.initLayOut().dateWindowHeight,"top": this.initLayOut().mapHeight+this.initLayOut().ukcGraphHeight-10});
		$("#tidegraphpdiv").css({"height": this.initLayOut().tideGraphHeight,"top": this.initLayOut().mapHeight+this.initLayOut().ukcGraphHeight + this.initLayOut().dateWindowHeight});
		$("#tidegraphdiv").css({"height": this.initLayOut().tideGraphHeight});
		$("#tideerrordiv").css({"height": this.initLayOut().tideGraphHeight,"top": this.initLayOut().mapHeight+this.initLayOut().ukcGraphHeight + this.initLayOut().dateWindowHeight});
		$("#journeyspan").css({"height": this.initLayOut().tideGraphHeight - 10});
		$("#ukcgraphdiv").css({"height": this.initLayOut().ukcGraphHeight,"top": this.initLayOut().mapHeight});
		$("#starttime").css("top", this.initLayOut().mapHeight);
		$("#laponetime").css("top", this.initLayOut().mapHeight);
		$("#laptwotime").css("top", this.initLayOut().mapHeight);
		$("#endtime").css("top", this.initLayOut().mapHeight);
		$("#laponeline").css("top", this.initLayOut().mapHeight);
		$("#laptwoline").css("top", this.initLayOut().mapHeight);
		$("#stationId").css({"height": 30,"top": this.initLayOut().mapHeight+this.initLayOut().ukcGraphHeight+this.initLayOut().dateWindowHeight-5,"position":"absolute","right":5});
	},
	// adjust trash radius size in medium and small devices
	initDeviceAdj: function(){
		if(this.initLayOut().windowWidth < 770){
			TRASH_RADIUS = 50;
		} 
	},
	// initialize the combodate
	initDate: function(){
	var comboDate = $("#datetime24");
		comboDate.combodate({
		    minYear: 2014,
		    maxYear: 2018,
		    minuteStep: 1,
		    firstItem: "none",
		    smartDays: true,
		    errorClass : null
		    });
		return comboDate;
	},
	// set current time to combodate
	setDate : function(date){
		this.initDate().combodate("setValue", date);	
	},
	//get time from the combodate
	getDate: function(){
		return this.initDate().combodate("getValue", 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');	
	},
	init : function(){
		this.initLayOut();
		this.initStyles();
		this.initDeviceAdj();
		this.initDate();
		this.setDate(new Date());
	}
};
// Set date change event handler
var dateService = {	
	initOnDateChange : function(){		
		$(".combodate").delegate('select', "change", function() {
		      ga('send', 'event', $('#authusername').val(), JSON.stringify({
		    		'EventType' : 'Journey start time changed in Date field',
		    		'ProfileMethodValue' : $('#profilemethod').val(),
		    		'wayPoints': wpArr,
		    		'Date': initialSettings.getDate().toString()
		      }), initialSettings.getDate().toString());
			showTaptoRefresh();	
		});
		$("#taptorefreshdiv").on('click', function() {
				  	getDepthAndTideProfile(wpArr);			
		});
	}
};
// map service to manage map object and wms layers
var mapService = {
		init : function(){		
			map = new ol.Map({
		        target: 'mapdiv',
			    interactions: ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false}), // disable map rotation
		        view: new ol.View({
		          center: [0, 0],
		          zoom: 4
		        })
		      });
		},		
		addWMSLayer : function(layerName){
			var layer = new ol.layer.Tile({
				preload : Infinity,
				visible : true,
				source : new ol.source.TileWMS(({
					url : initialSettings.gisServerUrl(),
					crossOrigin : 'anonymous',
					params : {
						'LAYERS' : initialSettings.gisWorkSpaceName() + ':' + layerName,
						'TILED' : true
					},
					serverType : 'geoserver'
				}))
			});
			map.addLayer(layer);
		}
};

//------------- utilities ------------------//
/**
 * Method to convert degree to Degrees minutes and seconds
 */
function deg_to_dms(deg){
	   var d = Math.floor(deg);
	   var minfloat = (deg-d)*60;
	   var m = Math.floor(minfloat);
	   var secfloat = (minfloat-m)*60;
	   var s = Math.round(secfloat);
	   if (s==60) {
	     m++;
	     s=0;
	   }
	   if (m==60) {
	     d++;
	     m=0;
	   }
	   return ("<input type='text' value='" + d + "'>&#176; <input type='text' value='" + m + "'>' <input type='text' value='" + s + "'>''");
}

/**
 * Method to convert Latitude Degree to Degree Minutes Seconds
 * @param deg
 * @returns {String}
 */
function deg_to_dms_lat(deg){
	   var d = Math.floor(deg);
	   var minfloat = (deg-d)*60;
	   var m = Math.floor(minfloat);
	   var secfloat = (minfloat-m)*60;
	   var s = Math.round(secfloat);
	   if (s==60) {
	     m++;
	     s=0;
	   }
	   if (m==60) {
	     d++;
	     m=0;
	   }
	   return ("<input type='number' id='contentlatdeg' onblur='return latDegValidation(this.value,\"contentlatdeg\")' value='" + d + "' min='0' max='89'>&#176; <input type='number' id='contentlatmin' onblur=' return latMinValidation(this.value,\"contentlatmin\") ' value='" + m + "' min='0' max='59'>' <input type='number' id='contentlatsec' onblur=' return latSecValidation(this.value,\"contentlatsec\")' value='" + s + "' min='0' max='59.99'>'' <input type='text' value='N' id='latdirection' disabled>");
}

/**
 * Method to convert Longitude Degree to Degree Minutes Seconds
 * @param deg
 * @returns {String}
 */
function deg_to_dms_lon(deg){
	   var d = Math.floor(deg);
	   var minfloat = (deg-d)*60;
	   var m = Math.floor(minfloat);
	   var secfloat = (minfloat-m)*60;
	   var s = Math.round(secfloat);
	   if (s==60) {
	     m++;
	     s=0;
	   }
	   if (m==60) {
	     d++;
	     m=0;
	   }
	   return ("<input type='number' id='contentlondeg' onblur=' return lonDegValidation(this.value,\"contentlondeg\")' value='" + d + "' min='-179' max='179'>&#176; <input type='number' id='contentlonmin' onblur=' return lonMinValidation(this.value,\"contentlonmin\")' value='" + m + "' min='0' max='59'>' <input type='number' id='contentlonsec' onblur=' return lonSecValidation(this.value,\"contentlonsec\")' value='" + s + "' min='0' max='59.99'>'' <input type='text' value='W' id='londirection' disabled>");
}

/**
 * Method to convert bearing to angle
 * @param b
 * @returns {Number}
 */

function bTa(b) {
    return (450 - b) % 360;
}

/**
 * Method to convert angle to bearing
 * @param a
 * @returns {Number}
 */
function aTb(a) {
    a = a % 360;
    return (a > 90 && a <270) ? -(180 - (450 - a) % 180) : (450 - a) % 180;
}

/**
 * Method to get coordinates from the feature
 * @param p
 * @returns {Array}
 */
function turfToLatLng(p) {
    return [p.geometry.coordinates[1], p.geometry.coordinates[0]];
}
/**
 * Method to find whether the point c is left of a,b 
 * @param a point
 * @param b point
 * @param c point
 * @returns {Boolean} true if it is in left else returns false
 */
function isLeft(a, b, c) {
    return ((b[0] - a[0])*(c[1] - a[1]) - (b[1] - a[1])*(c[0] - a[0])) > 0;
}
/**
 * Method to calculate angle between two points
 * @param a1
 * @param a2
 * @returns {Number} Angle
 */
function _angleDiff(a1, a2) {
    return Math.abs(180 - Math.abs(a2 - a1));
}

/**
 * Method to transform EPSG:4326 to EPSG:900913
 * @param p
 * @returns
 */
function _pointToLngLat(p) {
        return ol.proj.transform(p.geometry.coordinates,'EPSG:4326', 'EPSG:900913');
}

/**
 * Method to convert polygon geometry to points
 * @param polygon
 * @returns array of points
 */
function polygonToPointArray(polygon) {
    return polygon.geometry.coordinates[0].map(function(coord) {
        return turf.point([coord[0], coord[1]]);
    });
}

/**
 * Method to convert points to polygon
 * @param points
 * @returns ploygon geometry
 */
function pointArrayToPolygon(points) {
    points.push(points[0]);
    return turf.polygon([points.map(function(p) {
        return p.geometry.coordinates;
    })]);
}

/**
 * Method to convert points to linestring
 */
var pointArrayToLinestring = function(points) {
    return turf.linestring(points.map(function(p) {
        return p.geometry.coordinates;
    }));
};

/**
 * Method to calculate difference between to coordinates
 * @param a
 * @param b
 * @returns {Array}
 */
function coordinateDifference(a, b) {
    var result = [];
    for (var i = 0; i < a.length; i++) {
      var found = false;
      for (var j = 0; j < b.length; j++) {
        if(turfToLatLng(a[i])[0] == turfToLatLng(b[j])[0]) {
          found = true;
        }
      }
      if(!found) result.push(a[i]);
    }
    return result;
}
/**
 * Method Clear the plotted route on the map
 */
function clearRoute(){
	if(wpArr.length>1){
	//confirmation dialouge while clearing the route
	jConfirm('Are you sure you want Clear Route?','Clear Route', function(confirmed){
		  if(confirmed){
			 wpArr = [];
			 rearrangeWPMarkers();
			 drawWpRoute();
			 updateXTE(wpArr);
			 showTaptoRefresh();
		  }
	});
	}
	else{
		jAlert("No Route Found to clear", "Clear Route");
	}
}