# Wily-front

このリポジトリは、Wilyサービス（フルオンチェーンNFTオークション＆投票サービス）のフロントエンドコードを管理するためのリポジトリです。

## 概要

Wily-frontは、Wilyサービスのフロントエンドに関連するコードを管理します。このフロントエンドコードはブロックチェーン上に保存され、サーバーインフラを必要としない完全分散型アプリケーションの一部として機能します。

## ファイル構成

- `index.html` - 開発用のHTMLファイル（複数ファイル構成）
- `onchain-frontend.html` - オンチェーンに保存するための最適化された単一HTMLファイル
- `css/` - スタイルシートファイル
  - `styles.css` - メインのCSSファイル
- `js/` - JavaScriptファイル
  - `web3.js` - ウォレット接続とブロックチェーン連携用のJavaScriptファイル
  - `app.js` - UIの操作とイベント処理用のJavaScriptファイル

## セットアップと実行方法

### 前提条件
- Node.js (v14以上)
- npm または yarn
- MetaMaskなどのイーサリアム互換ウォレット

### インストール

1. リポジトリをクローン
   ```
   git clone https://github.com/yourusername/wily-front.git
   cd wily-front
   ```

2. 依存関係をインストール
   ```
   npm install
   ```

### フロントエンドの実行
ブラウザでHTMLファイルを開く:
- 開発版: `open index.html`
- オンチェーン版: `open onchain-frontend.html`

## オンチェーンへのデプロイ

フロントエンドコードをブロックチェーンにデプロイするには、wily-contractリポジトリの手順に従ってください。

## 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript
- **ブロックチェーン連携**: ethers.js
- **推奨チェーン**: Arbitrum（低ガスコストでフロントエンド保存に最適）

## ライセンス

MIT
