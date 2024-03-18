import { requestClear, requestRegister, requestQuizCreate, requestCreateQuestion, requestQuizInfo, requestDeleteQuestionV2 } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

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

let token1: any, token1quizId1: number;
beforeEach(() => {
  requestClear();
  token1 = requestRegister('rayhan@gmail.com', 'grainwaves1724', 'Rayhan', 'Rahman').body.token;
  token1quizId1 = requestQuizCreate(token1, 'Quiz1bellyville', 'Description of bellyville').body.quizId;
});

describe('Error code 400', () => {
  test('Quiz ID does not refer to a valid quiz', () => {
    const invalidQuizId = token1quizId1 + 20;
    const questionId2 = requestCreateQuestion(token1quizId1, token1, 'egypt denmark sreyam deadlock', 7, 5, validArray).body.questionId;
    const ret = requestDeleteQuestionV2(invalidQuizId, questionId2, token1);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const questionId2 = requestCreateQuestion(token1quizId1, token1, 'egypt denmark sreyam deadlock', 7, 5, validArray).body.questionId;
    const token2 = requestRegister('andrew@gmail.com', 'COMP1511', 'Andrew', 'Suhaili').body.token;
    const ret = requestDeleteQuestionV2(token1quizId1, questionId2, token2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const questionId1 = requestCreateQuestion(token1quizId1, token1, 'gang gang gang', 7, 5, validArray).body.questionId;
    const token2 = requestRegister('andrew@gmail.com', 'COMP1511', 'Andrew', 'Suhaili').body.token;
    const token2quizId2 = requestQuizCreate(token2, 'Quiz2', 'Quiz on 2').body.quizId;
    const ret = requestDeleteQuestionV2(token2quizId2, questionId1, token2);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    const ret = requestCreateQuestion(token1quizId1, 'eshaysbah', validString, 10, 5, validArray);
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success Cases', () => {
  test('One question is created and deleted', () => {
    const questionId = requestCreateQuestion(token1quizId1, token1, validString, 10, 5, validArray).body.questionId;
    const ret = requestDeleteQuestionV2(token1quizId1, questionId, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(requestQuizInfo(token1, token1quizId1).body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 0,
      questions: [

      ],
      duration: expect.any(Number)
    });
  });

  test('Two questions is created and second question is deleted', () => {
    const questionId1 = requestCreateQuestion(token1quizId1, token1, validString, 10, 5, validArray).body.questionId;
    const questionId2 = requestCreateQuestion(token1quizId1, token1, 'gang boon docks sjmd', 10, 5, validArray).body.questionId;
    const ret = requestDeleteQuestionV2(token1quizId1, questionId2, token1);
    expect(ret.status).toStrictEqual(OK);
    expect(requestQuizInfo(token1, token1quizId1).body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 1,
      questions: [
        {
          questionId: questionId1,
          question: validString,
          duration: 10,
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
      duration: expect.any(Number)
    });
  });
});
