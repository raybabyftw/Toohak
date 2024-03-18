// A testing file called "clear.test" that tests functionalities of clear function and ensures
// that everything is working as intended.

import { requestClear, requestRegister, requestLogin, requestQuizInfo, requestQuizCreate } from './routeRequestHelper';

const LOGIN_ERROR = 400;
const ERROR_STRING = { error: expect.any(String) };

requestClear();

describe('Testing functionality of clear function', () => {
  test('Testing for user being cleared', () => {
    requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    requestClear();
    const failLogin = requestLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    expect(failLogin.status).toStrictEqual(LOGIN_ERROR);
  });

  test('Testing for user and quizzes being cleared', () => {
    const token1 = requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman').body.token;
    const quizId1 = requestQuizCreate(token1, 'quiz1', 'testquiz1').body.quizId;
    requestClear();
    const failLogin = requestLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!');
    expect(failLogin.status).toStrictEqual(LOGIN_ERROR);
    const failedQuizInfo = requestQuizInfo(quizId1, token1);
    expect(failedQuizInfo.body).toStrictEqual(ERROR_STRING);
  });

  test('Testing that register works after clear', () => {
    requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    requestClear();
    const registeredUser1 = requestRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    const registeredUser2 = requestRegister('andrew.suhaili@gmail.com', 'Andrew2003!', 'Andrew', 'Suhaili');
    expect(registeredUser1.body.token).toStrictEqual(expect.any(String));
    expect(registeredUser2.body.token).toStrictEqual(expect.any(String));
  });
});
