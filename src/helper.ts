import { getData, DataStore, session } from './dataStore';
import crypto from 'crypto';
import HTTPError from 'http-errors';

export const checkValidToken = (token: string) => {
  const data = getData();

  for (const user of data.users) {
    if (user.tokens.includes(token)) {
      return user.userId;
    }
  }

  throw HTTPError(403, 'Token does not belong to logged in session');
};

export const findUserFromUserId = (authUserId: number) => {
  const data = getData();
  return data.users.find(element => element.userId === authUserId);
};

export const getHashOf = (plaintext: string) => crypto.createHash('sha256').update(plaintext).digest('hex');

export const validStringCheck = (string: string) => /^[a-zA-Z0-9 ]*$/.test(string);

export function findSessionFromPlayerId(playerId: number, dataStore: DataStore) {
  for (const session of dataStore.sessions) {
    if (session.players.find(element => element.playerId === playerId) !== undefined) {
      return session;
    }
  }
  throw HTTPError(400, 'Player Id does not exist');
}

export const findAnswersFromQuestionId = (session: session, questionId: number) =>
  session.metadata.questions.find(Element => Element.questionId === questionId).answers;

export const findPlayerfromPlayerId = (session: session, playerId: number) => session.players.find(element => element.playerId === playerId);
