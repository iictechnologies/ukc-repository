package com.iic.ukc.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.sql.SQLException;
import java.text.ParseException;

import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.iic.ukc.service.TidalService;

@Component
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:root-test-context.xml")
public class tidalStationServiceTest {
	@Autowired
	private TidalService tidalStationService = null;

	@Test
	public void test(HttpSession session) throws JSONException, SQLException, ParseException {
		String sessionId = session.getId();
		String stationName = "Humber";

		String str = tidalStationService.saveTidalStationsWithName(stationName, sessionId);
		String expected = "SUCCESS - Inserted given TidalStation Details";
		if (str != null) {
			assertTrue(true);
		} else if (str == null) {

			assertFalse(true);
		}

		if (str != null) {
			assertEquals(expected, str);
		}
	}
	@SuppressWarnings("unused")
	@Test
	public void test4(HttpSession session) throws JSONException, SQLException, ParseException {
		String stationName = null;
		String sessionId = session.getId();
		String str = tidalStationService.saveTidalStationsWithName(stationName, sessionId);
		String expected = "SUCCESS - Inserted given TidalStation Details";
		if (str != null) {
			assertTrue(true);
		} else if (str == null) {

			assertFalse(true);
		}

		if (str != null) {			
			assertEquals(expected, str);
		}
	}

	@Test
	public void test1(HttpSession session) throws JSONException, SQLException, ParseException {
		String sessionId = session.getId();
		String str = tidalStationService.saveTidalStations(sessionId);
		String expected = "SUCCESS - Inserted Default TidalStation Details";

		if (str != null) {
			assertTrue(true);
		} else if (str == null) {
			assertFalse(true);
		}
		if (str != null) {
			assertEquals(expected, str);
		}
	}

	@Test
	public void test2(HttpSession session) throws JSONException, SQLException, ParseException {
		int duration = 0;
		String sessionId = session.getId();
		String str = tidalStationService.saveTidalHeights(duration,sessionId);
		String expected = "SUCCESS";
		if (str != null) {
			assertTrue(true);
		} else if (str == null) {
			assertFalse(true);
		}
		if (str != null) {
			assertEquals(expected, str);
		}

	}
	@Test
	public void test3(HttpSession session) throws JSONException, SQLException, ParseException {
		int duration = 0;
		String sessionId = session.getId();
		double aoiArr [] = {};
		String presentTime= "2017-07-18T00:00:00+00:00";
		String str = tidalStationService.saveTidalHeights(presentTime, duration, aoiArr, sessionId);
		String expected = "SUCCESS";
		if (str != null) {
			assertTrue(true);
		} else if (str == null) {
			assertFalse(true);
		}
		if (str != null) {
			assertEquals(expected, str);
		}

	}
	@Rule
	public ExpectedException expectedEx = ExpectedException.none();
	@SuppressWarnings("unused")
	@Test
	public void test5(HttpSession session) throws ParseException {
		int duration = 0;
		String sessionId = session.getId();
		double aoiArr [] = {};
		String presentTime= null;
		String str;
		try {
			str = tidalStationService.saveTidalHeights(presentTime, duration, aoiArr, sessionId);
			assertTrue("Exception wasn't thrown", false);
		} catch (JSONException e) {
		
			e.printStackTrace();
		} catch (SQLException e) {
			
			e.printStackTrace();
		} catch (NullPointerException e) {
			
			assertTrue("Given PresentTime is null",true);
		}
	}	
}