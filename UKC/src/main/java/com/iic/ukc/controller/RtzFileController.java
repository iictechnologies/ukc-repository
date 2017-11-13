package com.iic.ukc.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.iic.ukc.service.RtzFileServiceAdapter;
import com.iic.ukc.util.FileUtil;
import com.iic.ukc.util.UKCConstants;

/**
 * RtzFileController is a controller class
 * 
 * @author SMDV4518
 *
 */
@Controller
public class RtzFileController {
	private static Logger LOGGER = Logger.getLogger(RtzFileController.class);

	// autowire rtzWayPointService class
	@Autowired
	private RtzFileServiceAdapter rtzWayPointService = null;

	/**
	 * method to process and save the RTZFile reads the RTZ file and sends the
	 * result
	 * 
	 * @param datafile
	 *            RTZ file of type multi-part.
	 * @param session
	 *            {@link HttpSession} class
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 * @throws ParseException
	 * @throws JSONException
	 */
	@SuppressWarnings({ "unused", "unchecked" })
	@RequestMapping(value = "/rtzwaypoints", method = RequestMethod.POST)
	public @ResponseBody JSONArray processRTZFile(@RequestParam("datafile") MultipartFile datafile, HttpSession session)
			throws FileNotFoundException, IOException, ParseException, JSONException {
		LOGGER.info("Process RTZfile from /uploadRtzFile.htm");
		String result = null;
		org.json.JSONObject resultObj = null;

		boolean filestatus = false;
		if (datafile.isEmpty()) {
			// return false;
		}

		String rtzPath = session.getServletContext().getRealPath(UKCConstants.RTZ_PATH);

		String filePath = rtzPath + UKCConstants.FILE_SEPERATOR + session.getId() + UKCConstants.FILE_SEPERATOR
				+ datafile.getOriginalFilename();
		LOGGER.info("Requested for RTZ file validation");
		JSONObject xmlJSONObj = new JSONObject();
		JSONArray waypointList = new JSONArray();

		File fileName = new File(filePath);
		if (getFileExtension(fileName).equalsIgnoreCase(UKCConstants.RTZP_EXTENSION)) {
			filestatus = FileUtil.saveFile(datafile.getInputStream(), rtzPath + UKCConstants.FILE_SEPERATOR
					+ session.getId() + UKCConstants.FILE_SEPERATOR + datafile.getOriginalFilename());

			rtzWayPointService.unzipRTZPFile(filePath, rtzPath + UKCConstants.FILE_SEPERATOR + session.getId()
					+ UKCConstants.FILE_SEPERATOR + getFileWithoutExtension(datafile.getOriginalFilename()));
			File folder = new File(rtzPath + UKCConstants.FILE_SEPERATOR + session.getId() + UKCConstants.FILE_SEPERATOR
					+ getFileWithoutExtension(datafile.getOriginalFilename()));
			File[] listOfFiles = folder.listFiles();

			for (File file : listOfFiles) {
				if (file.isFile()) {
					if (getFileExtension(file).equalsIgnoreCase(UKCConstants.RTZ_EXTENSION)) {
						filePath = folder.getAbsolutePath() + UKCConstants.FILE_SEPERATOR + file.getName();
						break;
					}
				}
			}
			LOGGER.info("Path to send : " + filePath);
		} else {
			filestatus = FileUtil.saveFile(datafile.getInputStream(), rtzPath + UKCConstants.FILE_SEPERATOR
					+ session.getId() + UKCConstants.FILE_SEPERATOR + datafile.getOriginalFilename());
			LOGGER.info("RTZfile path :: " + rtzPath + UKCConstants.FILE_SEPERATOR + session.getId()
					+ UKCConstants.FILE_SEPERATOR + datafile.getOriginalFilename());

		}

		String valid = rtzWayPointService.validateRTZFile(rtzPath, filePath);
		resultObj = new org.json.JSONObject(valid);

		if (resultObj.getInt("status") == UKCConstants.ZERO) {
			xmlJSONObj = rtzWayPointService.convertRTZToJson(filePath);
			waypointList = rtzWayPointService.fetchJsonData(xmlJSONObj);
			LOGGER.info("Response : " + waypointList);
		} else {
			JSONParser parser = new JSONParser();
			Object obj = parser.parse(resultObj.toString());
			waypointList.add(obj);
		}
		return waypointList;
	}

	/**
	 * Method to get file extension
	 * 
	 * @param file
	 *            input the file object
	 * @return file path extension
	 */
	private String getFileExtension(File file) {
		String name = file.getName();
		try {
			return name.substring(name.lastIndexOf(UKCConstants.FILE_DOT) + 1);
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * Method to get the file without extension
	 * 
	 * @param fileName
	 *            input the file object
	 * @return the file path without extension
	 */
	private String getFileWithoutExtension(String fileName) {
		int pos = fileName.lastIndexOf(UKCConstants.FILE_DOT);

		if (pos == -1)
			return fileName;

		return fileName.substring(0, pos);
	}
}