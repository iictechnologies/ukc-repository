package com.iic.ukc.util;

public class EmailFormatter {
	public static final String FORGOT_PASSWORD_SUBJECT ="Password recovery, do not reply";
	
	public static String formatForForgotPassword(String userName, String password) {

		StringBuilder builder = new StringBuilder();
		builder.append("<html><head></head>");
		builder.append("<body>");
		builder.append("<div>");

		builder.append("<p>");
		builder.append("Dear " + userName + ",");
		builder.append("</p>");

		builder.append("<p>");
		builder.append("You have requested for password recovery. Below is your password.<br/>");
		builder.append("Password : <b>"+password+"</b>");
		builder.append("</p>");

		/*builder.append("<p style='font-size:10px; color:#90959a; font-style:italic;'><b>Disclaimer :</b></p><hr>");
		builder.append("<p style='font-size:10px; color:#90959a; font-style:italic;'>");
		builder.append(
				"Information is being made available in this email purely as a measure of confidential. While every effort has been made to ensure that the information in this email is accurate and up-to-date, UKHO does not hold itself liable for any consequence, legal or otherwise, arising out of use of any such information.");
		builder.append("</p>");*/
		builder.append("</div>");
		builder.append("</body>");
		builder.append("</html>");

		return builder.toString();
	}
}
