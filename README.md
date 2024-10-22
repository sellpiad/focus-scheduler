## Introduction

`작업마다 소요된 시간을 실시간으로 측정합니다.`

![screenshot](https://github.com/user-attachments/assets/4b9b8189-1e8c-45c1-8c9d-4ed139a60f00)

최초 버전 개발기간: 2024.10.05 ~ 2024.10.17


## Getting Started


루트 최상단 디렉토리에 .env 파일을 생성하여 아래 내용을 추가합니다.
```
CLIENT_ID = YOUR GOOGLE ID
CLIENT_SECRET = YOUR SECRET KEY
```

*본 프로젝트는 작업 내용의 저장을 위해 구글 테스크 API를 사용하기 때문에 API키를 발급받으셔야 사용이 가능합니다.*

이후 아래 커맨드를 차례로 입력하여 실행합니다.

```bash
npm install
npm start
npm run electron
```
