import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';

import { adminAuthRegister, adminAuthLogin, adminAuthLogout, adminGetUserDetails } from './auth';
import {
  adminQuizCreate, adminQuizNameUpdate, adminQuizDescriptionUpdate, adminQuizRemove,
  adminQuizList, adminCreateQuestion, adminQuizTrashList, adminQuizTransfer, adminMoveQuestion,
  adminQuizRestore, adminDuplicateQuestion, adminQuizInfo, adminUpdateQuestion, adminTrashEmpty,
  adminDeleteQuestion, updateQuizThumbnail, adminSessionStart
} from './quiz';

import { adminSessionUpdate, getSessionStatus, adminViewSessions, questionResults } from './session';
import { playerJoin, playerSendChat, playerStatus, playerQuestionInfo, adminPlayerAnswerSubmission, playerViewChat } from './player';
import { readDataFile, saveDataFile } from './dataStore';
import { adminUserUpdateDetails, adminUserUpdatePassword } from './user';
import { clear } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
app.use('/thumbnails', express.static('thumbnails'));
// for producing the docs that define the API
const file = fs.readFileSync('./swagger.yaml', 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = JSON.parse(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// for logging errors (print to terminal)
app.use(morgan('dev'));

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  const ret = clear();
  return res.json(ret);
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const ret = adminAuthRegister(req.body.email, req.body.password, req.body.nameFirst, req.body.nameLast);
  return res.json(ret);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const ret = adminAuthLogin(req.body.email, req.body.password);
  return res.json(ret);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const ret = adminAuthLogout(req.body.token);
  return res.json(ret);
});
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const ret = adminAuthLogout(req.header('token'));
  return res.json(ret);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const ret = adminQuizCreate(req.body.token, req.body.name, req.body.description);
  return res.json(ret);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const ret = adminQuizCreate(req.header('token'), req.body.name, req.body.description);
  return res.json(ret);
});

app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const ret = adminQuizNameUpdate(req.body.token, JSON.parse(req.params.quizid), req.body.name);
  return res.json(ret);
});
app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const ret = adminQuizNameUpdate(req.header('token'), JSON.parse(req.params.quizid), req.body.name);
  return res.json(ret);
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const ret = adminQuizDescriptionUpdate(req.body.token, JSON.parse(req.params.quizid), req.body.description);
  return res.json(ret);
});
app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const ret = adminQuizDescriptionUpdate(req.header('token'), JSON.parse(req.params.quizid), req.body.description);
  return res.json(ret);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const ret = adminGetUserDetails(req.query.token);
  return res.json(ret);
});
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const ret = adminGetUserDetails(req.header('token'));
  return res.json(ret);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const ret = adminUserUpdateDetails(req.body.token, req.body.email, req.body.nameFirst, req.body.nameLast);
  return res.json(ret);
});
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const ret = adminUserUpdateDetails(req.header('token'), req.body.email, req.body.nameFirst, req.body.nameLast);
  return res.json(ret);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const ret = adminUserUpdatePassword(req.body.token, req.body.oldPassword, req.body.newPassword);
  return res.json(ret);
});
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const ret = adminUserUpdatePassword(req.header('token'), req.body.oldPassword, req.body.newPassword);
  return res.json(ret);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const ret = adminCreateQuestion(JSON.parse(req.params.quizid), req.body.token, req.body.questionBody.question, req.body.questionBody.duration, req.body.questionBody.points, req.body.questionBody.answers);
  return res.json(ret);
});
app.post('/v2/admin/quiz/:quizid/question', async (req: Request, res: Response, next) => {
  try {
    const ret = adminCreateQuestion(JSON.parse(req.params.quizid), req.header('token'), req.body.questionBody.question, req.body.questionBody.duration, req.body.questionBody.points, req.body.questionBody.answers, req.body.questionBody.thumbnailUrl);
    return res.json(ret);
  } catch (err) {
    return next(err);
  }
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const ret = adminUpdateQuestion(JSON.parse(req.params.quizid), parseFloat(req.params.questionid), req.body.token, req.body.questionBody.question, req.body.questionBody.duration, req.body.questionBody.points, req.body.questionBody.answers);
  return res.json(ret);
});
app.put('/v2/admin/quiz/:quizid/question/:questionid', async (req: Request, res: Response, next) => {
  try {
    const ret = adminUpdateQuestion(JSON.parse(req.params.quizid), parseFloat(req.params.questionid), req.header('token'), req.body.questionBody.question, req.body.questionBody.duration, req.body.questionBody.points, req.body.questionBody.answers, req.body.questionBody.thumbnailUrl);
    return res.json(ret);
  } catch (err) {
    return next(err);
  }
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const ret = adminDeleteQuestion(JSON.parse(req.params.quizid), parseFloat(req.params.questionid), req.query.token);
  return res.json(ret);
});
app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const ret = adminDeleteQuestion(JSON.parse(req.params.quizid), parseFloat(req.params.questionid), req.header('token'));
  return res.json(ret);
});

app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const ret = adminQuizRemove(req.query.token, JSON.parse(req.params.quizid));
  return res.json(ret);
});
app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const ret = adminQuizRemove(req.header('token'), JSON.parse(req.params.quizid));
  return res.json(ret);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const ret = adminQuizList(req.query.token);
  return res.json(ret);
});
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const ret = adminQuizList(req.header('token'));
  return res.json(ret);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const ret = adminQuizTrashList(req.query.token as string);
  return res.json(ret);
});
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const ret = adminQuizTrashList(req.headers.token as string);
  return res.json(ret);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const ret = adminQuizTransfer(JSON.parse(req.params.quizid), req.body.token, req.body.userEmail);
  return res.json(ret);
});
app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const ret = adminQuizTransfer(JSON.parse(req.params.quizid), req.header('token'), req.body.userEmail);
  return res.json(ret);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const ret = adminMoveQuestion(req.body.token, JSON.parse(req.params.quizid), parseFloat(req.params.questionid), req.body.newPosition);
  return res.json(ret);
});
app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const ret = adminMoveQuestion(req.header('token'), JSON.parse(req.params.quizid), parseFloat(req.params.questionid), req.body.newPosition);
  return res.json(ret);
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const ret = adminQuizRestore(JSON.parse(req.params.quizid), req.body.token);
  return res.json(ret);
});
app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const ret = adminQuizRestore(JSON.parse(req.params.quizid), req.headers.token);
  return res.json(ret);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const ret = adminDuplicateQuestion(req.body.token, JSON.parse(req.params.quizid), parseFloat(req.params.questionid));
  return res.json(ret);
});
app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const ret = adminDuplicateQuestion(req.header('token'), JSON.parse(req.params.quizid), parseFloat(req.params.questionid));
  return res.json(ret);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const ret = adminQuizInfo(req.query.token, parseInt(req.params.quizid), 1);
  return res.json(ret);
});
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const ret = adminQuizInfo(req.header('token'), parseInt(req.params.quizid), 2);
  return res.json(ret);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const ret = adminTrashEmpty(req.query.token, JSON.parse(req.query.quizIds));
  return res.json(ret);
});
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const ret = adminTrashEmpty(req.header('token'), JSON.parse(req.query.quizIds));
  return res.json(ret);
});

app.put('/v1/admin/quiz/:quizid/thumbnail', async (req: Request, res: Response, next) => {
  try {
    const ret = updateQuizThumbnail(JSON.parse(req.params.quizid), req.header('token'), req.body.imgUrl);
    return res.json(ret);
  } catch (err) {
    return next(err);
  }
});

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const ret = adminSessionStart(JSON.parse(req.params.quizid), req.header('token'), req.body.autoStartNum);
  return res.json(ret);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const ret = adminSessionUpdate(JSON.parse(req.params.quizid), JSON.parse(req.params.sessionid), req.header('token'), req.body.action);
  return res.json(ret);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  const ret = playerJoin(req.body.sessionId, req.body.name);
  return res.json(ret);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const ret = getSessionStatus(JSON.parse(req.params.quizid), JSON.parse(req.params.sessionid), req.header('token'));
  return res.json(ret);
});
app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const ret = playerSendChat(JSON.parse(req.params.playerid), req.body.message.messageBody);
  return res.json(ret);
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const ret = playerStatus(parseFloat(req.params.playerid));
  return res.json(ret);
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const ret = playerQuestionInfo(parseFloat(req.params.playerid), JSON.parse(req.params.questionposition));
  return res.json(ret);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const ret = adminPlayerAnswerSubmission(parseFloat(req.params.playerid), parseInt(req.params.questionposition), req.body.answerIds);
  return res.json(ret);
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const ret = playerViewChat(parseFloat(req.params.playerid));
  return res.json(ret);
});

app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const ret = adminViewSessions(JSON.parse(req.params.quizid), req.header('token'));
  return res.json(ret);
});

app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const ret = questionResults(JSON.parse(req.params.playerid), JSON.parse(req.params.questionposition));
  return res.json(ret);
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
  readDataFile();
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
  saveDataFile();
});
