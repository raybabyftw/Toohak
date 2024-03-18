// A testing file called "adminUserDetails.test" that tests functionalities of adminUserDEtails function and ensures
// that everything is working as intended.

import { requestClear, requestRegister, requestLogin, requestDetailsV2 } from './routeRequestHelper';
const LOGIN_ERROR = 403;
const ERROR = { error: expect.any(String) };

beforeEach(() => {
  requestClear();
});

describe('Testing functionality of adminUserDetails function', () => {
  test('Token does not corresepond to a valid user', () => {
    const invalidToken = '12345678';
    const invalidRequest = requestDetailsV2(invalidToken);
    expect(invalidRequest.status).toStrictEqual(LOGIN_ERROR);
    expect(invalidRequest.body).toStrictEqual(ERROR);
  });
  test('numSuccessfulLogins is equal to 1, numFailedPasswordsSinceLastLogin is equal to 0', () => {
    const token1 = requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman').body.token;
    expect(requestDetailsV2(token1).body).toStrictEqual({
      user: {
        userId: 1,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('numSuccessfulLogins is equal to 1, numFailedPasswordsSinceLastLogin is equal to 1', () => {
    const token2 = requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman').body.token;
    requestLogin('rayhan1724.rahman@gmail.com', 'Poop1234!');
    expect(requestDetailsV2(token2).body).toStrictEqual({
      user: {
        userId: 1,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });

  test('numSuccessfulLogins is equal to 3, numFailedPasswordsSinceLastLogin is equal to 0', () => {
    const token3 = requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman').body.token;
    requestLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    requestLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    expect(requestDetailsV2(token3).body).toStrictEqual({
      user: {
        userId: 1,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('numSuccessfulLogins is equal to 2, numFailedPasswordsSinceLastLogin is equal to 2', () => {
    const token4 = requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman').body.token;
    requestLogin('rayhan1724.rahman@gmail.com', 'Glizzy123');
    requestLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    requestLogin('rayhan1724.rahman@gmail.com', 'Poop1234');
    requestLogin('rayhan1724.rahman@gmail.com', 'Poopy1234');
    expect(requestDetailsV2(token4).body).toStrictEqual({
      user: {
        userId: 1,
        name: 'Rayhan Rahman',
        email: 'rayhan1724.rahman@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });
});
