import { requestClear, requestRegister, requestQuizCreateV2, requestLogout, requestSessionStart, requestCreateQuestion } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };
const VALID = { sessionId: expect.any(Number) };

let token1: string;
let token2: string;
let quizId1: number;
let quizId2: number;
let invalidQuizId: number;
let autoStartNum: number;
let invalidAutoStartNum: number;

const validArray = [
  {
    answer: 'answer',
    correct: true
  },
  {
    answer: 'notAnswer',
    correct: false
  }
];

beforeEach(() => {
  requestClear();

  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;
  token2 = requestRegister('softwaring@gmail.com', 'compp1531', 'Software', 'Engineering').body.token;

  quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  quizId2 = requestQuizCreateV2(token2, 'Quiz Three', 'This is the quiz.').body.quizId;
  invalidQuizId = quizId1 - 1;

  autoStartNum = 5;
  invalidAutoStartNum = 51;

  requestCreateQuestion(quizId1, token1, 'validString', 10, 5, validArray);
  requestCreateQuestion(quizId1, token1, 'validString2', 10, 5, validArray);
});

afterEach(() => {
  requestClear();
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogout(token1);
    const invalidRet = requestSessionStart(quizId1, token1, autoStartNum);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('Error 400', () => {
  test('Refers to an invalid quizId', () => {
    const invaldRet1 = requestSessionStart(invalidQuizId, token1, autoStartNum);
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('QuizId under different user', () => {
    const invalidRet2 = requestSessionStart(quizId2, token1, autoStartNum);
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });

  test('autoStartNum is greater than 50', () => {
    const invalidRet3 = requestSessionStart(quizId1, token1, invalidAutoStartNum);
    expect(invalidRet3.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet3.body).toStrictEqual(ERROR);
  });

  test('A maximum of 10 quizzes that are not in end state currently exist', () => {
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);
    requestSessionStart(quizId1, token1, autoStartNum);

    const invalidRet4 = requestSessionStart(quizId1, token1, autoStartNum);
    expect(invalidRet4.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet4.body).toStrictEqual(ERROR);
  });

  test('The quiz does not have any questions in it', () => {
    const invalidRet5 = requestSessionStart(quizId2, token2, autoStartNum);
    expect(invalidRet5.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet5.body).toStrictEqual(ERROR);
  });
});

describe('Successful Case', () => {
  test('A session is started', () => {
    const validRet = requestSessionStart(quizId1, token1, autoStartNum);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
  });

  test('Multiple sessions for the same quiz', () => {
    const validRet1 = requestSessionStart(quizId1, token1, autoStartNum);
    expect(validRet1.status).toStrictEqual(OK);
    expect(validRet1.body).toStrictEqual(VALID);
  });

  test('Concurrent sessions of two different quizzes', () => {
    requestCreateQuestion(quizId2, token2, 'validString', 10, 5, validArray);
    const validRet2 = requestSessionStart(quizId2, token2, autoStartNum);
    expect(validRet2.status).toStrictEqual(OK);
    expect(validRet2.body).toStrictEqual(VALID);
  });

  // // Need to print out something here to ensure nothing's been changed in the duplicated
  // // quiz
  // test('Edits made to quiz and quiz remains unchanged', () => {
  //   const validRet3 = requestSessionStart(quizId1, token1, autoStartNum);

  //   const ret3 = requestCreateQuestionV2(quizId1, token1, "validString3", 10, 5, validArray);
  //   const qId3 = ret3.body.questionId;

  //   expect(validRet3.status).toStrictEqual(OK);
  //   expect(validRet3.body).toStrictEqual(VALID);

  //   expect(requestSessionStatus())
  // });
});
