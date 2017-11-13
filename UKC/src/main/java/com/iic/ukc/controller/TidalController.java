package com.iic.ukc.controller;

import java.sql.SQLException;
import java.text.ParseException;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iic.ukc.exception.TidalStationIdNotFoundException;
import com.iic.ukc.service.TidalService;

/**
 * TidalController is a controller class to fetch TidalStations and TideHeights for each station with given StationName at given Time
 * 
 * @author SMDV4518
 *
 */
@Controller
@RequestMapping(value = "/tidal")
public class TidalController {
	private static Logger LOGGER = Logger.getLogger(TidalController.class);
	
	@Autowired
	private TidalService tidalService = null;

	/**
	 * This method is used to get TidalStations with default stationName
	 * 
	 * @return status
	 * @throws ParseException 
	 * @throws SQLException 
	 * @throws JSONException 
	 */
	@RequestMapping(value = "/stations", method = RequestMethod.GET)
	public @ResponseBody String getTidalStations(HttpSession session) throws JSONException, SQLException, ParseException {
		LOGGER.info("Retriving data for Tidal Stations with default StationName");
		String sessionId = session.getId();
		return tidalService.saveTidalStations(sessionId);
	}

	/**
	 * This method is used to get TidalStations with given stationName
	 * 
	 * @param stationName
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 */
	@RequestMapping(value = "/stations/{stationName}", method = RequestMethod.GET)
	public @ResponseBody String getTidalStationsWithName(@PathVariable String stationName, HttpSession session) throws JSONException, SQLException, ParseException {
		LOGGER.info("Retriving data of tidalstationname");
		String sessionId = session.getId();
		return tidalService.saveTidalStationsWithName(stationName, sessionId);
	}

	/**
	 * This method is used to get TidalStations with given BBox
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
	@RequestMapping(value = "/stationswithbbox", method = RequestMethod.GET)
	public @ResponseBody String getTidalStationsWithBBox(@RequestParam Double north, @RequestParam Double south, @RequestParam Double east,
			@RequestParam Double west, HttpSession session) throws JSONException, SQLException, ParseException, TidalStationIdNotFoundException {
		LOGGER.info("Retriving data of tidalstationsbbox");
		String sessionId = session.getId();
		return tidalService.saveTidalStationsWithBBox(north, south, east, west, sessionId);
	}

	/**
	 * This method is used to get Tidal heights with current time
	 * 
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 */
	@RequestMapping(value = "/heights", method = RequestMethod.GET)
	public @ResponseBody String getTidalHeights(@RequestParam int duration, HttpSession session) throws JSONException,
			SQLException, ParseException {
		LOGGER.info("Retriving data of tidalheights");
		String sessionId = session.getId();
		return tidalService.saveTidalHeights(duration, sessionId);
	}
	
	/**
	 * This method is used to get Tidal heights with given presentTime
	 * 
	 * @param presentTime
	 * @return status
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 * @throws TidalStationIdNotFoundException 
	 */
	@RequestMapping(value = "/heightswithtime", method = RequestMethod.GET)
	public @ResponseBody String getTidalHeightsWithTime(@RequestParam String presentTime, double aoiArr[], @RequestParam int duration, HttpSession session) throws JSONException,
			SQLException, ParseException, TidalStationIdNotFoundException {
		LOGGER.info("Retriving data of tidalheights with given time");
		String sessionId = session.getId();
		return tidalService.saveTidalHeights(presentTime, duration, aoiArr, sessionId);
	}
}