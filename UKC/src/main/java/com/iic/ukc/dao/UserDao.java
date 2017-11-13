package com.iic.ukc.dao;

import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import com.iic.ukc.dto.UserDto;
import com.iic.ukc.exception.UserNameNotFoundException;
import com.iic.ukc.util.UKCConstants;

/**
 * {@link UserDao} class is responsible for User login persistence businuss
 * logic
 * 
 * @author PSHV6291
 *
 */
@Repository
public class UserDao implements IUserDao {

	private JdbcTemplate jdbcTemplate = null;
	private SimpleJdbcInsert simpleJdbcInsert = null;

	/**
	 * Parameter constructor mandatory to provide
	 * 
	 * @param jdbcTemplate
	 */
	@Autowired
	public UserDao(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
		this.simpleJdbcInsert = new SimpleJdbcInsert(jdbcTemplate).withTableName(UKCConstants.USER_LOGIN);
	}

	/**
	 * Method to get list of Users from the database.
	 */
	@Override
	public Collection<UserDto> selectUsers() {

		List<Map<String, Object>> userlist = this.jdbcTemplate.queryForList("SELECT * FROM " + UKCConstants.USER_LOGIN);
		List<UserDto> users = new ArrayList<>();

		for (Map<String, Object> map : userlist) {

			UserDto user = new UserDto();
			user.setUserId(Integer.parseInt(map.get("userid").toString()));
			user.setFirstName(String.valueOf(map.get("firstname")));
			user.setLastName(String.valueOf(map.get("lastname")));
			user.setPhoneNumber(String.valueOf(map.get("phonenumber")));
			user.setEmail(String.valueOf(map.get("email")));
			user.setEnable(Boolean.valueOf(map.get("enable").toString()));

			users.add(user);
		}

		return users;
	}

	/**
	 * Method to select the user by userid
	 * 
	 * @param userId
	 *            the user id of the user
	 * @return the User
	 */
	@Override
	public UserDto selectUserBy(int userId) {
		String query = "SELECT * FROM userlogin WHERE userid=?";
		Map<String, Object> dbuser = this.jdbcTemplate.queryForMap(query, new Object[] { userId });

		if (dbuser != null && dbuser.size() > 0) {
			UserDto user = new UserDto();
			user.setUserId(Integer.parseInt(dbuser.get("userid").toString()));
			user.setFirstName(String.valueOf(dbuser.get("firstname")));
			user.setLastName(String.valueOf(dbuser.get("lastname")));
			user.setPhoneNumber(String.valueOf(dbuser.get("phonenumber")));
			user.setEmail(String.valueOf(dbuser.get("email")));
			user.setEnable(Boolean.valueOf(dbuser.get("enable").toString()));
			user.setPassword(String.valueOf(dbuser.get("password")));
			return user;
		}

		return null;
	}

	/**
	 * Method to select the user by user name
	 * 
	 * @param userName
	 *            the name of the user
	 * @return the user
	 * @throws UserNameNotFoundException
	 *             class
	 */
	public UserDto selectUserBy(String userName) throws UserNameNotFoundException {
		String query = "SELECT * FROM userlogin WHERE username=?";

		try {
			Map<String, Object> dbuser = this.jdbcTemplate.queryForMap(query, new Object[] { userName });
			if (dbuser != null && dbuser.size() > 0) {

				UserDto user = new UserDto();
				user.setUserId(Integer.parseInt(dbuser.get("userid").toString()));
				user.setFirstName(String.valueOf(dbuser.get("firstname")));
				user.setLastName(String.valueOf(dbuser.get("lastname")));
				user.setPhoneNumber(String.valueOf(dbuser.get("phonenumber")));
				user.setEmail(String.valueOf(dbuser.get("email")));
				user.setEnable(Boolean.valueOf(dbuser.get("enable").toString()));
				user.setPassword(String.valueOf(dbuser.get("password")));
				return user;

			} else {
				throw new UserNameNotFoundException("user name not found");
			}
		} catch (EmptyResultDataAccessException exception) {
			throw new UserNameNotFoundException("user name not found");
		}
	}

	/**
	 * Method to insert user into the database
	 * 
	 * @param user
	 *            the user dto from the service class
	 * @return true, if user is inserted else false, if user is not inserted
	 */
	@Override
	public boolean insertUser(UserDto user) {

		SqlParameterSource parameterSource = new MapSqlParameterSource().addValue("userid", user.getUserId())
				.addValue("roleid", user.getRoleName()).addValue("username", user.getEmail())
				.addValue("password", user.getPassword()).addValue("firstname", user.getFirstName())
				.addValue("lastname", user.getLastName()).addValue("email", user.getEmail())
				.addValue("phonenumber", user.getPhoneNumber()).addValue("enable", user.isEnable());

		int result = this.simpleJdbcInsert.execute(parameterSource);

		return 1 == result;
	}

	@Override
	public boolean updateUser(UserDto user) {
		return false;
	}

	@Override
	public boolean deleteUser(int userId) {
		return false;
	}

	@Override
	public boolean updatePassword(int userId, String newPassword) {
		String query = "UPDATE userlogin SET password=? WHERE userid=?";

		int result = this.jdbcTemplate.update(query, new Object[] { newPassword, userId },
				new int[] { Types.VARCHAR, Types.INTEGER });

		return result == 1;
	}

}
