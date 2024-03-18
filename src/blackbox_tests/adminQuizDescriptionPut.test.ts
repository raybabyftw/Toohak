import { requestClear, requestRegister, requestQuizCreate, requestDescriptionUpdateV2, requestQuizInfo } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;
const ERROR_STRING = { error: expect.any(String) };

let token1: any, token1Quiz1: number;

beforeEach(() => {
  requestClear();
  token1 = requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam').body.token;
  token1Quiz1 = requestQuizCreate(token1, 'Quizzy', 'Game for 1511').body.quizId;
});

describe('Error code 400', () => {
  test('Invalid QuizId', () => {
    const invalidQuizId = token1Quiz1 - 1;
    const ret = requestDescriptionUpdateV2(token1, invalidQuizId, 'New Description');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('QuizId does not belong to user', () => {
    const token2 = requestRegister('rayhan@gmail.com', 'COMP1521', 'Ray', 'Han').body.token;
    requestQuizCreate(token2, 'Glizzy', 'Game for 1521');
    const ret = requestDescriptionUpdateV2(token2, token1Quiz1, 'New Description');
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
  test('Description is too long', () => {
    const ret = requestDescriptionUpdateV2(token1, token1Quiz1, 'a'.repeat(105));
    expect(ret.status).toStrictEqual(INPUT_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('Token does not belong to an active session', () => {
    const ret = requestDescriptionUpdateV2('asdlkj', token1Quiz1, 'New Description');
    expect(ret.status).toStrictEqual(OFFLINE_ERROR);
    expect(ret.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Successful cases', () => {
  test('Update 1 quiz description successfully', () => {
    const ret = requestDescriptionUpdateV2(token1, token1Quiz1, 'New Description');
    expect(ret.status).toStrictEqual(OK);
    expect(ret.body).toStrictEqual({});
    expect(requestQuizInfo(token1, token1Quiz1).body).toStrictEqual(
      {
        quizId: token1Quiz1,
        name: 'Quizzy',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'New Description',
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
  test('Update 2 quiz descriptions successfully using identical description', () => {
    requestDescriptionUpdateV2(token1, token1Quiz1, 'New Description');
    const token1Quiz2 = requestQuizCreate(token1, 'Quizlet', 'Game for 1521').body.quizId;
    requestDescriptionUpdateV2(token1, token1Quiz2, 'New Description');
    expect(requestQuizInfo(token1, token1Quiz2).body).toStrictEqual(
      {
        quizId: token1Quiz2,
        name: 'Quizlet',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'New Description',
        numQuestions: 0,
        questions: [],
        duration: 0
      }
    );
  });
});
