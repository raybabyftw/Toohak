import { requestClear, requestRegister, requestQuizCreateV2, requestSessionStart, requestCreateQuestionV2, requestPlayerJoin } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;

const ERROR = { error: expect.any(String) };

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

const jpg = 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80';
let token1: string, token1quizId1: number, sessionId1: number;

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

beforeEach(() => {
  requestClear();
  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;

  token1quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;
  requestCreateQuestionV2(token1quizId1, token1, 'validString', 10, 5, validArray, jpg);

  sessionId1 = requestSessionStart(token1quizId1, token1, 2).body.sessionId;
});

afterEach(() => {
  requestClear();
});

describe('Error code 400', () => {
  test('Name of user entered is not unique', () => {
    requestPlayerJoin(sessionId1, 'Rayhan');

    const ret = requestPlayerJoin(sessionId1, 'Rayhan');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  test('Session is not in LOBBY state as number of players has reached autoStartNum', () => {
    requestPlayerJoin(sessionId1, 'Rayhan');
    requestPlayerJoin(sessionId1, 'Andrew');

    sleepSync(2 * 1000);

    const ret = requestPlayerJoin(sessionId1, 'Anchala');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR);
  });

  //   test('Session is not in LOBBY state as next question action has been called', () => {
  //     requestPlayerJoin(sessionId1, 'Rayhan');
  //     requestPlayerJoin(sessionId1, 'Andrew');
  //     requestUpdateSessionState(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

//     const ret = requestPlayerJoin(sessionId1, 'Anchala');
//     expect(ret.status).toStrictEqual(INPUT_ERROR);
//     expect(ret.body).toStrictEqual(ERROR);
//   });
});

describe('Success Cases', () => {
  test('success case for one player', () => {
    const ret = requestPlayerJoin(sessionId1, 'Rayhan');
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      playerId: expect.any(Number)
    });
  });

  test('Success case for one player given empty string as name', () => {
    const ret = requestPlayerJoin(sessionId1, '');
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      playerId: expect.any(Number)
    });
  });

  // test('Name entered is an empty string for the second name', () => {
  //   const playerId1 = requestPlayerJoin(sessionId1, 'Rayhan').body.playerId;
  //   const playerId2 = requestPlayerJoin(sessionId1, '').body.playerId;

  //   requestUpdateSessionState(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

  //   const ret = requestGetSessionStatus(token1quizId1, sessionId1, token1);
  //   expect(ret.status).toStrictEqual(OK);
  //   expect(ret.body).toStrictEqual({
  //     state: expect.any(String),
  //     atQuestion: expect(1),
  //     players: expect([
  //         'Rayhan',
  //         expect.any(String)
  //     ]),
  //     metadata: {
  //         quizId: expect(token1quizId1),
  //         name: expect.any(String),
  //         timeCreated: expect.any(Number),
  //         timeLastEdited: expect.any(Number),
  //         description: expect.any(String),
  //         numQuestions: 1,
  //         questions: [
  //             {
  //                 questionId: expect.any(String),
  //                 question: expect.any(String),
  //                 duration: expect.any(Number),
  //                 thumbnailUrl: expect.any(String),
  //                 points: expect.any(Number),
  //                 answers: [
  //                     {
  //                         answerId: HOWTOACCESS,
  //                         answer: 'answer',
  //                         colour: expect.any(String),
  //                         correct: expect(true)
  //                     }
  //                 ]
  //             }
  //         ],
  //         duration: expect.any(Number),
  //         thumbnailUrl: expect.any(String)
  //     }
  //   })

  // });

  // test('Add 4 guest players', () => {
  //     requestPlayerJoin(sessionId1, 'Rayhan');
  //     requestPlayerJoin(sessionId1, 'Andrew');
  //     requestPlayerJoin(sessionId1, 'Anchala');
  //     requestPlayerJoin(sessionId1, 'Lina');

  //     requestUpdateSessionState(token1quizId1, sessionId1, token1, 'NEXT_QUESTION');

  //     const ret = requestGetSessionStatus(token1quizId1, sessionId1, token1);
  //     expect(ret.status).toStrictEqual(OK);
  //     expect(ret.body).toStrictEqual({
  //         state: expect.any(String),
  //         atQuestion: expect(1),
  //         players: expect([
  //             'Anchala',
  //             'Andrew',
  //             'Lina',
  //             'Rayhan'
  //         ]),
  //         metadata: {
  //             quizId: expect(token1quizId1),
  //             name: expect.any(String),
  //             timeCreated: expect.any(Number),
  //             timeLastEdited: expect.any(Number),
  //             description: expect.any(String),
  //             numQuestions: 1,
  //             questions: [
  //                 {
  //                     questionId: expect.any(String),
  //                     question: expect.any(String),
  //                     duration: expect.any(Number),
  //                     thumbnailUrl: expect.any(String),
  //                     points: expect.any(Number),
  //                     answers: [
  //                         {
  //                             answerId: HOWTOACCESS,
  //                             answer: 'answer',
  //                             colour: expect.any(String),
  //                             correct: expect(true)
  //                         }
  //                     ]
  //                 }
  //             ],
  //             duration: expect.any(Number),
  //             thumbnailUrl: expect.any(String)
  //         }
  //     })
  // });
});
