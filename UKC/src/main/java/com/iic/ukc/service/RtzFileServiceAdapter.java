package com.iic.ukc.service;

import java.io.FileNotFoundException;
import java.io.IOException;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * RTZWayPointService is a Service class to provide services for Unzipping RTZP
 * file , validating RTZ file, converting RTZ file to JSON and Fetching JSON
 * data
 *  
 * @author SMDV4518
 *
 */
@Service
public class RtzFileServiceAdapter {

	@Autowired(required = true)
	private RtzFileService rtzWayPointDao = null;
	
	public void unzipRTZPFile(String xsdFilePath, String rtzFilePath) throws IOException {
		rtzWayPointDao.unzipRTZPFile(xsdFilePath, rtzFilePath);	
	}
	
	public String validateRTZFile(String xsdFilePath, String rtzFilePath) {
		return rtzWayPointDao.validateRTZFile(xsdFilePath, rtzFilePath);	
	}
	
	public JSONObject convertRTZToJson(String filePath) throws FileNotFoundException, IOException, ParseException {
		return rtzWayPointDao.convertRTZToJson(filePath);
	}
	
	public JSONArray fetchJsonData(JSONObject jsonObject) {
		return rtzWayPointDao.fetchJsonData(jsonObject);
	}
}