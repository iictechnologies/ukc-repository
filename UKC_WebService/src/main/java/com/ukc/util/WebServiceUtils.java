package com.ukc.util;

import org.springframework.http.MediaType;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

public class WebServiceUtils {

	public static ClientResponse executeGetService(String url) {
		Client client = Client.create();
		WebResource webResource = client.resource(url);
		ClientResponse response = webResource.accept(MediaType.APPLICATION_JSON_VALUE).get(ClientResponse.class);
		return response;
	}
}
