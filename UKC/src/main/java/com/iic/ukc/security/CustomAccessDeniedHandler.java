package com.iic.ukc.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.iic.ukc.dao.TidalDaoImpl;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	private static Logger LOGGER = Logger.getLogger(CustomAccessDeniedHandler.class);
	
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		LOGGER.info("---- CustomAccessDeniedHandler ----");
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null) {
			LOGGER.info(
					"User: " + auth.getName() + " attempted to access the protected URL: " + request.getRequestURI());
		}

		response.sendRedirect(request.getContextPath() + "/accessdenied");
	}

}
