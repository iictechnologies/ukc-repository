package com.iic.ukc.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Base64;



//import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import com.iic.ukc.util.ConfigFileUtils;
import com.iic.ukc.util.UKCConstants;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

/**
 * TidalDaoImpl is an implementation class to fetch Tidal Station details from
 * Amazon Web services
 * 
 * @author SMDV4518
 *
 */
@Repository
public class TidalDaoImpl implements TidalDao {
	private static Logger LOGGER = Logger.getLogger(TidalDaoImpl.class);

	@Autowired(required = true)
	private ConfigFileUtils configFileUtils = null;

	private JdbcTemplate jdbcTemplate = null;
	private SimpleJdbcInsert simpleJdbcInsert = null;

	@Autowired(required = true)
	public TidalDaoImpl(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * method to insert TidalStationsJSON into the database
	 * 
	 * @param tidalStations
	 * @return status 1 if inserted else returns 0 if not
	 */
	public int insertTidalStationsJSON(String tidalStations, String sessionId) throws JSONException, SQLException, ParseException {
		this.simpleJdbcInsert = new SimpleJdbcInsert(this.jdbcTemplate).withTableName(UKCConstants.TIDALSTATIONS_JSON);
		SqlParameterSource parameters = new MapSqlParameterSource()
				.addValue("data", tidalStations)
				.addValue("sessionid", sessionId);
		int status = simpleJdbcInsert.execute(parameters);

		if (status > 0) {
			insertTidalStations(sessionId);
		}
		return status;
	}
	
	/**
	 * method to insert tidalStations into the database
	 * 
	 * @return status 1 if inserted else returns 0 if not
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 */
	public String insertTidalStations(String sessionId) throws JSONException, SQLException, ParseException {
		Connection conn = jdbcTemplate.getDataSource().getConnection();
		ResultSet rs = conn.createStatement().executeQuery(UKCConstants.GET_TIDALSTATIONS_JSON+ " WHERE sessionid = '"+sessionId+"'");
		String content = null;
		if (rs != null) {
			while (rs.next()) {
				content = rs.getObject("data").toString();
			}
		}
		JSONObject jsonobj = new JSONObject(content);
		JSONArray featuresList = jsonobj.getJSONArray("features");
		JSONArray tideStationsList = new JSONArray();
		for (int i = 0; i < featuresList.length(); i++) {
			JSONObject featureSummary = featuresList.getJSONObject(i);

			String stationId = featureSummary.get("id").toString();
			String coordinates = featureSummary.getJSONObject("geometry").get("coordinates").toString();

			JSONObject tideStationsObj = new JSONObject();
			tideStationsObj.put("stationId", stationId);
			tideStationsObj.put("coordinates", coordinates);
			tideStationsObj.put("sessionid", sessionId);

			tideStationsList.put(tideStationsObj);
		}

		insertTidalStations(tideStationsList, sessionId);
		return "SUCCESS";
	}

	/**
	 * method to insertTidalStations into the database
	 * 
	 * @param tideStationsList
	 *            list of stations JSON array object
	 * @return status 1 if inserted else returns 0 if not
	 * @throws JSONException
	 */
	public String insertTidalStations(JSONArray tideStationsList, String sessionId) throws JSONException {
		this.simpleJdbcInsert = new SimpleJdbcInsert(this.jdbcTemplate).withTableName(UKCConstants.TIDALSTATIONS);

		SqlParameterSource[] parameters = new SqlParameterSource[tideStationsList.length()];

		for (int i = 0; i < parameters.length; i++) {
			parameters[i] = new MapSqlParameterSource()
					.addValue("id", tideStationsList.getJSONObject(i).get("stationId"))
					.addValue("coordinates", tideStationsList.getJSONObject(i).get("coordinates"))
					.addValue("sessionid",sessionId);
		}
		int[] results = simpleJdbcInsert.executeBatch(parameters);

		LOGGER.info("Inserted Tidal Heights");
		return Arrays.toString(results);
	}
	
	/**
	 * method to insert TidalHeightsWithTime into the database
	 * 
	 * @param presentTime
	 *            input the present time
	 * @return status 1 if inserted else returns 0 if not
	 */
	public String insertTidalHeightsWithTime(String presentTime, int duration, String sessionId) throws JSONException, SQLException, ParseException {
		if(duration > 0) {
			duration = duration + 26;
		}
		else {
			duration = 26;
		}

		Connection conn = jdbcTemplate.getDataSource().getConnection();
		String stationId = null;
		
		String sql = "SELECT ukc_get_nearest_stationid_session('"+sessionId+"')";
		ResultSet rs = conn.createStatement().executeQuery(sql);
        	
		if (rs != null) {
			while (rs.next()) {
				stationId = rs.getString(1);
			}
		}
		
		JSONArray tideHeightsList = new JSONArray();

		String params = "dateTime="+presentTime+"&duration="+duration+"&interval=1";
		String encodedParams = encodeParameter(params);

		String url1 = configFileUtils.getWebServiceUrl() + UKCConstants.TIDAL_PORT_HEIGHTS + stationId + "&parameters="
				+ encodedParams;

		String content1 = webServiceResponse(url1);
		
		JSONObject tideHeightsObj = new JSONObject();
		tideHeightsObj.put("stationId", stationId);
		tideHeightsObj.put("tideHeights", content1);
		tideHeightsObj.put("sessionid", sessionId);
		
		tideHeightsList.put(tideHeightsObj);

		insertTidalHeights(tideHeightsList, sessionId);
		return stationId;
	}
	
	public String insertTidalHeightsWithTime(String presentTime, int duration, double aoiArr[], String sessionId) throws JSONException, SQLException, ParseException {
		StringBuilder urlBuilder=null;
		
		duration = (duration>0) ? duration+26 : 26;

		Connection conn = jdbcTemplate.getDataSource().getConnection();
		String stationId = null;
		
		String sql = "SELECT ukc_get_nearest_stationid_session('{"+Arrays.toString(aoiArr).replace('[', ' ').replace(']', ' ')+"}','"+sessionId+"')";
		LOGGER.info("SQL : "+sql);
		ResultSet rs = conn.createStatement().executeQuery(sql);
        	
		if (rs != null) {
			while (rs.next()) {
				stationId = rs.getString(1);
			}
		}
		
		JSONArray tideHeightsList = new JSONArray();

		urlBuilder=new StringBuilder();
		urlBuilder.append("dateTime=");
		urlBuilder.append(presentTime);
		urlBuilder.append("&duration=");
		urlBuilder.append(duration);
		urlBuilder.append("&interval=1");
		String encodedParams = encodeParameter(urlBuilder.toString());

		urlBuilder = new StringBuilder();
		urlBuilder.append(configFileUtils.getWebServiceUrl());
		urlBuilder.append(UKCConstants.TIDAL_PORT_HEIGHTS);
		urlBuilder.append(stationId);
		urlBuilder.append("&parameters=");
		urlBuilder.append(encodedParams);
	
		String content1 = webServiceResponse(urlBuilder.toString());
		JSONObject responseObject = new JSONObject(content1);
		
		String status = responseObject.get("status").toString();
		
		JSONObject jsonObject = new JSONObject();
		if(status.equalsIgnoreCase("404")) {
			
			jsonObject.put("Status", status);
			return jsonObject.toString();
		}	
		else if(status.equalsIgnoreCase("400")) {
			jsonObject.put("Status", status);
			return jsonObject.toString();
		}	
		
		JSONArray tideData = responseObject.getJSONArray("data");
		
		
		JSONObject tideHeightsObj = new JSONObject();
		tideHeightsObj.put("stationId", stationId);
		tideHeightsObj.put("tideHeights", tideData);
		tideHeightsObj.put("sessionid", sessionId);
		
		tideHeightsList.put(tideHeightsObj);

		insertTidalHeights(tideHeightsList, sessionId);
		jsonObject.put("Status", status);
		jsonObject.put("stationId", stationId);
		return jsonObject.toString();
	}
	

	/**
	 * method to insert tidal heights into the database with specified
	 * tidal height list
	 * 
	 * @param tideHeightsList
	 *            tidal heights in JSON array format
	 * @return status 1 if inserted else return 0 if not
	 * @throws JSONException
	 */
	public String insertTidalHeights(JSONArray tideHeightsList, String sessionId) throws JSONException {
		this.simpleJdbcInsert = new SimpleJdbcInsert(this.jdbcTemplate).withTableName(UKCConstants.TIDAL_HEIGHTS);

		SqlParameterSource[] parameters = new SqlParameterSource[tideHeightsList.length()];

		for (int i = 0; i < parameters.length; i++) {
			parameters[i] = new MapSqlParameterSource()
					.addValue("id", tideHeightsList.getJSONObject(i).get("stationId"))
					.addValue("properties", tideHeightsList.getJSONObject(i).get("tideHeights"))
					.addValue("sessionid", sessionId);
		}
		int[] results = simpleJdbcInsert.executeBatch(parameters);

		LOGGER.info("Inserted Tidal Heights");
		return Arrays.toString(results);
	}

	/**
	 * method to encode the given input parameter
	 * 
	 * @param parameter
	 *            the parameter to be encoded
	 * @return the encoded parameter
	 */
	public String encodeParameter(String parameter) {
		String encodedUrl = Base64.getEncoder().encodeToString(parameter.getBytes());
		return encodedUrl;
	}

	public String webServiceResponse(String url) throws JSONException {
		Client client = Client.create();
		WebResource webResource = client.resource(url);
		ClientResponse response = webResource.accept("application/json").get(ClientResponse.class);
		
		return response.getEntity(String.class);
	}
}