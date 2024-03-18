import { requestClear, requestRegister, requestQuizList, requestQuizCreate, requestQuizRemove, requestQuizTransfer } from './routeRequestHelper';

const OK = 200;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };
let ret, token1: any, token1Quiz1: number, token1Quiz2: number, token1Quiz3: number;

beforeEach(() => {
  requestClear();
});

describe('Successful cases', () => {
  beforeEach(() => {
    token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
    token1Quiz1 = requestQuizCreate(token1, 'Quizzy', 'Game for 1511').body.quizId;
    token1Quiz2 = requestQuizCreate(token1, 'Wazzup', 'Game for 2521').body.quizId;
  });

  test('No quizzes added', () => {
    requestClear();
    token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
    ret = requestQuizList(token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizzes: []
      }
    );
  });
  test('List of quizzes', () => {
    ret = requestQuizList(token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizzes: [
          {
            quizId: token1Quiz1,
            name: 'Quizzy',
          },
          {
            quizId: token1Quiz2,
            name: 'Wazzup',
          }
        ]
      }
    );
  });
  test('List of quizzes after a quiz is removed', () => {
    requestQuizRemove(token1, token1Quiz2);
    ret = requestQuizList(token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizzes: [
          {
            quizId: token1Quiz1,
            name: 'Quizzy',
          }
        ]
      }
    );
  });
  test('List of quizzes after a quiz is transferred to another owner', () => {
    requestRegister('andrew@gmail.com', 'COMP2521', 'Andrew', 'Rayhan');
    token1Quiz3 = requestQuizCreate(token1, 'Howdy', 'Game for 1531').body.quizId;
    requestQuizTransfer(token1Quiz2, token1, 'andrew@gmail.com');
    ret = requestQuizList(token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizzes: [
          {
            quizId: token1Quiz1,
            name: 'Quizzy',
          },
          {
            quizId: token1Quiz3,
            name: 'Howdy',
          }
        ]
      }
    );
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    ret = requestQuizList('99999999');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});
