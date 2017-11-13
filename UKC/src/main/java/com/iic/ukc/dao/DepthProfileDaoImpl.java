package com.iic.ukc.dao;

import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import com.iic.ukc.dto.WayPointsDto;
import com.iic.ukc.util.UKCConstants;

/**
 * DepthProfileDaoImpl is an implementation class for displaying DepthProfile
 * graph and Tidal graph request
 * 
 * @author SMDV4518
 *
 */
@Repository
public class DepthProfileDaoImpl implements DepthProfileDao {
	private static Logger LOGGER = Logger.getLogger(DepthProfileDaoImpl.class);
	private JdbcTemplate jdbcTemplate = null;
	private SimpleJdbcInsert simpleJdbcInsert = null;

	@Autowired
	public DepthProfileDaoImpl(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.simpleJdbcInsert = new SimpleJdbcInsert(this.jdbcTemplate).withTableName(UKCConstants.WAY_POINTS);
	}

	/**
	 * method to insert way points into the database with given sessionid
	 * 
	 * @param wayPointsDto
	 *            
	 */
	public void insertWayPoints(WayPointsDto[] wayPointsDto, String sessionId) {
		SqlParameterSource[] parameters = new SqlParameterSource[wayPointsDto.length];

		for (int i = 0; i < parameters.length; i++) {
			WayPointsDto dto = wayPointsDto[i];
			parameters[i] = new MapSqlParameterSource()
					.addValue("x", dto.getCoordinates()[0])
					.addValue("y", dto.getCoordinates()[1])
					.addValue("speed", dto.getSpeed())
					.addValue("turnradius", dto.getTrn())
					.addValue("xtl", dto.getXtl())
					.addValue("xtr", dto.getXtr())
					.addValue("sessionId", sessionId);
		}

		int[] results = simpleJdbcInsert.executeBatch(parameters);

		LOGGER.info("Waypoints inserted : " + Arrays.toString(results));		
	}
	
	/**
	 * Method to clip XTEPolygon with given sessionid
	 * 
	 * @param precisionValues
	 *            array of precisionValues
	 * @param query
	 * @return the status true if valid else returns false
	 * @throws SQLException 
	 */
	public String clipXTEPolygon(Object[] xtePolygonArr, String sessionId, String query) throws SQLException {
		String data = null;
		PreparedStatement preparedStatement=null;
		ResultSet resultSet=null;
		try(Connection connection = jdbcTemplate.getDataSource().getConnection();) {
			Array array = connection.createArrayOf("text", xtePolygonArr);
			LOGGER.info("XTE Polygon "+array.toString());
			preparedStatement = connection.prepareStatement(query);
			preparedStatement.setArray(1, array);
			preparedStatement.setString(2, sessionId);
			resultSet = preparedStatement.executeQuery();
			if (resultSet.next()) {
				data = resultSet.getObject(1).toString();
			}
			LOGGER.info("Data from API - clipXTEPolygon : " + data);
			resultSet.close();
			
		} catch (SQLException exception) {
			LOGGER.error(exception.getMessage());
		}finally{
			preparedStatement.close();
			resultSet.close();
		}
		return data;
	}
	
	/**
	 * Method to clip XTEPolygon with given sessionid
	 * 
	 * @param precisionValues
	 *            array of precisionValues
	 * @param query
	 * @return the status true if valid else returns false
	 * @throws SQLException 
	 */
	public String clipXTEPolygon(Object[] xtePolygonArr, Object[] extentArr, String sessionId, String query) throws SQLException {
		String data = null;
		PreparedStatement preparedStatement=null;
		ResultSet resultSet=null;
		try(Connection connection = jdbcTemplate.getDataSource().getConnection();) {
			Array xteArray = connection.createArrayOf("text", xtePolygonArr);
			LOGGER.info("XTE Polygon "+xteArray.toString());
			Array extentArray = connection.createArrayOf("text", extentArr);
			LOGGER.info("Extent Polygon "+extentArray.toString());
			preparedStatement = connection.prepareStatement(query);
			preparedStatement.setArray(1, xteArray);
			preparedStatement.setArray(2, extentArray);
			preparedStatement.setString(3, sessionId);
			resultSet = preparedStatement.executeQuery();
			if (resultSet.next()) {
				data = resultSet.getObject(1).toString();
			}
			LOGGER.info("Data from API - clipXTEPolygon : " + data);
			
		} catch (SQLException exception) {
			LOGGER.error(exception.getMessage());
		}finally{
			resultSet.close();
			preparedStatement.close();
		}
		return data;
	}
	
	
	/**
	 * Method to clip XTEPolygon with given splitcount and sessionid
	 * 
	 * @param precisionValues
	 *            array of precisionValues
	 * @param query
	 * @return the status true if valid else returns false
	 * @throws SQLException 
	 */
	public String clipXTEPolygon(String sessionId, String query) throws SQLException {
		String data = null;
		PreparedStatement preparedStatement=null;
		ResultSet resultSet=null;
		try(Connection connection = jdbcTemplate.getDataSource().getConnection();) {
			preparedStatement = connection.prepareStatement(query);
			preparedStatement.setString(1, sessionId);
			resultSet = preparedStatement.executeQuery();
			if (resultSet.next()) {
				data = resultSet.getObject(1).toString();
			}
			LOGGER.info("Data from API - clipXTEPolygon : " + data);
		} catch (SQLException exception) {
			LOGGER.error(exception.getMessage());
		} finally {
			resultSet.close();
			preparedStatement.close();
		}
		return data;
	}
	
	
	/**
	 * Method to get journey time with given splitcount, presenttime, legsArray and sessionid
	 * 
	 * @param splitCount
	 * @param prestime
	 * @param legsArr
	 * @param sessionId
	 * @param query
	 * 
	 * @return the journey time for given legsarray
	 * @throws SQLException 
	 * 
	 */	
	public int getJourneyTime(int splitCount, String prestime, Object[][] legsArr, String sessionId, String query) throws SQLException {
		int data = 0;
		PreparedStatement preparedStatement=null;
		ResultSet rs=null;
		try(Connection connection = jdbcTemplate.getDataSource().getConnection();) {
			Array legarray = connection.createArrayOf("text", matchMultiDimensions(legsArr));
			preparedStatement = connection.prepareStatement(query);
			preparedStatement.setInt(1, splitCount);
			preparedStatement.setString(2, prestime);
			preparedStatement.setArray(3, legarray);
			preparedStatement.setString(4, sessionId);
			
			rs = preparedStatement.executeQuery();
			if (rs.next()) {
				data = rs.getInt(1);
			}
			LOGGER.info("Data from API - getJourneyTime : " + data);
			
		} catch (SQLException e) {
			LOGGER.error(e.getMessage());
		} finally{
			rs.close();
			preparedStatement.close();
		}
		return data;
	}
	
	/**
	 * Method to find Depthprofile with Tideheights with given presenttime, presentdatetime and sessionid
	 * 
	 * @param presentTime
	 * @param presentDateTime
	 * @param sessionId
	 * @param query
	 * 
	 * @return the json with depthprofile and tideheights 
	 * @throws SQLException 
	 */
	public String findDepthprofileWithTideheights(String presentTime, String presentDateTime, String sessionId, String query) throws SQLException {
		String data = null;
		PreparedStatement preparedStatement=null;
		ResultSet resultSet=null;
		try(Connection connection = jdbcTemplate.getDataSource().getConnection();) {
			preparedStatement = connection.prepareStatement(query);
			preparedStatement.setString(1, presentTime);
			preparedStatement.setString(2, presentDateTime);
			preparedStatement.setString(3, sessionId);
			resultSet = preparedStatement.executeQuery();
			if (resultSet.next()) {
				data = resultSet.getObject(1).toString();
			}
			LOGGER.info("Data from API - selectDepthprofileWithTideheightsResultAsJson : " + data);
			
		} catch (SQLException exception) {
			LOGGER.error(exception.getMessage());
		}finally{
			resultSet.close();
			preparedStatement.close();
		}
		return data;
	}
	
	/**
	 * Method to equalize the multidimensional array
	 * 
	 * @param d
	 * 
	 * @return multidimensional array with equal dimensions
	 */
	public Object[][] matchMultiDimensions(Object d[][]) {
		int length = 0;
		for (int i = 0; i < d.length; i++) {
			if (length < d[i].length)
				length = d[i].length;
		}
		Object[][] d1 = new Object[d.length][length];
		for (int i = 0; i < d.length; i++) {
			for (int j = 0; j < length; j++) {
				if (d[i].length < length) {
					int dif = length - d[i].length;
					if (j < d[i].length) {
						d1[i][j] = d[i][j];
					} else {
						for (int k = dif; k >= d[i].length; k--)
							d1[i][j] = 0.0;
						d1[i][j] = 0.0;
					}
				} else {
					d1[i][j] = d[i][j];
				}
			}
		}
		return d1;
	}
}