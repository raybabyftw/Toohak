// A testing file called "adminAuthRegister" that tests functionalities of adminAuthRegister and ensure
// that everything is working as intended.

import { clear } from './../other';
import { adminAuthRegister, adminAuthLogin } from './../auth';

// Any error strings that are passed through will count
const ERROR = { error: expect.any(String) };

// This beforeEach will run before every test in this test suite!
// This saves us from having to repeatedly clear the data store every time we start a new, independent test
beforeEach(() => {
  clear();
});

describe('adminAuthLogin formats', () => {
  test('Correct adminAuthLogin formats', () => {
    const regMail = [
      { email: 'bill1@gmail.com', password: 'blHues123murf', nameFirst: 'soyboi', nameLast: 'sugoidesu' },
      { email: 'bill2@gmail.com', password: 'yoHy123oyo', nameFirst: 'helloxd', nameLast: 'hehexd' },
      { email: 'bill3@gmail.com', password: 'heHhe123hegha', nameFirst: 'ma7nlike', nameLast: 'bo2bcat' },
      { email: 'bill4@gmail.com', password: 'Hhe123hegha', nameFirst: 'man5like', nameLast: 'bobc3at' },
      { email: 'bill5@gmail.com', password: 'Hhe1hegha', nameFirst: 'man123like', nameLast: 'bo4bcat' },
      { email: 'bill6@gmail.com', password: 'Hhe2hegha', nameFirst: 'man1like', nameLast: 'bobc4at' },
      { email: 'bill7@gmail.com', password: 'Hhe3hegha', nameFirst: 'man2like', nameLast: 'bob5cat' },
      { email: 'bill8@gmail.com', password: 'Hhe4hegha', nameFirst: 'man3like', nameLast: 'bo6bcat' },
      { email: 'bill9@gmail.com', password: 'Hhe5hegha', nameFirst: 'man4like', nameLast: 'bo7bcat' },
    ];
    const logMail = [
      { email: 'bill1@gmail.com', password: 'blHues123murf' },
      { email: 'bill2@gmail.com', password: 'yoHy123oyo' },
      { email: 'bill3@gmail.com', password: 'heHhe123hegha' },
      { email: 'bill4@gmail.com', password: 'Hhe123hegha' },
      { email: 'bill5@gmail.com', password: 'Hhe1hegha' },
      { email: 'bill6@gmail.com', password: 'Hhe2hegha' },
      { email: 'bill7@gmail.com', password: 'Hhe3hegha' },
      { email: 'bill8@gmail.com', password: 'Hhe4hegha' },
      { email: 'bill9@gmail.com', password: 'Hhe5hegha' },
    ];

    let i = 0;
    const regUsers = [];
    for (const user of regMail) {
      const result = adminAuthRegister(user.email, user.password, user.nameFirst, user.nameLast);

      if ('error' in result) {
        expect(result).toStrictEqual(ERROR);
      } else {
        regUsers[i] = result.authUserId;
      }
      i++;
    }

    let j = 0;
    const logUsers = [];
    for (const user of logMail) {
      const result = adminAuthLogin(user.email, user.password);

      if ('error' in result) {
        expect(result).toStrictEqual(ERROR);
      } else {
        logUsers[j] = result.authUserId;
        expect(result.authUserId).toStrictEqual(regUsers[j]);
        j++;
      }
    }
  });

  test('Incorrect adminAuthLogin formats', () => {
    const regInMail = [
      { email: 'bill1@gmail.com', password: 'blHues123murf', nameFirst: 'soyboi', nameLast: 'sugoidesu' },
      { email: 'bill2@gmail.com', password: 'yoHy123oyo', nameFirst: 'helloxd', nameLast: 'hehexd' },
      { email: 'bill3@gmail.com', password: 'heHhe123hegha', nameFirst: 'ma7nlike', nameLast: 'bo2bcat' },
      { email: 'bill4@gmail.com', password: 'Hhe123hegha', nameFirst: 'man5like', nameLast: 'bobc3at' },
      { email: 'bill5@gmail.com', password: 'Hhe1hegha', nameFirst: 'man123like', nameLast: 'bo4bcat' },
      { email: 'bill6@gmail.com', password: 'Hhe2hegha', nameFirst: 'man1like', nameLast: 'bobc4at' },
      { email: 'bill7@gmail.com', password: 'Hhe3hegha', nameFirst: 'man2like', nameLast: 'bob5cat' },
      { email: 'bill8@gmail.com', password: 'Hhe4hegha', nameFirst: 'man3like', nameLast: 'bo6bcat' },
      { email: 'bill9@gmail.com', password: 'Hhe5hegha', nameFirst: 'man4like', nameLast: 'bo7bcat' },
    ];
    const logInMail = [
      { email: 'bil1l1@gmail.com', password: 'blHues123murf' },
      { email: 'bil2l2@gmail.com', password: 'yoHy123oyo' },
      { email: 'bi3ll3@gmail.com', password: 'heHhe123hegha' },
      { email: 'bill4@gmail.com', password: 'Hhe121233hegha' },
      { email: 'bill5@gmail.com', password: 'Hhe1h123egha' },
      { email: 'bill6@gmail.com', password: 'Hhe2h123egha' },
      { email: 'bi123ll7@gmail.com', password: 'Hhe3123hegha' },
      { email: 'bi123ll8@gmail.com', password: 'Hhe4123hegha' },
      { email: 'bi123ll9@gmail.com', password: 'Hhe5123hegha' },
    ];

    let i = 0;
    const regUsers = [];
    for (const user of regInMail) {
      const result = adminAuthRegister(user.email, user.password, user.nameFirst, user.nameLast);

      if ('error' in result) {
        expect(result).toStrictEqual(ERROR);
      } else {
        regUsers[i] = result.authUserId;
      }
      i++;
    }

    for (const user of logInMail) {
      const result = adminAuthLogin(user.email, user.password);

      if ('error' in result) {
        expect(result).toStrictEqual(ERROR);
      } else {
        expect(result.authUserId).toStrictEqual(undefined);
      }
    }
  });
});
