// A testing file called "clear.test" that tests functionalities of clear function and ensures
// that everything is working as intended.

import { clear } from './../other';
import { adminAuthRegister } from './../auth';
import { adminAuthLogin } from './../auth';
import { adminQuizCreate } from './../quiz';

const ERROR = { error: expect.any(String) };

clear();

describe('Testing functionality of clear function', () => {
  test('Testing for user being cleared', () => {
    adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    clear();
    expect(adminAuthLogin('rayhan1724.rahman@gmail.com', 'Rayhan1724!')).toStrictEqual(ERROR);
  });

  test('Testing for user and quizzes being cleared', () => {
    adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    adminQuizCreate(1, 'quiz1', 'testquiz1');
    clear();
    adminAuthRegister('raybaby.rahman@gmail.com', 'GrainWaves1724!', 'Raybaby', 'Rahman');
    expect(adminQuizCreate(1, 'quiz2', 'testquiz2').quizId).toStrictEqual(1);
  });

  test('Testing that register works after clear', () => {
    adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman');
    clear();
    expect(adminAuthRegister('rayhan1724.rahman@gmail.com', 'Rayhan1724!', 'Rayhan', 'Rahman').authUserId).toStrictEqual(1);
  });
});
