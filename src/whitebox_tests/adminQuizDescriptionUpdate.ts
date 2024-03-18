import { adminQuizDescriptionUpdate, adminQuizCreate, adminQuizRemove, adminQuizInfo } from './../quiz';
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
let invalidUserId: number;
let userId2: number;
let userId3: number;
let user1Quiz1: number;
let invalidQuizId: number;
let user2Quiz1: number;
const validDescription = 'I want to update the description';

beforeEach(() => {
  clear();

  userId1 = adminAuthRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').authUserId;
  invalidUserId = userId1 - 1;
  userId2 = adminAuthRegister('ray@gmail.com', 'COMP1521', 'Ray', 'Han').authUserId;
  userId3 = adminAuthRegister('super@gmail.com', 'COMP1541', 'Super', 'Man').authUserId;
  user1Quiz1 = adminQuizCreate(userId1, 'Quizzy', 'Game for 1511').quizId;
  invalidQuizId = user1Quiz1 - 1;
  user2Quiz1 = adminQuizCreate(userId2, 'Glizzy', 'Game for 1531').quizId;
});
describe('AuthUserId is not a valid user', () => {
  test('Invalid AuthUserId', () => {
    expect(adminQuizDescriptionUpdate(invalidUserId, user1Quiz1, validDescription)).toStrictEqual(ERROR);
  });
});

describe('QuizId is not a valid quiz', () => {
  test('Invalid QuizId', () => {
    expect(adminQuizDescriptionUpdate(userId1, invalidQuizId, validDescription)).toStrictEqual(ERROR);
  });

  test('QuizId doesnt belong to current user', () => {
    expect(adminQuizDescriptionUpdate(userId1, user2Quiz1, validDescription)).toStrictEqual(ERROR);
  });

  test('UserId exists but user has no quizzes', () => {
    expect(adminQuizDescriptionUpdate(userId3, user2Quiz1, validDescription)).toStrictEqual(ERROR);
  });

  test('QuizId belongs to deleted quiz', () => {
    adminQuizRemove(userId1, user1Quiz1);
    expect(adminQuizDescriptionUpdate(userId1, user1Quiz1, 'Quizzy2')).toStrictEqual(ERROR);
  });
});

describe('Description is invalid', () => {
  test('Description is more than 100 characters', () => {
    expect(adminQuizDescriptionUpdate(userId1, user1Quiz1,
      'Woolworths has established itself as Australias largest supermarket chain, operating a vast network of stores that offer a range of products and ')
    ).toStrictEqual(ERROR);
  });
});

describe('Valid cases', () => {
  test('Successful description update for most basic case', () => {
    adminQuizDescriptionUpdate(userId1, user1Quiz1, 'I changed the description');
    expect(adminQuizInfo(userId1, user1Quiz1)).toStrictEqual(
      {
        quizId: user1Quiz1,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'I changed the description',
      }
    );
  });

  test('Successful description update using a duplicate description', () => {
    adminQuizDescriptionUpdate(userId1, user1Quiz1, 'Identical Description');
    adminQuizDescriptionUpdate(userId1, user1Quiz1, 'Identical Description');
    expect(adminQuizInfo(userId1, user1Quiz1)).toStrictEqual(
      {
        quizId: user1Quiz1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'Identical Description',
      }
    );
  });
});
