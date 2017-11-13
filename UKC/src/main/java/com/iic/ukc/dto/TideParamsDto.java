package com.iic.ukc.dto;

import java.io.Serializable;
import java.util.Arrays;

/**
 * ParametersDto is a DTO class to access Parameters
 * 
 * @author SMDV4518
 *
 */
public class TideParamsDto implements Serializable {
	private static final long serialVersionUID = 1L;

	private WayPointsDto[] wayPointsDtos;
	private String stationName;
	private String presentTime;
	private String profileMethod;
	private int splitCount;
	
	private Object[][] legsArr;
	private Object[][] xtePolygon;
	
	private AreaofInterestDto aoi;
	
	/**
	 * @return the wayPointsDtos
	 */
	public WayPointsDto[] getWayPointsDtos() {
		return wayPointsDtos;
	}
	/**
	 * @param wayPointsDtos the wayPointsDtos to set
	 */
	public void setWayPointsDtos(WayPointsDto[] wayPointsDtos) {
		this.wayPointsDtos = wayPointsDtos;
	}
	/**
	 * @return the stationName
	 */
	public String getStationName() {
		return stationName;
	}
	/**
	 * @param stationName the stationName to set
	 */
	public void setStationName(String stationName) {
		this.stationName = stationName;
	}
	/**
	 * @return the presentTime
	 */
	public String getPresentTime() {
		return presentTime;
	}
	/**
	 * @param presentTime the presentTime to set
	 */
	public void setPresentTime(String presentTime) {
		this.presentTime = presentTime;
	}
	/**
	 * @return the profileMethod
	 */
	public String getProfileMethod() {
		return profileMethod;
	}
	/**
	 * @param profileMethod the profileMethod to set
	 */
	public void setProfileMethod(String profileMethod) {
		this.profileMethod = profileMethod;
	}
	/**
	 * @return the splitCount
	 */
	public int getSplitCount() {
		return splitCount;
	}
	/**
	 * @param splitCount the splitCount to set
	 */
	public void setSplitCount(int splitCount) {
		this.splitCount = splitCount;
	}
	/**
	 * @return the legsArr
	 */
	public Object[][] getLegsArr() {
		return legsArr;
	}
	/**
	 * @param legsArr the legsArr to set
	 */
	public void setLegsArr(Object[][] legsArr) {
		this.legsArr = legsArr;
	}
	/**
	 * @return the xtePolygon
	 */
	public Object[][] getXtePolygon() {
		return xtePolygon;
	}
	/**
	 * @param xtePolygon the xtePolygon to set
	 */
	public void setXtePolygon(Object[][] xtePolygon) {
		this.xtePolygon = xtePolygon;
	}
	/**
	 * @return the aoi
	 */
	public AreaofInterestDto getAoi() {
		return aoi;
	}
	/**
	 * @param aoi the aoi to set
	 */
	public void setAoi(AreaofInterestDto aoi) {
		this.aoi = aoi;
	}
	
	/**
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ParametersDto [wayPointsDtos=" + Arrays.toString(wayPointsDtos)
				+ ", stationName=" + stationName + ", presentTime="
				+ presentTime + ", profileMethod=" + profileMethod
				+ ", splitCount=" + splitCount + ", legsArr="
				+ Arrays.toString(legsArr) + ", xtePolygon=" + xtePolygon
				+ ", aoi=" + aoi + "]";
	}	
}