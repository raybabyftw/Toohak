import { requestClear, requestRegister, requestQuizCreate, requestQuizTransferV2, requestQuizList } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR = { error: expect.any(String) };

let token2QuizId2: number,
  token2: string,
  token1QuizId1: number,
  token1: string,
  reg1: any;

beforeEach(() => {
  requestClear();
  reg1 = requestRegister('rayhan@gmail.com', 'GrainWaves1724', 'Rayhan', 'Rahman');
  token1 = reg1.body.token;
  token1QuizId1 = requestQuizCreate(token1, 'Quiz1', 'Quiz on 1').body.quizId;
  token2 = requestRegister('andrew@gmail.com', 'Whales204', 'Andrew', 'Suhaili').body.token;
  token2QuizId2 = requestQuizCreate(token2, 'Quiz2', 'Quiz on 2').body.quizId;
});

describe('Error code 400', () => {
  test('Quiz ID does not refer to a valid quiz', () => {
    const invalidQuizId = 7;
    const ret = requestQuizTransferV2(invalidQuizId, token2, 'rayhan@gmail.com');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const ret = requestQuizTransferV2(token1QuizId1, token2, 'rayhan@gmail.com');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('userEmail is not a real user', () => {
    const ret = requestQuizTransferV2(token2QuizId2, token2, 'bill@gmail.com');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('userEmail is the current logged in user', () => {
    const ret = requestQuizTransferV2(token2QuizId2, token2, 'andrew@gmail.com');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
    const token2QuizId3 = requestQuizCreate(token2, 'Quiz1', 'Quiz on 3').body.quizId;
    const ret = requestQuizTransferV2(token2QuizId3, token2, 'rayhan@gmail.com');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });
});

describe('Error code 403', () => {
  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    const ret = requestQuizTransferV2(token2QuizId2, 'asdvdsfaasd', 'rayhan@gmail.com');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases', () => {
  test('One quiz is made for two users separately, second user transfers their quiz to the first user', () => {
    requestQuizTransferV2(token2QuizId2, token2, 'rayhan@gmail.com');
    const ret = requestQuizList(token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        quizzes: [
          {
            quizId: token1QuizId1,
            name: 'Quiz1',
          },
          {
            quizId: token2QuizId2,
            name: 'Quiz2',
          }
        ]
      });
  });
});
