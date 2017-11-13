package com.ukc.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * {@link PropertyfileUtils} class is reponsible for receiving property values
 * from Config.properities based {@value} property of spring and bind to the
 * member variables of the class.
 * 
 * @author SMDV
 */
@Component
public class PropertyfileUtils {

	// set tidalwebservice url
	@Value("${tidal.webservice.url}")
	private String tidalserviceurl = null;

	// set tidalwebservice apikey
	@Value("${tidal.webservice.apikey}")
	private String tidalservicekey = null;

	/**
	 * @return the tidalserviceurl
	 */
	public String getTidalserviceurl() {
		return tidalserviceurl;
	}

	/**
	 * @param tidalserviceurl
	 *            the tidalserviceurl to set
	 */
	public void setTidalserviceurl(String tidalserviceurl) {
		this.tidalserviceurl = tidalserviceurl;
	}

	/**
	 * @return the tidalservicekey
	 */
	public String getTidalservicekey() {
		return tidalservicekey;
	}

	/**
	 * @param tidalservicekey
	 *            the tidalservicekey to set
	 */
	public void setTidalservicekey(String tidalservicekey) {
		this.tidalservicekey = tidalservicekey;
	}

	/**
	 * Returns a string representation of the object. In general, the toString
	 * method returns a string that "textually represents" this object. The
	 * result should be a concise but informative representation that is easy
	 * for a person to read. It is recommended that all subclasses override this
	 * method. The toString method for class Object returns a string consisting
	 * of the name of the class of which the object is an instance, the at-sign
	 * character `@', and the unsigned hexadecimal representation of the hash
	 * code of the object. In other words, this method returns a string equal to
	 * the value of:
	 * 
	 * getClass().getName() + '@' + Integer.toHexString(hashCode())
	 * 
	 * Returns:a string representation of the object.
	 */
	@Override
	public String toString() {
		return "PropertyfileUtils [tidalserviceurl=" + tidalserviceurl + ", tidalservicekey=" + tidalservicekey + "]";
	}

}
