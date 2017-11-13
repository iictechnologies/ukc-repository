# Pre requisites 

* Java 1.8
* Tomcat7
* eclipse IDE
* Maven

# Build instructions

1. Download the source code zip file from GitHub.
2. Extract the downloaded zip file in folder.
3. Open the eclipse IDE.
4. Import projects (UKC, UKC_Webservice) as existing maven projects into workspace.
5. Add the Tomcat7 server to the projects runtime.
6. Make sure that the Java project facet set to Java 1.7.
7. To change the database, tidal service, web service and GeoServer properties, go to UKC/src/main/resources/config.properties file and do the necessary changes. Do similarly for UKC_Webservice project as well.
7. To build/run, go to Run menu, select "Run as" --> "Run on Server".
8. Run on server dialogue box will be displayed.
9. In the dialogue box, Select tomcat server and click finish button.
10. The application should build and run on the browser.