import { adminQuizNameUpdate, adminQuizCreate, adminQuizRemove, adminQuizInfo } from './../quiz';
import { adminAuthRegister } from './../auth';
import { clear } from './../other';

//  AuthUserId is not a valid user
//  Quiz ID does not refer to a valid quiz
//   Quiz ID does not refer to a quiz that this user owns
//  Name contains any characters that are not alphanumeric or are spaces
//  Name is either less than 3 characters long or more than 30 characters long
//  Name is already used by the current logged in user for another quiz

const ERROR = { error: expect.any(String) };
let userId1: number;
let invalidserid: number;
let userId2: number;
let userId3: number;
let userId1QuizId1: number;
let invalidQuizId: number;
let userId1QuizId2: number;
let userId2QuizId1: number;

beforeEach(() => {
  clear();

  userId1 = adminAuthRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').authUserId;
  invalidserid = userId1 - 1;
  userId2 = adminAuthRegister('ray@gmail.com', 'COMP1521', 'Ray', 'Han').authUserId;
  userId3 = adminAuthRegister('super@gmail.com', 'COMP1541', 'Super', 'Man').authUserId;
  userId1QuizId1 = adminQuizCreate(userId1, 'Quizzy', 'Game for 1511').quizId;
  invalidQuizId = userId1QuizId1 - 1;
  userId1QuizId2 = adminQuizCreate(userId1, 'Wheezy', 'Game for 1521').quizId;
  userId2QuizId1 = adminQuizCreate(userId2, 'Glizzy', 'Game for 1531').quizId;
});
describe('AuthUserId is not a valid user', () => {
  test('Invalid AuthUserId', () => {
    expect(adminQuizNameUpdate(invalidserid, userId1QuizId1, 'Quizzy2')).toStrictEqual(ERROR);
  });
});

describe('QuizId is not a valid quiz', () => {
  test('Invalid QuizId', () => {
    expect(adminQuizNameUpdate(userId1, invalidQuizId, 'Quizzy2')).toStrictEqual(ERROR);
  });

  test('QuizId doesnt belong to current user', () => {
    expect(adminQuizNameUpdate(userId1, userId2QuizId1, 'Quizzy2')).toStrictEqual(ERROR);
  });

  test('UserId exists but user has no quizzes', () => {
    expect(adminQuizNameUpdate(userId3, userId2QuizId1, 'Quizzy2')).toStrictEqual(ERROR);
  });

  test('QuizId belongs to deleted quiz', () => {
    adminQuizRemove(userId1, userId1QuizId1);
    expect(adminQuizNameUpdate(userId1, userId1QuizId1, 'Quizzy2')).toStrictEqual(ERROR);
  });
});

describe('Name is invalid', () => {
  test('Empty Name', () => {
    expect(adminQuizNameUpdate(userId1, userId1QuizId1, '')).toStrictEqual(ERROR);
  });

  test('Non alphanumeric name', () => {
    expect(adminQuizNameUpdate(userId1, userId1QuizId1, '!!!!!!!')).toStrictEqual(ERROR);
  });

  test('Name is less than 3 characters', () => {
    expect(adminQuizNameUpdate(userId1, userId1QuizId1, 'hi')).toStrictEqual(ERROR);
  });

  test('Name is longer than 30 characters', () => {
    expect(adminQuizNameUpdate(userId1, userId1QuizId1, 'Elements of securely storing passwords and other tricky authorisation')).toStrictEqual(ERROR);
  });

  test('Name is already used by logged in user', () => {
    expect(adminQuizNameUpdate(userId1, userId1QuizId1, 'Wheezy')).toStrictEqual(ERROR);
  });
});

describe('Valid cases', () => {
  test('Successful name update for most basic case', () => {
    adminQuizNameUpdate(userId1, userId1QuizId1, 'Quizzy2');
    expect(adminQuizInfo(userId1, userId1QuizId1)).toStrictEqual(
      {
        quizId: userId1QuizId1,
        name: 'Quizzy2',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
      }
    );
  });

  test('Successful name update using a name from quiz that has already been deleted', () => {
    adminQuizRemove(userId1, userId1QuizId2);
    adminQuizNameUpdate(userId1, userId1QuizId1, 'Wheezy');
    expect(adminQuizInfo(userId1, userId1QuizId1)).toStrictEqual(
      {
        quizId: userId1QuizId1,
        name: 'Wheezy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
      }
    );
  });

  test('Successful name update using a name from quiz that has already been renamed', () => {
    adminQuizNameUpdate(userId1, userId1QuizId1, 'Sleezy');
    adminQuizNameUpdate(userId1, userId1QuizId2, 'Quizzy');
    expect(adminQuizInfo(userId1, userId1QuizId2)).toStrictEqual(
      {
        quizId: userId1QuizId2,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
      }
    );
  });
});

// must account for cases where things are removed

// assumptions
// admin quiz info time last edited = time created for first time.
// can still change name to other user's existing quiz names
// cases where quizid/userid invalid, a variable of the same type is passed through
// (e.g. string cannot be passed through int quizId)

// when we clear, everything starts again from 0
// when we add a quiz or user then remove,

// case where user exists but quiz does not exist for the user

// everytime a new quiz is created, does it just add onto quizId, or does it add on to the number of quizes that taht autuserId has.
