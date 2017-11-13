package com.iic.ukc.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.filter.DelegatingFilterProxy;

import com.iic.ukc.util.StringUtils;

/**
 * {@link LoginController} class is responsible for doing the login
 * functionalities. display login page, login, logout functionalities can be
 * done.
 * 
 * @author KJKR6571
 *
 */
@Controller
public class LoginController {

	String pageToShow = "";

	private static Logger LOGGER = Logger.getLogger(LoginController.class);

	/**
	 * Method to show login page to the user.
	 * 
	 * @param logout
	 * @param sessionExpire
	 * @param request
	 * @param model
	 * @return the login page to UI
	 * @throws Exception
	 */
	@RequestMapping(value = "/displaylogin.htm")
	public String displayLoginPage(@RequestParam(value = "logout", required = false) String logout,
			@RequestParam(value = "sessionexpire", required = false) String sessionexpire, HttpServletRequest request,
			Model model) throws Exception {

		String exceptionMessage = null;

		AuthenticationException exception = (AuthenticationException) request.getSession()
				.getAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		LOGGER.info(exception);

		// Handling the spring security authentication exception with custom
		// messages
		if (exception != null) {
			if (exception instanceof BadCredentialsException) {
				exceptionMessage = StringUtils.ERROR_MESSAGE_BAD_CREDENTIALS;
			} else if (exception instanceof DisabledException) {
				exceptionMessage = StringUtils.ERROR_MESSAGE_DISABLED;
			} else if (exception instanceof SessionAuthenticationException) {
				exceptionMessage = StringUtils.ERROR_MESSAGE_SESSION_AUTHENTICATION;
			} else {
				exceptionMessage = StringUtils.ERROR_MESSAGE_UNKNOWN;
			}
		} else if (logout != null) {
			request.setAttribute("logout", "Successfully logged out");
		} else if (sessionexpire != null) {
			request.setAttribute("sessionexpire", "Your session expired");
		}

		LOGGER.info("Error message when login to app:" + exceptionMessage);
		request.getSession().removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		model.addAttribute("exceptionMessage", exceptionMessage);
		return StringUtils.LOGIN_PAGE;
	}

	/**
	 * Method to show access denied page to the user
	 * 
	 * @return access denied page to the user
	 * @throws Exception
	 */
	@RequestMapping(value = "/accessdenied", method = RequestMethod.GET)
	public String accessDeniedPage() throws Exception {
		LOGGER.error("Access Denied");
		JdbcDaoImpl tst=null;
		DelegatingFilterProxy proxy=null;
		FilterChainProxy proxss=null;
		ExceptionTranslationFilter filter=null;
		UsernamePasswordAuthenticationFilter filtser=null;
		return StringUtils.ACCESSDENIED_PAGE;
	}
}
