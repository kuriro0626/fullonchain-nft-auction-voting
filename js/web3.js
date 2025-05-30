// web3.js - ウォレット接続とブロックチェーン連携

// モックデータ（実際の実装ではブロックチェーンから取得）
const mockData = {
    currentNFT: {
        id: 1,
        title: "NFT #1",
        description: "今日のユニークNFT",
        image: `<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="300" height="300" fill="#f0f0f0" />
                    <text x="150" y="150" font-family="Arial" font-size="24" text-anchor="middle" fill="#333">NFT #1</text>
                    <circle cx="150" cy="150" r="100" fill="none" stroke="#333" stroke-width="2" />
                </svg>`
    },
    auction: {
        highestBid: "0.1",
        highestBidder: "0x1234...5678",
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24時間後
    },
    activeVotes: [
        {
            id: 1,
            title: "次回のNFTテーマは？",
            options: [
                { id: 1, text: "宇宙", votes: 65 },
                { id: 2, text: "海洋", votes: 35 }
            ],
            totalVotes: 100,
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3日後
        }
    ],
    pastVotes: [
        {
            id: 2,
            title: "トレジャリー資金の使途は？",
            options: [
                { id: 1, text: "開発者報酬", votes: 45 },
                { id: 2, text: "マーケティング", votes: 30 },
                { id: 3, text: "流動性提供", votes: 25 }
            ],
            totalVotes: 100,
            endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5日前
            result: "開発者報酬に決定"
        }
    ]
};

// Web3関連の状態
let web3State = {
    isConnected: false,
    account: null,
    balance: 0,
    network: null,
    gasPrice: null,
    provider: null
};

// ウォレット接続ボタンの要素を取得
const connectWalletBtn = document.getElementById('connect-wallet');
const walletInfo = document.getElementById('wallet-info');
const walletAddress = document.getElementById('wallet-address');
const walletBalance = document.getElementById('wallet-balance');
const networkName = document.getElementById('network-name');
const gasPrice = document.getElementById('gas-price');

// 通知関連
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ウォレット接続処理
async function connectWallet() {
    try {
        // 実際の実装ではここでMetaMaskやWalletConnectを使用
        // モック実装
        web3State.isConnected = true;
        web3State.account = '0x' + Math.random().toString(16).substr(2, 40);
        web3State.balance = (Math.random() * 10).toFixed(4);
        web3State.network = 'Arbitrum';
        web3State.gasPrice = (Math.random() * 50).toFixed(2);
        
        // UI更新
        updateWalletUI();
        
        showNotification('ウォレットが接続されました', 'success');
        return true;
    } catch (error) {
        console.error('ウォレット接続エラー:', error);
        showNotification('ウォレット接続に失敗しました', 'error');
        return false;
    }
}

// ウォレットUI更新
function updateWalletUI() {
    if (web3State.isConnected) {
        connectWalletBtn.textContent = '接続済み';
        connectWalletBtn.disabled = true;
        walletInfo.classList.remove('hidden');
        
        // アドレスを省略表示
        const shortAddress = `${web3State.account.substring(0, 6)}...${web3State.account.substring(38)}`;
        walletAddress.textContent = shortAddress;
        walletBalance.textContent = `${web3State.balance} ETH`;
        
        // ネットワーク情報
        networkName.textContent = `ネットワーク: ${web3State.network}`;
        gasPrice.textContent = `ガス価格: ${web3State.gasPrice} Gwei`;
    } else {
        connectWalletBtn.textContent = 'ウォレット接続';
        connectWalletBtn.disabled = false;
        walletInfo.classList.add('hidden');
        networkName.textContent = 'ネットワーク: 未接続';
        gasPrice.textContent = 'ガス価格: -- Gwei';
    }
}

// オークション入札処理
async function placeBid(amount) {
    if (!web3State.isConnected) {
        showNotification('入札するにはウォレットを接続してください', 'warning');
        return false;
    }
    
    try {
        // 実際の実装ではここでスマートコントラクトを呼び出し
        // モック実装
        if (parseFloat(amount) > parseFloat(mockData.auction.highestBid)) {
            mockData.auction.highestBid = amount;
            mockData.auction.highestBidder = web3State.account.substring(0, 6) + '...' + web3State.account.substring(38);
            
            // UI更新
            document.getElementById('highest-bid').textContent = `${amount} ETH`;
            document.getElementById('highest-bidder').textContent = mockData.auction.highestBidder;
            
            showNotification('入札が成功しました', 'success');
            return true;
        } else {
            showNotification('入札額は現在の最高額より高くなければなりません', 'warning');
            return false;
        }
    } catch (error) {
        console.error('入札エラー:', error);
        showNotification('入札に失敗しました', 'error');
        return false;
    }
}

// 投票処理
async function submitVote(voteId, optionId) {
    if (!web3State.isConnected) {
        showNotification('投票するにはウォレットを接続してください', 'warning');
        return false;
    }
    
    try {
        // 実際の実装ではここでスマートコントラクトを呼び出し
        // モック実装
        showNotification('投票が成功しました', 'success');
        return true;
    } catch (error) {
        console.error('投票エラー:', error);
        showNotification('投票に失敗しました', 'error');
        return false;
    }
}

// 新規投票作成
async function createVote(title, options, duration) {
    if (!web3State.isConnected) {
        showNotification('投票を作成するにはウォレットを接続してください', 'warning');
        return false;
    }
    
    try {
        // 実際の実装ではここでスマートコントラクトを呼び出し
        // モック実装
        const newVote = {
            id: mockData.activeVotes.length + mockData.pastVotes.length + 1,
            title: title,
            options: options.map((text, index) => ({ id: index + 1, text, votes: 0 })),
            totalVotes: 0,
            endTime: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
        };
        
        mockData.activeVotes.push(newVote);
        showNotification('投票が作成されました', 'success');
        return true;
    } catch (error) {
        console.error('投票作成エラー:', error);
        showNotification('投票の作成に失敗しました', 'error');
        return false;
    }
}

// オークション情報の取得
function getAuctionInfo() {
    return mockData.auction;
}

// 現在のNFT情報の取得
function getCurrentNFT() {
    return mockData.currentNFT;
}

// 進行中の投票リストの取得
function getActiveVotes() {
    return mockData.activeVotes;
}

// 過去の投票リストの取得
function getPastVotes() {
    return mockData.pastVotes;
}

// オークション残り時間の更新
function updateAuctionTimeLeft() {
    const timeLeftElement = document.getElementById('auction-time-left');
    const endTime = mockData.auction.endTime;
    const now = new Date();
    
    if (endTime > now) {
        const diff = endTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timeLeftElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        timeLeftElement.textContent = '終了';
    }
}

// イベントリスナーの設定
function setupWeb3EventListeners() {
    // ウォレット接続ボタンのイベントリスナー
    connectWalletBtn.addEventListener('click', connectWallet);
}

// 初期化
function initWeb3() {
    setupWeb3EventListeners();
    
    // オークション残り時間の定期更新
    setInterval(updateAuctionTimeLeft, 1000);
}

// エクスポート
window.web3API = {
    connectWallet,
    placeBid,
    submitVote,
    createVote,
    getAuctionInfo,
    getCurrentNFT,
    getActiveVotes,
    getPastVotes,
    isConnected: () => web3State.isConnected
};

// 初期化
document.addEventListener('DOMContentLoaded', initWeb3);
