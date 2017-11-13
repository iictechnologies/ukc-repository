$(function() {
	window.sessionStorage.clear();
    //hang on event of form with id=myform
    $(".registerform").submit(function(e) {
        //prevent Default functionality
        e.preventDefault();
        //get the action-url of the form

        var user = {
        		firstName : $("#firstname").val(),
        		lastName : $("#lastname").val(),
        		email : $("#email").val(),
        		password : $("#password").val(),
        		phoneNumber : $('.selected-flag').attr('title').split(': ')[1]+" "+$("#phone").val(),
        		roleName : "NA",
        		enable : "true",
        		userId : "0"
        	}
        	$.ajax({
        		dataType : 'json',
        		type : 'POST',
        		url : "users",
        		data : JSON.stringify(user),
        		contentType : 'application/json; charset=utf-8',
        		beforeSend : function(xhr) {
        			xhr.setRequestHeader($("meta[name='_csrf_header']").attr("content"), $("meta[name='_csrf']").attr("content"));
        		},
        		success : function(response) {
        			
        			if(response===true){
        				jCustomConfirm('Successfully Signed up','Sign up', function(confirmed){
        					  if(confirmed){
        						 location.reload();
        					  }
        				});
        			}else{
        				jAlert("Failed to registered user");
        			}
        		},

        		failure : function(response) {
        			jAlert(response.responseText);
        		},
        		error : function(response) {
        			//indicates that conflict with user
        			if(response.status==409){
        				jAlert("User already register with provided email.");
        			}
        			
        		}
        	});
    });
    
    
    $('.viewpassword').on('mouseup pointerup', function(){
    	$(this).removeClass('glyphicon-eye-open');
    	$(this).addClass('glyphicon-eye-close');
    	$('#u_password').attr('type','password');
    });
    
    $('.viewpassword').on('mousedown pointerdown', function(){
    	$(this).removeClass('glyphicon-eye-close');
    	$(this).addClass('glyphicon-eye-open');
    	$('#u_password').attr('type','text');
    });

    $('.loginform').submit(function(e) {
    	window.sessionStorage.setItem('username', $('#userName').val());
    });
    
    $('.form-forgotpassword').submit(function(e){
    	  e.preventDefault();
  
    	  $("#loadinmask").addClass("loadinmask");
    	      	
          $.ajax({
          	url : 'users/resetpassword',
          	type : 'POST',
          	dataType: "json",
          	data : {userName : $('#username_fp').val() },
          	beforeSend : function(xhr) {
    			xhr.setRequestHeader($("meta[name='_csrf_header']").attr("content"), $("meta[name='_csrf']").attr("content"));
    		},
          	success :  function(response){
          		if(response.status==200){
          			jCustomConfirm('Password has been sent to your Email Id','Recover Password', function(confirmed){
    					  if(confirmed){
    						 location.reload();
    					  }
    				});
            		console.log(response);
          		}else if(response.status==404){
          			jAlert("Username not found", 'Forgot Password');
          			$("#loadinmask").removeClass("loadinmask");
          		}
          		
          	},
          	error : function(error){
          		jAlert("Error on sending the password", 'Change Password');
          		$("#loadinmask").removeClass("loadinmask");
          		console.log(error);
          	},
          	
          	failure : function(failure){
          		jAlert("Failure on sending the password");
          		$("#loadinmask").removeClass("loadinmask");
          		console.log(failure);
          	}
          });
    });
});

function validateEmail(emailField){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) == false){
        return false;
    }
    return true;
}

function resetFields() {
	$('.login__input').val('');
}

function checkUserNameExistence(userName){
	var isExists=false;
	if(userName.value!=""){
		$.ajax({
			type : 'GET',
			url : "userexists?username="+userName.value,
			async : false,
			beforeSend : function(xhr) {
				xhr.setRequestHeader($("meta[name='_csrf_header']").attr("content"), $("meta[name='_csrf']").attr("content"));
			},
			success : function(response) {
				isExists = response;
			}
		});
	}
	return isExists;
}

function validateFields(textbox, type){
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	//password between 6 to 20 characters which contain 
	// at least one numeric digit, one uppercase, and one lowercase letter
	var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
	var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 
	
	if (textbox.value === '') {
		
        textbox.setCustomValidity('Please Enter '+textbox.placeholder);
        
    }
	else if(/[^a-zA-Z0-9]/.test(textbox.value) && type==='text'){
		
    	textbox.setCustomValidity('Please Enter valid '+textbox.placeholder);
    	
    }
	else if(!textbox.value.match(reg) && type==='email' && textbox.validity.typeMismatch){
		
    	textbox.setCustomValidity('Please Enter valid '+textbox.placeholder);
    	
    }
	else if(!textbox.value.match(passw) && type==='password'){
		
    	textbox.setCustomValidity('Password should contain minimum length 5, at least one uppercase, one lowercase, one digit');
    	
    }
    else{
    	
    	if(type==='email'){
    		var data=checkUserNameExistence(textbox);
    		if(data){
    			textbox.setCustomValidity(textbox.placeholder+" already exists, try with different email id");
    		}else{
    			textbox.setCustomValidity('');
    		}
    	}else{
    		textbox.setCustomValidity('');
    	}

    }
	return true;
}

function validatePassword(confirm_password){
	var password = document.getElementById("password");
	
	if(confirm_password.value===""){
		 confirm_password.setCustomValidity('Please Enter '+confirm_password.placeholder);
	}
	else if(password.value != confirm_password.value) {
	    confirm_password.setCustomValidity("Passwords did not match");
	  } else {
	    confirm_password.setCustomValidity('');
	  }
	return true;
}

function validatePhoneNumber(textbox){
	var telInput = $("#phone");
	
	telInput.intlTelInput({
		  utilsScript: contextpath+"js/lib/utils.js"
	});
	
	if(textbox.value === ''){
		 textbox.setCustomValidity('Please Enter '+textbox.placeholder);
	}else if($.trim(telInput.val()) && !telInput.intlTelInput("isValidNumber")){
		textbox.setCustomValidity('Please Enter valid '+textbox.placeholder);
	}else{
		textbox.setCustomValidity('');
	}
}

function validateEmailAddress(textbox) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if (textbox.value === '') {
		textbox.setCustomValidity('Please Enter ' + textbox.placeholder);
	} else if (!textbox.value.match(reg) && textbox.validity.typeMismatch) {
		textbox.setCustomValidity('Please Enter valid ' + textbox.placeholder);
	}else{
		textbox.setCustomValidity('');
	}
	return true;
}

