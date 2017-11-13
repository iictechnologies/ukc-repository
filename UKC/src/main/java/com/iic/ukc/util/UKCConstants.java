package com.iic.ukc.util;

/**
 * UKCConstants is an Utility class used to maintain all constant values in the
 * application
 * 
 * @author SMDV4518
 *
 */
public class UKCConstants {
	
	// Default values 
	public static final int ZERO = 0;
	
	public static final int ONE = 1;
	
	public static final String EMPTY_STRING = "";
	
	public static final String STRING_CONCAT = "&";
	
	// Home page
	public static final String HOME_URL = "/home";
	
	public static final String HOME_PAGE = "home";
	
	
	// Map page	
	public static final String  FIND_DEPTHPROFILE_WITH_TIDEHEIGHTS_URL = "/finddepthprofilewithtideheights";
	
	public static final String PROFILE_METHOD_DEPTHAREA = "DEPTHAREA";

	public static final String PROFILE_METHOD_TIN = "TIN";

	public static final String PROFILE_METHOD_CLOSEST = "CLOSEST";
	
	public static final String CLIP_XTEPOLYGON_DEPTHAREA_QUERY = "SELECT ukc_clipped_xtepolygon_deptharea_session(?,?)";
	
	public static final String CLIP_XTEPOLYGON_DEPTHAREA1_QUERY = "SELECT ukc_clipped_xtepolygon_deptharea_session(?)";
	
	public static final String CLIP_XTEPOLYGON_TIN_QUERY = "SELECT ukc_clipped_xtepolygon_tin_session(?,?,?)";
	
	public static final String CLIP_XTEPOLYGON_CLOSEST_QUERY = "SELECT ukc_clipped_xtepolygon_closest_session(?,?)";
	
	public static final String GET_JOURNEYTIME_QUERY = "SELECT ukc_journey_time_session(?,?,?,?)";
	
	public static final String GET_STATIONID_QUERY = "SELECT ukc_get_nearest_stationid_session(?)";
	
	public static final String GET_DEPTHPROFILE_WITH_NO_TIDEHEIGHTS_DEPTHAREA_QUERY = "SELECT ukc_depth_profile_with_no_tidaldata_deptharea_session_xte_wreck(?,?,?)";
	
	public static final String GET_DEPTHPROFILE_WITH_NO_STATIONID_DEPTHAREA_QUERY = "SELECT ukc_depth_profile_with_no_stationid_deptharea_session_xte_wreck(?,?,?)";
	
	public static final String GET_DEPTHPROFILE_WITH_NO_TIDEHEIGHTS_TIN_QUERY = "SELECT ukc_depth_profile_with_no_tidaldata_tin_session_xte_wreck(?,?,?)";
	
	public static final String GET_DEPTHPROFILE_WITH_NO_STATIONID_TIN_QUERY = "SELECT ukc_depth_profile_with_no_stationid_tin_session_xte_wreck(?,?,?)";
	
	public static final String GET_DEPTHPROFILE_WITH_NO_TIDEHEIGHTS_CLOSEST_QUERY = "SELECT ukc_depth_profile_with_no_tidaldata_closest_session_xte_wreck(?,?,?)";
	
	public static final String GET_DEPTHPROFILE_WITH_NO_STATIONID_CLOSEST_QUERY = "SELECT ukc_depth_profile_with_no_stationid_closest_session_xte_wreck(?,?,?)";
	
	// Tidal Webservices URLs
	public static final String STATIONS_SEARCH_BY_NAME = "serviceuri=api/v1/Stations/SearchByName&parameters=";
	
	public static final String STATIONS_SEARCH_BY_BBOX = "serviceuri=api/v1/Stations&parameters=";
	
	public static final String TIDAL_PORT_HEIGHTS = "serviceuri=api/v1/TidalPortHeights/";
	
	public static final String NORTH = "north=";
	
	public static final String SOUTH = "south=";
	
	public static final String EAST = "east=";
	
	public static final String WEST = "west=";
	
	public static final String TEXT = "text=";
	
	public static final String TYPE_PORT = "type=Ports";

	// API table names
	public static final String WAY_POINTS = "waypoints_session";

	public static final String TIDALSTATIONS_JSON = "tidalstations_json_session";
	
	public static final String TIDALSTATIONS = "tidalstations_session";

	public static final String TIDAL_HEIGHTS = "tidalheights_session";
	
	public static final String USER_LOGIN = "userlogin";

	public static final String SCHEMA_PUBLIC = "public";

	public static final String DELETE = "DELETE FROM ";
	
	public static final String GET_TIDALSTATIONS_JSON = "select * from tidalstations_json_session";
	
	public static final String TIME = "T";
	
	// Changing default time from Zero hrs to previous day 23 hrs
	public static final String DEFAULT_TIME = "23:00:00";
	
	public static final String DATEFORMAT_TIME = "HH:mm:ss";
	
	public static final String DATEFORMAT_DATETIME = "yyyy-MM-dd'T'HH:mm:ss.SSS";
	
	
	// RTZ / RTZP constants
	public static final int BUFFER_SIZE = 4096;
	
	public static final String RTZ_SCHEMA_FILE_NAME = "rtz_xmlschema.xsd";
	
	public static final String RTZ_PATH = "/WEB-INF/RTZ/";
	
	public static final String RTZP_EXTENSION = "rtzp";
	
	public static final String RTZ_EXTENSION = "rtz";
	
	public static final String FILE_SEPERATOR = "/";
	
	public static final String FILE_DOT = ".";
	
	public static final String RTZ_FILE_NODE_ROUTE = "route";
	
	public static final String RTZ_FILE_NODE_WAYPOINTS = "waypoints";
	
	public static final String RTZ_FILE_NODE_DEFAULT_WAYPOINT = "defaultWaypoint";
	
	public static final String RTZ_FILE_NODE_WAYPOINT = "waypoint";
	
	public static final String WAYPOINT_KEY_ID = "id";
	
	public static final String WAYPOINT_ID_DEFAULT_VALUE = "0";
	
	public static final String WAYPOINT_KEY_NAME = "name";
	
	public static final String WAYPOINT_NAME_DEFAULT_VALUE = "Way Point";
	
	public static final String WAYPOINT_KEY_LAT = "lat";
	
	public static final String WAYPOINT_KEY_LON = "lon";
	
	public static final String WAYPOINT_KEY_PORT = "portsideXTD";
	
	public static final String WAYPOINT_KEY_XTL = "xtl";
	
	public static final String WAYPOINT_KEY_STAR = "starboardXTD";
	
	public static final String WAYPOINT_KEY_XTR = "xtr";
	
	public static final String WAYPOINT_KEY_PLANSPEED = "planSpeedMin";
	
	public static final String WAYPOINT_KEY_SPEED = "speed";
	
	public static final String WAYPOINT_KEY_RADIUS = "radius";
	
	public static final String WAYPOINT_SPEED_DEFAULT_VALUE = "10.0";
	
	public static final String WAYPOINT_REAL_DEFAULT_VALUE = "0.0";
	
	public static final String KEY_XTE_POLYGON = "XTEPOLYGON";
}