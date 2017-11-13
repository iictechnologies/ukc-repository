var tideGraph; 
var maxTide;
var currentTimePlotLine; 
var currentTimeInMin;
var tideTimeForXAxis;
var tideHeightSeriesYArr = [];
var tideTimeSeriesXArr = [];

/**
 * Method to create the Tide graph
 * @param response
 */
function displayTideGraph(response){
	hideTaptoRefresh();
	if(response.features[0].properties.tideheight == 0){
		$("#tideerrordiv").css("display","block");
		$("#errMessage").html(response.tideheights.message);
	}else{
		$("#tideerrordiv").css("display","none");
	generateTideTimeSeries(response);
	generateTideHeightSeries(response);						
	maxTide = Math.round(getMaxOfArray(tideHeightSeriesYArr))+1;
			
	var zeroLine = [];	
		
	var startTime = interpolateTimeArr[0].split(":");
	startTimeInMin = startTime[0] * 60 + startTime[1] * 1;
	
	var date = new Date();	
	var h = date.getHours() * 60;
	var m = date.getMinutes() * 1;
	currentTimeInMin = h + m + 60;
	
	currentTimePlotLine = [{
        color: '#000',
        width: 3,
        zIndex : 5,
        value: currentTimeInMin + 1
    }];
    	
	tideTimeForXAxis = [];	
	
	for(var j = 0; j<tideTimeSeriesXArr.length; j++  ){		
		tideTimeForXAxis.push(tideTimeSeriesXArr[j].split("T")[1].split("+")[0].split(":")[0]+":"+tideTimeSeriesXArr[j].split("T")[1].split("+")[0].split(":")[1]);
		zeroLine.push(0);
	}
		
	tideGraph = Highcharts.chart('tidegraphdiv', {
	    chart: {
	    	margin:[-15,0,10,70],
	    	animation: false
	    },
	    legend: {
            enabled: false
        },
	    title: {
	        text: ''
	    },
	    xAxis: {
	    	categories:tideTimeForXAxis,
	        title: {
	            enabled: false
	        },
	        labels:{
	        	formatter: function(){
        	        if(this.value == "00:00" || this.value =="12:00"){
        	        	return this.value;
        	        }	        	   	                
            },
	        	 enabled: true,	        	
	        	 y:-15,
		         x:-15,
		         useHTML:true,
		         align: 'left'	       
	        },
	        lineWidth: 1,
	        tickWidth: 2,
	        tickColor: '#FF0000',
	        tickInterval: 60,       
	       crosshair: {
	        	 width: 2,
	             color: 'red',
	             zIndex: 6,
	             animation: false	    
            },
            animation: false,        
            tickPosition: 'inside',
            plotLines : currentTimePlotLine,
	    },
	    yAxis: {
	        title: {
	            text: 'Tide'
	        },
	        tickInterval: 5,
	        labels: {	        
	        		formatter: function(){
	    	        if(this.value == 10 || this.value == 5){
	    	        	return Math.abs(this.value) + 'm';
	    	        }	        	   	                
	            },
	            y:3,
	            x:10,
	            useHTML:true,
	            align: 'left',
                style:{
                    width:'50px',
                }            
	        },
	        min: -1,
	        max: maxTide+5,
	        tickWidth: 1,
	        gridLineWidth: 0,
	        lineWidth:1,
	        animation: false,
	        tickPosition: 'inside'
	    },
	    tooltip: { 	    	
    	    formatter: function(e) {
	    	      
    	        var sdata = '';
    	        var index;
    	        $.each(this.points, function(i, point) {    	        	
    	        	
    	        	if(this.series.name =="."){
    	        		
    	        	}else{ 
    	        		index = this.series.data.indexOf(this.point);
    	        		sdata += '<tr><td style="vertical-align:top;" class="tooltiptext" >Tide : ' + Math.abs(this.y).toFixed(2) + ' m</td></tr>';
    	        	}
    	        	});
    	        var times = tideTimeSeriesXArr[index].split("T")[1].split("+")[0].split(":");
    	        
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
    	        var s = '<table style="width:150px;"><tr><td style="vertical-align:top;" class="tooltiptext">'+times[0]+':'+times[1]+'<br>'+ sign +''+HRSMINS+'</td></tr>';
    	        	s += sdata;    	        	
    	        return s;	    	       
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
                       tooltipX = point.plotX + this.chart.plotLeft - 12;
                       $(".tooltiptime").css("border-left","2px solid #f00");
                       $(".tooltiptime").css("text-align","left");
                    
                   } else {
                       tooltipX = point.plotX + this.chart.plotLeft - labelWidth + 11;
                       $(".tooltiptime").css("border-right","2px solid #f00");
                       $(".tooltiptime").css("text-align","right");
                   }
                   tooltipY = point.plotY + this.chart.plotTop;
                   return {
                       x: tooltipX,
                       y: -8	 
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
	            animation: false
	        },
	        areaspline: {
                
                threshold: -10,
                animation: false
            },
	        line: {
	            marker: {
	                enabled: false
	            },
	            animation: false
	        },
	        point: {
	            marker: {
	                enabled: false
	            },
	            animation: false
	        }, 
	        series: {
                stickyTracking: false,
                marker: {
                    enabled: false,
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
                fillOpacity: 0.9,              
                animation: false              
            }
	    },
		    series : [
				{
					name : 'Tide',
					data:tideHeightSeriesYArr,
					zIndex: 3,
					type: 'areaspline',
					lineWidth: 0,
					color:'#ccefff'
				},
				{
					name : '.',
					data:zeroLine,
					zIndex: 3,
					type: 'line',
					lineWidth: 2,
					color:'#111111',
					dashStyle:'Dash'
				}
				]
	});	
	setJourneyPlotBand();
	}
}

/**
 * Method to set Journey time span in tide graph
 */
function setJourneyPlotBand(){
	var left = tideGraph.xAxis[0].series[0].points[startTimeInMin  + 61 ].plotX;
	var xfactor =  tideTimeSeriesXArr.length / tideGraph.plotSizeX;
	var width = journeyTimeInMin / xfactor ;
	$("#journeyspan").css({"left":left,"width":width ,"border":"1px solid #f00"});
}

$(function (){
	//Create draggable journey span element	and initialize drag events  
	var xPos;
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	var tideGraphHeight = initialSettings.initLayOut().tideGraphHeight;
	$('#journeyspan').draggable({ containment: "parent",
		start: function(e) {
			
      },
      drag: function(e) {
    	  var offset = $(this).offset();   	  
          xPos = offset.left;      
          if(e.pageY > windowHeight - tideGraphHeight){
        	  journeySpanDrag(xPos,windowWidth);
          }else{
        	   e.preventDefault(); // stop dragging when mouse moved to outside of tidegraph
          }        
      },
      stop: function() {
    	  var offset = $(this).offset();   	  
          xPos = offset.left;    
          journeySpanDrag(xPos,windowWidth);
          
	      ga('send', 'event', $('#authusername').val(), JSON.stringify({
	    		'EventType' : 'Tide Journey Span Moved to Date: '+initialSettings.getDate().toString(),
	    		'ProfileMethodValue' : $('#profilemethod').val(),
	    		'wayPoints': wpArr,
	    		'Date': initialSettings.getDate().toString()
	      }), initialSettings.getDate().toString());	      
      }});		
});

/**
 * Method to Update UKC Graph when journey span drag event
 * Change start time in minutes
 * Update Depth series array
 * Update Time series array
 * Calculate UKC
 * Update safety margin series array
 * Update breach line array
 * Redraw UKC Graph
 * Update Date in date picker
 * 
 * @param xPos
 * @param windowWidth
 */
function journeySpanDrag(xPos,windowWidth){

		var xfactor =  tideTimeSeriesXArr.length / tideGraph.plotSizeX;
		if((xPos > 70) && ((xPos + journeyTimeInMin / xfactor ) < windowWidth)){
			
			var indexInTideGraph = Math.round(((xPos - 70) * xfactor));
	        var draggedTime = indexInTideGraph;             
 	        var m = draggedTime % 60;
	        var h = (draggedTime-m)/60;
	       	startTimeInMin = indexInTideGraph-1;    	         
	        updateUKCDepthSeriesY(); 
	        updateTimeSeriesX(); 
	        calculateUKC(tooltipStaticDraughtValue,tooltipDynamicMotionsValue,tooltipSafetyMarginValue);	        
	        generateSafetyMarginSeriesArr(tooltipSafetyMarginValue);
	        generateBreachLineArr();
	        updateWreckSeriesArr();
	        ukcGraph.redraw();
	        var date = new Date();
	        initialSettings.setDate(new Date(date.getFullYear(),date.getMonth() ,date.getDate(),h-1,m-1,0));	    	      
		} 
}

/**
 * Method to Create the Tide Height series for the tide graph
 * @param response
 */
function generateTideHeightSeries(response){
	tideHeightSeriesYArr = [];
	var i = 0, length = response.tideheights.length;
	for(i = 0; i< length; i++ ){
		tideHeightSeriesYArr.push(response.tideheights[i].Height);		
	}
}
/**
 * Method to Create the time series for the Tide graph 
 * @param response
 */
function generateTideTimeSeries(response){
	tideTimeSeriesXArr = [];
	var i = 0, length = response.tideheights.length;
	for(i = 0; i< length; i++ ){
		tideTimeSeriesXArr.push(response.tideheights[i].DateTime);
	}
}

/**
 * Method to maximum number from the array
 * @param numArray
 * @returns {Number}
 */
function getMaxOfArray(numArray) {
	  return Math.max.apply(null, numArray);
}