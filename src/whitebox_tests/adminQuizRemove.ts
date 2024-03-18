import { clear } from './../other';
import { adminQuizCreate, adminQuizRemove, adminQuizList } from './../quiz';
import { adminAuthRegister } from './../auth';

const ERROR = { error: expect.any(String) };
const VALID = {};

let authUserId1: number;
let authUserId2: number;
let invalidAuthUserId: number;
let quizId1: number;
let quizId2: number;
let quizId3: number;
let invalidQuizId: number;

beforeEach(() => {
  clear();

  authUserId1 = adminAuthRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').authUserId;
  authUserId2 = adminAuthRegister('softwaring@gmail.com', 'compp1531', 'Software', 'Engineering').authUserId;
  invalidAuthUserId = authUserId1 - 1;

  quizId1 = adminQuizCreate(authUserId1, 'Quiz One', 'This is the quiz.').quizId;
  quizId2 = adminQuizCreate(authUserId1, 'Quiz Two', 'This is the quiz.').quizId;
  quizId3 = adminQuizCreate(authUserId2, 'Quiz Three', 'This is the quiz.').quizId;
  invalidQuizId = quizId1 - 1;
});

describe('authUserId Tests', () => {
  test('invalidAuthUserId', () => {
    expect(adminQuizCreate(invalidAuthUserId, 'QuizOne', 'This is the quiz.')).toStrictEqual(ERROR);
  });

  test('validAuthUserId', () => {
    expect(adminQuizCreate(authUserId1, 'QuizOne', 'This is the quiz.')).toStrictEqual({ quizId: expect.any(Number) });
  });
});

describe('QuizId Tests', () => {
  test('Invalid QuizId', () => {
    expect(adminQuizRemove(authUserId1, invalidQuizId)).toStrictEqual(ERROR);
  });

  test('Valid QuizId', () => {
    expect(adminQuizRemove(authUserId1, quizId1)).toStrictEqual(VALID);
  });

  test('QuizId under different user', () => {
    expect(adminQuizRemove(authUserId1, quizId3)).toStrictEqual(ERROR);
  });

  test('QuizId under current user', () => {
    expect(adminQuizRemove(authUserId1, quizId1)).toStrictEqual(VALID);
  });
});

describe('Successful Removal', () => {
  test('Check if quiz was removed.', () => {
    expect(adminQuizRemove(authUserId1, quizId2)).toStrictEqual(VALID);

    // quizId2 removed from authUserId1. Thus, quizId1 should be remaining.
    expect(adminQuizList(authUserId1)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId1,
          name: 'Quiz One',
        }
      ]
    });
  });
});
