import request, { HttpVerb } from 'sync-request';
import config from './../config.json';

type addAnswer = {
  answer: string,
  correct: boolean
}

const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

const parseRouteParams = (route: string, params: Record<string, number>): string =>
  Object.entries(params).reduce((route, [key, value]) => route.replace(`${key}`, value.toString()), route);

export function requestHelper(method: HttpVerb, path: string, payload: object, token?: string) {
  let qs = {};
  let json = {};
  const headers = { token };

  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const res = request(method, SERVER_URL + path, { qs, json, headers });

  return {
    body: JSON.parse(res.body as string),
    status: res.statusCode,
  };
}

export const requestClear = () => requestHelper('DELETE', '/v1/clear', {});

export const requestRegister = (email: string, password: string, nameFirst: string, nameLast: string) =>
  requestHelper('POST', '/v1/admin/auth/register', { email: email, password: password, nameFirst: nameFirst, nameLast: nameLast });

export const requestLogin = (email: string, password: string) =>
  requestHelper('POST', '/v1/admin/auth/login', { email: email, password: password });

export const requestQuizList = (token: string) =>
  requestHelper('GET', '/v1/admin/quiz/list', { token: token });

export const requestQuizCreate = (token: string, name: string, description: string) =>
  requestHelper('POST', '/v1/admin/quiz', { token: token, name: name, description: description });

export const requestNameUpdate = (token: string, quizId: number, name: string) =>
  requestHelper('PUT', parseRouteParams('/v1/admin/quiz/quizid/name', { quizid: quizId }), { token: token, name: name });

export const requestDescriptionUpdate = (token: string, quizId: number, description: string) =>
  requestHelper('PUT', parseRouteParams('/v1/admin/quiz/quizid/description', { quizid: quizId }), { token: token, description: description });

export const requestDetails = (token: string) =>
  requestHelper('GET', '/v1/admin/user/details', { token: token });

export const requestQuizRemove = (token: string, quizId: number) =>
  requestHelper('DELETE', parseRouteParams('/v1/admin/quiz/quizid', { quizid: quizId }), { token: token });

export const requestQuizInfo = (token: string, quizId: number) =>
  requestHelper('GET', parseRouteParams('/v1/admin/quiz/quizid', { quizid: quizId }), { token: token });

// Iteration 2 NEW
export const requestLogout = (token: string) =>
  requestHelper('POST', '/v1/admin/auth/logout', { token: token });

export const requestUpdateDetails = (token: string, email: string, nameFirst: string, nameLast: string) =>
  requestHelper('PUT', '/v1/admin/user/details', { token: token, email: email, nameFirst: nameFirst, nameLast: nameLast });

export const requestUpdatePassword = (token: string, oldPassword: string, newPassword: string) =>
  requestHelper('PUT', '/v1/admin/user/password', { token: token, oldPassword: oldPassword, newPassword: newPassword });

export const requestQuizzesTrash = (token: string) =>
  requestHelper('GET', '/v1/admin/quiz/trash', { token: token });

export const requestRestoreQuiz = (quizId: number, token: string) =>
  requestHelper('POST', parseRouteParams('/v1/admin/quiz/quizid/restore', { quizid: quizId }), { token: token });

export const requestEmptyTrash = (token: string, quizIds: string) =>
  requestHelper('DELETE', '/v1/admin/quiz/trash/empty', { token: token, quizIds: quizIds });

export const requestQuizTransfer = (quizId: number, token: string, userEmail: string) =>
  requestHelper('POST', parseRouteParams('/v1/admin/quiz/quizid/transfer', { quizid: quizId }), { token: token, userEmail: userEmail });

export const requestCreateQuestion = (quizId: number, token: string, question: string, duration: number, points: number, answers: addAnswer[]) =>
  requestHelper('POST', parseRouteParams('/v1/admin/quiz/quizid/question', { quizid: quizId }),
    { token: token, questionBody: { question: question, duration: duration, points: points, answers: answers } });

export const requestUpdateQuestion = (quizId: number, questionId: number, token: string, question: string, duration: number, points: number, answers: addAnswer[]) =>
  requestHelper('PUT', parseRouteParams('/v1/admin/quiz/quizid/question/questionid', { quizid: quizId, questionid: questionId }),
    { token: token, questionBody: { question: question, duration: duration, points: points, answers: answers } });

export const requestDeleteQuestion = (quizId: number, questionid: number, token: string) =>
  requestHelper('DELETE', parseRouteParams('/v1/admin/quiz/quizid/question/questionid', { quizid: quizId, questionid: questionid }), { token: token });

export const requestMoveQuestion = (token: string, quizId: number, questionid: number, newPosition: number) =>
  requestHelper('PUT', parseRouteParams('/v1/admin/quiz/quizid/question/questionid/move', { quizid: quizId, questionid: questionid }), { token: token, newPosition: newPosition });

export const requestDuplicateQuestion = (token: string, quizId: number, questionid: number) =>
  requestHelper('POST', parseRouteParams('/v1/admin/quiz/quizid/question/questionid/duplicate', { quizid: quizId, questionid: questionid }), { token: token });

// Iteration 3 Modified V2 Routes
export const requestLogoutV2 = (token: string) =>
  requestHelper('POST', '/v2/admin/auth/logout', {}, token);

export const requestDetailsV2 = (token: string) =>
  requestHelper('GET', '/v2/admin/user/details', {}, token);

export const requestUpdateDetailsV2 = (token: string, email: string, nameFirst: string, nameLast: string) =>
  requestHelper('PUT', '/v2/admin/user/details', { email: email, nameFirst: nameFirst, nameLast: nameLast }, token);

export const requestUpdatePasswordV2 = (token: string, oldPassword: string, newPassword: string) =>
  requestHelper('PUT', '/v2/admin/user/password', { oldPassword: oldPassword, newPassword: newPassword }, token);

export const requestQuizListV2 = (token: string) =>
  requestHelper('GET', '/v2/admin/quiz/list', {}, token);

export const requestQuizCreateV2 = (token: string, name: string, description: string) =>
  requestHelper('POST', '/v2/admin/quiz', { name: name, description: description }, token);

export const requestQuizRemoveV2 = (token: string, quizId: number) =>
  requestHelper('DELETE', parseRouteParams('/v2/admin/quiz/quizid', { quizid: quizId }), {}, token);

export const requestQuizInfoV2 = (token: string, quizId: number) =>
  requestHelper('GET', parseRouteParams('/v2/admin/quiz/quizid', { quizid: quizId }), {}, token);

export const requestNameUpdateV2 = (token: string, quizId: number, name: string) =>
  requestHelper('PUT', parseRouteParams('/v2/admin/quiz/quizid/name', { quizid: quizId }), { name: name }, token);

export const requestDescriptionUpdateV2 = (token: string, quizId: number, description: string) =>
  requestHelper('PUT', parseRouteParams('/v2/admin/quiz/quizid/description', { quizid: quizId }), { description: description }, token);

export const requestQuizzesTrashV2 = (token: string) =>
  requestHelper('GET', '/v2/admin/quiz/trash', {}, token);

export const requestRestoreQuizV2 = (quizId: number, token: string) =>
  requestHelper('POST', parseRouteParams('/v2/admin/quiz/quizid/restore', { quizid: quizId }), {}, token);

export const requestEmptyTrashV2 = (token: string, quizIds: string) =>
  requestHelper('DELETE', '/v2/admin/quiz/trash/empty', { quizIds: quizIds }, token);

export const requestQuizTransferV2 = (quizId: number, token: string, userEmail: string) =>
  requestHelper('POST', parseRouteParams('/v2/admin/quiz/quizid/transfer', { quizid: quizId }), { userEmail: userEmail }, token);

export const requestCreateQuestionV2 = (quizId: number, token: string, question: string, duration: number, points: number, answers: addAnswer[], thumbnailUrl?: string) =>
  requestHelper('POST', parseRouteParams('/v2/admin/quiz/quizid/question', { quizid: quizId }),
    { questionBody: { question: question, duration: duration, points: points, answers: answers, thumbnailUrl: thumbnailUrl } }, token);

export const requestUpdateQuestionV2 = (quizId: number, questionId: number, token: string, question: string, duration: number, points: number, answers: addAnswer[], thumbnailUrl?: string) =>
  requestHelper('PUT', parseRouteParams('/v2/admin/quiz/quizid/question/questionid', { quizid: quizId, questionid: questionId }),
    { questionBody: { question: question, duration: duration, points: points, answers: answers, thumbnailUrl: thumbnailUrl } }, token);

export const requestDeleteQuestionV2 = (quizId: number, questionid: number, token: string) =>
  requestHelper('DELETE', parseRouteParams('/v2/admin/quiz/quizid/question/questionid', { quizid: quizId, questionid: questionid }), {}, token);

export const requestMoveQuestionV2 = (token: string, quizId: number, questionid: number, newPosition: number) =>
  requestHelper('PUT', parseRouteParams('/v2/admin/quiz/quizid/question/questionid/move', { quizid: quizId, questionid: questionid }), { newPosition: newPosition }, token);

export const requestDuplicateQuestionV2 = (token: string, quizId: number, questionid: number) =>
  requestHelper('POST', parseRouteParams('/v2/admin/quiz/quizid/question/questionid/duplicate', { quizid: quizId, questionid: questionid }), {}, token);

export const requestUpdateQuizThumbnail = (quizId: number, token: string, imgUrl: string) =>
  requestHelper('PUT', parseRouteParams('/v1/admin/quiz/quizid/thumbnail', { quizid: quizId }), { imgUrl: imgUrl }, token);

export const requestSessionStart = (quizId: number, token: string, autoStartNum: number) =>
  requestHelper('POST', parseRouteParams('/v1/admin/quiz/quizid/session/start', { quizid: quizId }), { autoStartNum: autoStartNum }, token);

export const requestSessionUpdate = (quizId: number, sessionId: number, token: string, action: string) =>
  requestHelper('PUT', parseRouteParams('/v1/admin/quiz/quizid/session/sessionid', { quizid: quizId, sessionid: sessionId }), { action: action }, token);

export const requestPlayerJoin = (sessionId: number, name: string) =>
  requestHelper('POST', '/v1/player/join', { sessionId: sessionId, name: name });

export const requestGetSessionStatus = (quizId: number, sessionId: number, token: string) =>
  requestHelper('GET', parseRouteParams('/v1/admin/quiz/quizid/session/sessionid', { quizid: quizId, sessionid: sessionId }), {}, token);

export const requestSendChat = (playerid: number, messageBody: string) =>
  requestHelper('POST', parseRouteParams('/v1/player/playerid/chat', { playerid: playerid }), { message: { messageBody: messageBody } });

export const requestPlayerStatus = (playerId: number) =>
  requestHelper('GET', parseRouteParams('/v1/player/playerid', { playerid: playerId }), {});

export const requestPlayerQuestionInfo = (playerId: number, questionposition: number) =>
  requestHelper('GET', parseRouteParams('/v1/player/playerid/question/questionposition', { playerid: playerId, questionposition: questionposition }), {});

export const requestPlayerSubmission = (playerId: number, questionposition: number, answerIds: number[]) =>
  requestHelper('PUT', parseRouteParams('/v1/player/playerid/question/questionposition/answer', { playerid: playerId, questionposition: questionposition }), { answerIds: answerIds });

export const requestViewChat = (playerid: number) =>
  requestHelper('GET', parseRouteParams('/v1/player/playerid/chat', { playerid: playerid }), {});

export const requestViewSessions = (quizId: number, token: string) =>
  requestHelper('GET', parseRouteParams('/v1/admin/quiz/quizid/sessions', { quizid: quizId }), {}, token);

export const requestQuestionResults = (playerId: number, questionPosition: number) =>
  requestHelper('GET', parseRouteParams('/v1/player/playerid/question/questionposition/results', { playerid: playerId, questionposition: questionPosition }), {});
