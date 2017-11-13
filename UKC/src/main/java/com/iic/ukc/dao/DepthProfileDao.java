package com.iic.ukc.dao;

import java.sql.SQLException;

import org.springframework.stereotype.Repository;

import com.iic.ukc.dto.WayPointsDto;

/**
 * DepthProfileDao is an interface for displaying DepthProfile graph and Tidal
 * graph request
 * 
 * @author SMDV4518
 *
 */
@Repository
public interface DepthProfileDao {

	public void insertWayPoints(WayPointsDto[] wayPointsDto, String sessionId);
	
	public String clipXTEPolygon(Object[] xtePolygonArr, String sessionId,  String query) throws SQLException;
	
	public String clipXTEPolygon(Object[] xtePolygonArr, Object[] extentArr, String sessionId,  String query) throws SQLException;
	
	public String clipXTEPolygon(String sessionId,  String query) throws SQLException;
	
	public int getJourneyTime(int splitCount, String prestime, Object[][] legsArr, String sessionId, String query) throws SQLException;
	
	public String findDepthprofileWithTideheights(String presenttime, String presentDateTime, String sessionId, String query) throws SQLException;	
}