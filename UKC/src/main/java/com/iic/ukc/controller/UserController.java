package com.iic.ukc.controller;

import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iic.ukc.dto.UserDto;
import com.iic.ukc.exception.DublicateUserNameException;
import com.iic.ukc.exception.UserNameNotFoundException;
import com.iic.ukc.service.IUserService;
import com.iic.ukc.util.ConfigFileUtils;
import com.iic.ukc.util.Email;
import com.iic.ukc.util.EmailFormatter;

/**
 * {@link UserController} is responsible for managing the users registration
 * user passwords and forgot password functionalities.
 * 
 * @author PSHV6291
 *
 */
@Controller
public class UserController {

	@Autowired
	private IUserService userService = null;

	@Autowired
	private ConfigFileUtils configFileUtils = null;

	/**
	 * Method to register the new User. User email as the username and with the
	 * details
	 * 
	 * @param userDto
	 * @return true if user is registered, else false if user is already exists
	 */
	@RequestMapping(value = "/users", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<Boolean> registerUser(@RequestBody UserDto userDto) {
		ResponseEntity<Boolean> responseEntity = null;
		try {
			responseEntity = new ResponseEntity<Boolean>(userService.addUser(userDto), HttpStatus.OK);
		} catch (DublicateUserNameException exception) {
			responseEntity = new ResponseEntity<Boolean>(false, HttpStatus.CONFLICT);
		}
		return responseEntity;
	}

	/**
	 * Method to provide all the registered users
	 * 
	 * @return the list of users
	 */
	@RequestMapping(value = "/users", method = RequestMethod.GET)
	public @ResponseBody ResponseEntity<List<UserDto>> getAllUsers() {

		List<UserDto> users = (List<UserDto>) userService.loadUsers();

		return new ResponseEntity<List<UserDto>>(users, HttpStatus.OK);
	}

	/**
	 * Method check the username existence. if exists the user returns true else
	 * retuns false
	 * 
	 * @param username
	 *            username of the register user
	 * @return the true if username exists else false if username does not exist
	 */
	@RequestMapping(value = "/userexists", method = RequestMethod.GET)
	public @ResponseBody ResponseEntity<Boolean> getUserBy(@RequestParam String username) {
		ResponseEntity<Boolean> responseEntity = null;
		try {
			userService.getUserBy(username);
			responseEntity = new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} catch (UserNameNotFoundException exception) {
			responseEntity = new ResponseEntity<Boolean>(false, HttpStatus.OK);
		}
		return responseEntity;
	}

	/**
	 * Method to handle the forgot password
	 * 
	 * @param userName
	 *            user email of the registered user
	 * @return json response of the status and message
	 * @throws UserNameNotFoundException
	 */
	@RequestMapping(value = "/users/resetpassword", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<Properties> handleForgotPassword(@RequestParam String userName)
			throws UserNameNotFoundException {
		Properties props = new Properties();
		UserDto user = userService.getUserBy(userName);
		Email.config(configFileUtils.getEmailfrom(), configFileUtils.getEmailfrompassword(),
				configFileUtils.getEmailhost(), configFileUtils.getEmailport());
		Email.send(user.getEmail(), EmailFormatter.FORGOT_PASSWORD_SUBJECT,
				EmailFormatter.formatForForgotPassword(user.getFirstName(), user.getPassword()));

		props.put("status", HttpStatus.OK.value());
		props.put("message", HttpStatus.OK);

		return new ResponseEntity<Properties>(props, HttpStatus.OK);
	}

	/**
	 * Method to handle the change password
	 * 
	 * @param userid
	 * @param password
	 * @param newPassword
	 * @return status and message as json response
	 * @throws UserNameNotFoundException
	 */
	@RequestMapping(value = "/users/changepassword", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<Properties> changePassword(@RequestParam int userid,
			@RequestParam String password, @RequestParam String newPassword) throws UserNameNotFoundException {
		Boolean status = userService.changePassword(userid, password, newPassword);

		Properties props = new Properties();
		if (status) {
			props.put("status", HttpStatus.OK.value());
			props.put("message", HttpStatus.OK);
		} else {
			props.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
			props.put("message", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Properties>(props, HttpStatus.OK);
	}
}
