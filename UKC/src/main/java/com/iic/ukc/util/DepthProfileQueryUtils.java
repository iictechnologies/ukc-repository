package com.iic.ukc.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;

public class DepthProfileQueryUtils {
	private static Map<String, String> map = new HashMap<>();

	static {
		/*
		 * status not found, which means 404
		 */
		// DepthArea profile method
		map.put(UKCConstants.PROFILE_METHOD_DEPTHAREA + HttpStatus.NOT_FOUND.value(), UKCConstants.GET_DEPTHPROFILE_WITH_NO_STATIONID_DEPTHAREA_QUERY);
		// TIN profile method
		map.put(UKCConstants.PROFILE_METHOD_TIN + HttpStatus.NOT_FOUND.value(), UKCConstants.GET_DEPTHPROFILE_WITH_NO_STATIONID_TIN_QUERY);
		// Closest profile method
		map.put(UKCConstants.PROFILE_METHOD_CLOSEST + HttpStatus.NOT_FOUND.value(), UKCConstants.GET_DEPTHPROFILE_WITH_NO_STATIONID_CLOSEST_QUERY);
		/*
		 * status found, which means 200
		 */
		// DepthArea profile method
		map.put(UKCConstants.PROFILE_METHOD_DEPTHAREA + HttpStatus.OK.value(), UKCConstants.GET_DEPTHPROFILE_WITH_NO_TIDEHEIGHTS_DEPTHAREA_QUERY);
		// TIN profile method
		map.put(UKCConstants.PROFILE_METHOD_TIN + HttpStatus.OK.value(), UKCConstants.GET_DEPTHPROFILE_WITH_NO_TIDEHEIGHTS_TIN_QUERY);
		// Closest profile method
		map.put(UKCConstants.PROFILE_METHOD_CLOSEST + HttpStatus.OK.value(), UKCConstants.GET_DEPTHPROFILE_WITH_NO_TIDEHEIGHTS_CLOSEST_QUERY);
		
		/*
		 * store xte query methods
		 */
		//API to clip XTEPolygon
		map.put(UKCConstants.PROFILE_METHOD_DEPTHAREA+UKCConstants.KEY_XTE_POLYGON, UKCConstants.CLIP_XTEPOLYGON_DEPTHAREA_QUERY);
		// TIN profile method
		map.put(UKCConstants.PROFILE_METHOD_TIN+UKCConstants.KEY_XTE_POLYGON, UKCConstants.CLIP_XTEPOLYGON_TIN_QUERY);
		// Closest profile method
		map.put(UKCConstants.PROFILE_METHOD_CLOSEST+UKCConstants.KEY_XTE_POLYGON, UKCConstants.CLIP_XTEPOLYGON_CLOSEST_QUERY);
	}

	public static String getQuery(String queryType) {
		return map.get(queryType).toString();
	}
}
