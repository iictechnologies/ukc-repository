<%@ include file="/WEB-INF/views/include.jsp"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="images/pmrda_title_logo.png" type="image/png">
<title>Session Expired</title>
<script
	src="${pageContext.request.contextPath}/resources/js/lib/jquery.min.js"></script>
<style>
.sessionexpirepage {
	padding: 6px 12px !important;
}

.cont {
	position: relative;
	height: 100%;
	background-image:
		url(${pageContext.request.contextPath}/resources/images/UKC.png);
	background-size: 100% 100%;
	overflow: auto;
	font-family: "Open Sans", Helvetica, Arial, sans-serif;
	background-repeat: no-repeat;
}

body {
	margin: 0px;
	padding: 0px;
	height: 100%;
}
</style>
<script type="text/javascript">
	$(document).ready(function() {
		$('body').css('height', $(window).height());
	});
</script>
</head>
<body>
	<div class="cont">
		<div style="position: relative; top: calc(50% - 300px);">
			<h2 style="text-align: center; color: #fff;" class="text-info">Oops...</h2>
			<div class="col-md-3 india-map" style="border: 0px">&nbsp;</div>
			<div class="col-md-6" style="text-align: center;" class="text-info">
				<h2 style="color: #fff;; text-align: center" align="center">${message}</h2>
				<b style="font-size: 20px; color: #fff;">Please <a
					href="displaylogin.htm" style="color: red">click here</a> to Sign in
					again
				</b>
			</div>
		</div>
	</div>
</body>
</html>
