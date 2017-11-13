package com.ukc.util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonUtils {

	public static Object toJson(String jsonString) throws JSONException {
		Object data = null;
		
		if (jsonString.trim().charAt(0) == '[') {	
			data = new JSONArray(jsonString);	
		} else if (jsonString.trim().charAt(0) == '{') {
			data = new JSONObject(jsonString);
		}
		
		return data;
	}
}
