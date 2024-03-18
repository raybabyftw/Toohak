// A testing file called "adminUserDetails.test" that tests functionalities of adminUserDEtails function and ensures
// that everything is working as intended.

// Check for AuthUserID being a valid user

import { clear } from './../other';
import { adminAuthRegister } from './../auth';
import { adminAuthLogin } from './../auth';
import { checkUserIdExist } from './../auth';
import { adminUserDetails } from './../auth';

const ERROR = { error: expect.any(String) };

beforeEach(() => {
  clear();
});

describe('Testing functionality of adminUserDetails function', () => {
  test('authUserId is not a valid user', () => {
    const authUserId = 3;

    if (checkUserIdExist(authUserId) === true) {
      expect(adminUserDetails(authUserId)).toStrictEqual(adminUserDetails(authUserId));
    }
    if (checkUserIdExist(authUserId) === false) {
      expect(adminUserDetails(authUserId)).toStrictEqual(ERROR);
    }
  });

  test('numSuccessfulLogins is equal to 1, numFailedPasswordsSinceLastLogin is equal to 0', () => {
    const userId1 = adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    const authUserIdtest = userId1.authUserId;
    expect(adminUserDetails(authUserIdtest)).toStrictEqual({
      user: {
        userId: authUserIdtest,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('numSuccessfulLogins is equal to 1, numFailedPasswordsSinceLastLogin is equal to 1', () => {
    const userId2 = adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Poop1234!');
    const authUserIdtest = userId2.authUserId;
    expect(adminUserDetails(authUserIdtest)).toStrictEqual({
      user: {
        userId: authUserIdtest,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });

  test('numSuccessfulLogins is equal to 3, numFailedPasswordsSinceLastLogin is equal to 0', () => {
    const userId3 = adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    const authUserIdtest = userId3.authUserId;
    expect(adminUserDetails(authUserIdtest)).toStrictEqual({
      user: {
        userId: authUserIdtest,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('numSuccessfulLogins is equal to 2, numFailedPasswordsSinceLastLogin is equal to 2', () => {
    const userId4 = adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Glizzy123');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Poop1234');
    adminAuthLogin('rayhan1724.rahman@gmail.com', 'Poopy1234');
    const authUserIdtest = userId4.authUserId;
    expect(adminUserDetails(userId4.authUserId)).toStrictEqual({
      user: {
        userId: authUserIdtest,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });
});
