# react-googletasks-example

React + GoogleOAuth2 + GoogleTasksAPI + React Queryを利用したサンプルプロジェクト

- React v18
- vite
- react-query v4
- [react-google-login](https://github.com/anthonyjgrove/react-google-login)
- eslint
- prettier

## 事前準備

GoogleAPI接続用の準備が必要となります。
OAuth認証には[React Google Login](https://github.com/anthonyjgrove/react-google-login)を利用しています。

### [GoogleTasksAPI](https://developers.google.com/tasks)

- GoogleAPI接続用のCLIENT_IDの取得
- GoogleTasksAPIの追加

```bash
$ cp .env.local.example .env.local
```

```text
VITE_CLIENT_ID=**********.apps.googleusercontent.com
```

## 起動

```bash
$ yarn install
$ yarn dev
```
