package com.iic.ukc.test;

import java.util.Arrays;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.runners.Suite.SuiteClasses;

@RunWith(Suite.class)
@SuiteClasses({ tidalStationServiceTest.class, WayPointsTest.class })
public class AllTests {
	public static void main(String[] args) {
		System.out.println(Arrays.toString(sort(new int[]{5,4,3,8,1})));
	}
	
	public static int[] sort(int[] array){
		
		for (int i = 0; i < array.length-1; i++) {
			if(array[i]>array[i+1]){
				int temp = array[i];
				array[i] = array[i+1];
				array[i+1] = temp;
			}
		}
		return array;
	}

}
