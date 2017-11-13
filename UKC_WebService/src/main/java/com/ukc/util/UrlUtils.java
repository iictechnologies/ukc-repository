package com.ukc.util;

import org.apache.log4j.Logger;

public class UrlUtils {
	private static Logger LOGGER = Logger.getLogger(UrlUtils.class);

	public static String prepareUrl(PropertyfileUtils utils, String serviceUri, String decodeparameters) {
		StringBuilder urlBuilder = new StringBuilder(utils.getTidalserviceurl());
		urlBuilder.append(serviceUri);
		urlBuilder.append(StringUtils.PARAMETER_QUESTION);
		urlBuilder.append(decodeparameters);
		urlBuilder.append(StringUtils.PARAMETER_APPENDER);
		urlBuilder.append(StringUtils.PARAMETERNAME_API_KEY);
		urlBuilder.append(StringUtils.PARAMETER_EQUAL);
		urlBuilder.append(utils.getTidalservicekey());

		LOGGER.info(urlBuilder.toString());
		System.out.println(urlBuilder.toString());
		return urlBuilder.toString();
	}
}
