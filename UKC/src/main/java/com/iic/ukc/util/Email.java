package com.iic.ukc.util;

import java.io.File;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 * {@link Email} Email util class, which is resposible to send the emails to the given email
 * ids
 * 
 * @author Shiva Shankar
 * @date 04-Oct-2015
 *
 */
public class Email {
	public static String CONFIG_FROM_EMAIL_ID;
	public static String CONFIG_FROM_EMAIL_PWD;
	public static String CONFIG_SMTP_HOST;
	public static String CONFIG_SMTP_PORT;

	private static Properties emailProperties;
	private static Session session;

	/**
	 * config the initial parameters to the email
	 */
	public static void config() {
		emailProperties = new Properties();
		emailProperties.put("mail.smtp.auth", "true");
		emailProperties.put("mail.smtp.starttls.enable", "true");
		emailProperties.put("mail.smtp.host", CONFIG_SMTP_HOST);
		emailProperties.put("mail.smtp.port", CONFIG_SMTP_PORT);
		emailProperties.put("mail.smtp.ssl.trust", CONFIG_SMTP_HOST);

		session = Session.getInstance(emailProperties,
				new javax.mail.Authenticator() {
					protected PasswordAuthentication getPasswordAuthentication() {
						return new PasswordAuthentication(CONFIG_FROM_EMAIL_ID,
								CONFIG_FROM_EMAIL_PWD);
					}
				});
	}

	/**
	 * config the initial parameters to send the email to the users
	 * 
	 * @param fromEmail
	 *            to send from which email id
	 * @param fromEmailPassword
	 *            refers to password of the sender
	 * @param smtpHost
	 *            refers to host of the server configaration SMTP,TCP, etc
	 * @param portNumber
	 *            refer to the port number of the host
	 */
	public static void config(final String fromEmail,
			final String fromEmailPassword, String smtpHost, String portNumber) {

		
		emailProperties = new Properties();
		emailProperties.put("mail.smtp.auth", "true");
		emailProperties.put("mail.smtp.starttls.enable", "true");
		emailProperties.put("mail.smtp.host", smtpHost);
		emailProperties.put("mail.smtp.port", portNumber);
		emailProperties.put("mail.smtp.ssl.trust", smtpHost);

		Email.CONFIG_FROM_EMAIL_ID = fromEmail;
		Email.CONFIG_FROM_EMAIL_PWD = fromEmailPassword;

		session = Session.getInstance(emailProperties,
				new javax.mail.Authenticator() {
					protected PasswordAuthentication getPasswordAuthentication() {
						return new PasswordAuthentication(fromEmail,
								fromEmailPassword);
					}
				});
	}

	/**
	 * 
	 * @param mailTo
	 * @param subject
	 * @param body
	 * @return the status of the email
	 */
	public static String send(String mailTo, String subject, String body) {
		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(CONFIG_FROM_EMAIL_ID));
			// mailTo.replaceAll("\\s", "") which replaces or removes if any
			// white spaces are there in the email address
			message.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(mailTo.replaceAll("\\s", "")));

			message.setSubject(subject);
			message.setContent(body, "text/html");
			//message.setText(body);

			System.out.println("Sending Email to : " + mailTo + " from: "
					+ CONFIG_FROM_EMAIL_ID);
			Transport.send(message);
			System.out.println("message sent successfully....");

		} catch (Exception exception) {
			exception.printStackTrace();
		}
		return "success";
	}

	/**
	 * senda the emails to the given addresses
	 * 
	 * @param mailTo
	 *            which email to be received
	 * @param subject
	 *            email subject
	 * @param body
	 *            content to be sent to the mail to address
	 * @return returns status of the email.
	 */
	public static String send(String[] mailTo, String subject, String body) {
		for (String mail : mailTo) {
			Email.send(mail, subject, body);
		}
		return "success";
	}

	/**
	 * 
	 * @param addresses
	 * @param seperator
	 * @param subject
	 * @param body
	 * @return
	 */
	public static String send(String addresses, String seperator,
			String subject, String body) {
		String[] mails = addresses.split(seperator);
		Email.send(mails, subject, body);
		return "success";
	}

	/**
	 * send the email to the given address
	 * 
	 * @param mailTo
	 *            which email to be received
	 * @param subject
	 *            email subject
	 * @param body
	 *            content to be sent to the mail to address
	 * @return returns status of the email.
	 */
	public static String send(String mailTo, String subject, String body,
			File attachementFile, String attachedFileName) {
		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(CONFIG_FROM_EMAIL_ID));
			// mailTo.replaceAll("\\s", "") which replaces or removes if any
			// white spaces are there in the email address
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(mailTo.replaceAll("\\s", "")));

			message.setSubject(subject);
			message.setText(body);

			// create MimeBodyPart for file attachment
			MimeBodyPart messageBodyPart = new MimeBodyPart();
			Multipart multipart = new MimeMultipart();
			// file data
			DataSource source = new FileDataSource(attachementFile);
			// attach file
			messageBodyPart.setDataHandler(new DataHandler(source));
			// messageBodyPart.setFileName("PlotRegistrationForm.pdf");
			messageBodyPart.setFileName(attachedFileName);
			multipart.addBodyPart(messageBodyPart);
			message.setContent(multipart);

			System.out.println("Sending Email to : " + mailTo + " from: " + CONFIG_FROM_EMAIL_ID);
			Transport.send(message);
			System.out.println("message sent successfully....");

		} catch (Exception exception) {
			exception.printStackTrace();
		}
		return "success";
	}

	/**
	 * 
	 * @param mailTo
	 *            this parameter takes the array of email ids
	 * @param subject
	 *            this param is used to set the subject for the email
	 * @param body
	 *            set the content of the email to body
	 * @param attachementFile
	 *            set the file, if there is any attachment to the mail
	 * @param fileName
	 *            give the name of the file, that will be displayed as name in
	 *            the attachement file
	 * @return the status of the email
	 */
	public static String send(String[] mailTo, String subject, String body,
			File attachementFile, String fileName) {
		for (String emailAddress : mailTo) {
			Email.send(emailAddress, subject, body, attachementFile, fileName);
		}
		return "success";
	}

	/**
	 * The following method sends the mail to the given addresses
	 * 
	 * @param emailAddresses
	 *            this parameter takes the list of email ids as String seperated
	 *            with any charachter. Ex: abc@gmail.com,xyz@gmail.com etc
	 * @param seperator
	 *            this param is used to provide the seperater to split the email
	 *            ids accordingly Ex : "," or "*" etc;
	 * @param subject
	 *            this param is used to set the subject for the email
	 * @param body
	 *            set the content of the email to body
	 * @param attachementFile
	 *            set the file, if there is any attachment to the mail
	 * @param fileName
	 *            give the name of the file, that will be displayed as name in
	 *            the attachement file
	 * @return the status of the email
	 */
	public static String send(String emailAddresses, String seperator,
			String subject, String body, File attachementFile, String fileName) {
		String[] mails = emailAddresses.split(seperator);
		Email.send(mails, subject, body, attachementFile, fileName);
		return "success";
	}
}
