import { requestClear, requestRegister, requestQuizCreate, requestCreateQuestionV2, requestUpdateQuestionV2, requestQuizInfoV2 } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

const jpg = 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80';
const jpeg = 'https://images.unsplash.com/photo-1601902572612-3c850fab3ad8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80';

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

let token1: string, token1quizId1: number, questionId: number;
beforeEach(() => {
  requestClear();
  token1 = requestRegister('rayhan@gmail.com', 'grainwaves1724', 'Rayhan', 'Rahman').body.token;
  token1quizId1 = requestQuizCreate(token1, 'Quiz1bellyville', 'Description of bellyville').body.quizId;
  questionId = requestCreateQuestionV2(token1quizId1, token1, validString, 7, 5, validArray, jpg).body.questionId;
});

describe('Error code 400', () => {
  test('Quiz ID does not refer to a valid quiz', () => {
    const invalidQuizId = token1quizId1 + 20;
    const ret = requestUpdateQuestionV2(invalidQuizId, questionId, token1, 'eshays cereal microphone', 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Quiz ID does not refer to a quiz that this user owns', () => {
    const token2 = requestRegister('andrew@gmail.com', 'COMP1511', 'Andrew', 'Suhaili').body.token;
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token2, 'eshays cereal microphone', 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Question Id does not refer to a valid question within this quiz', () => {
    const token2 = requestRegister('andrew@gmail.com', 'COMP1511', 'Andrew', 'Suhaili').body.token;
    const token2quizId2 = requestQuizCreate(token2, 'Quiz2', 'Quiz on 2').body.quizId;
    const ret = requestUpdateQuestionV2(token2quizId2, questionId, token2, 'travis scott egypt', 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Question string is less than 5 characters in length', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, 'How', 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Question string is greater than 50 characters in length', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, 'Q'.repeat(51), 7, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The question has more than 6 answers', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 7, 5, [
      { answer: 'hello', correct: true }, { answer: 'my', correct: true }, { answer: 'name', correct: true }, { answer: 'is', correct: true }, { answer: 'andrew', correct: true }, { answer: 'jason', correct: true }, { answer: 'suhaili', correct: true }
    ], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The question has less than 2 answers', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 7, 5, [validCorrectAnswer]);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The question duration is not a positive number', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, -5, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
    const questionId1 = requestCreateQuestionV2(token1quizId1, token1, 'How many days are there', 170, 5, validArray, jpg).body.questionId;
    const ret = requestUpdateQuestionV2(token1quizId1, questionId1, token1, 'How many sharts are there', 175, 5, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The points awarded for the question are less than 1', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 0, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The points awarded for the question are greater than 10', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 12, validArray, jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The length of any answer is shorter than 1 character long', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, [validCorrectAnswer, { answer: '', correct: false }], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The length of any answer is longer than 30 characters long', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, [validCorrectAnswer, { answer: 'a'.repeat(31), correct: false }], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Any answer strings are duplicates of one another (within the same question)', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, [validCorrectAnswer, validCorrectAnswer], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('Answer array is empty', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, [], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('No correct answers provided', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, [{ answer: 'hello', correct: false }, { answer: 'goodbye', correct: false }], jpg);
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  /// ///////////////////////////////////////////////////

  test('The thumbnailUrl is an empty string', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, validArray, '');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The thumbnailUrl does not return to a valid file', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, validArray, 'https://i.gifer.com/7I');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });

  test('The thumbnailUrl, when fetched, is not a JPG or PNg file type', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, validString, 10, 5, validArray, 'https://i.gifer.com/7IsD.gif');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Provided token is valid structure, but is not for a currently logged in session', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, 'token1', validString, 10, 5, validArray, 'https://i.gifer.com/7IsD.gif');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success Cases', () => {
  test('One question is created and updated', () => {
    const ret = requestUpdateQuestionV2(token1quizId1, questionId, token1, 'Changed name bah', 16, 7, validArray, jpg);
    expect(ret.status).toStrictEqual(OK);
    expect(requestQuizInfoV2(token1, token1quizId1).body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 1,
      questions: [
        {
          questionId: questionId,
          question: 'Changed name bah',
          duration: 16,
          points: 7,
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
          ],
          thumbnailUrl: expect.any(String)
        }
      ],
      duration: expect.any(Number),
      thumbnailUrl: expect.any(String)
    });
  });

  test('Two questions is created and second question is updated', () => {
    const questionId2 = requestCreateQuestionV2(token1quizId1, token1, 'gang boon docks sjmd', 10, 5, validArray, jpg).body.questionId;
    const ret = requestUpdateQuestionV2(token1quizId1, questionId2, token1, 'What is the day?', 20, 5, [{ answer: 'monday', correct: true }, { answer: 'tuesday', correct: false }], jpeg);
    expect(ret.status).toStrictEqual(OK);
    expect(requestQuizInfoV2(token1, token1quizId1).body).toStrictEqual({
      quizId: token1quizId1,
      name: 'Quiz1bellyville',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: 'Description of bellyville',
      numQuestions: 2,
      questions: [
        {
          questionId: questionId,
          question: validString,
          duration: 7,
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
          ],
          thumbnailUrl: expect.any(String)
        },
        {
          questionId: questionId2,
          question: 'What is the day?',
          duration: 20,
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
          ],
          thumbnailUrl: expect.any(String)
        }
      ],
      duration: 27,
      thumbnailUrl: expect.any(String)
    });
  });
});
