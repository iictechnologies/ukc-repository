package com.iic.ukc.controller;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.SQLException;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.iic.ukc.exception.UserNameNotFoundException;

/**
 * ExceptionControllerAdvice is a controller class to handle Exception in the
 * application
 * 
 * @author PSHV6291
 *
 */
@ControllerAdvice
public class GlobalExceptionController {
	private static Logger LOGGER = Logger.getLogger(GlobalExceptionController.class);

	/**
	 * method to handle {@link JSONException} class
	 * 
	 * @param json
	 *            parameter {@link JSONException} object
	 * @return the model and view object
	 */
	@ExceptionHandler(value = JSONException.class)
	public ModelAndView handler(JSONException json) {
		ModelAndView modelAndView = new ModelAndView("exception");
		modelAndView.addObject("exceptionname", json.getClass().getSimpleName());
		modelAndView.addObject("exceptionmessagefull", getStackTrace(json));
		modelAndView.addObject("exceptionmessage", json.getMessage());
		LOGGER.error(getStackTrace(json));
		return modelAndView;
	}

	/**
	 * method to handle {@link SQLException} class
	 * 
	 * @param sql
	 *            parameter {@link SQLException} object
	 * @return the ModelAndView
	 */
	@ExceptionHandler(value = SQLException.class)
	public ModelAndView handler1(SQLException sql) {
		ModelAndView modelAndView = new ModelAndView("exception");
		modelAndView.addObject("exceptionname", sql.getClass().getSimpleName());
		modelAndView.addObject("exceptionmessagefull", getStackTrace(sql));
		modelAndView.addObject("exceptionmessage", sql.getMessage());
		LOGGER.error(getStackTrace(sql));
		return modelAndView;
	}

	@ExceptionHandler(value = {UserNameNotFoundException.class})
	public @ResponseBody ResponseEntity<String> handleException(UserNameNotFoundException exception) throws JSONException{
		LOGGER.error(getStackTrace(exception));
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("status", HttpStatus.NOT_FOUND.value());
		jsonObject.put("message", exception.getMessage());
		return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
	}
	
	/**
	 * method to print stack trace in the log console
	 * 
	 * @param throwable
	 *            parameter {@link Throwable} object
	 * @return root stack trace string
	 */
	public static String getStackTrace(final Throwable throwable) {
		final StringWriter sw = new StringWriter();
		final PrintWriter pw = new PrintWriter(sw, true);
		throwable.printStackTrace(pw);
		return sw.getBuffer().toString();
	}
}