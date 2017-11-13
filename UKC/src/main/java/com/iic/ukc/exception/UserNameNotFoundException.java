/**
 * 
 */
package com.iic.ukc.exception;

/**
 * @author PSHV6291
 *
 */
public class UserNameNotFoundException extends Exception {

	private static final long serialVersionUID = -6214427494604374998L;
	private String message;
	
	public UserNameNotFoundException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
		this.message=message;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "InvalidUserException [message=" + message + "]";
	}
}
