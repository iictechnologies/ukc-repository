package com.iic.ukc.dao;

import java.util.Collection;

import com.iic.ukc.dto.UserDto;
import com.iic.ukc.exception.UserNameNotFoundException;

public interface IUserDao {
	
	public Collection<UserDto> selectUsers();

	public UserDto selectUserBy(int userId);
	
	public UserDto selectUserBy(String userName) throws UserNameNotFoundException;

	public boolean insertUser(UserDto user);

	public boolean updateUser(UserDto user);

	public boolean deleteUser(int userId);
	
	public boolean updatePassword(int userId, String newPassword);
}
