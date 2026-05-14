# Grainly

復古膠卷風格的共享相機 Web App（PRD v1.0 對應的 MVP 實作）。

## 本機開發

```bash
cd grainly
npm install
npm run dev
```

瀏覽 [http://localhost:3000](http://localhost:3000)。

## 功能（MVP）

- 首頁、建立空間、邀請碼加入、空間相片牆
- Web 相機、8 款膠卷風格濾鏡、快門音效與閃光
- 預覽後上傳至空間；訪客 Token（`localStorage`）與上傳頻率限制
- 主辦密鑰（建立空間後寫入本機）可進入管理頁刪除照片
- QR Code：`/api/qrcode/[CODE]`；`NEXT_PUBLIC_APP_URL` 用於正確的 QR 連結（可選）

## 資料儲存（目前）

後端使用**程序內記憶體**儲存空間與照片，方便零設定體驗。**伺服器重啟或 Serverless 新實例會清空資料**。正式環境請改接 **Supabase**（Auth、PostgreSQL、Storage）與 **Stripe**，對照 PRD 的資料表與 API 設計替換 `lib/store.ts` 與 API routes。

## 技術棧

Next.js 14（App Router）、TypeScript、Tailwind CSS、`qrcode`。
