function validateRTZFile() {
	
	$("#taptorefreshdiv").css("display", "block");
	var fileName = document.getElementById('rtzFile').value;
	
	if(fileName == "") {
		fileName = document.getElementById('mrtzFile').value;	
	}
	
	var rtzRegExp = /([a-zA-Z0-9\s_\\.\-:])+(.rtz|.RTZ|.rtzp)$/;

	if (rtzRegExp.test(fileName) == false) {
		jAlert('Upload rtz / rtzp file only');
	} else {

		var data = new FormData();
		var filedata = document.getElementById('rtzFile').files[0];
		
		if(filedata == undefined) {
			filedata = document.getElementById('mrtzFile').files[0];
		}
		data.append('datafile', filedata);

		$.ajax({
			type : 'POST',
			url : "rtzwaypoints",
			dataType : 'json',
			data : data,
			cache : false,
			contentType : false,
			processData : false,
			async : false,
			success : function(response) {
				if(response[0].status == 1) {
					jAlert(response[0].lineDetails +"\n"+response[0].message);
				}
				else {
					for (var i = 0; i < wpMarkersArr.length; i++) {
						wpMarkersArr[i].setPosition(undefined);
					}
	
					wpArr = [];
					wpMarkersArr = [];
						
					if (response.length >= 1) {
						for (var index = 0; index < response.length; index++) {
							var pointobject = {
								'coordinates' : [ response[index].lat,
										response[index].lon ],
								'speed' : response[index].speed,
								'trn' : response[index].radius,
								'xtl' : response[index].xtl,
								'xtr' : response[index].xtr,
								'minukc' : 0
							}
							wpArr.push(pointobject);
						}
						for (var index = 1; index < response.length; index++) {
							createWPMarker(index);
						}
					}
					rearrangeWPMarkers();
					drawWpRoute();
					updateXTE(wpArr);
					updateXTEMarkers(wpArr);
					slideing();
					var ext = routeLineLayer.getSource().getExtent();
					map.getView().fit(ext, map.getSize());
					
					ga('send', 'event', $('#authusername').val(), JSON.stringify({
						'EventType' : 'RoutePlot Through RTZ file',
						'FileName' : fileName,
						'wayPoints':wpArr,
			    		'Date': initialSettings.getDate().toString()
					}), initialSettings.getDate().toString());
				}
			},
			failure : function(response) {
				jAlert("Error in getting Waypoints from RTZ File");
			},
			error : function(response) {
				jAlert("Error in getting Waypoints from RTZ File");
			}
		});
	}
}

function longRouteOn(){
	if(longRouteStatus){
		longRouteOff();
		if(wpArr.length>1){
			updateXTE(wpArr);
			updateXTEMarkers(wpArr);
			var ext = routeLineLayer.getSource().getExtent();
			map.getView().fit(ext, map.getSize());
			showTaptoRefresh();
		}
	}else{
		if(wpArr.length>1){
			longRouteStatus = true;
			$("#longroute").css("display","block");	
			$("#longrouteicon").css("background-color","rgba(255, 10, 0, 1)");
			$("#startwaypoint").html(generateWaypointOptionNumbers());
			$("#endwaypoint").html(generateWaypointOptionNumbers());
			$("#endwaypoint").val(wpArr.length-1);
			calculateDistance(1);
		}
		else{
			jAlert("Add atleast two Waypoints on Map");
		}
	}	
}

function hideLongRouteForm(){
	resetFields();
	$("#longroute").css("display","none");
}

function longRouteOff(){	
	longRouteStatus = false;
	$("#longrouteicon").css("background-color","rgba(0, 60, 136, .5)");
	hideLongRouteForm();
}

function generateWaypointOptionNumbers(){
	var i = 1, length = wpArr.length -1, text = "<option value='none'>-</option><option value='0' selected='selected'>S</option>";
	for(i = 1; i<length; i++ ){
		text+= "<option value='"+i+"'>"+i+"</option>";
	}
	text+= "<option value='"+length+"'>D</option>";
	return text;
}

function calculateDistance(value){
	var startpoint = $("#startwaypoint").val();
	var endpoint =  $("#endwaypoint").val();
	if(value != "none"){
	if(startpoint!="none" && endpoint!="none" ){
		if(startpoint<endpoint){
			var distance = 0;
			for(var i = parseInt(startpoint); i < parseInt(endpoint); i++){
				distance+= turf.distance(turf.point(wpArr[i].coordinates),turf.point(wpArr[i+1].coordinates),'kilometers') * 0.539957 ;
			}
		}else if(startpoint == endpoint){
			jAlert("Start and End Destination are same");
			 resetFields();
		}else{
			jAlert("Start point value must be less than endpoint");
			 resetFields();
		}
			
	$("#distance").val(distance.toFixed(2));
	}else if(startpoint=="none"){
		if(parseFloat($("#distance").val())>0)
		calculateStartWaypoint();
	}else if(endpoint == "none"){
		if(parseFloat($("#distance").val())>0)
		calculateEndWayPoint();
	}
  }
}

function calculateStartWaypoint(){
	var startpoint = $("#startwaypoint").val();
	var endpoint =  $("#endwaypoint").val();
	var distance = 0;
	var waypointnotfound = true;
	for(var i = parseInt(endpoint); i > 0; i--){
			distance+= turf.distance(turf.point(wpArr[i].coordinates),turf.point(wpArr[i-1].coordinates),'kilometers') * 0.539957;
			if(parseFloat($("#distance").val()) <= distance.toFixed(2))
			{
				if(i == parseInt(endpoint))
					$("#startwaypoint").val(i-1);
				else
					$("#startwaypoint").val(i);
				waypointnotfound = false;
				break;
			}
	}
	
	if(waypointnotfound){
		 resetFields();
		 jAlert("No waypoint found with the given distance");
	}	
}

function calculateEndWayPoint(){
	var startpoint = $("#startwaypoint").val();
	var endpoint =  $("#endwaypoint").val();
	var distance = 0;
	var waypointnotfound = true;
	for(var i = parseInt(startpoint); i < wpArr.length-1 ; i++){
			distance+= turf.distance(turf.point(wpArr[i].coordinates),turf.point(wpArr[i+1].coordinates),'kilometers') * 0.539957;
			if(parseFloat($("#distance").val()) <= distance)
			{
				if(i == parseInt(startpoint))
					$("#endwaypoint").val(i+1);
				else	
					$("#endwaypoint").val(i);
				waypointnotfound = false;
				break;
				
			}
		}
	
	if(waypointnotfound){
		 resetFields();
		jAlert("No waypoint found with the given distance");
	}	
}

function calculateWayPoints(){
	if(parseFloat($("#distance").val())>0){
	if($("#startwaypoint").val()=="none"){
		if($("#endwaypoint").val()!="none")
		calculateStartWaypoint()
	}else {
		calculateEndWayPoint();
	}
  }
}
function resetFields(){
	$("#startwaypoint").val("none");
	$("#endwaypoint").val("none");
	$("#distance").val("");
}

function findLongRouteDepthProfile(){
	var startpoint = $("#startwaypoint").val();
	var endpoint =  $("#endwaypoint").val();
	var distance = parseFloat($("#distance").val());
	lwpArr = [];
	if(startpoint!="none" && endpoint!= "none" && distance > 0){
		
		for (var int = parseInt(startpoint); int <= parseInt(endpoint); int++) {
			lwpArr.push(wpArr[int]);
		}
		
		updateXTE(lwpArr);
		removeXTEMarkers();
		var ext = routeLineLayer.getSource().getExtent();
		map.getView().fit(ext, map.getSize());
		getDepthAndTideProfile(lwpArr);
		
	}else{
		jAlert("Please select any two parameters");
	}
}
function removeXTEMarkers(){
	// remove all xte markers from the map
	var i = 0, length = xteMarkersArr.length;
	for (i = 0; i < length; i++) {
		map.removeOverlay(xteMarkersArr[i]);
	}

	xteMarkersArr = [];
	xteIconsArr = [];
}