package com.iic.ukc.dto;

import java.io.Serializable;
import java.util.Arrays;

/**
 * WayPointsDto is a DTO class to access WayPoints
 * 
 * @author PSHV6291
 *
 */
public class WayPointsDto implements Serializable {

	private static final long serialVersionUID = 1L;
	private Double[] coordinates;
	private Double speed;
	private Double trn;
	private Double xtl;
	private Double xtr;

	/**
	 * @return the coordinates
	 */
	public Double[] getCoordinates() {
		return coordinates;
	}

	/**
	 * @param coordinates
	 *            the coordinates to set
	 */
	public void setCoordinates(Double[] coordinates) {
		this.coordinates = coordinates;
	}

	/**
	 * @return the speed
	 */
	public Double getSpeed() {
		return speed;
	}

	/**
	 * @param speed
	 *            the speed to set
	 */
	public void setSpeed(Double speed) {
		this.speed = speed;
	}

	/**
	 * @return the TRN
	 */
	public Double getTrn() {
		return trn;
	}

	/**
	 * @param trn
	 *            the TRN to set
	 */
	public void setTrn(Double trn) {
		this.trn = trn;
	}

	/**
	 * @return the XTL
	 */
	public Double getXtl() {
		return xtl;
	}

	/**
	 * @param xtl
	 *            the XTL to set
	 */
	public void setXtl(Double xtl) {
		this.xtl = xtl;
	}

	/**
	 * @return the XTR
	 */
	public Double getXtr() {
		return xtr;
	}

	/**
	 * @param XTR
	 *            the XTR to set
	 */
	public void setXtr(Double xtr) {
		this.xtr = xtr;
	}

	/**
	 * 
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Arrays.hashCode(coordinates);
		result = prime * result + ((speed == null) ? 0 : speed.hashCode());
		result = prime * result + ((trn == null) ? 0 : trn.hashCode());
		result = prime * result + ((xtl == null) ? 0 : xtl.hashCode());
		result = prime * result + ((xtr == null) ? 0 : xtr.hashCode());
		return result;
	}

	/**
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		WayPointsDto other = (WayPointsDto) obj;
		if (!Arrays.equals(coordinates, other.coordinates))
			return false;
		if (speed == null) {
			if (other.speed != null)
				return false;
		} else if (!speed.equals(other.speed))
			return false;
		if (trn == null) {
			if (other.trn != null)
				return false;
		} else if (!trn.equals(other.trn))
			return false;
		if (xtl == null) {
			if (other.xtl != null)
				return false;
		} else if (!xtl.equals(other.xtl))
			return false;
		if (xtr == null) {
			if (other.xtr != null)
				return false;
		} else if (!xtr.equals(other.xtr))
			return false;
		return true;
	}

	/** 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "WayPointsDto [coordinates=" + Arrays.toString(coordinates) + ", speed=" + speed + ", trn=" + trn
				+ ", xtl=" + xtl + ", xtr=" + xtr + "]";
	}

}