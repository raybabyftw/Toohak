import {
  requestClear, requestPlayerJoin, requestGetSessionStatus, requestRegister,
  requestCreateQuestionV2, requestSessionStart, requestQuizCreateV2, requestUpdateQuestionV2,
  requestSessionUpdate, requestNameUpdateV2, requestDescriptionUpdateV2,
  requestDeleteQuestionV2
} from './routeRequestHelper';
const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

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

const validString = 'validString';
const image = 'https://www.motortrend.com/uploads/2023/03/2023-porsche-911-gt3-rs-04.jpg?fit=around%7C875:492';

let token1: string, quizId1: number, sessionId: number, questionId: number;
beforeEach(() => {
  requestClear();
  token1 = requestRegister('rayhan@gmail.com', 'grainwaves1724', 'Rayhan', 'Rahman').body.token;
  quizId1 = requestQuizCreateV2(token1, 'Quiz1bellyville', 'Description of bellyville').body.quizId;
  questionId = requestCreateQuestionV2(quizId1, token1, validString, 0.1, 5, validArray, image).body.questionId;
  sessionId = requestSessionStart(quizId1, token1, 2).body.sessionId;
});

afterEach(() => {
  requestClear();
});

describe('400 Error', () => {
  test('Quiz ID does not refer to a valid quiz', () => {
    const ret = requestGetSessionStatus(quizId1 - 100, sessionId, token1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const tempToken = requestRegister('ray@gmail.com', 'pathfinder123', 'Bill', 'Boss').body.token;
    const tempQuizId = requestQuizCreateV2(tempToken, 'yessir', 'Description of bellyville').body.quizId;
    const ret = requestGetSessionStatus(tempQuizId, sessionId, token1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Session Id does not refer to a valid session within this quiz', () => {
    const ret = requestGetSessionStatus(quizId1, sessionId - 1, token1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('403 Token Error', () => {
  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    const ret = requestGetSessionStatus(quizId1, sessionId, 'token');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success cases', () => {
  test('Basic success case at LOBBY state', () => {
    requestPlayerJoin(sessionId, 'Rayhan');
    const ret = requestGetSessionStatus(quizId1, sessionId, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        state: 'LOBBY',
        atQuestion: 0,
        players: [
          'Rayhan'
        ],
        metadata: {
          quizId: quizId1,
          name: 'Quiz1bellyville',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'Description of bellyville',
          numQuestions: 1,
          questions: [
            {
              questionId: questionId,
              question: validString,
              duration: 0.1,
              thumbnailUrl: expect.any(String),
              points: 5,
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: 'answer',
                  colour: expect.any(String),
                  correct: true
                },
                {
                  answerId: expect.any(Number),
                  answer: 'notAnswer',
                  colour: expect.any(String),
                  correct: false
                }
              ]
            }
          ],
          duration: 0.1,
          thumbnailUrl: ''
        }
      }
    );
  });

  test('Basic success case at QUESTION_COUNTDOWN state', () => {
    requestPlayerJoin(sessionId, 'Rayhan');
    requestPlayerJoin(sessionId, 'Andrew');
    const ret = requestGetSessionStatus(quizId1, sessionId, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        state: 'QUESTION_COUNTDOWN',
        atQuestion: 0,
        players: [
          'Rayhan',
          'Andrew'
        ],
        metadata: {
          quizId: quizId1,
          name: 'Quiz1bellyville',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'Description of bellyville',
          numQuestions: 1,
          questions: [
            {
              questionId: questionId,
              question: validString,
              duration: 0.1,
              thumbnailUrl: expect.any(String),
              points: 5,
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: 'answer',
                  colour: expect.any(String),
                  correct: true
                },
                {
                  answerId: expect.any(Number),
                  answer: 'notAnswer',
                  colour: expect.any(String),
                  correct: false
                }
              ]
            }
          ],
          duration: 0.1,
          thumbnailUrl: ''
        }
      }
    );
  });

  test('Basic success case at QUESTION_CLOSE state', () => {
    requestPlayerJoin(sessionId, 'Rayhan');
    requestPlayerJoin(sessionId, 'Andrew');
    sleepSync(300);
    const ret = requestGetSessionStatus(quizId1, sessionId, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        state: 'QUESTION_CLOSE',
        atQuestion: 1,
        players: [
          'Rayhan',
          'Andrew'
        ],
        metadata: {
          quizId: quizId1,
          name: 'Quiz1bellyville',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'Description of bellyville',
          numQuestions: 1,
          questions: [
            {
              questionId: questionId,
              question: validString,
              duration: 0.1,
              thumbnailUrl: expect.any(String),
              points: 5,
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: 'answer',
                  colour: expect.any(String),
                  correct: true
                },
                {
                  answerId: expect.any(Number),
                  answer: 'notAnswer',
                  colour: expect.any(String),
                  correct: false
                }
              ]
            }
          ],
          duration: 0.1,
          thumbnailUrl: ''
        }
      }
    );
  });

  test('Basic success case at ANSWER_SHOW state', () => {
    requestPlayerJoin(sessionId, 'Rayhan');
    requestPlayerJoin(sessionId, 'Andrew');
    sleepSync(300);
    requestSessionUpdate(quizId1, sessionId, token1, 'GO_TO_ANSWER');
    const ret = requestGetSessionStatus(quizId1, sessionId, token1);

    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        state: 'ANSWER_SHOW',
        atQuestion: 1,
        players: [
          'Rayhan',
          'Andrew'
        ],
        metadata: {
          quizId: quizId1,
          name: 'Quiz1bellyville',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'Description of bellyville',
          numQuestions: 1,
          questions: [
            {
              questionId: questionId,
              question: validString,
              duration: 0.1,
              thumbnailUrl: expect.any(String),
              points: 5,
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: 'answer',
                  colour: expect.any(String),
                  correct: true
                },
                {
                  answerId: expect.any(Number),
                  answer: 'notAnswer',
                  colour: expect.any(String),
                  correct: false
                }
              ]
            }
          ],
          duration: 0.1,
          thumbnailUrl: ''
        }
      }
    );
  });
  test('Success case at QUESTION_OPEN state using NEXT_QUESTION', () => {
    requestPlayerJoin(sessionId, 'Rayhan');
    requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');
    sleepSync(110);
    const ret = requestGetSessionStatus(quizId1, sessionId, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        state: 'QUESTION_OPEN',
        atQuestion: 1,
        players: [
          'Rayhan'
        ],
        metadata: {
          quizId: quizId1,
          name: 'Quiz1bellyville',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'Description of bellyville',
          numQuestions: 1,
          questions: [
            {
              questionId: questionId,
              question: validString,
              duration: 0.1,
              thumbnailUrl: expect.any(String),
              points: 5,
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: 'answer',
                  colour: expect.any(String),
                  correct: true
                },
                {
                  answerId: expect.any(Number),
                  answer: 'notAnswer',
                  colour: expect.any(String),
                  correct: false
                }
              ]
            }
          ],
          duration: 0.1,
          thumbnailUrl: ''
        }
      }
    );
  });
  test('Testing metadata is not affected when question is updated', () => {
    requestPlayerJoin(sessionId, 'Rayhan');
    requestSessionUpdate(quizId1, sessionId, token1, 'NEXT_QUESTION');
    requestNameUpdateV2(token1, quizId1, 'Quizzy');
    requestDescriptionUpdateV2(token1, quizId1, 'new description');
    requestUpdateQuestionV2(quizId1, questionId, token1, 'whos ur mama', 0.1, 10, validArray, 'https://www.topgear.com/sites/default/files/cars-car/image/2019/05/_dsc4838_0.jpg');
    requestDeleteQuestionV2(quizId1, questionId, token1);

    sleepSync(100);
    const ret = requestGetSessionStatus(quizId1, sessionId, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual(
      {
        state: 'QUESTION_CLOSE',
        atQuestion: 1,
        players: [
          'Rayhan'
        ],
        metadata: {
          quizId: quizId1,
          name: 'Quiz1bellyville',
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: 'Description of bellyville',
          numQuestions: 1,
          questions: [
            {
              questionId: expect.any(Number),
              question: validString,
              duration: 0.1,
              thumbnailUrl: expect.any(String),
              points: 5,
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: 'answer',
                  colour: expect.any(String),
                  correct: true
                },
                {
                  answerId: expect.any(Number),
                  answer: 'notAnswer',
                  colour: expect.any(String),
                  correct: false
                }
              ]
            }
          ],
          duration: 0.1,
          thumbnailUrl: ''
        }
      }
    );
  });
});
