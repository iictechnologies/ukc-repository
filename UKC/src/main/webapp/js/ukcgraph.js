var ukcGraph;
var minDepth;
var startTimeInMin,journeyTimeInMin;
var lapOneTime;
var lapTwoTime;
var tooltipDraughtHeight, tooltipDraughtWidth;
var UKCGraphTickInterval;
var intermediateWPPlotLines = [];
var interpolateQualityArr = [], interpolateCoordinatesArr = [], interpolateTimeArr = [];
var staticDraughtArr = [], safetyMarginArr = [],breachLineArr = [], dynamicMotionsArr = [], minimumUKCArr = [], tooltipminUKCArr =[] ,tooltipStaticDraughtValue = 0, tooltipSafetyMarginValue = 0, tooltipDynamicMotionsValue = 0, minimuUKCPresentinFactors = false;
var intWpPlotIndexArr=[];
var ukcDepthSeriesArr = [];
var wreckSeriesArr = [];
var depthColor = "rgba(138, 66, 15, 1)";
var tootltipAreaColor = 'rgba(240, 240, 240, 1)';
var staticDraughtColor = 'rgba(124, 119, 119, 1)';
var dynamicMotionsColor = 'rgba(195, 195, 195, 1)';
var SafetyMarginColor = "rgba(255, 134, 20, 1)";
var minimumUKCColor = 'rgba(141, 215, 247, 0.2)';
var chartBackgroundColor = 'rgba(74, 120, 199, 1)';
var intWpPlotLineColor = "rgba(255, 255, 0, 1)";
var breachColor = "rgba(255,0,0,1)";
var tickLineColor = 'rgba(25, 127, 7, 1)';
var ukcArray = [];
var totalFactorsValue = 0;
var wreckWidth = 32, wreckHeight = 64;

$(function(){
/**
 * UI Adjustments of Tooltip area Height
 */	
	if($(window).width() > 320 && $(window).width() < 780) {
		tooltipDraughtWidth = 28;
		wreckWidth = 24;
		wreckHeight = 48;
	}
	else if($(window).width() > 990 && $(window).width() < 1370) {
		tooltipDraughtWidth = 35;
	}
	else {
		tooltipDraughtWidth = 47;
	}
	
	if($(window).height() > 1100 && $(window).height() < 1200) {
		tooltipDraughtWidth = 60;
	}
	
	if($(window).height() > 900 && $(window).height() < 950 && $(window).width() > 1200 && $(window).width() < 1300) {
		tooltipDraughtWidth = 47;
	}
	
});

/**
 * Method to create UKC Graph 
 * @param response
 */
function displayUKCGraph(response){
	
	depthProfile = response;					
	generateUKCDepthSeriesY(response);
	generateWreckSeriesArr(response);
	generateQualityValue(response);
	generateCoordinates(response);		
	generateTimeSeriesX(response);			
	generateExtremesAndTickInterval();
	
	lapOneTime = Math.round(interpolateTimeArr.length/3);
	lapTwoTime = Math.round(interpolateTimeArr.length * 2/3);
	 
	// Add intermediate waypoint plot lines
	 intermediateWPPlotLines = [];
	 
	var j = 0,length = intWpPlotIndexArr.length;
	 
	if(length>0){
				for(j = 0; j< length; j++){
					intermediateWPPlotLines.push({
				        color: intWpPlotLineColor,
				        width: 2,
				        zIndex : 5,
				        value: intWpPlotIndexArr[j]
				    });
				}			
			}						
				
    ukcGraph = Highcharts.chart('ukcgraphdiv', {
	    chart: {
	    	margin:[0,0,0,70],
	    	animation: false,
	    	plotBackgroundColor: chartBackgroundColor,
	    	seriesBoostThreshold:20
	    },
	    boost: {
	        useGPUTranslations: true,
	        usePreallocated:true
	    },
	    legend: {
            enabled: false
        },
	    title: {
	        text: ''
	    },
	    xAxis: {
	        title: {
	            enabled: true
	        },
	        labels:{
	        	enabled: false
	        },
	        lineWidth: 1,
	        tickWidth: 0,
	        gridLineColor: tickLineColor,
	        gridLineWidth: 0,
	        startOnTick: false,
	        endOnTick: false,
	        minPadding:0,
	        maxPadding:0,
	        offset:0,
	        crosshair: {
	        	 width: 2.5,
	             color: depthColor,
	             zIndex: 8,
	             animation: false
	        },
	        animation: false,
	        plotLines: intermediateWPPlotLines
	    },
	    yAxis: {
	        title: {
	            text: 'Depth'
	        },
	        labels: {
	            formatter: function () {
	                return Math.abs(this.value) + 'm';
	            },
	            y:15,
	            x:-5,
	            useHTML:true,
                style:{
                    width:'50px',
                }           
	        },
	        min: minDepth,
	        max: 5,
	        tickInterval: UKCGraphTickInterval,
	        tickWidth: 1,
	        gridLineColor: tickLineColor,
	        gridLineWidth: 0,
	        lineWidth:1,
	        animation: false,
	        showFirstLabel: true,
	        showLastLabel: false
	    },
	    tooltip: { 	    	
	    	// Tool tip for all points shared true
	    	    formatter: function() {
	    	      
	    	        var ukcAndQuality = '';
	    	        var index;
	    	        $.each(this.points, function(i, point) {	    	        	
	    	        	if(this.series.name =="." || this.series.name ==""){
	    	        		
	    	        	}else{
	    	        		index = this.series.data.indexOf(this.point);
	    	        		removeTimeOnChart();
	    	        		var ukc = ukcArray[index];
	    	        		if(ukc<=0){
	    	        			ukc = 0;
	    	        		}
	    	        		
	    	        		if($("#quality").val()=="yes" && interpolateQualityArr[this.series.data.indexOf( this.point )]!=null){
	    	        			if(ukc<=tooltipminUKCArr[this.series.data.indexOf( this.point )] || ukc==0){
	    	        				ukcAndQuality += '<tr><td style="vertical-align:top;" class="tooltiptext" ><b style="color: '+breachColor+' !important;  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;">UKC : ' + ukc + ' m</b><br>Quality &#177;'+interpolateQualityArr[this.series.data.indexOf( this.point )].toFixed(1) +'<b style="display:none">'+ showShipMarker(this.series.data.indexOf( this.point ))+'</b></td></tr>';		    	        			
	    	        				}
	    	        			else{
	    	        				ukcAndQuality += '<tr><td style="vertical-align:top;" class="tooltiptext" >UKC : ' + ukc + ' m <br>Quality &#177;'+interpolateQualityArr[this.series.data.indexOf( this.point )].toFixed(1) +'<b style="display:none">'+ showShipMarker(this.series.data.indexOf( this.point ))+'</b></td></tr>';		    	        			
	    	        			    }
	    	        		}else{
	    	        			if(ukc == 0 || ukc<=tooltipminUKCArr[this.series.data.indexOf( this.point )]){
	    	        				ukcAndQuality += '<tr><td style="vertical-align:top;" class="tooltiptext" ><b style="color: '+breachColor+' !important;  text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;">UKC : ' + ukc + ' m </b><b style="display:none">'+ showShipMarker(this.series.data.indexOf( this.point ))+'</b></td></tr>';	    	    	        		
	    	        			    }
	    	        			else{
	    	        				ukcAndQuality += '<tr><td style="vertical-align:top;" class="tooltiptext" >UKC : ' + ukc + ' m <b style="display:none">'+ showShipMarker(this.series.data.indexOf( this.point ))+'</b></td></tr>';	    	    	        		
	    	        			    }
	    	        			}
	    	        	     }
	    	        	});
	    	        
	    	        var times = interpolateTimeArr[index].split(":");	  	        
	    	        var d = new Date();
	    	        var n = d.getTimezoneOffset() * -1;
	    	        var sign;
	    	        if(n>0){
	    	        	sign = "+"; 
	    	        }else{
	    	        	sign = "";
	    	        }	    	      
	    	        var m = n % 60;
	    	        var h = (n-m)/60;
	    	        var HRSMINS = (h<10?"0":"") + h.toString() + ":" + (m<10?"0":"") + m.toString();
	    	        var ukcTooltipText = '<table style="width:150px;"><tr><td style="vertical-align:top;" class="tooltiptext tooltiptime">'+times[0]+':'+times[1]+'<br>'+ sign +''+HRSMINS+'</td></tr>';
	    	        ukcTooltipText += ukcAndQuality;
	    	        return ukcTooltipText;	    	       
	    	    },
	    	    shared: true,
	    	    useHTML: true,	    	
	    	    style: {
	    	        padding: 0,
	    	        margin: 0
	    	    },
	    	    positioner: function(labelWidth, labelHeight, point) {         
                    var tooltipX, tooltipY;
                       if (point.plotX  < labelWidth) {
                           tooltipX = point.plotX + this.chart.plotLeft - 10;
                           $(".tooltiptime").css("border-left","2px solid "+ depthColor +"");
                           $(".tooltiptime").css("text-align","left");
                           $(".tooltiptext").css("text-align","left");                          
                       } else {
                           tooltipX = point.plotX + this.chart.plotLeft - labelWidth + 9;
                           $(".tooltiptime").css("border-right","2px solid "+ depthColor +"");
                           $(".tooltiptime").css("text-align","right");
                           $(".tooltiptext").css("text-align","right");
                       }
                       tooltipY = point.plotY + this.chart.plotTop;
                       return {
                           x: tooltipX,
                           y: -13
                       };       
               },
               animation: false,
               hideDelay: 0
	    },
	    plotOptions: {
	        area: {	       
	            lineColor: 'transparent',
	            lineWidth: 0,
	            marker: {
	            	enabled:false,
	                lineWidth: 0,
	                lineColor: 'transparent'
	            },
	            animation: false,
	            threshold: 0.5,	            
	        },
	        areaspline: {               
                threshold: -5000,
                animation: false
            },
	        point: {
	            marker: {
	                enabled: false
	            },
	            animation: false
	        }, 
	        series: {
	        	stickyTracking: true,
                events: {
                    mouseOut: function() { 
                    	ukcGraph.tooltip.hide();
                    	closePopup();
                    	shipMarker.setPosition(undefined);
                    	setStartEndTime();
                    }                    
                },          
                animation: false,
                marker: {
	                enabled: true,
	                radius: 0
	            },
                states: {              	
                    hover: {
                      enabled: false,
                      halo: {
                          size: 0
                      }                     
                    }
                },
                fillOpacity: 1
            }
	    },
		    series : [
				{ // TimeSeries
					name : 'Tooltip',
					data:generateTooltipSeriesY(),
					zIndex: 10,
					type: 'line',
					marker:{
						enabled: false
					},
					lineWidth: tooltipDraughtWidth,
					color:tootltipAreaColor
				},
				{ // Static Draught Series
					name : '.',
					data: staticDraughtArr,
					zIndex: 9,
					type: 'area',
					color:staticDraughtColor
				},
				{ // Dynamic Motions Series
					name : '.',
					data:dynamicMotionsArr,
					zIndex: 5,
					type: 'area',
					color:dynamicMotionsColor 
				},
				{ // Minimum UKC Series 
					name : '.', 
					data:minimumUKCArr,
					zIndex: 4,
					type: 'area',
					color:minimumUKCColor
				},
				{ // Depth Series
					name : '.',
					data:ukcDepthSeriesArr,
					zIndex: 6,
					type: 'areaspline',
					color:depthColor
				},
				{ // safety margin series 
					name : '.', 
					data:safetyMarginArr,
					zIndex: 5,
					type: 'areaspline',
					color:SafetyMarginColor
				},
				{ // breach series line 
					name : '.', 
					data:breachLineArr,
					zIndex: 7,
					type: 'line',
					color:breachColor
				},
				{ //wreck series line 
					name : '.', 
					data:wreckSeriesArr,
					 marker: {
				            symbol: 'url('+contextpath+'images/wreck.png)',
				            width: wreckWidth,
				            height: wreckHeight
				        },
					zIndex: 9,
					type: 'line'					
				}
				]
	});
    
    updateFactorValuesOnLoadGraph();
	setStartEndTime();
}

/**
 * Method to show the times on UKC Graph
 * StratTime, LaponeTime, LapTwoTime,EndTime
 * @param interpolateTimeArr
 */
function setStartEndTime(){
	
	var timesstart = interpolateTimeArr[0].split(":");
    var timened = interpolateTimeArr[interpolateTimeArr.length-1].split(":");
    var timelapone = interpolateTimeArr[lapOneTime].split(":");
    var timelaptwo = interpolateTimeArr[lapTwoTime].split(":");
    
    var d = new Date();
    var n = d.getTimezoneOffset() * -1;
    var sign;
    if(n>0){
    	sign = "+";
    }else{
    	sign = "";
    }
    var m = n % 60;
    var h = (n-m)/60;
    var HRSMINS = (h<10?"0":"") + h.toString() + ":" + (m<10?"0":"") + m.toString();
    
    $("#starttime").html(timesstart[0]+':'+timesstart[1]+'<br>'+ sign +''+HRSMINS);
    $("#endtime").html(timened[0]+':'+timened[1]+'<br>'+ sign +''+HRSMINS);
    
    var laponeLeft = ukcGraph.xAxis[0].series[0].data[lapOneTime].plotX;
    var laptwoLeft = ukcGraph.xAxis[0].series[0].data[lapTwoTime].plotX;
    var laplineHeight = initialSettings.initLayOut().ukcGraphHeight;
    
    $("#laponetime").css("left",laponeLeft);
    $("#laptwotime").css("left",laptwoLeft);   
    $("#laponeline").css("left",laponeLeft + 70);
    $("#laptwoline").css("left",laptwoLeft + 70);   
    $("#laponeline").css("height",laplineHeight);
	$("#laptwoline").css("height",laplineHeight);
	
	$("#starttime").css("display","block");
	$("#endtime").css("display","block");
	$("#laponetime").css("display","block");
	$("#laptwotime").css("display","block");
    $("#laponeline").css("display","block");
	$("#laptwoline").css("display","block");
    
    $("#laponetime").html(timelapone[0]+':'+timelapone[1]+'<br>'+ sign +''+HRSMINS);
    $("#laptwotime").html(timelaptwo[0]+':'+timelaptwo[1]+'<br>'+ sign +''+HRSMINS);      
}

/**
 * Method to remove time on chart
 */
function removeTimeOnChart(){
	
	  $("#starttime").css("display","none");
	  $("#endtime").css("display","none");
	  $("#laponetime").css("display","none");
	  $("#laptwotime").css("display","none");
	  $("#laponeline").css("display","none");
	  $("#laptwoline").css("display","none");
}

/**
 * Update static Draught series in UKC graph
 */
function updateStaticDraughtSeries(){
	ukcGraph.series[1].setData(staticDraughtArr);	
}

/**
 * Method to Update Dynamic Motions series in UKC Graph
 */
function updateDynamicMotionSeries(){
	ukcGraph.series[2].setData(dynamicMotionsArr);
}

/**
 * Method to Update Minimum UKC series in UKC Graph
 */
function updateMinimumUKCSeries(){
	ukcGraph.series[3].setData(minimumUKCArr);
}

/**
 * Method to Update Depth series in UKC Graph
 */
function updateDepthSeries(){
	ukcGraph.series[4].setData(ukcDepthSeriesArr,false);
}

/**
 * Method to Update Safety Margin series in UKC Graph
 */
function updatSafetyMarginSeries(){		
	ukcGraph.series[5].setData(safetyMarginArr,false);
}

/**
 * Method to convert seconds to HH:MM
 * @param sec
 * @returns {String}
 */
function convertSecondsToMinutes(sec){
	var date = new Date(null);
	date.setSeconds(sec);
	var result = date.toISOString().substr(11, 8).split(":");
	var hoursandminutes = result[0]+":"+result[1];
	return hoursandminutes;
}

/**
 * Method to minimum number from the array
 * @param numArray
 * @returns {Number}
 */
function getMinOfArray(numArray) {
	  return Math.min.apply(null, numArray);
}

/**
 * Method to create Chart Depth series from the response to add in UKC Graph
 * @param response
 */
function generateUKCDepthSeriesY(response){
	
	ukcDepthSeriesArr = [];
	intWpPlotIndexArr=[];
	var i = 0, features = response.features, length = features.length;	
	for(i = 0; i< length ; i++ ){
		if(parseFloat(features[i].properties.z<=0)){
			ukcDepthSeriesArr.push(parseFloat(features[i].properties.z).toFixed(2) * -1);
		}
		else{
			ukcDepthSeriesArr.push((parseFloat(features[i].properties.z) + parseFloat(features[i].properties.tideheight)).toFixed(2) * -1);
		}
		
		if( i>0 && i %( SPLIT_INTERVAL+1 ) == 0){
			intWpPlotIndexArr.push(ukcDepthSeriesArr.length-1); // Logic for intermediate way points
		}
	}		
}
/**
 * Method to generate wreck series from the response to add in UKC Graph
 * @param response
 */
function generateWreckSeriesArr(response){
	wreckSeriesArr = [];
	
	var i = 0, features = response.features, length = features.length;	
	for(i = 0; i< length ; i++ ){
		if(features[i].properties.shipwreck == null){
			wreckSeriesArr.push(null);
		}
		else{			
			wreckSeriesArr.push(ukcDepthSeriesArr[i]);
		}
	}	
}
/**
 * Method to update the wreck series when journey span dragged.
 */
function updateWreckSeriesArr(){
	wreckSeriesArr = [];
	
	var i = 0, features = depthProfile.features, length = features.length;	
	for(i = 0; i< length ; i++ ){
		if(features[i].properties.shipwreck == null){
			wreckSeriesArr.push(null);
		}
		else{			
			wreckSeriesArr.push(ukcDepthSeriesArr[i]);			
		}
	}
	updateWreckSeries();
}

/**
 * Method to Update Wreck series in UKC Graph
 */
function updateWreckSeries(){
	ukcGraph.series[7].setData(wreckSeriesArr,false);
}

/**
 * Method to generate breach line array based on safety margin height and minimum ukc value
 * Update breach line on UKC Graph
 */
function generateBreachLineArr(){
	
	var length = ukcDepthSeriesArr.length;
	breachLineArr = [];
	
	for(i = 0; i< length ; i++ ){
		if(safetyMarginArr[i] > minimumUKCArr[i]){
			breachLineArr.push([i,safetyMarginArr[i]]);
			breachLineArr.push([i,minimumUKCArr[i]]);
		}else{
			breachLineArr.push([i,null]);
		}
	}
	ukcGraph.series[6].setData(breachLineArr,false);
}

/**
 * Method to Create Quality Array from the response
 * @param response
 */
function generateQualityValue(response){

	interpolateQualityArr = [];	
	
	var i = 0, features = response.features, length = features.length;
	for(i = 0; i< length ; i++ ){		
		interpolateQualityArr.push(features[i].properties.quality);	
	}
}

/**
 * Method to create Coordinates response from the response
 * @param response
 */
function generateCoordinates(response){
interpolateCoordinatesArr = [];

var i = 0, features = response.features, length = features.length;
  for(i = 0; i< length ; i++ ){	
	interpolateCoordinatesArr.push([features[i].properties.x, features[i].properties.y]);										
  }
}

/**
 * Method to create time series to add in UKC Graph
 * Calculate Journey time in minutes from the start and end time
 * @param response
 */
function generateTimeSeriesX(response){

	var starttimes = response.features[0].properties.tidetime.split(":");
	var endtimes = response.features[response.features.length-1].properties.tidetime.split(":");
	startTimeInMin = starttimes[0] * 60 + starttimes[1] * 1;
	var endtimeinminutes = endtimes[0] * 60 + endtimes[1] * 1;
	
	if(startTimeInMin<endtimeinminutes){
		journeyTimeInMin = endtimeinminutes - startTimeInMin; 
	}else{
		journeyTimeInMin = endtimeinminutes - startTimeInMin + 1440;
	}
	
	interpolateTimeArr = [];
	
	var i = 0, features = response.features, length = features.length;
	  for(i = 0; i< length ; i++ ){			
		interpolateTimeArr.push(features[i].properties.tidetime);										
	 }
}
/**
 * Method to create Tooltip series
 * @returns Array
 */
function generateTooltipSeriesY(){
	var tempArr = [];
	var i = 0 , length = ukcDepthSeriesArr.length;
	for(i = 0; i < length; i++){
		tempArr.push(tooltipDraughtHeight);
	}
	return tempArr;
}

/**
 * Method to update the time series when changing the time in tide graph
 * @param startingtime
 */
function updateTimeSeriesX(){
	
	var tempresponse = depthProfile;	
	interpolateTimeArr = [];
	var timearray = [];
	var differtime = tempresponse.features[0].properties.tidetime.split(":");
	var differtimeinseconds = (differtime[0] * 60 * 60 + differtime[1] * 60 + differtime[2] * 1) - ( startTimeInMin - 60 ) * 60;
	
	var i = 0, features = tempresponse.features, length = features.length;
	for(i = 0; i< length; i++ ){			
		var onetime = features[i].properties.tidetime.split(":");
		var onetimeseconds = (onetime[0] * 60 * 60 + onetime[1] * 60 + onetime[2] * 1);
		if(onetimeseconds - differtimeinseconds<0){
			timearray.push(onetimeseconds - differtimeinseconds + 1440 * 60);
		}else{
			timearray.push(onetimeseconds - differtimeinseconds);
		}		
	}
	var k = 0, length = timearray.length;
	for(k = 0; k< length; k++ ){										
		interpolateTimeArr.push(convertSecondsToMinutes(timearray[k]));									
	}
	setStartEndTime();
}

/**
 * Method to update the Chart depth when changing the time in tide graph
 * 
 */
function updateUKCDepthSeriesY(){
		
	var tempresponse = depthProfile;	
	var timearray = [];
	var differtime = tempresponse.features[0].properties.tidetime.split(":");
	var differtimeinseconds = (differtime[0] * 60 * 60 + differtime[1] * 60 + differtime[2] * 1) - ( startTimeInMin - 60 ) * 60;
	
	var i = 0, features = tempresponse.features, length = features.length;
	for(i = 0; i< length; i++ ){		
		var onetime = features[i].properties.tidetime.split(":");
		var onetimeseconds = (onetime[0] * 60 * 60 + onetime[1] * 60 + onetime[2] * 1);
		if(onetimeseconds - differtimeinseconds<0){
			timearray.push(onetimeseconds - differtimeinseconds + 1440 * 60);
		}else{
			timearray.push(onetimeseconds - differtimeinseconds);
		}				
	}
	
	ukcDepthSeriesArr = [];
	var i = 0, features = tempresponse.features, length = features.length;
		for(i = 0; i< length; i++ ){
			
			if(parseFloat(features[i].properties.z<=0)){
				ukcDepthSeriesArr.push(parseFloat(features[i].properties.z).toFixed(2) * -1);
			}
			else{
				ukcDepthSeriesArr.push((parseFloat(features[i].properties.z) + parseFloat(tideHeightSeriesYArr[Math.round(timearray[i]/60) + 60])).toFixed(2) * -1);
			}							
		}	
    updateDepthSeries();
}

/**
 * Method to get UKC factor values
 * Calculate the UKC Value for tooltip in graph from the factors and chart depth
 */
function updateFactorValuesOnLoadGraph(){
	
	if(minimuUKCPresentinFactors){
		minimuUKCPresentinFactors = false;
		updateMinimumUKCForEntireRoute(0);
	}
	
	var factorName = document.getElementsByClassName("factorname");
	var factorValue = document.getElementsByClassName("factorvalue");
	var dynamicMotionsValue = 0;	
	var minimumUKCValue = 0;
	var staticDraughtValue = 0;
	var safetyMarginValue = 0;
	var i = 0, length = factorName.length;
	for(i = 0; i< length; i++){
		if(factorName[i].value.trim() == "Static Draught".trim() ){
			staticDraughtValue = parseFloat(factorValue[i].value);
		}else if(factorName[i].value == "Safety Margin"){
			safetyMarginValue = parseFloat(factorValue[i].value);
		}else if(factorName[i].value == "Minimum UKC"){
			minimumUKCValue = parseFloat(factorValue[i].value);	
			updateMinimumUKCForEntireRoute(minimumUKCValue);
			minimuUKCPresentinFactors = true;
		}else if(factorName[i].value == ""){			
		}else{ 
			dynamicMotionsValue += parseFloat(factorValue[i].value);
		}
	}
	
	var factorNameTemp="";
	//var factorNameValue="";
	for (var int = 0; int < length; int++) {
		
		if(factorName[int].value != ""){
			factorNameTemp += factorName[int].value.trim()+"-"+factorValue[int].value+", ";
		}

	}
	
	calculateUKC(staticDraughtValue,dynamicMotionsValue, safetyMarginValue);
	generateStaticDraughtSeriesArr(staticDraughtValue);
	generateDynamicMotionSeriesArr(dynamicMotionsValue,staticDraughtValue);	
	generateMinimumUKCSeriesArr();
	updateDepthSeries();
	generateSafetyMarginSeriesArr(safetyMarginValue);
	generateBreachLineArr();
	ukcGraph.redraw();
	
	ga('send', 'event', $('#authusername').val(), JSON.stringify({
		'EventType' : 'Added Factors',
		'Factors' : factorNameTemp,
		'wayPoints':wpArr,
		'profileMethod' : $("#profilemethod").val(),
		'Date': initialSettings.getDate().toString()
	}), initialSettings.getDate().toString());

}

/**
 * Method to generate static draught series array
 */
function generateStaticDraughtSeriesArr(staticDraughtValue){
	
	staticDraughtArr = [];
	
	var i = 0 , length = ukcDepthSeriesArr.length;
	for(i = 0; i < length; i++){
		staticDraughtArr.push(staticDraughtValue * -1);
	}
	
	tooltipStaticDraughtValue = staticDraughtValue;
	updateStaticDraughtSeries();
}

/**
 * Method to generate safety margin series array
 */
function generateSafetyMarginSeriesArr(safetyMarginValue){
	safetyMarginArr = [];

	var l = 0, length = ukcDepthSeriesArr.length;	
		for(var l=0; l<length;l++){		
			safetyMarginArr.push(safetyMarginValue  + ukcDepthSeriesArr[l]);			
		}
			tooltipSafetyMarginValue = safetyMarginValue;		
	updatSafetyMarginSeries();
}

/**
 * Method to generate dynamic motions series array
 */
function generateDynamicMotionSeriesArr(dynamicMotionsValue,staticDraughtValue){
			
	dynamicMotionsArr = [];
	
	var i = 0 , length = ukcDepthSeriesArr.length;
	for(i = 0; i < length; i++){
		dynamicMotionsArr.push((dynamicMotionsValue + staticDraughtValue) * -1);
	}
	
	tooltipDynamicMotionsValue = dynamicMotionsValue;
	updateDynamicMotionSeries();
}
/**
 * Method to generate minimum ukc array
 */
function generateMinimumUKCSeriesArr(){
	minimumUKCArr = [];
	tooltipminUKCArr = [];
	var i = 0, length = wpArr.length-1;
	for(var i = 0; i<length;i++){
		generateMinimumUKCArray(wpArr[i].minukc,i);
	}
	updateMinimumUKCSeries();
}

/**
 * Method to calculate UKC based upon factor values
 * @param tooltipStaticDraughtValue
 * @param tooltipDynamicMotionsValue
 * @param tooltipSafetyMarginValue
 */
function calculateUKC(tooltipStaticDraughtValue,tooltipDynamicMotionsValue,tooltipSafetyMarginValue){
	
	ukcArray = [];
	totalFactorsValue = parseFloat(tooltipStaticDraughtValue) + parseFloat(tooltipSafetyMarginValue) + parseFloat(tooltipDynamicMotionsValue);
	var l = 0, length = ukcDepthSeriesArr.length;
	for(l = 0; l<length;l++){
		
		var ukc = ( ukcDepthSeriesArr[l] + totalFactorsValue ).toFixed(2);	
		if(ukc>0){
		    ukcArray.push(0);		
		}else{
			ukcArray.push(Math.abs(ukc));
		}		
	}
}

/**
 * Generate minimum ukc array for each leg
 * @param value
 * @param pos
 */
function generateMinimumUKCArray(value,pos){

	if(pos == 0){
		if(intWpPlotIndexArr.length == 0)
		generateMinimumUKCArrValues(value,0,ukcDepthSeriesArr.length);
		else
		generateMinimumUKCArrValues(value,0,intWpPlotIndexArr[0]);						
	}else if(pos == intWpPlotIndexArr.length){
		generateMinimumUKCArrValues(value,intWpPlotIndexArr[pos-1],ukcDepthSeriesArr.length);			
	}else{		
		generateMinimumUKCArrValues(value,intWpPlotIndexArr[pos-1],intWpPlotIndexArr[pos]);	
	}
}

/**
 * Method to generate minimum ukc values for each leg
 * @param value
 * @param start
 * @param end
 */
function generateMinimumUKCArrValues(value,start,end){
	for(var i = start; i<end;i++ ){
		minimumUKCArr.push(value * -1 + tooltipDynamicMotionsValue * -1 + tooltipStaticDraughtValue * -1);
		tooltipminUKCArr.push(value);
	}
}

/**
 * Method to update minimum ukc array of specific leg when a change in waypoint popup
 * @param value
 * @param pos
 */
function updateMinimumUKCArray(value,pos){
	
	if(pos == 0){		
		if(intWpPlotIndexArr.length == 0)
		updateMinimumUKCArrValues(value,0,ukcDepthSeriesArr.length);			
		else
		updateMinimumUKCArrValues(value,0,intWpPlotIndexArr[0]);				
	}else if(pos == wpArr.length){
		// no need to update minimum ukc value for destination point leg
	}else{
		updateMinimumUKCArrValues(value,intWpPlotIndexArr[pos],intWpPlotIndexArr[pos+1]);
	}
	updateMinimumUKCSeries();
}

/**
 * Method to update minimum ukc array for a specific leg
 */
function updateMinimumUKCArrValues(value,start,end){
	for(var i = start; i<end;i++ ){
		minimumUKCArr[i] = value * -1 + tooltipDynamicMotionsValue * -1 + tooltipStaticDraughtValue * -1;
		tooltipminUKCArr[i] = value;
	}
}

/**
 * Method to update minimum UKC array for entire with same value
 * Update minimum ukc value to each waypoint
 * @param value
 */
function updateMinimumUKCForEntireRoute(value){
	tooltipminUKCArr = [];
	minimumUKCArr = [];
	var n = 0, length = ukcDepthSeriesArr.length;
	for(var n=0; n<length;n++){				
		minimumUKCArr.push(value * -1 + tooltipDynamicMotionsValue * -1 + tooltipStaticDraughtValue * -1);
		tooltipminUKCArr.push(value);
	}
	
	for(var k=0; k<wpArr.length;k++){				
		wpArr[k].minukc = value;
	}
	updateMinimumUKCSeries();
}

/**
 * Method to generate Extremes( min, max)
 * Method to generate Tick interval for Y axis in UKC Graph
 */
function generateExtremesAndTickInterval(){
	
	minDepth = Math.round(getMinOfArray(ukcDepthSeriesArr))-1;
	
	if(minDepth * -1 < 20){		
		tooltipDraughtHeight = 2.6;
		UKCGraphTickInterval = 5;
		minDepth = -20;
	}
	else {
	for (var i = 1; i <= 1000; i++) {
		if (minDepth * -1 >= i * 20 && minDepth * -1 < (i + 1) * 20) {
			tooltipDraughtHeight = 2.6 * (i + 1);
			UKCGraphTickInterval = 5 * (i + 1);
			minDepth = (i + 1) * -20 ;
			break;
		}
	 }
  }
}

/**
 * Method to update Extremes and Tick interval in UKC Graph when a change in journey span of Tide Graph
 */
function updateExtremesAndTickInterval(){
	 generateExtremesAndTickInterval();
	 ukcGraph.yAxis[0].setExtremes(minDepth,5,false);
	 ukcGraph.yAxis[0].options.tickInterval = UKCGraphTickInterval;
	 ukcGraph.series[0].setData(generateTooltipSeriesY(),false); 
}