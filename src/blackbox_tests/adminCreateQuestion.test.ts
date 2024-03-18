import { requestClear, requestRegister, requestQuizCreate, requestCreateQuestionV2, requestCreateQuestion, requestQuizInfo, requestQuizInfoV2 } from './routeRequestHelper';
import request from 'sync-request';
// Define error constants
const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

const validCorrectAnswer = {
  answer: 'answer',
  correct: true
};

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
const image = 'https://freepngimg.com/thumb/star/22-star-png-image.png';
const jpg = 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80';
const jpeg = 'https://images.unsplash.com/photo-1601902572612-3c850fab3ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80';

let token1: any, token1quizId1: number;
beforeEach(() => {
  requestClear();
  token1 = requestRegister('rayhan@gmail.com', 'grainwaves1724', 'Rayhan', 'Rahman').body.token;
  token1quizId1 = requestQuizCreate(token1, 'Quiz1bellyville', 'Description of bellyville').body.quizId;
});

describe('Error code 400', () => {
  test('Quiz ID does not refer to a valid quiz', () => {
    const invalidQuizId = token1quizId1 - 1;
    const ret = requestCreateQuestionV2(invalidQuizId, token1, validString, 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const token2 = requestRegister('andrew@gmail.com', 'COMP1511', 'Andrew', 'Suhaili').body.token;
    const ret = requestCreateQuestionV2(token1quizId1, token2, validString, 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Question string is less than 5 characters in length', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, 'How', 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Question string is greater than 50 characters in length', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, 'Q'.repeat(51), 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The question has more than 6 answers', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 7, 5, [
      { answer: 'hello', correct: true }, { answer: 'my', correct: true }, { answer: 'name', correct: true }, { answer: 'is', correct: true }, { answer: 'andrew', correct: true }, { answer: 'jason', correct: true }, { answer: 'suhaili', correct: true }
    ], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The question has less than 2 answers', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 7, 5, [validCorrectAnswer], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The question duration is not a positive number', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, -5, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    requestCreateQuestion(token1quizId1, token1, 'How many sharts are there', 30, 5, validArray);
    const ret = requestCreateQuestionV2(token1quizId1, token1, 'How many sharts are there', 151, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The points awarded for the question are less than 1', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 0, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The points awarded for the question are greater than 10', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 12, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The length of any answer is shorter than 1 character long', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, [validCorrectAnswer, { answer: '', correct: false }], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The length of any answer is longer than 30 characters long', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, [validCorrectAnswer, { answer: 'a'.repeat(31), correct: false }], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, [validCorrectAnswer, validCorrectAnswer], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Answer array is empty', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, [], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('No correct answers provided', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, [{ answer: 'hello', correct: false }, { answer: 'goodbye', correct: false }], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  describe('ThumbnailUrl errors', () => {
    test('The thumbnailUrl is an empty string', () => {
      const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, validArray, '');
      expect(ret.status).toStrictEqual(INPUT_ERROR);
      expect(ret.body).toStrictEqual(ERROR_STRING);
    });
    test('The thumbnailUrl does not return to a valid file', () => {
      const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, validArray, 'https://i.gifer.com/7I');
      expect(ret.status).toStrictEqual(INPUT_ERROR);
      expect(ret.body).toStrictEqual(ERROR_STRING);
    });
    test('The thumbnailUrl, when fetched, is not a JPG or PNg file type', () => {
      const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, validArray, 'https://i.gifer.com/7IsD.gif');
      expect(ret.status).toStrictEqual(INPUT_ERROR);
      expect(ret.body).toStrictEqual(ERROR_STRING);
    });
  });
});

describe('Error code 403', () => {
  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    const ret = requestCreateQuestionV2(token1quizId1, 'hehehe', validString, 10, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success Cases', () => {
  // test sum of durations = 179
  test('One question is created with png', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      questionId: expect.any(Number)
    });
    expect(requestQuizInfo(token1, token1quizId1).body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 1,
      questions: [
        {
          questionId: ret.body.questionId,
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
      duration: 10
    });
  });
  test('One question is created with jpeg', () => {
    const ret = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, validArray, jpeg);
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({
      questionId: expect.any(Number)
    });
    expect(requestQuizInfo(token1, token1quizId1).body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 1,
      questions: [
        {
          questionId: ret.body.questionId,
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
      duration: 10
    });
  });
  test('Two questions is created with total duration 179', () => {
    const ret1 = requestCreateQuestionV2(token1quizId1, token1, validString, 10, 5, validArray, image);
    const ret2 = requestCreateQuestionV2(token1quizId1, token1, 'What is the day?', 169, 5, [{ answer: 'monday', correct: true }, { answer: 'tuesday', correct: false }], jpg);
    expect(ret2.status).toStrictEqual(OK);
    expect(ret2.body).toStrictEqual({
      questionId: expect.any(Number)
    });
    const ret3 = requestQuizInfoV2(token1, token1quizId1);
    expect(ret3.body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 2,
      questions: [
        {
          questionId: ret1.body.questionId,
          question: validString,
          duration: 10,
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
        },
        {
          questionId: ret2.body.questionId,
          question: 'What is the day?',
          duration: 169,
          thumbnailUrl: expect.any(String),
          points: 5,
          answers: [
            {
              answerId: expect.any(Number),
              answer: 'monday',
              colour: expect.any(String),
              correct: true
            },
            {
              answerId: expect.any(Number),
              answer: 'tuesday',
              colour: expect.any(String),
              correct: false
            }
          ]
        }
      ],
      duration: 179,
      thumbnailUrl: ''
    });
    const url = ret3.body.questions[0].thumbnailUrl;
    const res = request('GET', url);
    expect(res.statusCode).toStrictEqual(OK);
  });
});
