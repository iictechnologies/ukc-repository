package com.iic.ukc.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iic.ukc.dao.DepthProfileDao;
import com.iic.ukc.dto.WayPointsDto;
import com.iic.ukc.util.DepthProfileQueryUtils;
import com.iic.ukc.util.UKCConstants;

/**
 * DepthProfileService is a Service class to provide services for displaying
 * DepthProfile graph and Tidal graph request
 * 
 * @author SMDV4518
 *
 */
@Service
public class DepthProfileService {

	private static Logger LOGGER = Logger
			.getLogger(DepthProfileService.class);
	
	@Autowired
	private DepthProfileDao depthProfileDao = null;

	public Double[] formatWaypoints(WayPointsDto[] wayPointsDtos) {
		List<Double> waypointCoords = new ArrayList<Double>();
		for (WayPointsDto wayPointsDto : wayPointsDtos) {
			waypointCoords.add(wayPointsDto.getCoordinates()[0]);
			waypointCoords.add(wayPointsDto.getCoordinates()[1]);
		}

		Double[] waypointCoordsArray = waypointCoords.toArray(new Double[waypointCoords.size()]);
		return waypointCoordsArray;
	}
	
	public void clipXTEPolygon(Object[] xtePolygonArr, Object[] extentArr, String profileMethod, String sessionId) throws SQLException {
		String query = null; 
		query = DepthProfileQueryUtils.getQuery(profileMethod.toUpperCase()+UKCConstants.KEY_XTE_POLYGON);
		
		depthProfileDao.clipXTEPolygon(xtePolygonArr, extentArr, sessionId, query);		
	}
	
	public void clipXTEPolygon(Object[] xtePolygonArr, String profileMethod, String sessionId) throws SQLException {
		String query = null; 
		query = DepthProfileQueryUtils.getQuery(profileMethod.toUpperCase()+UKCConstants.KEY_XTE_POLYGON);
		
		depthProfileDao.clipXTEPolygon(xtePolygonArr, sessionId, query);		
	}
	
	public void clipXTEPolygon(String sessionId) throws SQLException {
		String query = UKCConstants.CLIP_XTEPOLYGON_DEPTHAREA1_QUERY; 		
		depthProfileDao.clipXTEPolygon(sessionId, query);		
	}
	
	
	public synchronized int getJourneyTime(WayPointsDto[] wayPointsDtos, int splitCount, String presentTime, Object[][] legsArr, String sessionId) throws JSONException, SQLException {
		String sql = null;
		int result = 0;
		
		// Add Waypoints to Database
		addWaypoints(wayPointsDtos, sessionId);
				
		//API to find the entire journey time
		sql = UKCConstants.GET_JOURNEYTIME_QUERY;
		result = depthProfileDao.getJourneyTime(splitCount, presentTime, legsArr, sessionId, sql);
		return result;
	}
	
	public void addWaypoints(WayPointsDto[] wayPointsDtos, String sessionId) {
		this.depthProfileDao.insertWayPoints(wayPointsDtos, sessionId);		
	}
	
	public String findDepthprofileWithTideheights(String profileMethod, String presentTime,  String presentDateTime, String status, String sessionId) throws JSONException, SQLException {		
		String sql = null;
		String result = "SUCCESS";
		LOGGER.info("Started - profileMethod : "+new Date());
		//API to calculate DepthProfile with presentTime and presentDateTime
		sql = DepthProfileQueryUtils.getQuery(profileMethod.toUpperCase()+status);
		
		result = depthProfileDao.findDepthprofileWithTideheights(presentTime, presentDateTime, sessionId, sql);

		LOGGER.info("End - profileMethod : "+new Date());
		return result;
	}		
}