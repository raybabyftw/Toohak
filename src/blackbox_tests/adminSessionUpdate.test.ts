import { requestClear, requestRegister, requestQuizCreateV2, requestLogout, requestSessionStart, requestCreateQuestionV2, requestSessionUpdate } from './routeRequestHelper';

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  let i = 0;
  while (new Date().getTime() - startTime < ms) {
    i++;
  }
  return i;
}

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };
const VALID = { };

let token1: string;
let token2: string;
let quizId1: number;
let quizId2: number;
let invalidQuizId: number;
let sessionId1: number;
const autoStartNum = 5;

const nextQuestion = 'NEXT_QUESTION';
const goToAnswer = 'GO_TO_ANSWER';
const goToFinalResults = 'GO_TO_FINAL_RESULTS';
const end = 'END';

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

  requestCreateQuestionV2(quizId1, token1, 'validString', 0.1, 5, validArray);
  requestCreateQuestionV2(quizId1, token1, 'validString2', 0.1, 5, validArray);

  sessionId1 = requestSessionStart(quizId1, token1, autoStartNum).body.sessionId;
});

afterEach(() => {
  requestClear();
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogout(token1);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, end);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('Error 400', () => {
  test('Refers to an invalid quizId', () => {
    invalidQuizId = quizId1 - 1;
    const invaldRet1 = requestSessionUpdate(invalidQuizId, sessionId1, token1, end);
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('QuizId under different user', () => {
    const invalidRet2 = requestSessionUpdate(quizId2, sessionId1, token1, end);
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });

  test('SessionId does not refer to valid session within this quiz', () => {
    const invalidSessionId = 0;
    const invalidRet3 = requestSessionUpdate(quizId2, invalidSessionId, token2, end);
    expect(invalidRet3.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet3.body).toStrictEqual(ERROR);
  });

  test('Action provided is not a valid Action', () => {
    const invalidReturn = 'invalid';
    const invalidRet4 = requestSessionUpdate(quizId1, sessionId1, token1, invalidReturn);
    expect(invalidRet4.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet4.body).toStrictEqual(ERROR);
  });
});

// haven't named the returns diff things - idk if this'll fuck up anything
describe('Error 400 - Action enum cannot be applied in the current state.', () => {
  test('Session: Lobby -> Action: go_to_answer -> Session: invalid', () => {
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: Lobby -> Action: go_to_final_results -> Session: invalid', () => {
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, goToFinalResults);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: question_countdown -> Action: next_question -> Session: invalid', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: question_countdown -> Action: go_to_answer -> Session: invalid', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: question_countdown -> Action: go_to_final_results -> Session: invalid', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, goToFinalResults);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: question_open -> Action: next_question -> Session: invalid', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    // Advance timers by 20
    sleepSync(0.05 * 1000);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: question_open -> Action: go_to_final_results -> Session: invalid', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.05 * 1000);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });

  test('Session: answer_show -> Action: go_to_answer -> Session: invalid', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    const invalidRet = requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    expect(invalidRet.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('Success Cases - Lobby', () => {
  test('Action: next_question -> Session: question_countdown', () => {
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("QUESTION_COUNTDOWN");
  });

  test('Action: end -> Session: end', () => {
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, end);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("END");
  });
});

describe('Success Cases - Question Countdown', () => {
  test('Action: end -> Session: end', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, end);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("END");
  });
});

describe('Success Cases - Question Close', () => {
  test('Action: next_question -> Session: question_countdown', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // sleepSync(5 * 1000);
    // expect(validRet.body.state).toStrictEqual("QUESTION_COUNTDOWN");
  });

  test('Action: go_to_answer -> Session: answer_show', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("ANSWER_SHOW");
  });

  test('Action: end -> Session: end', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    // Delay 30 seconds for the countdown timer + question timer to finish
    sleepSync(0.5 * 1000);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, end);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("END");
  });

  test('Action: go_to_final_results -> Session: final_results', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, goToFinalResults);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("FINAL_RESULTS");
  });
});

describe('Success Cases - Answer Show', () => {
  test('Action: next_question -> Session: question_countdown', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("QUESTION_COUNTDOWN");
  });

  test('Action: end -> Session: end', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, end);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("END");
  });

  test('Action: go_to_final_results -> Session: final_results', () => {
    requestSessionUpdate(quizId1, sessionId1, token1, nextQuestion);
    sleepSync(0.5 * 1000);
    requestSessionUpdate(quizId1, sessionId1, token1, goToAnswer);
    const validRet = requestSessionUpdate(quizId1, sessionId1, token1, goToFinalResults);
    expect(validRet.status).toStrictEqual(OK);
    expect(validRet.body).toStrictEqual(VALID);
    // expect(validRet.body.state).toStrictEqual("FINAL_RESULTS");
  });
});
