package com.iic.ukc.service;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iic.ukc.dao.IUserDao;
import com.iic.ukc.dto.UserDto;
import com.iic.ukc.exception.DublicateUserNameException;
import com.iic.ukc.exception.UserNameNotFoundException;

@Service
public class UserService implements IUserService {

	@Autowired
	private IUserDao userDao = null;

	@Override
	public boolean addUser(UserDto user) throws DublicateUserNameException {
		try {
			userDao.selectUserBy(user.getEmail());
			throw new DublicateUserNameException(user.getEmail()+" already exists");
		} catch (UserNameNotFoundException e) {
			int count = userDao.selectUsers().size();
			user.setRoleName("1");
			user.setUserId(++count);
			return userDao.insertUser(user);
		}
	}

	@Override
	public Collection<UserDto> loadUsers() {
		return userDao.selectUsers();
	}

	@Override
	public boolean modifyUser(UserDto user) {
		return userDao.updateUser(user);
	}

	@Override
	public boolean removeUser(int userId) {
		return userDao.deleteUser(userId);
	}

	@Override
	public UserDto getUserBy(String userName) throws UserNameNotFoundException {
		return userDao.selectUserBy(userName);
	}

	@Override
	public boolean changePassword(int userid, String oldPassword, String newPassword) throws UserNameNotFoundException {
		UserDto user = userDao.selectUserBy(userid);
		if(!user.getPassword().equals(oldPassword) || user.getPassword().equals(newPassword)){
			throw new UserNameNotFoundException("Invalid Current Password or New password is same as Current Password.");
		}else{
			return userDao.updatePassword(userid, newPassword);
		}
	}

}
