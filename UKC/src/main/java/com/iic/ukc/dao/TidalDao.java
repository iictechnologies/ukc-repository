package com.iic.ukc.dao;

import java.sql.SQLException;
import java.text.ParseException;

import org.json.JSONException;
import org.springframework.stereotype.Component;

/**
 * TidalDao is an interface to fetch Tidalstation and Tidalheights details from Amazon
 * Webservices
 * 
 * @author SMDV4518
 *
 */
@Component
public interface TidalDao {

	public int insertTidalStationsJSON(String tidalStations, String sessionId) throws JSONException, SQLException, ParseException;
	
	public String insertTidalHeightsWithTime(String presentTime, int duration, String sessionId) throws JSONException, SQLException, ParseException;
	
	public String insertTidalHeightsWithTime(String presentTime, int duration, double aoiArr[], String sessionId) throws JSONException, SQLException, ParseException;
}