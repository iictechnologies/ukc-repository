package com.iic.ukc.service;

import java.util.Collection;

import com.iic.ukc.dto.UserDto;
import com.iic.ukc.exception.DublicateUserNameException;
import com.iic.ukc.exception.UserNameNotFoundException;

public interface IUserService {
	
	public boolean addUser(UserDto user) throws DublicateUserNameException;
	
	public UserDto getUserBy(String userName) throws UserNameNotFoundException;

	public Collection<UserDto> loadUsers();

	public boolean modifyUser(UserDto user);

	public boolean removeUser(int userid);
	
	public boolean changePassword(int userid, String oldPassword, String newPassword) throws UserNameNotFoundException;
}
