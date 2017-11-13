package com.iic.ukc.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * {@link SessionController} class, which handles the session expired feature
 * 
 * @author PSHV6291
 */
@Controller
public class SessionController {
	/**
	 * Method to check the session, whether exists the user session or not
	 * 
	 * @param request
	 *            The http request from the user
	 * @return true, if the session exists else false, if the session doen't
	 *         exist
	 */
	@RequestMapping(value = "/sessionstatus", method = RequestMethod.GET)
	public @ResponseBody boolean checkSession(HttpServletRequest request) {
		if (request.getUserPrincipal() != null) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Method to show session expired page to the user, if the session is
	 * expired.
	 * 
	 * @param invalid
	 *            the input, shows invalid if the session is invalid
	 * @param timeout
	 *            the timeout, shows session expired message, if the session is
	 *            timed out
	 * @param request
	 *            The http request from the user
	 * @return the session expired page
	 */
	@RequestMapping(value = "/sessionexpired", method = RequestMethod.GET)
	public String sessionExpired(@RequestParam(value = "invalid", required = false) String invalid,
			@RequestParam(value = "timeout", required = false) String timeout, HttpServletRequest request) {

		if (invalid != null) {
			request.setAttribute("message", "Your current session is Signed out as you are Signed in other system");
		} else if (timeout != null) {
			request.setAttribute("message", "Your session has been expired");
		}

		return "sessionexpired";
	}
}
