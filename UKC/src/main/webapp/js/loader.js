var slideup = false;
function slideing() {

	if (!slideup) {
		var height = $(window).height();
		var fheight = (height * 44 / 100);
		$("#factor").slideDown();
		$("#factordiv").css({
			"height" : fheight,
			"z-index" : 9998,
			"border-top" : "1px solid"
		});
		$("#factorButton").css({
			"-webkit-transform" : "rotate(180deg)",
			"-moz-transform" : "rotate(180deg)",
			"-ms-transform" : "rotate(180deg)",
			"-o-transform" : "rotate(180deg)",
			"transform" : "rotate(180deg)"
		});
		slideup = true;
	} else {
		$("#factor").slideUp();
		$("#factordiv").css({
			"height" : 110,
			"border-top" : "0px solid"
		});
		$("#factorButton").css({
			"-webkit-transform" : "rotate(360deg)",
			"-moz-transform" : "rotate(360deg)",
			"-ms-transform" : "rotate(360deg)",
			"-o-transform" : "rotate(360deg)",
			"transform" : "rotate(360deg)"
		});
		slideup = false;
		if(ukcGraph)
		updateFactorValuesOnLoadGraph();
	}
}

/*************** Loading ************/

function addloading() {
	$("#loadingmodel").css("display", "block");
	$("#loadinggif").addClass("loading");
	$("#refreshtext").html("");
}

function removeloading() {
	$("#loadingmodel").css("display", "none");
	$("#loadinggif").removeClass("loading");
	$("#refreshtext").html("Tap to refresh");
}