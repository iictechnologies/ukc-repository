(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', "${googleanalyticsid}", 'auto');

function logout(){
	document.getElementById('logout').submit();
}
//For genrating token for jackson and ajax call for csrf security
$(function () {
	token = $("meta[name='_csrf']").attr("content");
	header = $("meta[name='_csrf_header']").attr("content");
	$(document).ajaxSend(function(e, xhr, options) {
		xhr.setRequestHeader(header, token);
	});

	//checkSessionExistance();
	$("#logout_id").click(function(){
		jConfirm('Are you sure you want to Sign out?','Sign out', function(confirmed){
			  if(confirmed){
				  document.getElementById('logout').submit();
			  }
		});
	});
	
	
	$('.changepwdfrm').submit(function(e) {
        //prevent Default functionality
        e.preventDefault();
        
        $.ajax({
        	url : 'users/changepassword',
        	type : 'POST',
        	dataType: "json",
        	data : {userid : $('#userid').val(), password: $("#current_password").val() , newPassword :$("#new_password").val() },
        	success :  function(response){
        		if(response.status==200){
        			jCustomConfirm('Password Updated Successfully, Please login again','Change Password', function(confirmed){
    					  if(confirmed){
    						 logout();
    					  }
    				});
          		}else if(response.status==404){
          			jAlert(response.message, 'Forgot Password');
          		}else if(response.status==500){
          			jAlert(response.message, 'Forgot Password');
          		}
        	},
        	error : function(error){
        		jAlert("Error on changing the password", 'Change Password');
        		console.log(error);
        	},
        	
        	failure : function(failure){
        		jAlert("Failure on changing the password");
        		console.log(failure);
        	}
        });
	});
	
});
	
function showChangePasswordWindow() {
	$("#change_password_div").css("display", "block");
	$('.changepwdfrm')[0].reset();
}

function closeChangePasswordWindow() {
	$("#change_password_div").css("display", "none");
}

function validateFields(textbox, type) {

	//password between 6 to 20 characters which contain 
	// at least one numeric digit, one uppercase, and one lowercase letter
	var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

	if (textbox.value === '') {
		textbox.setCustomValidity('Please Enter ' + textbox.placeholder);
	} else if (!textbox.value.match(passw) && type === 'password') {
		textbox
				.setCustomValidity('Password should contain minimum length 5, at least one uppercase, one lowercase, one digit');
	} else {
		textbox.setCustomValidity('');
	}
	return true;
}

function validatePassword(confirm_password) {
	var password = document.getElementById("new_password");
	var current_password = document.getElementById("current_password");
	if (confirm_password.value === "") {
		confirm_password.setCustomValidity('Please Enter '
				+ confirm_password.placeholder);
	} else if (password.value != confirm_password.value) {
		confirm_password.setCustomValidity("Passwords did not match");
	} else if (current_password.value == confirm_password.value) {
		confirm_password
				.setCustomValidity('New Password should not be same as Current password');
	} else {
		confirm_password.setCustomValidity('');
	}
	return true;
}