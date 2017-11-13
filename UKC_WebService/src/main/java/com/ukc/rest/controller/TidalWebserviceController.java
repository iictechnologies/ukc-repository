package com.ukc.rest.controller;

import java.util.Base64;

import org.apache.catalina.tribes.util.Arrays;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sun.jersey.api.client.ClientResponse;
import com.ukc.util.JsonUtils;
import com.ukc.util.PropertyfileUtils;
import com.ukc.util.StringUtils;
import com.ukc.util.UrlUtils;
import com.ukc.util.WebServiceUtils;

/**
 * {@link TidalWebserviceController} class, which is responsible for calling the
 * TidalWebServices from swagger site. The available rest services are as follow
 * 
 * <li>Stations
 * <ol>
 * <li>GET /api/v1/Stations/SearchByName</li>
 * <li>GET /api/v1/Stations</li>
 * <li>GET /api/v1/Stations/{id}</li>
 * </ol>
 * </li>
 * 
 * <li>StationsAndPredictions
 * <ol>
 * <li>GET /api/v1/StationsAndPredictions</li>
 * </ol>
 * </li>
 * <li>TidalPortEvents
 * <ol>
 * <li>GET /api/v1/TidalPortEvents/{id}</li>
 * </ol>
 * </li>
 * <li>TidalPortHeights
 * <ol>
 * <li>GET /api/v1/TidalPortHeights/Graph</li>
 * <li>GET /api/v1/TidalPortHeights/{id}</li>
 * </ol>
 * </li>
 * <li>TidalStreamEvents
 * <ol>
 * <li>GET /api/v1/TidalStreamEvents/{id}</li>
 * </ol>
 * </li>
 * <li>TidalStreamRates
 * <ol>
 * <li>GET /api/v1/TidalStreamRates/{id}</li>
 * </ol>
 * </li>
 * <p>
 * Returned format is a standard GeoJSON FeatureCollection. The tidal station
 * number is used as the GeoJSON feature Id. Each feature has point geometry.
 * </p>
 * <p>
 * The following custom properties are returned: </br>
 * <b>Name</b> - tidal station name </br>
 * <b>StationType</b> - TidalPortStandardHarmonic, TidalPortStandardNonHarmonic,
 * TidalPortSecondaryHarmonic, TidalPortSecondaryNonHarmonic,
 * TidalStreamHarmonic, TidalStreamNonHarmonic</br>
 * <b>Country</b> - the country that provided the data for the tidal
 * station </br>
 * <b>ATTBias</b> - offset from local timezone (as defined by Admiralty Tide
 * Tables) to UTC, in minutes Ports only Footnote - footnote text
 * HeightsAvailable - boolean to indicate if continuous heights are available
 * for this station
 * </p>
 * 
 * @author SMDV
 */
@RestController
public class TidalWebserviceController {
	private static Logger LOGGER = Logger.getLogger(TidalWebserviceController.class);

	// create instance and bind the config.properties
	// to propertyFileUtils class
	@Autowired
	private PropertyfileUtils propertyfileUtils = null;

	/**
	 * Method to execute the tidelWebService rest urls as per the given
	 * parameters.
	 * 
	 * @param serviceuri
	 *            uri to be executed, ex: /api/v1/Stations/SearchByName
	 * @param parameters
	 *            base64 encripted input parameters for the serviceuri ex:
	 *            text=humber&type=streams&api_key=xxxxxxxxx
	 * @return the geojson result to the client browser
	 * @throws JSONException
	 */
	@RequestMapping(value = "/tidalservice", method = RequestMethod.GET)
	public String executeService(@RequestParam String serviceuri, @RequestParam String parameters)
			throws JSONException {
		LOGGER.info("In TidalWebserviceController ");

		String decodeParams = StringUtils.decodeStringb64(parameters);
		String url = UrlUtils.prepareUrl(propertyfileUtils, serviceuri, decodeParams);
		ClientResponse response = WebServiceUtils.executeGetService(url);
		
		JSONObject object = new JSONObject();
		object.put("status", response.getStatus());
		if (response.getStatus() == 200) {
			String responsedata = response.getEntity(String.class);
			object.put("data", JsonUtils.toJson(responsedata));
		} else {
			object.put("message", "data not available");
		}

		LOGGER.info(object.toString());
		System.out.println(object.toString());
		return object.toString();
	}

	public static void main(String[] args) {
		String url = "text=miami&api_key=336b76844a47026b";
		LOGGER.info(Arrays.toString(url.getBytes()));
		String encodedUrl = Base64.getEncoder().encodeToString(url.getBytes());
		LOGGER.info("ENOCDED : " + encodedUrl);

		LOGGER.info(new String(Base64.getDecoder().decode(encodedUrl)));
	}

}