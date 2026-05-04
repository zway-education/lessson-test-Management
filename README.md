# 台灣展威文化教育 — 後台管理（Admin）

只有授權 Google 帳號才能進入的管理員後台。

## 檔案

- `index.html` — 後台主程式（原 admin.html 改名）
  - Google OAuth 登入閘門（GSI）
  - 資料管理：列表、篩選、班別/角色/日期條件
  - 測評報告：簡版預覽 + 跳轉富版
- `測評報告_圖表優化版.html` — 富版報告（圖表優化，自動讀 localStorage 接動態資料）
- `config.js` — ZW 全域設定備份

## 首次部署設定（很重要）

### 1. 建立 Google OAuth Client ID

1. 開 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 建立 OAuth 2.0 Client ID，類型選「Web 應用程式」
3. **已授權的 JavaScript 來源** 加：
   ```
   https://zway-education.github.io
   ```
4. 拿到 Client ID（格式 `xxxxxx.apps.googleusercontent.com`）

### 2. 編輯 index.html

搜尋以下兩處替換：

```
YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

改成你的真實 Client ID。

### 3. 編輯白名單

搜尋 `const ADMIN_EMAILS`，把可進後台的 Google 帳號加進去：

```javascript
const ADMIN_EMAILS = [
  'oscar19960613@gmail.com',
  'teacher1@example.com',
  'teacher2@school.edu.tw',
];
```

### 4. push 到 GitHub Pages

git push → 後台會發佈到：

https://zway-education.github.io/lessson-test-Management/

## 登入流程

1. 開後台網址 → 顯示黑色登入閘門
2. 點 Google 登入按鈕 → 彈出 Google 一鍵登入
3. 系統解析 JWT 取得 email → 比對白名單
4. 通過 → `sessionStorage` 標記登入 → 顯示資料管理頁面
5. 關掉瀏覽器 → sessionStorage 失效 → 下次要重新登入

## 後台功能

- **資料管理**：篩選班別 / 角色 / 姓名 / 填寫日期，看學員填過的紀錄
- **測評報告（簡版）**：點某一筆 → 詳情面板「簡版預覽」按鈕 → 內嵌雷達圖 + 維度卡
- **測評報告（富版）**：點「📋 開啟完整報告（富版）」→ 新分頁開圖表優化版，自動讀 localStorage 顯示這筆紀錄的完整視覺化報告（隱藏其他班別 tab）
