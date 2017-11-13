package com.ukc.util;

import java.util.Base64;

public class StringUtils {

	public static final String PARAMETERNAME_API_KEY = "api_key";
	public static final String PARAMETER_APPENDER = "&";
	public static final String PARAMETER_EQUAL = "=";
	public static final String PARAMETER_QUESTION = "?";

	public static String encodeStringb64(String value) {
		return Base64.getEncoder().encodeToString(value.getBytes());
	}

	public static String decodeStringb64(String encodedString) {
		return new String(Base64.getDecoder().decode(encodedString));
	}
}
