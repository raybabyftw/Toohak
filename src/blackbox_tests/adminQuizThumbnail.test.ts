import { requestClear, requestQuizInfoV2, requestRegister, requestQuizCreate, requestLogoutV2, requestUpdateQuizThumbnail, requestQuizCreateV2 } from './routeRequestHelper';
import request from 'sync-request';

const OK = 200;
const INPUT_ERROR = 400;
const OFFLINE_ERROR = 403;

const ERROR = { error: expect.any(String) };

let token1: string;
let quizId1: number;

const validUrl = 'https://fjwp.s3.amazonaws.com/blog/wp-content/uploads/2019/11/02060940/Untitled-design-16-1024x512.png';

beforeEach(() => {
  requestClear();

  token1 = requestRegister('softwareengineering@gmail.com', 'comp1531', 'Software', 'Engineering').body.token;
  quizId1 = requestQuizCreateV2(token1, 'Quiz One', 'This is the quiz.').body.quizId;
});

afterEach(() => {
  requestClear();
});

describe('Testing Tokens', () => {
  test('Error 403: Provided token for a logged out user', () => {
    requestLogoutV2(token1);
    const invalidRet = requestUpdateQuizThumbnail(quizId1, token1, validUrl);
    expect(invalidRet.status).toStrictEqual(OFFLINE_ERROR);
    expect(invalidRet.body).toStrictEqual(ERROR);
  });
});

describe('QuizId Tests', () => {
  test('Error 400: Refers to an invalid quizId', () => {
    const invalidQuizId = quizId1 - 1;
    const invaldRet1 = requestUpdateQuizThumbnail(invalidQuizId, token1, validUrl);
    expect(invaldRet1.status).toStrictEqual(INPUT_ERROR);
    expect(invaldRet1.body).toStrictEqual(ERROR);
  });

  test('Error 400: QuizId under different user', () => {
    const token2 = requestRegister('softwareengi@gmail.com', 'comp1521', 'Luke', 'Walker').body.token;
    const quizId3 = requestQuizCreate(token2, 'Quiz Three', 'This is the quiz.').body.quizId;
    const invalidRet2 = requestUpdateQuizThumbnail(quizId3, token1, validUrl);
    expect(invalidRet2.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet2.body).toStrictEqual(ERROR);
  });

  test('Error 400: imgUrl is not a URL', () => {
    const invalidRet3 = requestUpdateQuizThumbnail(quizId1, token1, 'validUrlNoFile');
    expect(invalidRet3.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet3.body).toStrictEqual(ERROR);
  });

  test('Error 400: imgUrl when fetched does not return a valid file', () => {
    const invalidRet3 = requestUpdateQuizThumbnail(quizId1, token1, 'validUrlNoFile');
    expect(invalidRet3.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet3.body).toStrictEqual(ERROR);
  });

  test('Error 400: imgUrl when fetch is not a JPG or PNG image', () => {
    const invalidRet4 = requestUpdateQuizThumbnail(quizId1, token1, 'https://i.gifer.com/7IsD.gif');
    expect(invalidRet4.status).toStrictEqual(INPUT_ERROR);
    expect(invalidRet4.body).toStrictEqual(ERROR);
  });
});

describe('Successful URL Thumbnail', () => {
  test('Success Case with basic string', () => {
    const validRet = requestUpdateQuizThumbnail(quizId1, token1, validUrl);
    expect(validRet.status).toStrictEqual(OK);
    const info = requestQuizInfoV2(token1, quizId1);
    expect(info.body).toStrictEqual(
      {
        quizId: quizId1,
        name: 'Quiz One',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This is the quiz.',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: expect.any(String)
      }
    );
    const req = request('GET', info.body.thumbnailUrl);
    expect(req.statusCode).toStrictEqual(OK);
  });

  test('Success Case with string that doesnt contain .jpg/.jpeg', () => {
    const validRet = requestUpdateQuizThumbnail(quizId1, token1, 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1365&q=80');
    expect(validRet.status).toStrictEqual(OK);
    const info = requestQuizInfoV2(token1, quizId1);
    expect(info.body).toStrictEqual(
      {
        quizId: quizId1,
        name: 'Quiz One',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'This is the quiz.',
        numQuestions: 0,
        questions: [],
        duration: 0,
        thumbnailUrl: expect.any(String)
      }
    );
  });
});
