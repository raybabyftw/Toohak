import { requestClear, requestRegister, requestLogin, requestUpdateDetailsV2, requestDetails } from './routeRequestHelper';

const OK = 200;
const INPUT_ERROR = 400;
const HTTP_INVALIDLOGGEDIN = 403;
const ERROR_STRING = { error: expect.any(String) };

let token: any;

beforeEach(() => {
  requestClear();
  requestRegister('bill@gmail.com', 'COMP1511', 'Bill', 'Trinh');
  token = requestLogin('bill@gmail.com', 'COMP1511').body.token;
});

describe('Error code 400', () => {
  test('Email duplicate', () => {
    requestRegister('trinh@gmail.com', 'COMP1521', 'Billy', 'Trinhy');
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'Trinh', 'Bill');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('validator.isEmail is not satisfied', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail,,,,com', 'Trinh', 'Bill');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('NameFirst contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'Tr!@#?><~-=inh', 'Bill');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('NameFirst is less than 2 characters', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'A', 'Bill');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('NameFirst is more than 20 characters', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'ABCDIUAWDIOAWiojioiohhidawoihd', 'Bill');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('NameLast contains characters other than lowercase letters, uppercase letters, spaces, hyphens, or apostrophes', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'Bull', 'Tr!@#?><~-=inh');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('NameLast is less than 2 characters', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'Trinh', 'A');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('NameLast is more than 20 characters', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'Trinh', 'ABCDIUAWDIOAWiojioiohhidawoihd');

    expect(update.status).toStrictEqual(INPUT_ERROR);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Error code 403', () => {
  test('blank space', () => {
    requestLogin('bill@gmail.com', 'COMP1511');
    const update = requestUpdateDetailsV2('', 'trinh@gmail.com', 'Trinh', 'Bill');

    expect(update.status).toStrictEqual(HTTP_INVALIDLOGGEDIN);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
  test('random characters', () => {
    requestLogin('bill@gmail.com', 'COMP1511');
    const update = requestUpdateDetailsV2('characters that are never will not ever be get we are be back', 'trinh@gmail.com', 'Trinh', 'Bill');

    expect(update.status).toStrictEqual(HTTP_INVALIDLOGGEDIN);
    expect(update.body).toStrictEqual(ERROR_STRING);
  });
});

describe('Success cases', () => {
  test('updated a single user', () => {
    const update = requestUpdateDetailsV2(token, 'trinh@gmail.com', 'Trinh', 'Bill');
    const ret = requestDetails(token);

    expect(update.status).toStrictEqual(OK);
    expect(update.body).toStrictEqual({});
    expect(ret.body).toStrictEqual(
      {
        user: {
          userId: 1,
          name: 'Trinh Bill',
          email: 'trinh@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });
  test('change only last name', () => {
    const update = requestUpdateDetailsV2(token, 'bill@gmail.com', 'Bill', 'LLLL');
    const ret = requestDetails(token);

    expect(update.status).toStrictEqual(OK);
    expect(update.body).toStrictEqual({});
    expect(ret.body).toStrictEqual(
      {
        user: {
          userId: 1,
          name: 'Bill LLLL',
          email: 'bill@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });
  test('change only first name', () => {
    const update = requestUpdateDetailsV2(token, 'bill@gmail.com', 'LLLL', 'Trinh');
    const ret = requestDetails(token);

    expect(update.status).toStrictEqual(OK);
    expect(update.body).toStrictEqual({});
    expect(ret.body).toStrictEqual(
      {
        user: {
          userId: 1,
          name: 'LLLL Trinh',
          email: 'bill@gmail.com',
          numSuccessfulLogins: 2,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });
  test('updated multiple users', () => {
    requestRegister('billnguyen@gmail.com', 'COMP1521', 'Billy', 'Nguyen');

    const login1 = requestLogin('bill@gmail.com', 'COMP1511');
    const login2 = requestLogin('billnguyen@gmail.com', 'COMP1521');

    const update1 = requestUpdateDetailsV2(login1.body.token, 'trinh@gmail.com', 'Trinh', 'Bill');
    const update2 = requestUpdateDetailsV2(login2.body.token, 'nguyen@gmail.com', 'Nguyen', 'Billy');

    expect(update1.status).toStrictEqual(OK);
    expect(update1.body).toStrictEqual({});
    expect(update2.status).toStrictEqual(OK);
    expect(update2.body).toStrictEqual({});
  });
});
