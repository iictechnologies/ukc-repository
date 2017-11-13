package com.iic.ukc.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iic.ukc.dto.AreaofInterestDto;
import com.iic.ukc.dto.TideParamsDto;
import com.iic.ukc.service.DepthProfileService;
import com.iic.ukc.service.TidalService;
import com.iic.ukc.util.ConfigFileUtils;
import com.iic.ukc.util.UKCConstants;

/**
 * DepthProfileController is a controller class to display Depth profile graph
 * and Tidal graph
 * 
 * @author SMDV4518
 *
 */
@Controller
public class DepthProfileController {
	private static Logger LOGGER = Logger.getLogger(DepthProfileController.class);
	@Autowired
	private DepthProfileService depthProfileService = null;

	@Autowired
	private TidalService tidalService = null;
	
	@Autowired(required = true)
	private ConfigFileUtils configFileUtils = null;

	/**
	 * This method is used to find DepthProfile with Tide heights for given
	 * Way points
	 * 
	 * @param tideParamsDto
	 *            {@link TideParamsDto} class represents
	 * @return JSONObject the JSON formatted result
	 * @throws JSONException
	 * @throws SQLException
	 * @throws ParseException
	 * @throws IOException
	 */
	@RequestMapping(value = UKCConstants.FIND_DEPTHPROFILE_WITH_TIDEHEIGHTS_URL, method = RequestMethod.POST)
	public @ResponseBody String findDepthprofileWithTideheights(@RequestBody TideParamsDto tideParamsDto,
			HttpServletResponse response) throws JSONException, SQLException, ParseException, IOException {
		LOGGER.info("Start");
		LOGGER.info(configFileUtils);
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String sessionId = auth.getName();
		LOGGER.info("Started - sessionId : "+sessionId + " : " +new Date());
		String jsonResult = null;
		String stationId = null;
		
		String stationName = tideParamsDto.getStationName();
		String presentTime = tideParamsDto.getPresentTime();
		String presentDateTime = tideParamsDto.getPresentTime();
		String profileMethod = tideParamsDto.getProfileMethod().toUpperCase();
		int splitCount = tideParamsDto.getSplitCount();
		Object[][] legsArr = tideParamsDto.getLegsArr();
		
		Object[] xtePolygonArr = tideParamsDto.getXtePolygon();
		
		AreaofInterestDto aoi = tideParamsDto.getAoi();
		LOGGER.info("WaypointsDTO : "+ tideParamsDto.toString());
		
		Object[] aoiArr = {aoi.getNorth(), aoi.getSouth(), aoi.getEast(), aoi.getWest()};
		
		double extArr [] = {configFileUtils.getUkboundarynorth(), configFileUtils.getUkboundarysouth(), configFileUtils.getUkboundaryeast(), configFileUtils.getUkboundarywest()};
		
		int duration = 0;
		LOGGER.info("clipXTEPolygon : Started - "+new Date());
		if(profileMethod.equals(UKCConstants.PROFILE_METHOD_TIN)){
			depthProfileService.clipXTEPolygon(xtePolygonArr, aoiArr, profileMethod, sessionId);
		}
		else {
			depthProfileService.clipXTEPolygon(xtePolygonArr, profileMethod, sessionId);
		}
		
		LOGGER.info("clipXTEPolygon : End - "+new Date());
		
		// Get entire Journey time for given legsarray with present time and splitcount
		LOGGER.info("getJourneyTime : Started - "+new Date());
		duration = depthProfileService.getJourneyTime(tideParamsDto.getWayPointsDtos(), splitCount, setDefaultTime(presentTime), legsArr, sessionId);
		LOGGER.info("getJourneyTime : End - "+new Date());
		
		if(profileMethod.equals(UKCConstants.PROFILE_METHOD_DEPTHAREA)){
			LOGGER.info("clipXTEPolygon1 : Started - "+new Date());
			depthProfileService.clipXTEPolygon(sessionId);
			LOGGER.info("clipXTEPolygon1 : End - "+new Date());
		}
		
		LOGGER.info("TidalStations : Started - "+new Date());
		// If aoi is empty, then consider stationName
		if (aoi.getNorth() == 0) {
			// If stationName is empty, then set default StationName
			if ((stationName == null) || (stationName.equalsIgnoreCase(UKCConstants.EMPTY_STRING))) {
				tidalService.saveTidalStations(sessionId);
			} else {
				tidalService.saveTidalStationsWithName(stationName, sessionId);
			}
		} else {
			//tidalService.saveTidalStationsWithBBox(aoi.getNorth(), aoi.getSouth(), aoi.getEast(), aoi.getWest(), sessionId);
			jsonResult = tidalService.saveTidalStationsWithBBox(configFileUtils.getUkboundarynorth(), configFileUtils.getUkboundarysouth(), configFileUtils.getUkboundaryeast(), configFileUtils.getUkboundarywest(), sessionId);
		}
		LOGGER.info("TidalStations : End - "+new Date());
		
		JSONObject responseObject = new JSONObject(jsonResult);
	
		jsonResult = responseObject.get("Status").toString();
		
		if(jsonResult.equalsIgnoreCase(HttpStatus.NOT_FOUND.value()+"")) {
			LOGGER.info("No Stations - findDepthprofileWithTideheights : Started - "+new Date());
			if ((presentTime == null) || (presentTime.equalsIgnoreCase(UKCConstants.EMPTY_STRING))) {
				presentTime = setDefaultTime();
			} else {
				presentTime = setDefaultTime(presentTime);
			}
			jsonResult =  depthProfileService.findDepthprofileWithTideheights(profileMethod, presentTime, presentDateTime, String.valueOf(HttpStatus.NOT_FOUND.value()), sessionId);
			LOGGER.info("No Stations - findDepthprofileWithTideheights : End - "+new Date());			
		}
		else {
			LOGGER.info("TidalHeights : Started - "+new Date());
			// If presentTime is empty, then set default presentTime
			if ((presentTime == null) || (presentTime.equalsIgnoreCase(UKCConstants.EMPTY_STRING))) {
				stationId = tidalService.saveTidalHeights(duration, sessionId);
				presentTime = setDefaultTime();
			} else {
				stationId = tidalService.saveTidalHeights(presentTime, duration, extArr, sessionId);
				presentTime = setDefaultTime(presentTime);
			}
			LOGGER.info("TidalHeights : End - "+new Date());			
		
			LOGGER.info("findDepthprofileWithTideheights : Started - "+new Date());
			jsonResult =  depthProfileService.findDepthprofileWithTideheights(profileMethod, presentTime, presentDateTime, String.valueOf(HttpStatus.OK.value()), sessionId);
			LOGGER.info("findDepthprofileWithTideheights : End - "+new Date());		
			}
		LOGGER.info("End");
		LOGGER.info("End - sessionId : "+sessionId + " : " +new Date());
		JSONObject responseObject1 = new JSONObject(jsonResult);
		responseObject1.put("stationId", stationId);
		jsonResult = responseObject1.toString();
		return jsonResult;		
	}

	/**
	 * set the default time
	 */
	public String setDefaultTime() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(UKCConstants.DATEFORMAT_TIME);
		LOGGER.info(sdf.format(date));
		return sdf.format(date);

	}

	/**
	 * method to set default date time
	 * 
	 * @param presentTime
	 *            input param to set date time
	 * @return the date in the format of string
	 * @throws ParseException
	 */
	public String setDefaultTime(String presTime) throws ParseException {
		DateFormat df = new SimpleDateFormat(UKCConstants.DATEFORMAT_TIME);
		DateFormat sdf = new SimpleDateFormat(UKCConstants.DATEFORMAT_DATETIME);
		return df.format(sdf.parse(presTime));
	}
}