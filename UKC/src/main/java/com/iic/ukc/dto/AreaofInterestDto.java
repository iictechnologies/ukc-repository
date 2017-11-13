package com.iic.ukc.dto;

import java.io.Serializable;

/**
 * AreaofInterestDto is a DTO class to access AOI (Area of Interest)
 * 
 * @author SMDV4518
 *
 */
public class AreaofInterestDto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private Double north;
	private Double south;
	private Double east;
	private Double west;
	
	/**
	 * @return the north
	 */
	public Double getNorth() {
		return north;
	}


	/**
	 * @param north the north to set
	 */
	public void setNorth(Double north) {
		this.north = north;
	}


	/**
	 * @return the south
	 */
	public Double getSouth() {
		return south;
	}


	/**
	 * @param south the south to set
	 */
	public void setSouth(Double south) {
		this.south = south;
	}


	/**
	 * @return the east
	 */
	public Double getEast() {
		return east;
	}


	/**
	 * @param east the east to set
	 */
	public void setEast(Double east) {
		this.east = east;
	}


	/**
	 * @return the west
	 */
	public Double getWest() {
		return west;
	}


	/**
	 * @param west the west to set
	 */
	public void setWest(Double west) {
		this.west = west;
	}


	/**
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "AreaofInterestDto [north=" + north + ", south=" + south + ", east=" + east
				+ ", west=" + west + "]";
	}	
}