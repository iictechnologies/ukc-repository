package com.iic.ukc.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.apache.log4j.Logger;

/**
 * FileUtil is an Utility class used to save the imported RTZ/RTZP files at
 * context path
 * 
 * @author PSHV6291
 *
 */
public class FileUtil {
	private static Logger LOGGER = Logger.getLogger(FileUtil.class);

	/**
	 * Method to save given input file with specified location.
	 * 
	 * @param inputStream
	 *            {@link FileInputStream} class as input param
	 * @param path
	 *            the target path to be provided to save file
	 * @return true if the file is saved else return false if file is not saved
	 * @throws IOException
	 */
	public static boolean saveFile(InputStream inputStream, String path) throws IOException {

		LOGGER.info("saveFile method i/p InputStream: " + inputStream + " Path : " + path);
		boolean status = false;
		OutputStream outputStream = null;
		File file = new File(path);
		if (!file.exists()) {
			file.getParentFile().mkdirs();
			file.createNewFile();
		}
		outputStream = new FileOutputStream(file);
		int read = 0;
		byte[] bytes = new byte[1024];
		while ((read = inputStream.read(bytes)) != -1) {
			outputStream.write(bytes, 0, read);
		}
		inputStream.close();
		outputStream.close();
		status = true;
		return status;
	}

	/**
	 * Method to check the file or folder whether exists or not in the drive
	 * 
	 * @param fileOrFolderPath
	 *            file or folder path to check whether exists or not
	 * @return true if the file or folder exists else return false if not exists
	 */
	public static boolean fileOrFolderExists(String fileOrFolderPath) {
		LOGGER.info("fileOrFolderExists method i/p fileOrFolderPath:" + fileOrFolderPath);
		File file = new File(fileOrFolderPath);
		return file.exists();
	}

	/**
	 * Method to read the given file when specified the file path as input
	 * 
	 * @param filePath
	 *            file path as input param
	 * @return the text in the form of list line by line read file
	 * @throws IOException
	 */
	public static List<String> readFile(String filePath) throws IOException {
		LOGGER.info("readFile method i/p filePath:" + filePath);
		List<String> lines = new ArrayList<String>();
		BufferedReader br = new BufferedReader(new FileReader(new File(filePath)));
		String line = null;
		while ((line = br.readLine()) != null) {
			lines.add(line);
			LOGGER.info(line);
		}
		br.close();

		return lines;
	}

	/**
	 * Method to write the given content or text into the file
	 * 
	 * @param filePath
	 *            file path as input param
	 * @param contents
	 *            collection or list of content or text that needs to be written
	 *            into given path file
	 * @throws IOException
	 */
	public static void writeFile(String filePath, List<String> contents) throws IOException {

		LOGGER.info("writeFile method i/p filePath:" + filePath + "contents list:" + contents);
		FileWriter fw = new FileWriter(filePath);
		int size = contents.size();
		for (int i = 0; i < size; i++) {
			fw.write(contents.get(i));
		}

		fw.close();
	}

	/**
	 * Method to write the given contents into the file when file path is
	 * specified.
	 * 
	 * @param filePath
	 *            path of the file where content needs to be written or saved
	 * @param contents
	 *            text or content thats needs to be saved
	 * @throws IOException
	 */
	public static void writeFile(String filePath, String contents) throws IOException {

		LOGGER.info("writeFile method i/p filePath:" + filePath + "contents:" + contents);
		FileWriter fw = new FileWriter(filePath);
		BufferedWriter bufferWriter = new BufferedWriter(fw);
		bufferWriter.write(contents);
		bufferWriter.close();
		fw.close();
	}

	public static byte[] zipFiles(File directory, String[] files) throws IOException {

		LOGGER.info("zipFiles method i/p directory:" + directory + "files Array:" + files);
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		ZipOutputStream zipOutputStream = new ZipOutputStream(byteArrayOutputStream);
		byte bytes[] = new byte[2048];

		for (String fileName : files) {
			FileInputStream fileInputStream = new FileInputStream(directory.getPath() + "/" + fileName);
			BufferedInputStream bufferedInputStream = new BufferedInputStream(fileInputStream);

			zipOutputStream.putNextEntry(new ZipEntry(fileName));

			int bytesRead;
			while ((bytesRead = bufferedInputStream.read(bytes)) != -1) {
				zipOutputStream.write(bytes, 0, bytesRead);
			}
			zipOutputStream.closeEntry();
			bufferedInputStream.close();
			fileInputStream.close();
		}
		zipOutputStream.flush();
		byteArrayOutputStream.flush();
		zipOutputStream.close();
		byteArrayOutputStream.close();

		return byteArrayOutputStream.toByteArray();
	}

	/**
	 * Method to get the list of file names when the path of the folder is
	 * specified
	 * 
	 * @param path
	 *            path of the folder which contains the file names
	 * @return list of file names
	 */
	public static List<String> fileNames(String path) {

		LOGGER.info("fileNames method i/p Path :" + path);
		File folder = new File(path);
		LOGGER.error(path);
		List<String> fileNames = new ArrayList<>();
		if (folder.isDirectory()) {
			File[] files = folder.listFiles();
			for (File file : files) {
				if (file.isFile()) {
					fileNames.add(file.getName());
				}
			}
		}
		return fileNames;
	}
}