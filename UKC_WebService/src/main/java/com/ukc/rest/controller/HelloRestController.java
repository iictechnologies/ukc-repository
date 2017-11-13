package com.ukc.rest.controller;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloRestController {
	private static Logger LOGGER = Logger.getLogger(HelloRestController.class);

	@RequestMapping(value = "/hello", method = RequestMethod.GET)
	public String hello() {
		LOGGER.info("Request Forwarded to hello.jsp");
		return "hello";
	}
}
