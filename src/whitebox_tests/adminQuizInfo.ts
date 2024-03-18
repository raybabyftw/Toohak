// A testing file called "adminQuizInfo" that tests the functionalities of adminQuizInfo

import { clear } from './../other';
import { adminAuthRegister, adminAuthLogin } from './../auth';
import { adminQuizCreate, adminQuizInfo } from './../quiz';

// Any error strings that are passed through will count as an error
const ERROR = { error: expect.any(String) };

// This beforeEach will run before every test in this test suite!
// This saves us from having to repeatedly clear the data store every time we start a new, independent test
beforeEach(() => {
  clear();
});

describe('adminQuizInfo', () => {
  let userId1: number, userId2: number, quizId1: number, quizId2: number;

  beforeEach(() => {
    userId1 = adminAuthRegister('Lina@gmail.com', 'COMP1531', 'Lina', 'Lam').authUserId;
    quizId1 = adminQuizCreate(userId1, 'Quizzy', 'Game for 1531').quizId;
  });

  // Successful return
  test('view quiz info', () => {
    expect(adminQuizInfo(userId1, quizId1)).toStrictEqual(
      {
        quizId: quizId1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Game for 1531',
      }
    );
  });

  // Err1: AuthUserId is not a valid user

  test('error: invalid AuthUserId', () => {
    // email doesn't exist
    expect(adminAuthLogin('peanuts@hotmail.com', 'COMP1531')).toStrictEqual(ERROR);
    // incorrect password for given email
    expect(adminAuthLogin('Lina@gmail.com', 'COMP2521')).toStrictEqual(ERROR);
  });

  // Err2: Quiz ID does not refer to a valid quiz
  test('error: invalid quizId', () => {
    // Create invalid quiz (name < 3 characters long)
    const invalidQuizId = quizId1 - 1;
    expect(adminQuizInfo(userId1, invalidQuizId)).toStrictEqual(ERROR);
  });
  // Err3: Quiz Id does not refer to a quiz that this user owns
  test('error: user does not own quiz', () => {
    userId2 = adminAuthRegister('Lam@hotmail.com', 'COMP2521', 'Harry', 'Le').authUserId;
    quizId2 = adminQuizCreate(userId2, 'Quizlet', '2521 Game').quizId;
    expect(adminQuizInfo(userId1, quizId2)).toStrictEqual(ERROR);
    expect(adminQuizInfo(userId2, quizId1)).toStrictEqual(ERROR);
  });
});
