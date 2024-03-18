import { requestClear, requestRegister, requestLogin, requestLogoutV2, requestQuizCreate } from './routeRequestHelper';

const OK = 200;
const ERROR_STRING = { error: expect.any(String) };

let token: string;

beforeEach(() => {
  requestClear();
  requestRegister('lina@gmail.com', 'COMP1511', 'Lina', 'Lam');
  token = requestLogin('lina@gmail.com', 'COMP1511').body.token;
});

describe('400 Error', () => {
  test('400 error : Token is for a user who has already logged out.', () => {
    requestLogoutV2(token);
    const logout = requestLogoutV2(token);

    expect(logout.status).toStrictEqual(400);
    expect(logout.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success cases', () => {
  test('Basic single user log out', () => {
    const logout = requestLogoutV2(token);

    expect(logout.status).toStrictEqual(OK);
    expect(logout.body).toStrictEqual({});
    expect(requestQuizCreate(token, 'Quizzy', 'Game for 1511').status).toStrictEqual(403);
  });
  test('Multiple users log out', () => {
    const logout = requestLogoutV2(token);

    requestRegister('bill@gmail.com', 'COMP1521', 'Bill', 'Trinh');
    const login1 = requestLogin('bill@gmail.com', 'COMP1521');
    const logout1 = requestLogoutV2(login1.body.token);

    expect(logout.status).toStrictEqual(OK);
    expect(logout.body).toStrictEqual({});
    expect(logout1.status).toStrictEqual(OK);
    expect(logout1.body).toStrictEqual({});
  });
});
