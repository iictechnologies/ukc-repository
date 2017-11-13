var	optiontext="";
var factorId = 0;

/****************** Factor window validations *********************/
function onQualityKeyUp(){
	ga('send', 'event', $('#authusername').val(), JSON.stringify({
		'EventType' : 'Quality Value Changed',
		'QualityValue' : $('#quality').val(),
		'wayPoints': wpArr,
		'Date': initialSettings.getDate().toString()
	}), initialSettings.getDate().toString());
};

function onKeyUp() {
	$("#taptorefreshdiv").css("display", "block");
	
	ga('send', 'event', $('#authusername').val(), JSON.stringify({
		'EventType' : 'Profile method Changed',
		'ProfileMethodValue' : $('#profilemethod').val(),
		'wayPoints': wpArr,
		'Date': initialSettings.getDate().toString()
	}), initialSettings.getDate().toString());
}

/*********************  Waypoint Popup Validations *******************/

/**
 * Method to validate Latitude degree
 * Range 0 - 89
 */
function latDegValidation(val, id) {

	var NumericVal = val;
	if (NumericVal < 0 || NumericVal > 89 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Latitude degree : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate Latitude Minute
 * Range 0 to 59
 */
function latMinValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0 || NumericVal > 59 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Latitude minutes : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate Latitude second
 * Range 0 to 59.99
 */
function latSecValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0 || NumericVal > 59.99 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Latitude seconds : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate Longitude degree
 * Range -179 to 179
 */
function lonDegValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < -179 || NumericVal > 179 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Longitude degree : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate Longitude minute
 * Range 0 to 59
 */
function lonMinValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0 || NumericVal > 59 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Longitude minutes : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate Longitude second
 * Range 0 to 59.99 KM
 */
function lonSecValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0 || NumericVal > 59.99 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Longitude seconds : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate XTL
 * Range 0.1 to 1.50 KM
 */
function xtlValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0.1 || NumericVal > 1.50 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid XTL : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate XTR
 * Range 0.1 to 1.50 KM
 */
function xtrValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0.1 || NumericVal > 1.50 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid XTR : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}
/**
 * Method to validate speed
 * Range 0 to 50
 */
function speedValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0.0 || NumericVal > 50.0 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Speed : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate turn radius
 * Range 0.1 to 179.99
 */
function turnradiusValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0.1 || NumericVal > 179.99 || NumericVal == "" || NumericVal == null) {
		jAlert("Invalid Turn Radius : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, val);
	}
}

/**
 * Method to validate minimum UKC
 * Range 0 to 13
 */
function minukcValidation(val, id) {
	var NumericVal = val;
	if (NumericVal < 0.0 || NumericVal > 13 || NumericVal == ""	|| NumericVal == null) {
		jAlert("Invalid Minimum UKC : " + NumericVal);
		showAttributesPopup();
		return false;
	} else {
		updateWpArray(id, parseFloat(val));
		if(ukcGraph)
		updateFactorValuesOnLoadGraph();
	}
}

/**
 * Method to create dynamic option values to drop down of each factor
 * Range 0.1 m to 50.0 m 
 * 
 */
$(document).ready(function() {
	for(var i=1;i<=500;i++){
		optiontext+='<option value='+i/10+'>'+i/10+' m</option>';	
	}   
});

/**
 * Method to create dynamic factor 
 *  @param factorId
 */
function GetDynamicTextBox(factorId){
    return '<input class="factorname form-control" list="factorslist" id="fn-'+factorId+'" type="text" onblur="updateFactorValues(this)"  style="margin-right:5px; margin-bottom:15px; display:inline-block;" />'+'<datalist id="factorslist" name="factorslist">'+
    '<option value="Static Draught">Static Draught</option>'+
    '<option value="Safety Margin">Safety Margin</option>'+
    '<option value="Minimum UKC">Minimum UKC</option>'+
    '<option value="Squat">Squat</option>'+
    '<option value="Heel">Heel</option>'+
    '<option value="Pitch">Pitch</option>'+
    '<option value="Roll">Roll</option>'+
    '<option value="Met">Met</option>'+
    '<option value="Seawater Density">Seawater Density</option>'+
    '</datalist>'+'<select  class="factorvalue" style="margin-right:5px;" id="fv-'+factorId+'" onchange="updateFactorValues(this)" >'+optiontext+'</select>'+'<img src="resources/images/deletefactor.png" alt="Close" id="fd-'+factorId+'" onclick="removeTextBox(this)" class="closeimg" />';
}

/**
 * Add Factor fieldset when clicked plus button in factor window
 */
function addTextBox(){
	 var div = document.createElement('DIV');	 
	 div.setAttribute("display", "inline-block");
	 div.innerHTML = GetDynamicTextBox(factorId);
	 document.getElementById("textBoxContainer").appendChild(div);   
	 factorId++;
}
/**
 * Method to remove factor field set when cross button clicked
 * Update minimum ukc series for entire route
 * @param div
 */
function removeTextBox(div) {
	var factor = div.id.split("-")[1];
	var factorName = $("#fn-"+factor).val();
	if(factorName == "Minimum UKC"){
		minimuUKCPresentinFactors = false;
		updateMinimumUKCForEntireRoute(0);
	}	
	document.getElementById("textBoxContainer").removeChild(div.parentNode);
}