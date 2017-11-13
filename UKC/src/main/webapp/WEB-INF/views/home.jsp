<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ include file="/WEB-INF/views/include.jsp"%>
<html>
<head>
<title>Under Keel Clearance</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="_csrf" content="${_csrf.token}"/>
<!-- default header name is X-CSRF-TOKEN -->
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<!-- Stylesheets -->

<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/lib/bootstrap.min.css' type="text/css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/lib/ol.css" type="text/css">
<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/lib/jquery.alerts.css' type="text/css" />
<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/lib/glyphicons.css' type="text/css" />
<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/bootstrap-popover.css' type="text/css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/map.css" type="text/css">

<!-- Scripts -->
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery-ui.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery-touch.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/bootstrap.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/moment.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/combodate.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/ol-debug.js"></script>
<script src='${pageContext.request.contextPath}/resources/js/lib/turf.min.js'></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/highcharts.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/highcharts-boost.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/pattern-fill.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery.alerts.js"></script>

<script src="${pageContext.request.contextPath}/resources/js/home.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/validations.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/loader.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/rtzp.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/waypoint.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/map.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/ukcgraph.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/tidegraph.js"></script>

<script type="text/javascript">
	var contextpath = "${pageContext.request.contextPath}/resources/";
	var token='', header='';
</script>

</head>
<body onload="loadMap()">
	<div id="mapdiv"></div>
	<input type="hidden" id="authusername" value="${username}" />
	<input type="hidden" id="userid" value="${userid}" />
	<input type="hidden" id="geoserverUrl" value="${geoserverUrl}" />
	<input type="hidden" id="geoserverWorkspace"
		value="${geoserverWorkspace}" />
	<input type="hidden" id="geoserverBackdropLayer"
		value="${geoserverBackdropLayer}" />
	<input type="hidden" id="geoserverDepthPointLayer"
		value="${geoserverDepthPointLayer}" />
	<input type="hidden" id="authenticatedusername" value="${username}" />

	<!-- For logout we need add form with post method  -->
	<c:url var="logoutUrl" value="/logout.htm" />
	<form action="${logoutUrl}" id="logout" method="post">
		<input type="hidden" name="${_csrf.parameterName}"
			value="${_csrf.token}" />
	</form>

	<div class="dropdown">
		<div class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton"
			data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<span class="glyphicon glyphicon-user usericon"></span>
		</div>
		<ul class="dropdown-menu dropdown-menu-left"
			aria-labelledby="dropdownMenuButton">
			<li><a><span class="glyphicon glyphicon-user"></span>&nbsp;${username}</a></li>
			<li id="changepassword" onclick="showChangePasswordWindow();"><a><span
					class="glyphicon glyphicon-edit"></span>&nbsp;Change Password</a></li>
			<li><a id="logout_id" href="#"><span
					class="glyphicon glyphicon-log-out"></span>&nbsp;Sign out</a></li>
		</ul>
	</div>


	<div id="change_password_div" class="change_password">
		<h4>Change Password</h4>

		<form method="post" class="changepwdfrm">

			<div class="controls-row">
				<input type="password" class="login__input" name="current_password"
					placeholder="Current Password" id="current_password" maxlength="15"
					required="required" oninvalid="validateFields(this,'password');"
					oninput="validateFields(this,'password');" autocomplete="off">
			</div>


			<div class="controls-row">
				<input type="password" class="login__input"
					placeholder="New Password" id="new_password" name="new_password"
					maxlength="15" required="required"
					oninvalid="validateFields(this,'password');"
					oninput="validateFields(this,'password');" autocomplete="off">
			</div>


			<div class="controls-row">
				<input type="password" class='login__input'
					placeholder="Confirm Password" id="confirm_password" maxlength="15"
					required="required" name="confirm_password"
					oninvalid="validatePassword(this);"
					oninput="validatePassword(this);" autocomplete="off">
			</div>

			<div class="changepw_btns">
				<button class="changepw_savebtn" id="password_modal_save"
					type="submit" onclick="changePassword()">Update</button>
				<button class="changepw_closebtn"
					onclick="closeChangePasswordWindow()" type="button">Close</button>
			</div>
		</form>
	</div>
	<!-- Area of Interest window -->
	<div class="coordinateswindow container">
		<div>
			<h4 align="center">Area of Interest</h4>
			<table>
				<tr class="form-group">
					<td>Upper Left Coordinates:</td>
					<td><input type="text" id="upperleft"
						value="53.742943,-0.395928" class="form-control"></td>
				</tr>
				<tr class="form-group">
					<td>Lower Right Coordinates:</td>
					<td><input type="text" id="lowerright"
						value="53.554707,0.243940" class="form-control"></td>
				</tr>

				<tr class="form-group">
					<td>Station Name:</td>
					<td><input type="text" id="stationname" value="Humber"
						class="form-control"></td>
				</tr>

				<tr>
					<td colspan="2" align="center"><input type="submit"
						onclick="zoomToAOI()" value="Submit" class="btn btn-info"></td>
				</tr>
			</table>
		</div>
	</div>

	<div id="ukcgraphdiv"></div>
	<div id="taptorefreshdiv">
		<span style="position: relative; top: calc(40%)" id="refreshtext">Tap
			to refresh</span>
	</div>

	<div id="factor" style="display: none;">
		<div class="container-fluid">
			<div class="mobilefactorheight">
				<div
					class="col-sm-2 col-md-1 col-lg-1 col-xs-12 mobiledispnone smdevices">&nbsp;</div>
				<div class="col-sm-8 col-md-5 col-lg-4 col-xs-12"
					style="height: 100%; overflow: auto;">
					<fieldset class="col-md-12" style="margin-top: 10px;">
						<legend>Factors:</legend>
						<form class="form-horizontal">

							<div class="form-group"
								style="position: relative; padding-bottom: 10px !important;">
								<label class="control-label col-sm-5 col-xs-5 mobile_labelfont">Quality:</label>
								<div class="col-sm-7 col-xs-7 inputposition mobile_width">
									<select id="quality" class="form-control select-sm"
										onchange="onQualityKeyUp()">
										<option value="yes">Yes</option>
										<option value="no">No</option>
									</select>
								</div>
							</div>

							<div class="form-group"
								style="position: relative; padding-bottom: 10px !important;">
								<label class="control-label col-sm-5 col-xs-5 mobile_labelfont">UKC
									Method:</label>
								<div class="col-sm-7 col-xs-7 inputposition mobile_width">
									<select id="profilemethod" onchange="onKeyUp()"
										class="form-control select-sm">
										<option value="deptharea" selected="selected">Depth
											Area</option>
										<option value="tin">TIN</option>
										<option value="closest">Closest Point</option>
									</select>
								</div>
							</div>
							<p style="height: 1px; width: 100%; background-color: #999;"></p>
							<div class="form-group">
								<div class="col-sm-12 col-xs-12 nopad"
									style="position: relative;">
									<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"
										style="margin-bottom: 10px;">
										<div id="addinput" onclick="addTextBox()"
											style="position: absolute; top: 0px; left: 5px;"></div>
									</div>
									<div id="textBoxContainer"
										class="col-xs-10 col-sm-10 col-md-10 col-lg-10 nopad"
										style="max-height: 150px; overflow: auto;"></div>
								</div>
							</div>
							<input type="hidden" name="${_csrf.parameterName}"
								value="${_csrf.token}" />
						</form>
					</fieldset>
					<div class="clearfix"></div>
					<fieldset class="col-md-12 mobiledisplay" style="margin-top: 10px;">
						<legend>Import RTZ/RTZP:</legend>
						<form class="form-horizontal">
							<div class="form-group">

								<div class="col-sm-12">
									<input type="file" id="mrtzFile" accept=".rtz, .rtzp"
										name="mrtzFile"
										style="position: relative; top: 5px; width: 200px;" />
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12" style="text-align: center;">
									<input type="button" onclick="validateRTZFile()" value="Import"
										class="btn btn-danger" style="letter-spacing: 1px;">
								</div>
							</div>
							<input type="hidden" name="${_csrf.parameterName}"
								value="${_csrf.token}" />
						</form>
					</fieldset>

				</div>
				<div class="col-sm-2 col-md-5 col-lg-4 col-xs-12 mobiledispnone">
					<fieldset class="col-md-12" style="margin-top: 10px;">
						<legend>Import RTZ/RTZP:</legend>
						<form class="form-horizontal">
							<div class="form-group">
								<div class="col-sm-12">
									<input type="file" id="rtzFile" accept=".rtz, .rtzp"
										name="rtzFile"
										style="position: relative; top: 5px; width: 200px;" />
								</div>
							</div>
							<div class="form-group">
								<div class="col-sm-12" style="text-align: center;">
									<button type="button" onclick="validateRTZFile()"
										class="btn btn-danger" style="letter-spacing: 1px;">Import</button>
								</div>
							</div>
							<input type="hidden" name="${_csrf.parameterName}"
								value="${_csrf.token}" />
						</form>
					</fieldset>
				</div>

				<div class="col-sm-1 col-md-1 col-lg-3 col-xs-12 mobiledispnone">&nbsp;</div>
			</div>
		</div>
	</div>
	<div id="tidegraphpdiv">
		<div id="tidegraphdiv"></div>
		<div id="journeyspan"></div>
	</div>
	<div id="tideerrordiv">
		<span id="warningimg"></span><span
			style="position: relative; top: calc(30%); color: red;">No
			tide service is available</span>
	</div>
	<div id="factordiv">
		<div id="factorButton" onclick="slideing()" title="click to slide"></div>
	</div>

	<div id="datepickerdiv">
		<span id="dateicon"></span> <input type="text" id="datetime24"
			data-format="DD-MM-YYYY HH:mm"
			data-template="DD / MM / YYYY - HH : mm" name="datetime" />
	</div>

	<div id="popup"></div>

	<div id="profile"></div>
	<div id="starttime"></div>
	<div id="laponetime"></div>
	<div id="laptwotime"></div>
	<div id="laponeline"></div>
	<div id="laptwoline"></div>
	<div id="endtime"></div>
	<div class="addmarkercss" id="addmarkerelement"></div>
	<div id="loadinggif"></div>
	<div id="loadingmodel"></div>
	<div id="longroute">

		<table id="longroutetable">
			<tr>
				<td colspan="2"></td>
				<td><div onclick="longRouteOff()" id="closelongroute">X</div></td>
			</tr>
			<tr>
				<td>Start Waypoint</td>
				<td>End Waypoint</td>
				<td>Distance (NM)</td>
			</tr>
			<tr>
				<td><select class="form-control select-sm" id="startwaypoint"
					onchange="calculateDistance(this.value)"></select></td>
				<td><select class="form-control select-sm" id="endwaypoint"
					onchange="calculateDistance(this.value)"></select></td>
				<td><input type="number" min="0" class="form-control"
					id="distance" onblur="calculateWayPoints()"></td>
			</tr>
			<tr>
				<td colspan="3"><button type="button"
						class="btn btn-info btn-sm" onclick="resetFields()">Reset</button></td>
			</tr>
			<tr>
				<td colspan="3"><button type="button"
						class="btn btn-primary btn-lg" id="longrouteprofile"
						onclick="findLongRouteDepthProfile()">Show UKC Profile</button></td>
			</tr>
		</table>
	</div>
	<div id="longrouteicon" onclick="longRouteOn()" title="Long Route">LR</div>
	<div id="clearrouteicon" onclick="clearRoute()" title="Clear Route">CR</div>
	<div id="stationId"></div>
</body>
</html>