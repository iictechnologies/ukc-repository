package com.iic.ukc.service;

import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.iic.ukc.dao.TidalDao;
import com.iic.ukc.dao.TidalDaoImpl;
import com.iic.ukc.exception.TidalStationIdNotFoundException;
import com.iic.ukc.util.ConfigFileUtils;
import com.iic.ukc.util.UKCConstants;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

/**
 * TidalService is a service class to fetch Tidal station and Tide heights details from Amazon Web services
 * 
 * @author SMDV4518
 *
 */
@Service
public class TidalService {
	private static Logger LOGGER = Logger.getLogger(TidalDaoImpl.class);
	
	private DateFormat sdf = new SimpleDateFormat(UKCConstants.DATEFORMAT_DATETIME);
	
	@Autowired
	private ConfigFileUtils configFileUtils = null;
	
	@Autowired
	private TidalDao tidalDao = null;
	
	/**
	 * This method is used to save TidalStations for default stationName
	 * 
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 */
	public String saveTidalStations(String sessionId) throws JSONException, SQLException, ParseException {
		String paramValue = UKCConstants.TYPE_PORT + UKCConstants.STRING_CONCAT + UKCConstants.TEXT + configFileUtils.getDefaulttidalstation();
		String encodedParamValue = encodeParameter(paramValue);
		
		String url = configFileUtils.getWebServiceUrl()+UKCConstants.STATIONS_SEARCH_BY_NAME+ encodedParamValue;
		String tidalStations = webServiceResponse(url);
		int status = tidalDao.insertTidalStationsJSON(tidalStations,sessionId);
		if(status > 0) {
			LOGGER.info("Inserted default TidalStation Details");
			return "Inserted default TidalStation Details";
		}
		else {
			LOGGER.info("Failed to insert default TidalStation Details");
			return "Failed to insert default TidalStation Details";
		}	
	}
	
	/**
	 * This method is used to save TidalStations for given stationName
	 * 
	 * @param stationName
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 */
	public String saveTidalStationsWithName(String stationName, String sessionId) throws JSONException, SQLException, ParseException {
		String paramValue = UKCConstants.TYPE_PORT + UKCConstants.STRING_CONCAT + UKCConstants.TEXT + stationName;
		String encodedParamValue = encodeParameter(paramValue);

		String url = configFileUtils.getWebServiceUrl()+UKCConstants.STATIONS_SEARCH_BY_NAME+ encodedParamValue;
		String tidalStations = webServiceResponse(url);
		int status = tidalDao.insertTidalStationsJSON(tidalStations, sessionId);
		if(status > 0) {
			LOGGER.info("Inserted Default TidalStation Details");
			return "Inserted given TidalStation Details";
		}
		else {
			LOGGER.info("Failed to insert default TidalStation Details");
			return "Failed to insert default TidalStation Details";
		}
	}
	
	/**
	 * This method is used to save TidalStations for given BBox
	 * 
	 * @param north
	 * @param south
	 * @param east
	 * @param west
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 * @throws TidalStationIdNotFoundException 
	 */
	public String saveTidalStationsWithBBox(Double north, Double south, Double east, Double west, String sessionId) throws JSONException, SQLException, ParseException {
		String paramValue = UKCConstants.TYPE_PORT + UKCConstants.STRING_CONCAT + 
							UKCConstants.NORTH + north + UKCConstants.STRING_CONCAT + 
							UKCConstants.SOUTH + south + UKCConstants.STRING_CONCAT + 
							UKCConstants.EAST + east + UKCConstants.STRING_CONCAT + 
							UKCConstants.WEST + west;
		String encodedParamValue = encodeParameter(paramValue);

		String url = configFileUtils.getWebServiceUrl() + UKCConstants.STATIONS_SEARCH_BY_BBOX + encodedParamValue;
		
		String content1 = webServiceResponse(url);
		
		JSONObject responseObject1 = new JSONObject(content1);
		
				
		JSONObject jsonData = responseObject1.getJSONObject("data");
		
		JSONArray responseArray = jsonData.getJSONArray("features");
		JSONObject jsonObject = new JSONObject();
		if(responseArray.length() == 0) {
			jsonObject.put("Status", "404");			
		}
		else {
			int count = tidalDao.insertTidalStationsJSON(jsonData.toString(), sessionId);
			if(count > 0) {
				LOGGER.info("SUCCESS - Inserted Default TidalStation Details");
				jsonObject.put("Status", "200");
			}
			else {
				LOGGER.info("FAILURE - Check it Out !!!!");
				jsonObject.put("Status", "400");
			}					
		}
		return jsonObject.toString();		
	}
	
	
	/**
	 * This method is used to save Tidal heights for current time
	 * 
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 */
	public String saveTidalHeights(int duration, String sessionId) throws JSONException, SQLException, ParseException {
		String presentTime = sdf.format(new Date());
		String stationId = null;
		presentTime = getCurrentTime(presentTime);
		LOGGER.info("presentTime "+presentTime);
		stationId = tidalDao.insertTidalHeightsWithTime(presentTime, duration, sessionId);
		JSONObject stationIdObj = new JSONObject(stationId);
		return stationIdObj.getString("stationId");
	}
	
	/**
	 * This method is used to save Tidalheights for given presentTime
	 * 
	 * @param presentTime
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 * @throws TidalStationIdNotFoundException 
	 */
	public String saveTidalHeights(String presentTime, int duration, double aoiArr[], String sessionId) throws JSONException, SQLException, ParseException {
		String stationId = null;
		presentTime = getCurrentTime(presentTime);
		LOGGER.info("presentTime "+presentTime);
		stationId = tidalDao.insertTidalHeightsWithTime(presentTime, duration, aoiArr, sessionId);
		JSONObject stationIdObj = new JSONObject(stationId);
			return stationIdObj.getString("stationId");
	}
	
	/**
	 * This method is used to encode given parameter
	 * 
	 * @param parameter
	 * @return encoded parameter
	 */
	public String encodeParameter(String parameter) {
		String encodedUrl = Base64.getEncoder().encodeToString(parameter.getBytes());
		return encodedUrl;
	}
	
	/**
	 * This method is used to invoke Web service call
	 * 
	 * @param url
	 * @return requested response
	 * @throws JSONException 
	 */
	public String webServiceResponse(String url) throws JSONException {
		Client client = Client.create();
		WebResource webResource = client.resource(url);
		ClientResponse response = webResource.accept(MediaType.APPLICATION_JSON_VALUE).get(ClientResponse.class);
		return response.getEntity(String.class);	
	}
	
	/**
	 * This method is used to subtract 1 day from current/given date
	 * 
	 * @param presTime
	 * @return manipulated date
	 * @throws ParseException
	 */
	public String getCurrentTime(String presTime) throws ParseException {
		Date currentDate = sdf.parse(presTime);
        
        // convert date to calendar
        Calendar c = Calendar.getInstance();
        c.setTime(currentDate);

        // manipulate date - subtract 1 day
        c.add(Calendar.DATE, -1); 
        //same with c.add(Calendar.DAY_OF_MONTH, -1);
        
        // convert calendar to date
        Date currentDatePlusOne = c.getTime();

        presTime = sdf.format(currentDatePlusOne);
		String search = UKCConstants.TIME;
		String sub = UKCConstants.DEFAULT_TIME;
		String result = UKCConstants.EMPTY_STRING;
		int i;
		i = presTime.indexOf(search);
		if (i != -1) {
			result = presTime.substring(0, i);
			result = result + UKCConstants.TIME + sub;
		}
		return result;
	}
}