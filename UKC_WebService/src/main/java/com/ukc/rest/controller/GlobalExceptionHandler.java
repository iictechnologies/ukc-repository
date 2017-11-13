package com.ukc.rest.controller;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.sun.jersey.api.client.ClientHandlerException;

@ControllerAdvice
public class GlobalExceptionHandler {
	private static Logger LOGGER = Logger.getLogger(TidalWebserviceController.class);

	@ExceptionHandler(JSONException.class)
	public ResponseEntity<String> handleJsonException(JSONException exception) throws JSONException {
		LOGGER.info(getStackTrace(exception));
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		jsonObject.put("message", exception.getMessage());
		return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(ClientHandlerException.class)
	public ResponseEntity<String> handleSocketException(ClientHandlerException exception) throws JSONException {
		LOGGER.info(getStackTrace(exception));
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
		jsonObject.put("message", "swagger server down or not available");
		return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.SERVICE_UNAVAILABLE);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<String> handleException(Exception exception) throws JSONException {
		LOGGER.info(getStackTrace(exception));
		
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
