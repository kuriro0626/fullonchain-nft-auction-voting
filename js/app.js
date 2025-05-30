// app.js - UIの操作とイベント処理

// DOM要素
const placeBidBtn = document.getElementById('place-bid');
const bidAmountInput = document.getElementById('bid-amount');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const newVoteForm = document.getElementById('new-vote-form');
const addOptionBtn = document.getElementById('add-option');
const voteOptionsContainer = document.getElementById('vote-options-container');
const currentNftElement = document.getElementById('current-nft');
const nftTitleElement = document.getElementById('nft-title');
const nftDescriptionElement = document.getElementById('nft-description');

// 初期化
function initApp() {
    setupEventListeners();
    updateNFTDisplay();
}

// イベントリスナーの設定
function setupEventListeners() {
    // 入札ボタンのイベントリスナー
    placeBidBtn.addEventListener('click', handleBid);
    
    // タブ切り替えのイベントリスナー
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // 投票フォームの選択肢追加ボタン
    addOptionBtn.addEventListener('click', addVoteOption);
    
    // 投票フォームの送信
    newVoteForm.addEventListener('submit', handleVoteSubmit);
    
    // 投票ボタンのイベントリスナー
    document.querySelectorAll('.vote-submit').forEach(button => {
        button.addEventListener('click', function() {
            const voteItem = this.closest('.vote-item');
            const selectedOption = voteItem.querySelector('input[type="radio"]:checked');
            
            if (selectedOption) {
                handleVoteSubmission(voteItem.getAttribute('data-vote-id'), selectedOption.value);
            } else {
                window.web3API.showNotification('選択肢を選んでください', 'warning');
            }
        });
    });
    
    // 選択肢削除ボタンのイベントリスナー
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remove-option')) {
            removeVoteOption(e.target);
        }
    });
}

// NFT表示の更新
function updateNFTDisplay() {
    const nft = window.web3API.getCurrentNFT();
    currentNftElement.innerHTML = nft.image;
    nftTitleElement.textContent = nft.title;
    nftDescriptionElement.textContent = nft.description;
}

// 入札処理
async function handleBid() {
    const amount = bidAmountInput.value;
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        window.web3API.showNotification('有効な入札額を入力してください', 'warning');
        return;
    }
    
    const success = await window.web3API.placeBid(amount);
    
    if (success) {
        bidAmountInput.value = '';
    }
}

// タブ切り替え
function switchTab(tabId) {
    // タブボタンのアクティブ状態を更新
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // タブコンテンツの表示/非表示を切り替え
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

// 投票フォームに選択肢を追加
function addVoteOption() {
    const optionCount = voteOptionsContainer.children.length + 1;
    
    const optionDiv = document.createElement('div');
    optionDiv.className = 'vote-option-input';
    
    optionDiv.innerHTML = `
        <input type="text" class="vote-option-text" required placeholder="選択肢${optionCount}">
        <button type="button" class="remove-option">削除</button>
    `;
    
    voteOptionsContainer.appendChild(optionDiv);
}

// 投票フォームから選択肢を削除
function removeVoteOption(button) {
    const optionDiv = button.parentElement;
    
    // 最低2つの選択肢は必要
    if (voteOptionsContainer.children.length > 2) {
        voteOptionsContainer.removeChild(optionDiv);
    } else {
        window.web3API.showNotification('最低2つの選択肢が必要です', 'warning');
    }
}

// 投票フォーム送信処理
async function handleVoteSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('vote-title').value;
    const duration = document.getElementById('vote-duration').value;
    const optionInputs = document.querySelectorAll('.vote-option-text');
    
    const options = Array.from(optionInputs).map(input => input.value);
    
    if (!window.web3API.isConnected()) {
        window.web3API.showNotification('投票を作成するにはウォレットを接続してください', 'warning');
        return;
    }
    
    const success = await window.web3API.createVote(title, options, duration);
    
    if (success) {
        // フォームをリセット
        newVoteForm.reset();
        
        // 選択肢を2つだけにリセット
        while (voteOptionsContainer.children.length > 2) {
            voteOptionsContainer.removeChild(voteOptionsContainer.lastChild);
        }
        
        // アクティブな投票タブに切り替え
        switchTab('active-votes');
    }
}

// 投票送信処理
async function handleVoteSubmission(voteId, optionId) {
    if (!window.web3API.isConnected()) {
        window.web3API.showNotification('投票するにはウォレットを接続してください', 'warning');
        return;
    }
    
    const success = await window.web3API.submitVote(voteId, optionId);
    
    if (success) {
        // 投票後のUI更新
        // 実際の実装ではブロックチェーンから最新の投票状況を取得
    }
}

// 動的に投票アイテムを生成
function createVoteItem(vote, isPast = false) {
    const voteItem = document.createElement('div');
    voteItem.className = `vote-item ${isPast ? 'completed' : ''}`;
    voteItem.setAttribute('data-vote-id', vote.id);
    
    let optionsHTML = '';
    
    vote.options.forEach(option => {
        const percentage = vote.totalVotes > 0 ? Math.round((option.votes / vote.totalVotes) * 100) : 0;
        
        if (isPast) {
            optionsHTML += `
                <div class="vote-option">
                    <span>${option.text}</span>
                    <div class="vote-progress">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                        <span>${percentage}%</span>
                    </div>
                </div>
            `;
        } else {
            optionsHTML += `
                <div class="vote-option">
                    <label>
                        <input type="radio" name="vote-${vote.id}" value="${option.id}">
                        <span>${option.text}</span>
                    </label>
                    <div class="vote-progress">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                        <span>${percentage}%</span>
                    </div>
                </div>
            `;
        }
    });
    
    let resultHTML = '';
    if (isPast && vote.result) {
        const endDate = new Date(vote.endTime).toLocaleDateString('ja-JP');
        resultHTML = `
            <div class="vote-result">
                <p>結果: ${vote.result}</p>
                <p>投票終了: ${endDate}</p>
            </div>
        `;
    }
    
    const submitButtonHTML = isPast ? '' : '<button class="btn vote-submit">投票する</button>';
    
    voteItem.innerHTML = `
        <h3>${vote.title}</h3>
        <div class="vote-options">
            ${optionsHTML}
        </div>
        ${resultHTML}
        ${submitButtonHTML}
    `;
    
    return voteItem;
}

// 投票リストの更新
function updateVotesList() {
    const activeVotesContainer = document.querySelector('#active-votes .vote-list');
    const pastVotesContainer = document.querySelector('#past-votes .vote-list');
    
    // 進行中の投票リストをクリア
    activeVotesContainer.innerHTML = '';
    
    // 過去の投票リストをクリア
    pastVotesContainer.innerHTML = '';
    
    // 進行中の投票を追加
    const activeVotes = window.web3API.getActiveVotes();
    activeVotes.forEach(vote => {
        const voteItem = createVoteItem(vote);
        activeVotesContainer.appendChild(voteItem);
    });
    
    // 過去の投票を追加
    const pastVotes = window.web3API.getPastVotes();
    pastVotes.forEach(vote => {
        const voteItem = createVoteItem(vote, true);
        pastVotesContainer.appendChild(voteItem);
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    updateVotesList();
});
