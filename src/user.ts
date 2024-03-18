import validator from 'validator';
import { getData, setData } from './dataStore';
import { checkDupeEmail, nameInRange, checkPasswordConditions } from './auth';
import { checkValidToken, findUserFromUserId, getHashOf, validStringCheck } from './helper';
import HTTPError from 'http-errors';

const HTTP_FAILED = 400;

export function adminUserUpdateDetails(token: string, email: string, nameFirst: string, nameLast: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  if (checkDupeEmail(email, authUserId) === true) {
    throw HTTPError(HTTP_FAILED, 'This email has already been used by another user.');
  } else if (validator.isEmail(email) === false) {
    throw HTTPError(HTTP_FAILED, 'Email is not valid.');
  } else if (!validStringCheck(nameFirst) || nameInRange(nameFirst) === false) {
    throw HTTPError(HTTP_FAILED, 'First name is not in correct format.');
  } else if (!validStringCheck(nameLast) || nameInRange(nameLast) === false) {
    throw HTTPError(HTTP_FAILED, 'Last name is not in correct format.');
  }

  const user = findUserFromUserId(authUserId);

  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;
  setData(dataStore);

  return {};
}

export function adminUserUpdatePassword(token: string, oldPassword: string, newPassword: string) {
  const dataStore = getData();
  const authUserId = checkValidToken(token);

  const user = findUserFromUserId(authUserId);

  if (checkPasswordConditions(newPassword) === false) {
    throw HTTPError(HTTP_FAILED, 'Password is not in correct format.');
  } else if (user.usedPasswords.includes(getHashOf(newPassword))) {
    throw HTTPError(HTTP_FAILED, 'You have already used this password before');
  } else if (newPassword.length < 8) {
    throw HTTPError(HTTP_FAILED, 'New Password is less than 8 characters');
  } else if (user.currentPassword !== getHashOf(oldPassword)) {
    throw HTTPError(HTTP_FAILED, 'Old password is incorrect.');
  } else if (oldPassword === newPassword) {
    throw HTTPError(HTTP_FAILED, 'Old password is identical to new password');
  }

  user.currentPassword = getHashOf(newPassword);
  user.usedPasswords.push(getHashOf(oldPassword));
  setData(dataStore);

  return {};
}
