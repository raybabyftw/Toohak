// A testing file called "adminQuizList" that tests the functionalities of adminQuizList

import { clear } from './../other';
import { adminAuthRegister, adminAuthLogin } from './../auth';
import { adminQuizCreate, adminQuizList, adminQuizRemove } from './../quiz';

// Any error strings that are passed through will count as an error
const ERROR = { error: expect.any(String) };

// This beforeEach will run before every test in this test suite!
// This saves us from having to repeatedly clear the data store every time we start a new, independent test
beforeEach(() => {
  clear();
});

describe('adminQuizList', () => {
  let regId1: number, quizId1: number, quizId2: number, quizId3: number;

  beforeEach(() => {
    regId1 = adminAuthRegister('Lina@gmail.com', 'COMP1531', 'Lina', 'Lam').authUserId;
    quizId1 = adminQuizCreate(regId1, 'Quizzy', 'Game for 1531').quizId;
  });

  // Successful return
  test('list of quizzes', () => {
    quizId2 = adminQuizCreate(regId1, 'Quizlet', 'Game for 2521').quizId;
    quizId3 = adminQuizCreate(regId1, 'Kahoot', 'Game for 1521').quizId;
    expect(adminQuizList(regId1)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId1,
          name: 'Quizzy',
        },
        {
          quizId: quizId2,
          name: 'Quizlet',
        },
        {
          quizId: quizId3,
          name: 'Kahoot',
        }
      ]
    });
  });

  // empty list
  test('authUserId does not own any quizzes', () => {
    adminQuizRemove(regId1, quizId1);
    expect(adminQuizList(regId1)).toStrictEqual({ quizzes: [] });
  });

  // err1: AuthUserId is not a valid user (can't log in)
  test('error: invalid AuthUserId', () => {
    // email doesn't exist
    expect(adminAuthLogin('peanuts@hotmail.com', 'COMP1531')).toStrictEqual(ERROR);
    // incorrect password for given email
    expect(adminAuthLogin('Lina@gmail.com', 'COMP2521')).toStrictEqual(ERROR);
  });
});
