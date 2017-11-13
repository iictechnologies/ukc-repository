package com.iic.ukc.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * ConfigFileUtils class is an Utility class to use config.properties key-value
 * details in application
 * 
 * @author SMDV4518
 *
 */
@Component
public class ConfigFileUtils {

	@Value("${webservice.url}")
	private String webServiceUrl;

	@Value("${default.tidal.station}")
	private String defaulttidalstation;

	@Value("${geoserver.url}")
	private String geoserverUrl;

	@Value("${geoserver.workspace}")
	private String geoserverWorkspace;

	@Value("${geoserver.depthpoint.layer}")
	private String geoserverDepthPointLayer;

	@Value("${geoserver.backdrop.layer}")
	private String geoserverBackdropLayer;

	@Value("${ukboundary.north}")
	private Double ukboundarynorth;

	@Value("${ukboundary.east}")
	private Double ukboundaryeast;

	@Value("${ukboundary.west}")
	private Double ukboundarywest;

	@Value("${ukboundary.south}")
	private Double ukboundarysouth;

	@Value("${google.analytics.guid}")
	private String googleanalyticsid;

	@Value("${email.from.emaild}")
	private String emailfrom;
	
	@Value("${email.from.password}")
	private String emailfrompassword;
	
	@Value("${email.smtp.host}")
	private String emailhost;
	
	@Value("${email.port}")
	private String emailport;
	/**
	 * @return the webServiceUrl
	 */
	public String getWebServiceUrl() {
		return webServiceUrl;
	}

	/**
	 * @param webServiceUrl
	 *            the webServiceUrl to set
	 */
	public void setWebServiceUrl(String webServiceUrl) {
		this.webServiceUrl = webServiceUrl;
	}

	/**
	 * @return the default tidal station
	 */
	public String getDefaulttidalstation() {
		return defaulttidalstation;
	}

	/**
	 * @param defaulttidalstation
	 *            the default tidal station to set
	 */
	public void setDefaulttidalstation(String defaulttidalstation) {
		this.defaulttidalstation = defaulttidalstation;
	}

	/**
	 * @return the geoserverUrl
	 */
	public String getGeoserverUrl() {
		return geoserverUrl;
	}

	/**
	 * @param geoserverUrl
	 *            the geoserverUrl to set
	 */
	public void setGeoserverUrl(String geoserverUrl) {
		this.geoserverUrl = geoserverUrl;
	}

	/**
	 * @return the geoserverWorkspace
	 */
	public String getGeoserverWorkspace() {
		return geoserverWorkspace;
	}

	/**
	 * @param geoserverWorkspace
	 *            the geoserverWorkspace to set
	 */
	public void setGeoserverWorkspace(String geoserverWorkspace) {
		this.geoserverWorkspace = geoserverWorkspace;
	}

	/**
	 * @return the geoserverDepthPointLayer
	 */
	public String getGeoserverDepthPointLayer() {
		return geoserverDepthPointLayer;
	}

	/**
	 * @param geoserverDepthPointLayer
	 *            the geoserverDepthPointLayer to set
	 */
	public void setGeoserverDepthPointLayer(String geoserverDepthPointLayer) {
		this.geoserverDepthPointLayer = geoserverDepthPointLayer;
	}

	/**
	 * @return the geoserverBackdropLayer
	 */
	public String getGeoserverBackdropLayer() {
		return geoserverBackdropLayer;
	}

	/**
	 * @param geoserverBackdropLayer
	 *            the geoserverBackdropLayer to set
	 */
	public void setGeoserverBackdropLayer(String geoserverBackdropLayer) {
		this.geoserverBackdropLayer = geoserverBackdropLayer;
	}

	/**
	 * @return the ukboundarynorth
	 */
	public Double getUkboundarynorth() {
		return ukboundarynorth;
	}

	/**
	 * @param ukboundarynorth
	 *            the ukboundarynorth to set
	 */
	public void setUkboundarynorth(Double ukboundarynorth) {
		this.ukboundarynorth = ukboundarynorth;
	}

	/**
	 * @return the ukboundaryeast
	 */
	public Double getUkboundaryeast() {
		return ukboundaryeast;
	}

	/**
	 * @param ukboundaryeast
	 *            the ukboundaryeast to set
	 */
	public void setUkboundaryeast(Double ukboundaryeast) {
		this.ukboundaryeast = ukboundaryeast;
	}

	/**
	 * @return the ukboundarywest
	 */
	public Double getUkboundarywest() {
		return ukboundarywest;
	}

	/**
	 * @param ukboundarywest
	 *            the ukboundarywest to set
	 */
	public void setUkboundarywest(Double ukboundarywest) {
		this.ukboundarywest = ukboundarywest;
	}

	/**
	 * @return the ukboundarysouth
	 */
	public Double getUkboundarysouth() {
		return ukboundarysouth;
	}

	/**
	 * @param ukboundarysouth
	 *            the ukboundarysouth to set
	 */
	public void setUkboundarysouth(Double ukboundarysouth) {
		this.ukboundarysouth = ukboundarysouth;
	}

	/**
	 * @return the googleanalyticsid
	 */
	public String getGoogleanalyticsid() {
		return googleanalyticsid;
	}

	/**
	 * @param googleanalyticsid
	 *            the googleanalyticsid to set
	 */
	public void setGoogleanalyticsid(String googleanalyticsid) {
		this.googleanalyticsid = googleanalyticsid;
	}
	
	/**
	 * @return the emailfrom
	 */
	public String getEmailfrom() {
		return emailfrom;
	}

	/**
	 * @param emailfrom the emailfrom to set
	 */
	public void setEmailfrom(String emailfrom) {
		this.emailfrom = emailfrom;
	}

	/**
	 * @return the emailfrompassword
	 */
	public String getEmailfrompassword() {
		return emailfrompassword;
	}

	/**
	 * @param emailfrompassword the emailfrompassword to set
	 */
	public void setEmailfrompassword(String emailfrompassword) {
		this.emailfrompassword = emailfrompassword;
	}

	/**
	 * @return the emailhost
	 */
	public String getEmailhost() {
		return emailhost;
	}

	/**
	 * @param emailhost the emailhost to set
	 */
	public void setEmailhost(String emailhost) {
		this.emailhost = emailhost;
	}

	/**
	 * @return the emailport
	 */
	public String getEmailport() {
		return emailport;
	}

	/**
	 * @param emailport the emailport to set
	 */
	public void setEmailport(String emailport) {
		this.emailport = emailport;
	}


	@Override
	public String toString() {
		return "ConfigFileUtils [webServiceUrl=" + webServiceUrl + ", defaulttidalstation=" + defaulttidalstation
				+ ", geoserverUrl=" + geoserverUrl + ", geoserverWorkspace=" + geoserverWorkspace
				+ ", geoserverDepthPointLayer=" + geoserverDepthPointLayer + ", geoserverBackdropLayer="
				+ geoserverBackdropLayer + ", ukboundarynorth=" + ukboundarynorth + ", ukboundaryeast=" + ukboundaryeast
				+ ", ukboundarywest=" + ukboundarywest + ", ukboundarysouth=" + ukboundarysouth + ", googleanalyticsid="
				+ googleanalyticsid + ", emailfrom=" + emailfrom + ", emailfrompassword=" + emailfrompassword
				+ ", emailhost=" + emailhost + ", emailport=" + emailport + "]";
	}

}