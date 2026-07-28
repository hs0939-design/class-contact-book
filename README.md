# 電子聯絡簿 - 設定步驟

## 1. 建立 GitHub 帳號與 Repository
1. 到 https://github.com 註冊帳號（如果還沒有）
2. 點右上角 "+" → New repository
3. 名稱例如 `class-contact-book`，選 **Public**，勾選 "Add a README file"，按 Create repository

## 2. 上傳這些檔案
1. 打開妳剛建立的 repository 頁面
2. 點 "Add file" → "Upload files"
3. 把這個資料夾裡的所有檔案和資料夾（index.html、admin.html、styles.css、common.js、data/ 整個資料夾）拖進去
4. 下面填寫說明文字（隨便打，例如 "初始上傳"），按 "Commit changes"

## 3. 開啟 GitHub Pages
1. 進入 repository 的 "Settings"
2. 左側選單找到 "Pages"
3. Source 選 "Deploy from a branch"，Branch 選 "main"，資料夾選 "/ (root)"，按 Save
4. 等 1-2 分鐘，頁面會顯示網址，長得像：
   `https://你的帳號.github.io/class-contact-book/`
5. 這個網址 + `index.html` 就是給家長和教室觸控螢幕看的公開頁面
   這個網址 + `admin.html` 就是妳自己用的後台（例如：`https://你的帳號.github.io/class-contact-book/admin.html`）

## 4. 產生妳自己的 Personal Access Token（只有妳能用來編輯）
1. 點右上角大頭貼 → Settings → 左側最下面 "Developer settings"
2. "Personal access tokens" → "Fine-grained tokens" → "Generate new token"
3. Repository access 選 "Only select repositories"，選妳剛建立的這個 repo
4. Permissions 裡找到 "Contents"，設成 "Read and write"
5. 按 Generate token，**把出現的那串 Token 複製起來**（離開頁面後就看不到了，要存好，例如存在密碼管理工具裡）

## 5. 開始使用
1. 在妳的筆電或平板打開 `admin.html` 那個網址
2. 第一次會請妳輸入：GitHub 帳號名稱、Repository 名稱、分支（填 main）、貼上剛剛的 Token
3. 之後每天打開這個頁面，選日期、填功課和公告，按「發布」
4. 大約 1 分鐘後，`index.html` 那個公開頁面就會顯示最新內容
5. 教室觸控螢幕只要開 `index.html`，點「黑板投影模式」給學生抄

## 注意事項
- Token 只存在妳自己瀏覽器的本機儲存空間，不會傳給任何人；但換一台裝置（例如從筆電換平板）要重新輸入一次
- admin.html 這個網址不要分享給家長或學生——雖然沒有 Token 就無法儲存，但還是建議只有妳自己知道這個網址
- 如果 Token 不小心外流，到 GitHub 的 Developer settings 裡把它刪除，換一個新的重新設定就好
