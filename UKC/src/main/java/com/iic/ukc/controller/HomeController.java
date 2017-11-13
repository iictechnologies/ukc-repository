package com.iic.ukc.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.iic.ukc.dto.UserDto;
import com.iic.ukc.exception.UserNameNotFoundException;
import com.iic.ukc.service.IUserService;
import com.iic.ukc.util.ConfigFileUtils;
import com.iic.ukc.util.UKCConstants;

/**
 * HomeController is a controller class to display home page
 * 
 * @author SMDV4518
 *
 */
@Controller
public class HomeController {
	private static Logger LOGGER = Logger.getLogger(HomeController.class);

	@Autowired(required = true)
	private ConfigFileUtils configFileUtils = null;
	@Autowired
	private IUserService userService = null;

	/**
	 * This method is used to display Home page with GEO-SERVER URL details on
	 * map
	 * 
	 * @param request
	 * @return home.jsp
	 * @throws UserNameNotFoundException
	 */
	@RequestMapping(UKCConstants.HOME_URL)
	public String showHomePage(HttpServletRequest request) throws UserNameNotFoundException {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		UserDto user = userService.getUserBy(auth.getName());
		request.setAttribute("username", user.getFirstName());
		request.setAttribute("userid", user.getUserId());

		LOGGER.info("Request forwarding to home.jsp");
		request.setAttribute("googleanalyticsid", configFileUtils.getGoogleanalyticsid());
		request.setAttribute("geoserverUrl", configFileUtils.getGeoserverUrl());
		request.setAttribute("geoserverWorkspace", configFileUtils.getGeoserverWorkspace());
		request.setAttribute("geoserverBackdropLayer", configFileUtils.getGeoserverBackdropLayer());
		request.setAttribute("geoserverDepthPointLayer", configFileUtils.getGeoserverDepthPointLayer());
		return UKCConstants.HOME_PAGE;
	}
}