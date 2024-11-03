import { shell } from 'electron';
import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { setOAuth } from './googleTasks';

const REDIRECT_URI = 'http://localhost:3000/callback';
const SCOPES = ['https://www.googleapis.com/auth/tasks'];

let oauth2Client: OAuth2Client;
let accessToken: string | null | undefined = null;

export const handleGoogleLogin = (CLIENT_ID: string, CLIENT_SECRET: string): Promise<boolean> => {

  return new Promise((resolve, reject) => {

    if (oauth2Client || accessToken) {
      console.log("이미 인증이 존재합니다.")
      resolve(true);
      return;
    }

    oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

    // 인증 URL 생성
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    // 브라우저에서 OAuth 2.0 페이지 열기
    shell.openExternal(authUrl);

    // 로컬 서버 시작해서 Google에서 인증된 code를 받음
    const app = express()

    const server = app.listen(3000, () => {
      console.log('로컬 서버가 3000번 포트에서 실행 중입니다.');
    });

    app.get('/callback', (req: Request, res: Response) => {

      const authCode = req.query.code;

      if (typeof authCode === 'string') {
        oauth2Client.getToken(authCode, (err, tokens) => {

          if (err) {
            console.error('토큰 교환 실패:', err);
            res.send('로그인 실패');
            reject(false); // 실패 시 reject
            return;
          }

          if (tokens) {
            oauth2Client.setCredentials(tokens);
            accessToken = tokens.access_token;
            res.send('Google OAuth 성공! 창을 닫아도 됩니다.');
            setOAuth(oauth2Client)
            server.close()
            resolve(true);
          }

        });
      }
    })

  })
}
