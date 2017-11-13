package com.iic.ukc.service;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.Iterator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.XMLConstants;
import javax.xml.transform.Source;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.XML;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import com.iic.ukc.util.UKCConstants;

/**
 * RtzFileServiceImpl is an implementation class for Unzipp RTZP file ,
 * validating RTZ file, converting RTZ file to JSON and Fetching JSON data
 * 
 * @author SMDV4518
 *
 */
@Component
public class RtzFileService {
	private static Logger LOGGER = Logger.getLogger(RtzFileService.class);

	JSONParser parser = new JSONParser();

	/**
	 * Method to unzip the RTZ file
	 * 
	 * @param zipFilePath
	 *            provide the file path, which needs to be unzipped
	 * @param destDirectory
	 *            destination path directory to be saved
	 */
	public void unzipRTZPFile(String zipFilePath, String destDirectory) throws IOException {
		LOGGER.info("In UNZip method");

		File destDir = new File(destDirectory);
		if (!destDir.exists()) {
			destDir.mkdir();
		}

		ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath));
		ZipEntry entry = zipIn.getNextEntry();

		while (entry != null) {
			String filePath = destDirectory + File.separator + entry.getName();
			if (!entry.isDirectory()) {
				extractFile(zipIn, filePath);
			} else {
				File dir = new File(filePath);
				dir.mkdir();
			}
			zipIn.closeEntry();
			entry = zipIn.getNextEntry();
		}
		zipIn.close();
	}

	/**
	 * Method to extract the Zip file
	 * 
	 * @param zipIn
	 *            {@link ZipInputStream} class
	 * @param filePath
	 *            path of the zip file
	 * @throws IOException
	 */
	public void extractFile(ZipInputStream zipIn, String filePath) throws IOException {
		BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(filePath));
		byte[] bytesIn = new byte[UKCConstants.BUFFER_SIZE];
		int read = 0;
		while ((read = zipIn.read(bytesIn)) != -1) {
			bos.write(bytesIn, 0, read);
		}
		bos.close();
	}

	/**
	 * method to validate the XSD file and RTZ file
	 * 
	 * @param xsdFilePath
	 * @param rtzFilePath
	 */
	public String validateRTZFile(String xsdFilePath, String rtzFilePath) {
		LOGGER.info("xsdFilePath : " + xsdFilePath);
		File schemaFile = new File(xsdFilePath + UKCConstants.FILE_SEPERATOR + UKCConstants.RTZ_SCHEMA_FILE_NAME);
		Source xmlFile = new StreamSource(new File(rtzFilePath));
		String status = validateFile(schemaFile, xmlFile);
		LOGGER.info("Status : " + status.toString());
		return status;
	}

	@SuppressWarnings("unchecked")
	public String validateFile(File schemaFile, Source xmlFile) {
		String status;
		String fileName = xmlFile.getSystemId().substring(xmlFile.getSystemId().lastIndexOf("/") + 1,
				xmlFile.getSystemId().length());
		JSONObject json = new JSONObject();

		SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
		try {
			Schema schema = schemaFactory.newSchema(schemaFile);
			Validator validator = schema.newValidator();
			validator.validate(xmlFile);
			LOGGER.info(xmlFile.getSystemId() + " is valid");
			json.put("status", UKCConstants.ZERO);
			json.put("fileName", fileName);
			json.put("message", "Is Valid");
		} catch (SAXException e) {
			LOGGER.info(xmlFile.toString() + " is NOT valid ");
			LOGGER.info("Cause:" + e.getCause());
			LOGGER.info("Message:" + e.getMessage());
			String exceptionStr = e.fillInStackTrace().toString();
			String[] strList = exceptionStr.split(";");
			int length = strList.length;

			json.put("status", UKCConstants.ONE);
			json.put("fileName", fileName);
			json.put("message", strList[length - 1]);
			json.put("lineDetails", strList[length - 3] + "; " + strList[length - 2]);
		} catch (IOException e) {
			LOGGER.info(xmlFile.toString() + " is NOT valid ");
			LOGGER.info("Cause:" + e.getCause());
			LOGGER.info("Message:" + e.getMessage());
			String exceptionStr = e.fillInStackTrace().toString();
			String[] strList = exceptionStr.split(";");
			int length = strList.length;

			json.put("status", UKCConstants.ONE);
			json.put("fileName", fileName);
			json.put("message", strList[length - 1]);
			json.put("lineDetails", strList[length - 3] + "; " + strList[length - 2]);
		}
		status = json.toString();
		return status;
	}

	/**
	 * Method to read the RTZ file and convert it into {@link JSONObject} format
	 * 
	 * @param filePath
	 *            RTZ file path
	 * @return the {@link JSONObject}
	 */
	public JSONObject convertRTZToJson(String filePath) throws FileNotFoundException, IOException, ParseException {
		org.json.JSONObject xmlJSONObj = null;
		JSONObject jsonObject = null;
		try {
			File file = new File(filePath);
			FileReader fr = new FileReader(file);
			BufferedReader br = new BufferedReader(fr);

			String sCurrentLine = null;
			String temp = "";

			while ((sCurrentLine = br.readLine()) != null) {
				temp += sCurrentLine;
			}

			fr.close();
			xmlJSONObj = XML.toJSONObject(temp);
			jsonObject = (JSONObject) parser.parse(xmlJSONObj.toString());
		} catch (JSONException je) {
			LOGGER.error(je.toString());
		}
		return jsonObject;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public JSONArray fetchJsonData(JSONObject jsonObject) {
		JSONObject routeNode = (JSONObject) jsonObject.get(UKCConstants.RTZ_FILE_NODE_ROUTE);

		JSONObject waypointsNode = (JSONObject) routeNode.get(UKCConstants.RTZ_FILE_NODE_WAYPOINTS);

		JSONObject defaultWayPointNode = (JSONObject) waypointsNode.get(UKCConstants.RTZ_FILE_NODE_DEFAULT_WAYPOINT);
		defaultWayPointNode = jsonIterate(defaultWayPointNode);

		JSONArray waypointArr = (JSONArray) waypointsNode.get(UKCConstants.RTZ_FILE_NODE_WAYPOINT);

		JSONArray waypointList = new JSONArray();
		JSONObject waypoints1 = new JSONObject();
		Iterator<JSONObject> iterator1 = waypointArr.iterator();
		while (iterator1.hasNext()) {
			waypoints1 = jsonIterate((JSONObject) iterator1.next());
			waypointList.add(waypoints1);
		}
		JSONArray waypointList1 = new JSONArray();

		for (Iterator iterator = waypointList.iterator(); iterator.hasNext();) {
			while (iterator.hasNext()) {
				JSONObject wayPointsObj = new JSONObject();
				JSONObject sample = new JSONObject();
				sample = (JSONObject) iterator.next();

				// 1. Check for Waypoint Id
				boolean NotNullAndContainsKey = sample.containsKey(UKCConstants.WAYPOINT_KEY_ID)
						&& sample.get(UKCConstants.WAYPOINT_KEY_ID) != null;

				if (NotNullAndContainsKey) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_ID, sample.get(UKCConstants.WAYPOINT_KEY_ID));
				} else {

					NotNullAndContainsKey = defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_ID)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_ID) != null;

					if (NotNullAndContainsKey) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_ID,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_ID));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_ID, UKCConstants.WAYPOINT_ID_DEFAULT_VALUE);
					}
				}

				NotNullAndContainsKey = sample.containsKey(UKCConstants.WAYPOINT_KEY_NAME)
						&& sample.get(UKCConstants.WAYPOINT_KEY_NAME) != null;
				// 2. Check for Waypoint Name
				if (NotNullAndContainsKey) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_NAME, sample.get(UKCConstants.WAYPOINT_KEY_NAME));
				} else {
					NotNullAndContainsKey = defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_NAME)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_NAME) != null;
					if (NotNullAndContainsKey) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_NAME,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_NAME));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_NAME, UKCConstants.WAYPOINT_NAME_DEFAULT_VALUE);
					}
				}

				// 3. Check for Latitude
				if (sample.containsKey(UKCConstants.WAYPOINT_KEY_LAT)
						&& sample.get(UKCConstants.WAYPOINT_KEY_LAT) != null) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_LAT, sample.get(UKCConstants.WAYPOINT_KEY_LAT));
				} else {
					if (defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_LAT)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_LAT) != null) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_LAT,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_LAT));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_LAT, UKCConstants.WAYPOINT_REAL_DEFAULT_VALUE);
					}
				}

				// 4. Check for Longitude
				if (sample.containsKey(UKCConstants.WAYPOINT_KEY_LON)
						&& sample.get(UKCConstants.WAYPOINT_KEY_LON) != null) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_LON, sample.get(UKCConstants.WAYPOINT_KEY_LON));
				} else {
					if (defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_LON)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_LON) != null) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_LON,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_LON));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_LON, UKCConstants.WAYPOINT_REAL_DEFAULT_VALUE);
					}
				}

				// 5. Check for PortXTD
				if (sample.containsKey(UKCConstants.WAYPOINT_KEY_PORT)
						&& sample.get(UKCConstants.WAYPOINT_KEY_PORT) != null) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_XTL, sample.get(UKCConstants.WAYPOINT_KEY_PORT));
				} else {
					if (defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_PORT)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_PORT) != null) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_XTL,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_PORT));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_XTL, UKCConstants.WAYPOINT_REAL_DEFAULT_VALUE);
					}
				}

				// 6. Check for StarboardXTD
				if (sample.containsKey(UKCConstants.WAYPOINT_KEY_STAR)
						&& sample.get(UKCConstants.WAYPOINT_KEY_STAR) != null) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_XTR, sample.get(UKCConstants.WAYPOINT_KEY_STAR));
				} else {
					if (defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_STAR)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_STAR) != null) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_XTR,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_STAR));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_XTR, UKCConstants.WAYPOINT_REAL_DEFAULT_VALUE);
					}
				}

				// 7. Check for Speed
				if (sample.containsKey(UKCConstants.WAYPOINT_KEY_PLANSPEED)
						&& sample.get(UKCConstants.WAYPOINT_KEY_PLANSPEED) != null) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_SPEED, sample.get(UKCConstants.WAYPOINT_KEY_PLANSPEED));
				} else {
					if (defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_PLANSPEED)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_PLANSPEED) != null) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_SPEED,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_PLANSPEED));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_SPEED, UKCConstants.WAYPOINT_SPEED_DEFAULT_VALUE);
					}
				}

				// 8. Check for Radius
				if (sample.containsKey(UKCConstants.WAYPOINT_KEY_RADIUS)
						&& sample.get(UKCConstants.WAYPOINT_KEY_RADIUS) != null) {
					wayPointsObj.put(UKCConstants.WAYPOINT_KEY_RADIUS, sample.get(UKCConstants.WAYPOINT_KEY_RADIUS));
				} else {
					if (defaultWayPointNode.containsKey(UKCConstants.WAYPOINT_KEY_RADIUS)
							&& defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_RADIUS) != null) {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_RADIUS,
								defaultWayPointNode.get(UKCConstants.WAYPOINT_KEY_RADIUS));
					} else {
						wayPointsObj.put(UKCConstants.WAYPOINT_KEY_RADIUS, UKCConstants.WAYPOINT_REAL_DEFAULT_VALUE);
					}
				}
				waypointList1.add(wayPointsObj);
			}
		}

		LOGGER.info("JSONArray : " + waypointList1);

		return waypointList1;
	}

	@SuppressWarnings("unchecked")
	public JSONObject jsonIterate(JSONObject route) {
		JSONObject sampleJSONObject = new JSONObject();

		for (Object keyObject : route.keySet()) {
			JSONObject sampleJSONObject1 = sampleJSONObject;
			Object item = route.get(keyObject.toString());

			if (item instanceof JSONArray) {
				JSONArray urlArray = (JSONArray) item;
				Iterator<JSONObject> iterator = urlArray.iterator();
				while (iterator.hasNext()) {
					jsonIterate(iterator.next());
				}
			} else if (item instanceof JSONObject) {
				JSONObject jsonObject = (JSONObject) route.get(keyObject);
				jsonIterate(jsonObject);
				sampleJSONObject.putAll(jsonObject);
			} else if (item instanceof Double) {
				Double doubleValue = (Double) item;
				sampleJSONObject1.put(keyObject, doubleValue.doubleValue());
			} else if (item instanceof Long) {
				Long longValue = (Long) item;
				sampleJSONObject1.put(keyObject, longValue.longValue());
			} else if (item instanceof String) {
				String stringValue = (String) item;
				sampleJSONObject1.put(keyObject, stringValue.toString());
			}
		}

		return sampleJSONObject;
	}
}