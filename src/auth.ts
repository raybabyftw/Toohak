import validator from 'validator';
import { getData, setData, user } from './dataStore';
import { checkValidToken, getHashOf, validStringCheck, findUserFromUserId } from './helper';
import uniqid from 'uniqid';
import HTTPError from 'http-errors';

const HTTP_FAILED = 400;

/**
 * Register a user with an email, password, and names, then returns their authUserId value
 * @param { string } email
 * @param { string } password
 * @param { string } nameFirst
 * @param { string } nameLast
 * @returns { object } authUserId
 */
export const adminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string): object => {
  const dataStore = getData();

  if (dataStore.users.find(element => element.email === email)) {
    throw HTTPError(HTTP_FAILED, 'Email has already been registered.');
  // Check if email is valid or not
  } else if (validator.isEmail(email) === false) {
    throw HTTPError(HTTP_FAILED, 'Email is not valid.');
  // Check if the password satifies the conditions
  } else if (password.length < 8 || checkPasswordConditions(password) === false) {
    throw HTTPError(HTTP_FAILED, 'Password is not in correct format.');
    // check if nameFirst is valid
  } else if (!validStringCheck(nameFirst) || nameInRange(nameFirst) === false) {
    throw HTTPError(HTTP_FAILED, 'First name is not in correct format.');
    // Check if nameLast is valid
  } else if (!validStringCheck(nameLast) || nameInRange(nameLast) === false) {
    throw HTTPError(HTTP_FAILED, 'Last name is not in correct format.');
  }

  // Generate unique ID by having users object incremented by one
  const authUserId = dataStore.users.length + 1;
  const tokenId: string = uniqid();

  // Register user into dataStore file
  const user: user = {
    userId: authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email.toLocaleLowerCase(),
    currentPassword: getHashOf(password),
    usedPasswords: [],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
    tokens: [tokenId],
    trash: [],
  };

  dataStore.users.push(user); // push user details into the database
  setData(dataStore); // Update the database

  return { token: tokenId };
};

/**
 * Given a registered user's email and password returns their authUserId value
 * @param { string } email
 * @param { string } password
 * @returns { object } authUserId
 */

export const adminAuthLogin = (email: string, password: string): object => {
  const dataStore = getData();

  const user = checkEmailAndPassword(email, password);

  user.numSuccessfulLogins++;
  user.numFailedPasswordsSinceLastLogin = 0;

  const token:string = uniqid();
  user.tokens.unshift(token);

  setData(dataStore);
  return { token: token };
};

// This function logs out an admin user who has an active session
export function adminAuthLogout(token: string) {
  const dataStore = getData();
  let authUserId = -1;

  for (const user of dataStore.users) {
    if (user.tokens.includes(token)) {
      authUserId = user.userId;
      break;
    }
  }

  if (authUserId === -1) {
    throw HTTPError(HTTP_FAILED, 'Token is for a user who has already logged out.');
  }

  // search through datastore for user and remove the token
  const user = dataStore.users.find(element => element.userId === authUserId);
  const index = user.tokens.findIndex(element => element === token);
  user.tokens.splice(index, 1);

  setData(dataStore);
  return {};
}

/**
  * Given an admin user's authUserId, return details about the user.
  * "name" is the first and last name concatenated with a single space between them
  * @param { string } token
  * @returns
*/
export function adminGetUserDetails(token: any) {
  const authUserId = checkValidToken(token);
  const user = findUserFromUserId(authUserId);
  return {
    user:
    {
      userId: authUserId,
      name: `${user.nameFirst} ${user.nameLast}`,
      email: user.email,
      numSuccessfulLogins: user.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: user.numFailedPasswordsSinceLastLogin,
    }
  };
}

//= =================================================//
/**
 * Helper Functions
 */
//= =================================================//

// Helper function called checkDupeEmail() which check for any email dupes
// for adminAuthRegister()

export function checkDupeEmail(email: string, authUserId: number): boolean {
  const dataStore = getData();

  // return true if email is dupe
  const user = dataStore.users.find(element => element.email === email);
  if (user === undefined) {
    return false;
  } else if (user.userId === authUserId) {
    return false;
  } else {
    return true;
  }
}

// Helper function called checkPasswordConditions() which check password
// conditions of adminAuthRegister()
export function checkPasswordConditions(password: string): boolean {
  let foundNumber = false; // Initialise foundNumber to be false
  let foundLetter = false; // Initialise foundLetter to be false

  // Loop through the whole string
  for (let i = 0; i < password.length; i++) {
    // If a number is found then it satisfies the condition
    if (/^[0-9]+$/.test(password.charAt(i)) === true) {
      foundNumber = true;
    }
    // If a letter is found then it satisfies the condition
    if (/^[A-Za-z]+$/.test(password.charAt(i)) === true) {
      foundLetter = true;
    }
  }

  // If a string contains at least a string and a number
  if (foundNumber === true && foundLetter === true) {
    return true;
  } else {
    return false;
  }
}

export function nameInRange(name: string): boolean {
  if (name.length < 2 || name.length > 20) {
    return false;
  }

  return true;
}

const checkEmailAndPassword = (email: string, password: string) => {
  const dataStore = getData();
  const user = dataStore.users.find(element => element.email === email);

  if (user === undefined) {
    throw HTTPError(HTTP_FAILED, 'Email is not valid.');
  } else if (user.currentPassword !== getHashOf(password)) {
    user.numFailedPasswordsSinceLastLogin++;
    setData(dataStore);

    throw HTTPError(HTTP_FAILED, 'Password is not correct for the given email.');
  }

  return user;
};
