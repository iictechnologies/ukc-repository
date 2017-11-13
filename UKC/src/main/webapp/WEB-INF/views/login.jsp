<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ include file="/WEB-INF/views/include.jsp"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="_csrf" content="${_csrf.token}"/>
<!-- default header name is X-CSRF-TOKEN -->
<meta name="_csrf_header" content="${_csrf.headerName}"/>
<title>Login</title>
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery.min.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery.alerts.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/registeruser.js"></script>

<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/lib/bootstrap.min.css' type="text/css">
<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/lib/jquery.alerts.css' type="text/css">
<link rel="stylesheet" href='${pageContext.request.contextPath}/resources/css/Login.css' type="text/css">

<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/lib/intlTelInput.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/lib/demo.css">

<script>
var contextpath = "${pageContext.request.contextPath}/resources/";
</script>

<script type="text/javascript">
$(document).ready(function(){
	
	var telInput = $("#phone");
	telInput.intlTelInput({
		  utilsScript: contextpath+"js/lib/utils.js"
	});
	
	$(".row1").hide();
	$(".row3").hide();
	
	var height = $(window).height();
	
	$(".registerlink").on('click', function(){
		resetFields();
		$(".row2").hide();
		$(".row1").show();
		$(".row3").hide();
		$(".login").css("height","100%");
	});
	
	$(".loginbutton").on('click', function(){
		resetFields();
		$('.login__form').find('.errorMsgBG').remove();
		$(".row2").show();
		$(".row1").hide();
		$(".row3").hide();
		$(".login").css("height","100%");
	});
	
	$(".forgotbtn").on('click', function(){
		resetFields();
		$('.login__form').find('.errorMsgBG').remove();
		$(".row2").hide();
		$(".row1").hide();
		$(".row3").show();
		$(".login").css("height","200px");
	});
	
	$('.number').keyup(function () { 
	    this.value = this.value.replace(/[^0-9\.]/g,'');
	});
	
	$('.validation').on('focus', function(){
		$('.form-control').removeClass('errorClass');
	});
	
	$('.registerform .form-control').on('paste',function(e) { 
		 e.preventDefault();
	});
});
</script>
</head>
<body>

	<div class="cont">
		<div class="demo">
			<div class="login row2">
				<div class="logo_img">
					<img
						src="${pageContext.request.contextPath}/resources/images/ukc_logo.png"
						style="">
				</div>
				<div class="clearfix"></div>
				<c:url value="/login" var="loginUrl" />
				<form class="form-signin loginform" method="POST"
					action="${loginUrl}">

					<div class="login__form">
						<c:if test="${sessionexpire != null }">
							<span class="errorMsgBG alert alert-warning" style="color: red">${sessionexpire}</span>
						</c:if>
						<c:if test="${exceptionMessage !=null}">
							<span class="errorMsgBG alert alert-warning" style="color: red">${exceptionMessage}</span>
						</c:if>
						<div class="login__row">
							<span class="glyphicon glyphicon-user"
								style="color: white; font-size: 18px;"></span> <input
								type="text" class="login__input" placeholder="Username (E-mail)"
								name="userName" id='userName' required=""
								oninvalid="this.setCustomValidity('Please Enter Username.')"
								oninput="this.setCustomValidity('')" autocomplete="off" />
						</div>
						<div class="login__row" style="position: relative;">
							<span class="glyphicon glyphicon-lock"
								style="color: white; font-size: 18px;"></span> <input
								type="password" class="login__input" id="u_password"
								placeholder="Password" name="pwd" required=""
								oninvalid="this.setCustomValidity('Please Enter Password.')"
								oninput="this.setCustomValidity('')" autocomplete="off" /> <span
								class="glyphicon glyphicon-eye-close viewpassword"></span>
						</div>

						<button type="submit" class="login__submit">Sign in</button>
						<p class="login__signup">
							<a class="registerlink">Sign up</a>
						</p>
						<p class="login__signup" style="text-align: center;">
							<a class="forgotbtn">Forgot password? &nbsp;</a>
						</p>
					</div>
					<input type="hidden" name="${_csrf.parameterName}"
						value="${_csrf.token}" />
				</form>
			</div>

			<div class="login row1">
				<h3 class="heading_register_user">Sign up</h3>
				<form class="registerform form-signin" role="form">
					<div class="login__row">
						<input type="text" placeholder="First Name"
							class="login__input validation validstring" id="firstname"
							maxlength="20" required="required"
							oninvalid="validateFields(this,'text');"
							oninput="validateFields(this,'text');" autocomplete="off">
					</div>
					<div class="login__row">
						<input type="text" placeholder="Last Name"
							class="login__input validation validstring" id="lastname"
							maxlength="20" required="required"
							oninvalid="validateFields(this,'text');"
							oninput="validateFields(this,'text');" autocomplete="off">
					</div>
					<div class="login__row">
						<input type="email" placeholder="E-mail"
							class="login__input validation email" id="email" maxlength="50"
							required="required" oninvalid="validateFields(this,'email');"
							oninput="validateFields(this,'email');"
							onfocusout="checkUserNameExistence(this);" autocomplete="off">
					</div>

					<div class="login__row result">
						<input id="phone" type="tel" placeholder="Phone Number"
							class="login__input validation number" required="required"
							oninvalid="validatePhoneNumber(this);"
							oninput="validatePhoneNumber(this);" autocomplete="off">
					</div>
					<div class="login__row">

						<input type="password" placeholder="Password"
							class="login__input validation" id="password" maxlength="15"
							required="required" oninvalid="validateFields(this,'password');"
							oninput="validateFields(this,'password');" autocomplete="off">
					</div>

					<div class="login__row">

						<input type="password" placeholder="Confirm Password"
							class="login__input validation" id="confirmpassword"
							maxlength="15" required="required"
							oninvalid="validatePassword(this);"
							oninput="validatePassword(this);" autocomplete="off">
					</div>
					<button type="submit" class="login__submit_registerbtn">Submit</button>
					<button type="reset" class="login__reset" onclick="resetFields()">Reset</button>
					<p class="login__signup" style="text-align: center;">
						<a class="loginbutton">Sign in</a>
					</p>
				</form>
			</div>

			<div class="login row3">
				<h3 class="heading_register_user">Forgot Password</h3>
				<form class="form-forgotpassword" style="padding: 1.5rem 2rem;"
					role="form">
					<div class="login__row" style="margin-bottom: 20px;">
						<input type="text" placeholder="Username (E-mail)"
							class="login__input validation validstring" id="username_fp"
							maxlength="50" required="required"
							oninvalid="validateEmailAddress(this);"
							oninput="validateEmailAddress(this);" autocomplete="off">
						<p class="login__signup"
							style="text-align: center; padding-top: 20px; font-size: 12px;">*Password
							will be sent to your registered E-mail</p>
					</div>
					<button type="submit" class="login__submit_registerbtn">Send</button>
					<button type="button" class="login__reset loginbutton">Close</button>
				</form>
			</div>

		</div>
		<div id="loadinmask"></div>
	</div>
	<script
		src="${pageContext.request.contextPath}/resources/js/lib/intlTelInput.js"></script>
</body>
</html>