// 游戏核心数据
const gameState = {
    boardSize: { x: 10, y: 12 },
    currentPlayer: 'blue',
    movesRemaining: 2,
    selectedPiece: null,
    availableMoves: [],
    attackablePieces: [],
    swappablePieces: [], // 可交换的友方棋子
    pieces: [],
    selectedPieces: { blue: [], red: [] },
    gameStarted: false,
    devouredPieces: [] // 新增：记录恶食大王已经吞噬过的友军棋子ID
};

// 在全局作用域添加定时器变量
let borderUpdateInterval = null;

// 联机状态变量
const onlineState = {
  isOnline: false,
  roomId: null,
  playerId: null,
  playerRole: null, // 'blue' 或 'red'
  opponentId: null,
  isReady: false,
  opponentReady: false,
  // 添加投票状态
  resetVote: {
    requested: false,
    voted: false,
    opponentVoted: false
  }
};

// DOM元素
const gameBoard = document.getElementById('game-board');
const messageArea = document.getElementById('message-area');
const movesRemainingEl = document.getElementById('moves-remaining').querySelector('span');
const openPackBtn = document.getElementById('open-pack-btn');
const closePackBtn = document.getElementById('close-pack-btn');
const packModal = document.getElementById('pack-modal');
const pokemonPack = document.getElementById('pokemon-pack');
const confirmPiecesBtn = document.getElementById('confirm-pieces-btn');
const resetGameBtn = document.getElementById('reset-game-btn');
const rulesBtn = document.getElementById('rules-btn');
const closeRulesBtn = document.getElementById('close-rules-btn');
const rulesModal = document.getElementById('rules-modal');
const messageInput = document.getElementById('message-input');
const sendMessageBtn = document.getElementById('send-message');
// 添加Canvas引用
let riverCanvas, riverCtx, flowingRiver;

// Firebase配置
const firebaseConfig = {
  apiKey: "AIzaSyBi_Qpl-CmVA4nsXM3XkvL_BE1tTrVLjyU",
  authDomain: "pokechess-d0a84.firebaseapp.com",
  projectId: "pokechess-d0a84",
  storageBucket: "pokechess-d0a84.firebasestorage.app",
  messagingSenderId: "70454831279",
  appId: "1:70454831279:web:ce705a11eb4ce647918c5a",
  measurementId: "G-EH0XKQFLEL"
};

// 初始化Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 初始化函数
function init() {
    createBoard();
    createPokemonPack();
    setupEventListeners();
    initOnline();
    initAIGame(); // 添加这行代码
    addMessage('欢迎来到宝可梦象棋！请先打开棋包选择你的6个宝可梦');
}

// 初始化联机功能
function initOnline() {
  // 生成玩家ID
  onlineState.playerId = generateId();
  
  // 添加事件监听器
  document.getElementById('online-btn').addEventListener('click', openOnlineModal);
  document.getElementById('close-online-btn').addEventListener('click', closeOnlineModal);
  document.getElementById('create-room-btn').addEventListener('click', createRoom);
  document.getElementById('join-room-btn').addEventListener('click', joinRoom);
  document.getElementById('copy-room-btn').addEventListener('click', copyRoomCode);
  document.getElementById('ready-btn').addEventListener('click', toggleReady);
  document.getElementById('leave-room-btn').addEventListener('click', leaveRoom);
  document.getElementById('send-chat-btn').addEventListener('click', sendChatMessage);
  document.getElementById('online-chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

// 打开联机模态窗口
function openOnlineModal() {
  document.getElementById('online-modal').classList.remove('hidden');
}

// 关闭联机模态窗口
function closeOnlineModal() {
  document.getElementById('online-modal').classList.add('hidden');
}

// 生成随机ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// 生成房间ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 创建房间
function createRoom() {
  const roomId = generateRoomId();
  onlineState.roomId = roomId;
  onlineState.playerRole = 'blue';
  
  // 在Firebase中创建房间
  const roomRef = database.ref('rooms/' + roomId);
  roomRef.set({
    player1: onlineState.playerId,
    player2: null,
    player1Ready: false,
    player2Ready: false,
    gameState: null,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
  
  // 监听房间变化
  roomRef.on('value', handleRoomUpdate);
  
  // 更新UI
  document.getElementById('room-section').classList.remove('hidden');
  document.getElementById('room-code-display').textContent = roomId;
  document.getElementById('ready-section').classList.remove('hidden');
  document.getElementById('leave-room-btn').classList.remove('hidden');
  
  addOnlineMessage('已创建房间 ' + roomId);
}

// 加入房间
function joinRoom() {
  const roomId = document.getElementById('join-room-input').value.trim().toUpperCase();
  if (!roomId) {
    addOnlineMessage('请输入房间号');
    return;
  }
  
  onlineState.roomId = roomId;
  onlineState.playerRole = 'red';
  
  const roomRef = database.ref('rooms/' + roomId);
  
  // 检查房间是否存在
  roomRef.once('value').then((snapshot) => {
    if (!snapshot.exists()) {
      addOnlineMessage('房间不存在');
      return;
    }
    
    const roomData = snapshot.val();
    if (roomData.player2) {
      addOnlineMessage('房间已满');
      return;
    }
    
    // 加入房间
    roomRef.update({
      player2: onlineState.playerId,
      player2Ready: false
    });
    
    // 监听房间变化
    roomRef.on('value', handleRoomUpdate);
    
    // 更新UI
    document.getElementById('room-section').classList.remove('hidden');
    document.getElementById('room-code-display').textContent = roomId;
    document.getElementById('ready-section').classList.remove('hidden');
    document.getElementById('leave-room-btn').classList.remove('hidden');
    
    addOnlineMessage('已加入房间 ' + roomId);
  }).catch((error) => {  // 添加错误处理
    console.error('加入房间失败:', error);
    addOnlineMessage('加入房间失败，请检查网络连接');
  });
}

// 处理房间更新
function handleRoomUpdate(snapshot) {
  if (!snapshot.exists()) {
    addOnlineMessage('房间已关闭');
    leaveRoom();
    return;
  }
  
  const roomData = snapshot.val();
  
  // 同步对方选择的棋子
  if (onlineState.playerRole === 'blue' && roomData.selectedPieces_red) {
    gameState.selectedPieces.red = roomData.selectedPieces_red;
  } else if (onlineState.playerRole === 'red' && roomData.selectedPieces_blue) {
    gameState.selectedPieces.blue = roomData.selectedPieces_blue;
  }
  
  // 更新准备状态
  document.getElementById('player1-ready').textContent = roomData.player1Ready ? '已准备' : '未准备';
  document.getElementById('player2-ready').textContent = roomData.player2Ready ? '已准备' : '等待玩家...';
  
  onlineState.opponentReady = onlineState.playerRole === 'blue' ? 
    roomData.player2Ready : roomData.player1Ready;
  
  // 检查是否双方都已准备
  if (roomData.player1Ready && roomData.player2Ready) {
    // 开始游戏
    if (!gameState.gameStarted) {
      startOnlineGame();
    }
  }
  
  // 同步游戏状态
  if (roomData.gameState && onlineState.isOnline) {
    // 避免循环同步
    if (roomData.gameState.lastUpdatedBy !== onlineState.playerId) {
      applyGameState(roomData.gameState);
    }
  }
  
  // 处理聊天消息
  if (roomData.chat) {
    updateChatMessages(roomData.chat);
  }
  
  // 处理重置投票
  if (roomData.resetVote) {
    const resetVote = roomData.resetVote;
    
    // 检查是否有人发起投票
    if (resetVote.requestedBy && resetVote.requestedBy !== onlineState.playerId) {
      if (!onlineState.resetVote.requested) {
        onlineState.resetVote.requested = true;
        onlineState.resetVote.voted = false;
        
        addMessage('<span class="text-yellow-300">对方发起了重置游戏投票，点击重置按钮同意</span>');
      }
    }
    
    // 检查投票结果
    const bothVoted = resetVote.blueVoted && resetVote.redVoted;
    if (bothVoted) {
      // 双方都同意，执行重置
      const roomRef = database.ref('rooms/' + onlineState.roomId);
      roomRef.update({
        resetVote: null
      });
      
      // 调用实际的重置逻辑
      performActualReset();
    }
    
    // 更新对手投票状态
    const opponentVoteKey = onlineState.playerRole === 'blue' ? 'redVoted' : 'blueVoted';
    onlineState.resetVote.opponentVoted = resetVote[opponentVoteKey] || false;
  }
}

// 更新聊天消息
function updateChatMessages(chatData) {
  // 按时间顺序排序消息
  const messages = Object.entries(chatData)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  
  // 获取最后一条消息的时间戳用于去重检查
  const lastTimestamp = messageArea.lastElementChild?.dataset.timestamp;
  
  messages.forEach(([timestamp, message]) => {
    // 检查是否已经显示过这条消息（避免重复添加）
    if (lastTimestamp && parseInt(timestamp) <= parseInt(lastTimestamp)) {
      return;
    }
    
    const isOwn = message.sender === onlineState.playerId;
    const senderName = isOwn ? '你' : '对手';
    
    // 在主消息区域显示聊天消息，添加时间戳数据属性用于去重
    const messageEl = document.createElement('div');
    messageEl.classList.add('bg-gray-800/50', 'border-l-4', 'border-primary', 'p-3', 'rounded', 'text-sm');
    messageEl.dataset.timestamp = timestamp;
    messageEl.innerHTML = `<span class="${isOwn ? 'text-blue-300' : 'text-green-300'}">${senderName}: ${message.message}</span>`;
    
    messageArea.appendChild(messageEl);
  });
  
  messageArea.scrollTop = messageArea.scrollHeight;
}

// 复制房间号
function copyRoomCode() {
  navigator.clipboard.writeText(onlineState.roomId);
  addOnlineMessage('已复制房间号');
}

// 切换准备状态
function toggleReady() {
  const roomRef = database.ref('rooms/' + onlineState.roomId);
  const readyKey = onlineState.playerRole === 'blue' ? 'player1Ready' : 'player2Ready';
  
  roomRef.update({
    [readyKey]: !onlineState.isReady
  });
  
  onlineState.isReady = !onlineState.isReady;
  
  const btn = document.getElementById('ready-btn');
  if (onlineState.isReady) {
    btn.classList.remove('bg-blue-600');
    btn.classList.add('bg-green-600');
    btn.innerHTML = '<i class="fa fa-check mr-2"></i> 取消准备';
  } else {
    btn.classList.remove('bg-green-600');
    btn.classList.add('bg-blue-600');
    btn.innerHTML = '<i class="fa fa-check mr-2"></i> 准备';
  }
}

// 离开房间
function leaveRoom() {
  if (onlineState.roomId) {
    const roomRef = database.ref('rooms/' + onlineState.roomId);
    roomRef.off(); // 移除监听器
    
    // 如果是房主，删除房间
    if (onlineState.playerRole === 'blue') {
      roomRef.remove();
    } else {
      // 如果是玩家，清空玩家2信息
      roomRef.update({
        player2: null,
        player2Ready: false
      });
    }
  }
  
  // 重置状态
  onlineState.roomId = null;
  onlineState.isReady = false;
  onlineState.opponentReady = false;
  onlineState.isOnline = false;
  
  // 更新UI
  document.getElementById('room-section').classList.add('hidden');
  document.getElementById('ready-section').classList.add('hidden');
  document.getElementById('leave-room-btn').classList.add('hidden');
  
  addOnlineMessage('已离开房间');
}

// 发送聊天消息
function sendChatMessage() {
  const input = document.getElementById('online-chat-input');
  const message = input.value.trim();
  
  if (!message || !onlineState.roomId) return;
  
  const roomRef = database.ref('rooms/' + onlineState.roomId + '/chat');
  const messageId = Date.now();
  
  roomRef.update({
    [messageId]: {
      sender: onlineState.playerId,
      message: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }
  });
  
  input.value = '';
}

// 添加聊天消息
function addOnlineMessage(message, isSystem = true) {
  // 只在主消息区域显示系统消息
  if (isSystem) {
    addMessage(`<span class="text-gray-400 italic">${message}</span>`);
  } else {
    addMessage(message);
  }
}

// 开始在线游戏
function startOnlineGame() {
  onlineState.isOnline = true;
  
  // 关闭联机模态窗口
  closeOnlineModal();
  
  // 根据玩家角色设置棋子选择
  if (onlineState.playerRole === 'blue') {
    // 蓝色方（房主）选择棋子
    if (gameState.selectedPieces.blue.length === 6) {
      // 如果已经选择了6个棋子，直接开始游戏
      startOnlineGameWithPieces();
    } else {
      // 打开棋包选择棋子
      openPackBtn.click();
      addMessage('请选择6个宝可梦开始游戏');
    }
  } else {
    // 红色方（加入者）选择棋子
    if (gameState.selectedPieces.red.length === 6) {
      // 如果已经选择了6个棋子，直接开始游戏
      startOnlineGameWithPieces();
    } else {
      // 打开棋包选择棋子
      openPackBtn.click();
      addMessage('请选择6个宝可梦开始游戏');
    }
  }
}

// 新的开始游戏函数（使用各自选择的棋子）
function startOnlineGameWithPieces() {
  gameState.gameStarted = true;
  gameState.currentPlayer = 'blue'; // 蓝色先手
  gameState.movesRemaining = 2;
  
  placeInitialPieces();
  
  updateMoveCounter();
  
  // 通过消息区域播报游戏开始信息
  addMessage('联机游戏开始！<span class="text-primary font-bold">蓝色方先行</span>');
  addMessage(`你是${onlineState.playerRole === 'blue' ? '蓝色方' : '红色方'}`);
  
  // 同步游戏状态
  if (onlineState.isOnline) {
    syncGameState();
  }
  
  // 确保游戏开始时边框正确显示
  updatePieceBorders();
}

// 同步游戏状态到Firebase
function syncGameState() {
  if (!onlineState.isOnline || !onlineState.roomId) return;
  
  const roomRef = database.ref('rooms/' + onlineState.roomId);
  
  roomRef.update({
    gameState: {
      pieces: gameState.pieces,
      currentPlayer: gameState.currentPlayer,
      movesRemaining: gameState.movesRemaining,
      selectedPiece: gameState.selectedPiece ? gameState.selectedPiece.id : null,
      lastUpdatedBy: onlineState.playerId
    }
  });
}

// 应用从Firebase接收到的游戏状态
function applyGameState(remoteState) {
  // 更新游戏状态
  gameState.pieces = remoteState.pieces;
  gameState.currentPlayer = remoteState.currentPlayer;
  gameState.movesRemaining = remoteState.movesRemaining;
  
  // 更新选中的棋子
  if (remoteState.selectedPiece) {
    gameState.selectedPiece = gameState.pieces.find(p => p.id === remoteState.selectedPiece);
  } else {
    gameState.selectedPiece = null;
  }
  
  // 重新渲染棋盘 - 添加错误处理
  try {
    renderPieces();
  } catch (error) {
    console.error('渲染棋子时出错:', error);
    // 如果渲染失败，延迟重试
    setTimeout(() => {
      if (gameState.gameStarted) {
        renderPieces();
      }
    }, 100);
  }
  
  updateMoveCounter();
  
  // 如果当前玩家是自己，高亮可选移动
  if (gameState.currentPlayer === onlineState.playerRole && gameState.selectedPiece) {
    forceHighlightSelectedPiece();
  }
}

// 创建棋盘
function createBoard() {
    gameBoard.innerHTML = '';
    
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const cellWidth = boardWidth / gameState.boardSize.x;
    const cellHeight = boardHeight / gameState.boardSize.y;
    
    // 创建并初始化Canvas
    initRiverCanvas();
    
    for (let y = 0; y < gameState.boardSize.y; y++) {
        for (let x = 0; x < gameState.boardSize.x; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'absolute', 'border', 'border-gray-700/50', 'cursor-pointer');
            
            const left = x * cellWidth;
            const top = (gameState.boardSize.y - 1 - y) * cellHeight;
            
            cell.style.width = `${cellWidth}px`;
            cell.style.height = `${cellHeight}px`;
            cell.style.left = `${left}px`;
            cell.style.top = `${top}px`;
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // 创建格子右上角信息容器
            const cornerInfo = document.createElement('div');
            cornerInfo.classList.add('cell-corner-info');
            cornerInfo.dataset.x = x;
            cornerInfo.dataset.y = y;
            cell.appendChild(cornerInfo);
            
            // 保留river类标记，但实际效果由Canvas处理
            if (y === 5 || y === 6) {
                cell.classList.add('river');
            }
            
            cell.addEventListener('click', () => handleCellClick(x, y));
            
            gameBoard.appendChild(cell);
        }
    }
    
    // 移除原有的气泡生成函数调用
    if (window.bubbleInterval) {
        clearInterval(window.bubbleInterval);
        window.bubbleInterval = null;
    }
}

// 添加Canvas初始化函数
function initRiverCanvas() {
    // 移除旧的Canvas
    const oldCanvas = document.getElementById('river-canvas');
    if (oldCanvas) {
        oldCanvas.remove();
    }
    
    // 创建新的Canvas
    riverCanvas = document.createElement('canvas');
    riverCanvas.id = 'river-canvas';
    riverCanvas.width = gameBoard.clientWidth;
    riverCanvas.height = gameBoard.clientHeight;
    gameBoard.appendChild(riverCanvas);
    
    riverCtx = riverCanvas.getContext('2d');
    
    // 创建并启动河流动画
    if (flowingRiver) {
        flowingRiver.stop();
    }
    flowingRiver = new FlowingRiver();
    flowingRiver.start();
}

// 添加FlowingRiver类
class FlowingRiver {
    constructor() {
        this.animationId = null;
        this.particles = [];
        this.currentSpeed = 0.8;
        this.gradientOffset = 0;
        
        // 计算河流位置和大小
        const cellHeight = riverCanvas.height / gameState.boardSize.y;
        // y=5和y=6的格子是河流
        this.riverY = (gameState.boardSize.y - 1 - 6) * cellHeight; // 上河岸
        this.riverHeight = cellHeight * 2; // 两条河流格子的高度
        
        this.initParticles();
    }
    
    initParticles() {
        // 创建水流粒子
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * riverCanvas.width,
                y: this.riverY + Math.random() * this.riverHeight,
                size: 1 + Math.random() * 1.5,
                speed: this.currentSpeed * (0.6 + Math.random() * 0.3),
                alpha: 0.2 + Math.random() * 0.3
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speed;
            // 更温和的上下波动
            
            // 如果粒子流出屏幕，从左侧重新进入
            if (particle.x > riverCanvas.width) {
                particle.x = -particle.size;
                particle.y = this.riverY + Math.random() * this.riverHeight;
            }
        });
    }
    
    createAnimatedGradient() {
        const time = Date.now() * 0.001;
        this.gradientOffset = (this.gradientOffset + this.currentSpeed * 0.1) % 100;
        
        const gradient = riverCtx.createLinearGradient(
            this.gradientOffset, this.riverY,
            this.gradientOffset + 200, this.riverY + this.riverHeight
        );
        
        // 更明亮透明的蓝色渐变
        gradient.addColorStop(0, 'rgba(30, 136, 229, 0.9)');
        gradient.addColorStop(0.2, 'rgba(66, 165, 245, 0.8)');
        gradient.addColorStop(0.4, 'rgba(100, 181, 246, 0.9)');
        gradient.addColorStop(0.6, 'rgba(144, 202, 249, 0.95)');
        gradient.addColorStop(0.8, 'rgba(100, 181, 246, 1.1)');
        gradient.addColorStop(1, 'rgba(30, 136, 229, 0.85)');
        
        return gradient;
    }
    
    draw() {
        const time = Date.now() * 0.001;
        
        // 清除河流区域
        riverCtx.clearRect(0, this.riverY - 10, riverCanvas.width, this.riverHeight + 20);
        
        // 绘制动态流动的渐变背景
        riverCtx.fillStyle = this.createAnimatedGradient();
        riverCtx.fillRect(0, this.riverY, riverCanvas.width, this.riverHeight);
        
        // 绘制更柔和的水流线
        riverCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        riverCtx.lineWidth = 1;
        
        for (let y = this.riverY + 15; y < this.riverY + this.riverHeight; y += 18) {
            riverCtx.beginPath();
            for (let x = 0; x < riverCanvas.width; x += 25) {
                // 更温和的波浪效果
                const offset = Math.sin((x * 0.015) + time * 0.8 + (y * 0.003)) * 2;
                if (x === 0) {
                    riverCtx.moveTo(x, y + offset);
                } else {
                    riverCtx.lineTo(x, y + offset);
                }
            }
            riverCtx.stroke();
        }
        
        // 绘制水流粒子
        this.particles.forEach(particle => {
            riverCtx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
            riverCtx.beginPath();
            riverCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            riverCtx.fill();
        });
        
        this.updateParticles();
        
        // 绘制更精致的河岸
        riverCtx.fillStyle = '#5d4037';
        // 上河岸 - 带一点斜度
        riverCtx.beginPath();
        riverCtx.moveTo(0, this.riverY - 6);
        riverCtx.lineTo(riverCanvas.width, this.riverY - 8);
        riverCtx.lineTo(riverCanvas.width, this.riverY);
        riverCtx.lineTo(0, this.riverY);
        riverCtx.closePath();
        riverCtx.fill();
        
        // 下河岸 - 带一点斜度
        riverCtx.beginPath();
        riverCtx.moveTo(0, this.riverY + this.riverHeight);
        riverCtx.lineTo(riverCanvas.width, this.riverY + this.riverHeight);
        riverCtx.lineTo(riverCanvas.width, this.riverY + this.riverHeight + 10);
        riverCtx.lineTo(0, this.riverY + this.riverHeight + 8);
        riverCtx.closePath();
        riverCtx.fill();
        
        // 河岸装饰 - 更自然的草
        riverCtx.fillStyle = '#689f38';
        for (let x = 0; x < riverCanvas.width; x += 15) {
            // 上河岸草 - 不同高度
            const grassHeight = 5 + Math.sin(x * 0.1) * 3;
            riverCtx.fillRect(x, this.riverY - grassHeight - 2, 2, grassHeight);
            
            // 下河岸草
            const bottomGrassHeight = 4 + Math.cos(x * 0.1) * 2;
            riverCtx.fillRect(x + 8, this.riverY + this.riverHeight + 2, 2, bottomGrassHeight);
        }
        
        // 添加一些水面反光点
        riverCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 5; i++) {
            const x = (time * 20 + i * 200) % riverCanvas.width;
            const y = this.riverY + 10 + Math.sin(time + i) * 5;
            riverCtx.beginPath();
            riverCtx.arc(x, y, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2);
            riverCtx.fill();
        }
    }
    
    // 设置速度的方法
    setSpeed(speed) {
        this.currentSpeed = speed;
        // 更新所有粒子的速度
        this.particles.forEach(particle => {
            particle.speed = this.currentSpeed * (0.6 + Math.random() * 0.3);
        });
    }
    
    // 启动动画
    start() {
        this.animate();
    }
    
    // 动画循环
    animate() {
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // 停止动画
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // 调整Canvas大小
    resize(width, height) {
        this.stop();
        riverCanvas.width = width;
        riverCanvas.height = height;
        
        // 重新计算河流位置
        const cellHeight = height / gameState.boardSize.y;
        this.riverY = (gameState.boardSize.y - 1 - 6) * cellHeight;
        this.riverHeight = cellHeight * 2;
        
        // 重新初始化粒子
        this.particles = [];
        this.initParticles();
        
        // 重新启动动画
        this.start();
    }
}

// 创建属性筛选按钮
function createTypeFilterButtons() {
    const typeFilterButtons = document.getElementById('type-filter-buttons');
    typeFilterButtons.innerHTML = '';
    
    // 从typeChart中获取所有属性类型
    const allTypes = Object.keys(typeChart);
    
    // 定义属性类型的显示名称映射
    const typeNameMap = {
        'normal': '一般',
        'fire': '火',
        'water': '水',
        'electric': '电',
        'grass': '草',
        'ice': '冰',
        'fighting': '格斗',
        'poison': '毒',
        'ground': '地面',
        'flying': '飞行',
        'psychic': '超能',
        'bug': '虫',
        'rock': '岩石',
        'ghost': '幽灵',
        'dragon': '龙',
        'dark': '恶',
        'steel': '钢',
        'fairy': '妖精'
    };
    
    // 创建所有属性的筛选按钮
    allTypes.forEach(type => {
        const button = document.createElement('button');
        button.classList.add('type-filter-btn', 'bg-gray-700', 'hover:bg-gray-600', 'text-white', 'px-2', 'py-1', 'rounded-md', 'text-xs', 'transition-colors');
        button.textContent = typeNameMap[type] || type;
        button.dataset.type = type;
        
        button.addEventListener('click', () => {
            button.classList.toggle('bg-primary');
            updateFilteredPokemon();
        });
        
        typeFilterButtons.appendChild(button);
    });
}

// 更新筛选后的宝可梦显示
function updateFilteredPokemon() {
    // 获取所有选中的属性
    const selectedTypes = Array.from(document.querySelectorAll('.type-filter-btn.bg-primary'))
        .map(btn => btn.dataset.type);
    
    // 获取排序方式
    const sortMethod = document.querySelector('#sort-hp, #sort-atk, #sort-move.bg-primary')?.id;
    
    // 筛选宝可梦
    let filteredPokemon = pokemonData;
    
    if (selectedTypes.length > 0) {
        filteredPokemon = pokemonData.filter(pokemon => selectedTypes.includes(pokemon.type));
    }
    
    // 排序宝可梦
    if (sortMethod === 'sort-hp') {
        filteredPokemon.sort((a, b) => b.hp - a.hp);  // 体力从高到低排序
    } else if (sortMethod === 'sort-atk') {
        filteredPokemon.sort((a, b) => b.atk - a.atk);  // 攻击从高到低排序
    } else if (sortMethod === 'sort-move') {
        filteredPokemon.sort((a, b) => b.move - a.move);  // 距离从高到低排序
    }
    
    // 重新渲染筛选后的宝可梦
    pokemonPack.innerHTML = '';
    
    filteredPokemon.forEach(pokemon => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-gray-900', 'rounded-lg', 'overflow-hidden', 'shadow-lg', 'cursor-pointer');
        card.dataset.id = pokemon.id;
        
        card.innerHTML = `
                    <div class="relative">
                        <img src="${pokemon.image}" alt="${pokemon.name}" class="w-full h-32 object-contain bg-gray-800">
                        <div class="absolute top-2 right-2">
                            ${Array.isArray(pokemon.type) ? 
                                `<div class="flex flex-row items-center gap-1">
                                    <img src="type/${pokemon.type[0]}.png" alt="${pokemon.typeName[0]}系" class="type-icon w-5 h-5">
                                    <img src="type/${pokemon.type[1]}.png" alt="${pokemon.typeName[1]}系" class="type-icon w-5 h-5">
                                </div>` : 
                                `<img src="type/${pokemon.type}.png" alt="${pokemon.typeName}系" class="type-icon">`
                            }
                        </div>
                        <div class="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-full select-indicator hidden">
                            已选择
                        </div>
                    </div>
                    <div class="p-3">
                        <h3 class="text-lg font-bold mb-1">${pokemon.name}</h3>
                        <div class="space-y-0.5 text-xs">
                            <div class="flex justify-between">
                                <span class="text-gray-400">体力 (HP):</span>
                                <span class="text-red-400">${pokemon.hp}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">攻击 (ATK):</span>
                                <span class="text-yellow-400">${pokemon.atk}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">距离（MOVE）:</span>
                                <span class="text-green-400">${pokemon.move}</span>
                            </div>
                        </div>
                    </div>
                `;
        
        card.addEventListener('click', () => togglePokemonSelection(pokemon.id));
        
        // 检查宝可梦是否已被选择
        if (gameState.selectedPieces.blue.some(p => p.id === pokemon.id)) {
            const indicator = card.querySelector('.select-indicator');
            indicator.classList.remove('hidden');
            card.classList.add('ring-2', 'ring-primary');
        }
        
        pokemonPack.appendChild(card);
    });
}

// 创建宝可梦棋包
function createPokemonPack() {
    pokemonPack.innerHTML = '';
    
    // 创建属性筛选按钮
    createTypeFilterButtons();
    
    // 添加排序按钮事件监听
    document.getElementById('sort-hp').addEventListener('click', function() {
        this.classList.toggle('bg-primary');
        document.getElementById('sort-atk').classList.remove('bg-primary');
        document.getElementById('sort-move').classList.remove('bg-primary');
        updateFilteredPokemon();
    });
    
    document.getElementById('sort-atk').addEventListener('click', function() {
        this.classList.toggle('bg-primary');
        document.getElementById('sort-hp').classList.remove('bg-primary');
        document.getElementById('sort-move').classList.remove('bg-primary');
        updateFilteredPokemon();
    });
    
    document.getElementById('sort-move').addEventListener('click', function() {
        this.classList.toggle('bg-primary');
        document.getElementById('sort-hp').classList.remove('bg-primary');
        document.getElementById('sort-atk').classList.remove('bg-primary');
        updateFilteredPokemon();
    });
    
    // 添加重置筛选按钮事件监听
    document.getElementById('reset-filter').addEventListener('click', function() {
        document.querySelectorAll('.type-filter-btn.bg-primary').forEach(btn => {
            btn.classList.remove('bg-primary');
        });
        document.getElementById('sort-hp').classList.remove('bg-primary');
        document.getElementById('sort-atk').classList.remove('bg-primary');
        document.getElementById('sort-move').classList.remove('bg-primary');
        updateFilteredPokemon();
    });
    
    // 初始渲染所有宝可梦
    updateFilteredPokemon();
}

// 切换宝可梦选择状态
function togglePokemonSelection(pokemonId) {
    const player = onlineState.isOnline ? onlineState.playerRole : 'blue';
    const selectedPieces = gameState.selectedPieces[player];
    
    const pokemon = pokemonData.find(p => p.id === pokemonId);
    const index = selectedPieces.findIndex(p => p.id === pokemonId);
    
    if (index === -1) {
        if (selectedPieces.length >= 6) {
            addMessage('最多只能选择6个宝可梦！');
            return;
        }
        
        // 添加当前血量属性
        const selectedPokemon = {
            ...pokemon,
            currentHp: pokemon.hp
        };
        
        selectedPieces.push(selectedPokemon);
        
        // 同步到Firebase（联机模式下）
        if (onlineState.isOnline && onlineState.roomId) {
            syncSelectedPieces();
        }
    } else {
        selectedPieces.splice(index, 1);
        
        // 同步到Firebase（联机模式下）
        if (onlineState.isOnline && onlineState.roomId) {
            syncSelectedPieces();
        }
    }
    
    // 更新选择指示器
    updateSelectedIndicators();
    updateConfirmButton();
}

// 同步选择的棋子到Firebase
function syncSelectedPieces() {
    const roomRef = database.ref('rooms/' + onlineState.roomId);
    
    roomRef.update({
        [`selectedPieces_${onlineState.playerRole}`]: gameState.selectedPieces[onlineState.playerRole]
    });
}

// 更新选择指示器
function updateSelectedIndicators() {
    const cards = pokemonPack.querySelectorAll('.card');
    
    // 确定当前玩家
    const currentPlayer = onlineState.isOnline ? onlineState.playerRole : 'blue';
    
    cards.forEach(card => {
        const id = card.dataset.id;
        const indicator = card.querySelector('.select-indicator');
        const isSelected = gameState.selectedPieces[currentPlayer].some(p => p.id === id);
        
        if (isSelected) {
            indicator.classList.remove('hidden');
            card.classList.add('ring-2', 'ring-primary');
        } else {
            indicator.classList.add('hidden');
            card.classList.remove('ring-2', 'ring-primary');
        }
    });
}

// 更新确认按钮状态
function updateConfirmButton() {
    // 确定当前玩家
    const currentPlayer = onlineState.isOnline ? onlineState.playerRole : 'blue';
    const count = gameState.selectedPieces[currentPlayer].length;
    confirmPiecesBtn.textContent = `确认上阵 (${count}/6)`;
    
    if (count === 6) {
        confirmPiecesBtn.removeAttribute('disabled');
    } else {
        confirmPiecesBtn.setAttribute('disabled', 'true');
    }
}

// 放置初始棋子
function placeInitialPieces() {
    gameState.pieces = [];
    
    // 蓝色方棋子
    initialPositions.blue.forEach((pos, index) => {
        if (gameState.selectedPieces.blue[index]) {
            const pokemon = {...gameState.selectedPieces.blue[index]};
            gameState.pieces.push({
                ...pokemon,
                x: pos.x,
                y: pos.y,
                player: 'blue',
                id: `${pokemon.id}-blue-${index}`
            });
        }
    });
    
    // 红色方棋子
    initialPositions.red.forEach((pos, index) => {
        if (gameState.selectedPieces.red[index]) {
            const pokemon = {...gameState.selectedPieces.red[index]};
            gameState.pieces.push({
                ...pokemon,
                x: pos.x,
                y: pos.y,
                player: 'red',
                id: `${pokemon.id}-red-${index}`
            });
        }
    });
    
    renderPieces();
}

// 渲染棋子
function renderPieces() {
    // 先移除所有棋子
    document.querySelectorAll('.piece').forEach(piece => piece.remove());
    
    // 移除所有血量条
    document.querySelectorAll('.vertical-health-container').forEach(healthBar => healthBar.remove());
    
    // 移除所有特效
    if (window.pokemonAbilities && window.pokemonAbilities.kyogre) {
        window.pokemonAbilities.kyogre.removeRainEffects();
    }
    
    // 清空所有格子的角落信息
    document.querySelectorAll('.cell-corner-info').forEach(info => {
        info.innerHTML = '';
    });
    
    // 清除所有高亮
    clearAllHighlights();
    
    // 获取棋盘尺寸和格子大小
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const cellWidth = boardWidth / gameState.boardSize.x;
    const cellHeight = boardHeight / gameState.boardSize.y;
    const pieceSize = Math.min(cellWidth, cellHeight) * 1.1;
    
    // 渲染每个棋子
    gameState.pieces.forEach(piece => {
        // 为盖欧卡添加下雨特效
        if (window.pokemonAbilities && window.pokemonAbilities.kyogre) {
            const rainEffect = window.pokemonAbilities.kyogre.createRainEffect(piece, cellWidth, cellHeight);
            if (rainEffect) {
                gameBoard.appendChild(rainEffect);
            }
        }
        const pieceEl = document.createElement('div');
        pieceEl.classList.add('piece', 'rounded-lg', 'overflow-hidden');
        pieceEl.dataset.id = piece.id;
        pieceEl.dataset.player = piece.player;
        pieceEl.dataset.type = piece.type;
        
        let finalPieceSize = pieceSize;
        
        // 检查是否为恶食大王且已经吞噬过友军
        if (piece.name === '恶食大王' && gameState.devouredPieces.length > 0) {
            // 放大2倍
            finalPieceSize = pieceSize * 1.75;
        }
        
        // 设置位置 - 居中显示在格子内
        const left = piece.x * cellWidth + (cellWidth - finalPieceSize) / 2;
        const top = (gameState.boardSize.y - 1 - piece.y) * cellHeight + (cellHeight - finalPieceSize) / 2;
        
        pieceEl.style.width = `${finalPieceSize}px`;
        pieceEl.style.height = `${finalPieceSize}px`;
        pieceEl.style.left = `${left}px`;
        pieceEl.style.top = `${top}px`;
        
        // 棋子内容 - 只包含精灵图片
        pieceEl.innerHTML = `
            <img src="${piece.image}" alt="${piece.name}" class="w-full h-full object-contain">
        `;

        pieceEl.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCellClick(piece.x, piece.y);
        });

        gameBoard.appendChild(pieceEl);

        // 在格子左侧添加纵向血量条
        const healthContainer = document.createElement('div');
        healthContainer.classList.add('vertical-health-container');
        healthContainer.style.left = `${piece.x * cellWidth}px`;
        healthContainer.style.top = `${(gameState.boardSize.y - 1 - piece.y) * cellHeight}px`;
        healthContainer.style.width = `${cellWidth * 0.10}px`;  // 宽度为格子宽度的12%
        healthContainer.style.height = `${cellHeight}px`;       // 高度等于格子高度

        // 计算血量百分比并确定颜色类
        const healthPercentage = (piece.currentHp / piece.hp) * 100;
        let healthBarClass = 'health-full';
        if (healthPercentage <= 25) {
            healthBarClass = 'health-low';
        } else if (healthPercentage <= 50) {
            healthBarClass = 'health-half';
        }
        
        // 检查是否为恶食大王且已经吞噬过友军
        if (piece.name === '恶食大王' && gameState.devouredPieces.length > 0) {
            healthBarClass = 'health-guzzlord'; // 使用紫色血量条
        }

        healthContainer.innerHTML = `
            <div class="vertical-health-bar-bg">
                <div class="vertical-health-bar ${healthBarClass}" style="height: ${healthPercentage}%"></div>
            </div>
            <div class="vertical-health-value">${piece.currentHp}</div>
        `;

        gameBoard.appendChild(healthContainer);

        // 在格子右上角显示属性图标和攻击力
        const cornerInfo = document.querySelector(`.cell-corner-info[data-x="${piece.x}"][data-y="${piece.y}"]`);
        if (cornerInfo) {
            // 判断是否为双属性棋子
                if (Array.isArray(piece.type)) {
                    // 双属性：两个属性图标水平平行排列，攻击力显示在下方
                    cornerInfo.innerHTML = `
                        <div class="flex flex-col items-center gap-0">
                            <div class="flex flex-row items-center gap-1">
                                <img src="type/${piece.type[0]}.png" alt="${piece.typeName[0]}系" class="type-icon w-5 h-5">
                                <img src="type/${piece.type[1]}.png" alt="${piece.typeName[1]}系" class="type-icon w-5 h-5">
                            </div>
                            <div class="attack-container mt-0 self-end">
                                <div class="attack-circle"></div>
                                <div class="attack-value">${piece.atk}</div>
                            </div>
                        </div>
                    `;
            } else {
                // 单属性：保持原来的显示方式
                cornerInfo.innerHTML = `
                    <div class="flex flex-col items-center gap-1">
                        <img src="type/${piece.type}.png" alt="${piece.typeName}系" class="type-icon w-5 h-5">
                        <div class="attack-container">
                            <div class="attack-circle"></div>
                            <div class="attack-value">${piece.atk}</div>
                        </div>
                    </div>
                `;
            }
        }
    });
    
    // 强制重新高亮选中棋子的攻击范围
    forceHighlightSelectedPiece();
    
    // 确保红蓝色边框始终显示
    updatePieceBorders();
}

// 专门用于更新棋子边框的函数
function updatePieceBorders() {
    // 先清除所有边框
    document.querySelectorAll('.cell-blue, .cell-red').forEach(cell => {
        cell.classList.remove('cell-blue', 'cell-red');
    });
    
    // 为每个棋子所在格子添加对应颜色的边框
    gameState.pieces.forEach(piece => {
        const cell = document.querySelector(`.cell[data-x="${piece.x}"][data-y="${piece.y}"]`);
        if (cell) {
            if (piece.player === 'blue') {
                cell.classList.add('cell-blue');
            } else {
                cell.classList.add('cell-red');
            }
            
            // 如果是选中的棋子，添加选中边框
            if (gameState.selectedPiece && gameState.selectedPiece.id === piece.id) {
                cell.classList.add('cell-selected');
            }
        }
    });
}

// 清除所有高亮
function clearAllHighlights() {
    // 清除所有玩家颜色边框和选中边框
    document.querySelectorAll('.cell-blue, .cell-red, .cell-selected').forEach(cell => {
        cell.classList.remove('cell-blue', 'cell-red', 'cell-selected');
    });
    
    // 清除所有移动、攻击和交换高亮
    document.querySelectorAll('.cell-highlight, .cell-attack, .cell-swap').forEach(cell => {
        cell.classList.remove('cell-highlight', 'cell-attack', 'cell-swap');
    });
    
    // 清除所有数据属性
    document.querySelectorAll('.cell[data-move], .cell[data-attack], .cell[data-swap]').forEach(cell => {
        delete cell.dataset.move;
        delete cell.dataset.attack;
        delete cell.dataset.swap;
        delete cell.dataset.targetId;
    });
}

// 强制高亮选中棋子
function forceHighlightSelectedPiece() {
    // 如果没有选中的棋子，直接返回
    if (!gameState.selectedPiece) return;
    
    // 验证选中的棋子是否仍然存在
    const pieceExists = gameState.pieces.some(p => p.id === gameState.selectedPiece.id);
    if (!pieceExists) {
        gameState.selectedPiece = null;
        return;
    }
    
    // 重新获取最新的棋子数据
    gameState.selectedPiece = gameState.pieces.find(p => p.id === gameState.selectedPiece.id);
    
    // 重新计算可移动位置、可攻击目标和可交换目标
    const {moves, attackable, swappable} = calculateAvailableMovesAndAttacks(gameState.selectedPiece);
    gameState.availableMoves = moves;
    gameState.attackablePieces = attackable;
    gameState.swappablePieces = swappable;
    
    // 高亮可移动位置、可攻击目标和可交换目标
    highlightAvailableMovesAndAttacks();
}

// 处理格子点击
function handleCellClick(x, y) {
    if (!gameState.gameStarted) return;
    
    // AI模式下，如果是AI回合，不允许玩家操作
    if (aiGameState && aiGameState.isAIMode && aiGameState.aiTurn) {
        addMessage('AI回合中，请等待AI行动完成', 'error');
        return;
    }
    
    // 在线模式下，如果不是当前玩家回合，不允许操作
    if (onlineState.isOnline && gameState.currentPlayer !== onlineState.playerRole) {
        addMessage('不是你的回合！', 'error');
        return;
    }
    
    const pieceOnCell = getPieceAtPosition(x, y);
    
    if (gameState.selectedPiece) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (cell.dataset.attack) {
            handleAttack(cell.dataset.targetId);
            return;
        } else if (cell.dataset.swap) {
            handleSwap(cell.dataset.targetId);
            return;
        } else if (cell.dataset.move) {
            const oldX = gameState.selectedPiece.x;
            const oldY = gameState.selectedPiece.y;
            handleMove(x, y, oldX, oldY);
            return;
        }
    }
    
    if (pieceOnCell) {
        if (pieceOnCell.player !== gameState.currentPlayer) {
            addMessage('这不是你的棋子！', 'error');
            return;
        }
        
        if (gameState.selectedPiece && gameState.selectedPiece.id === pieceOnCell.id) {
            deselectPiece();
            return;
        }
        
        selectPiece(pieceOnCell);
    } else {
        if (gameState.selectedPiece) {
            deselectPiece();
        } else {
            addMessage('请先选择一个棋子', 'info');
        }
    }
}

// 选中棋子
function selectPiece(piece) {
    deselectPiece();
    
    gameState.selectedPiece = piece;
    
    // 强制计算并高亮
    forceHighlightSelectedPiece();
    
    // 确保边框正确显示
    updatePieceBorders();
    
    // 为超能系棋子添加特殊提示
    if (piece.type === 'psychic') {
        addMessage(`已选择超能系 ${piece.name}，可移动、攻击或与范围内友方交换位置`);
    } else {
        addMessage(`已选择 ${piece.name}，请选择移动位置或攻击目标`);
    }
}

// 取消选中棋子
function deselectPiece() {
    if (!gameState.selectedPiece) return;
    
    clearAllHighlights();
    
    gameState.selectedPiece = null;
    gameState.availableMoves = [];
    gameState.attackablePieces = [];
    gameState.swappablePieces = []; // 清空可交换列表
    
    // 确保边框正确显示
    updatePieceBorders();
}

// 计算可移动位置、可攻击的棋子和可交换的友方棋子
function calculateAvailableMovesAndAttacks(piece) {
    const moves = [];
    const attackable = [];
    const swappable = []; // 可交换的友方棋子
    const devourable = []; // 可吞噬的友方棋子（恶食大王专用）
    const maxDistance = piece.move;
    
    // 处理双属性精灵
    const pieceTypes = Array.isArray(piece.type) ? piece.type : [piece.type];
    
    let directions = [];
    
    // 检查是否为电系（支持双属性）
    if (pieceTypes.includes('electric')) {
        directions = [
            {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1},
            {dx: 1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: 1}, {dx: -1, dy: -1}
        ];
    } else {
        directions = [
            {dx: 1, dy: 0}, {dx: -1, dy: 0}, {dx: 0, dy: 1}, {dx: 0, dy: -1}
        ];
    }
    
    directions.forEach(({dx, dy}) => {
        for (let distance = 1; distance <= maxDistance; distance++) {
            const newX = piece.x + dx * distance;
            const newY = piece.y + dy * distance;
            
            if (newX < 0 || newX >= gameState.boardSize.x || newY < 0 || newY >= gameState.boardSize.y) {
                break;
            }
            
            if (isInRiver(newY) && !canMoveInRiver(piece, dx, dy)) {
                break;
            }
            
            const blockingPiece = getPieceAtPosition(newX, newY);
            
            if (blockingPiece) {
                // 如果是敌方棋子，可以攻击
                if (blockingPiece.player !== piece.player) {
                    attackable.push(blockingPiece);
                } 
                // 如果是友方棋子，且当前是超能系，则可以交换
                else if (blockingPiece.player === piece.player && pieceTypes.includes('psychic')) {
                    swappable.push(blockingPiece);
                }
                // 如果是友方棋子，且当前是恶食大王，则可以吞噬
                else if (blockingPiece.player === piece.player && pokemonAbilities.guzzlord.isGuzzlord(piece)) {
                    devourable.push(blockingPiece);
                }
                
                // 飞行系可以飞跃面前的第一个非飞行系棋子
                if (pieceTypes.includes('flying') && distance === 1) {
                    const jumpX = piece.x + dx * (distance + 1);
                    const jumpY = piece.y + dy * (distance + 1);
                    
                    if (jumpX >= 0 && jumpX < gameState.boardSize.x && jumpY >= 0 && jumpY < gameState.boardSize.y) {
                        const jumpPositionPiece = getPieceAtPosition(jumpX, jumpY);
                        // 跳跃位置必须为空
                        if (!jumpPositionPiece) {
                            moves.push({x: jumpX, y: jumpY});
                        }
                    }
                }
                
                break;
            } else {
                moves.push({x: newX, y: newY});
            }
        }
    });
    
    // 将可吞噬的友方棋子添加到可攻击列表中，以便显示紫色光效
    if (pokemonAbilities.guzzlord.isGuzzlord(piece)) {
        gameState.devourablePieces = devourable;
        attackable.push(...devourable);
    }
    
    return {moves, attackable, swappable};
}

// 检查是否在河流行
function isInRiver(y) {
    return y === 5 || y === 6;
}

// 检查是否可以在河流行移动
function canMoveInRiver(piece, dx, dy) {
    // 处理双属性精灵
    const pieceTypes = Array.isArray(piece.type) ? piece.type : [piece.type];
    
    if (pieceTypes.includes('water')) {
        return true;
    }
    
    return dx === 0 && dy !== 0;
}

// 获取指定位置的棋子
function getPieceAtPosition(x, y) {
    return gameState.pieces.find(piece => piece.x === x && piece.y === y);
}

// 高亮显示可移动位置、可攻击的棋子和可交换的友方棋子
function highlightAvailableMovesAndAttacks() {
    // 先清除已有的高亮
    document.querySelectorAll('.cell[data-move="true"], .cell[data-attack="true"], .cell[data-swap="true"]').forEach(cell => {
        cell.classList.remove('cell-highlight', 'cell-attack', 'cell-swap');
        delete cell.dataset.move;
        delete cell.dataset.attack;
        delete cell.dataset.swap;
        delete cell.dataset.targetId;
    });
    
    // 高亮可移动位置（绿色呼吸光效）
    gameState.availableMoves.forEach(move => {
        const cell = document.querySelector(`.cell[data-x="${move.x}"][data-y="${move.y}"]`);
        if (cell) {
            cell.classList.add('cell-highlight');
            cell.dataset.move = 'true';
        }
    });
    
    // 高亮可攻击的棋子（红色呼吸光效）
    gameState.attackablePieces.forEach(target => {
        const cell = document.querySelector(`.cell[data-x="${target.x}"][data-y="${target.y}"]`);
        if (cell) {
            cell.classList.add('cell-attack');
            cell.dataset.attack = 'true';
            cell.dataset.targetId = target.id;
        }
    });
    
    // 高亮可交换的友方棋子（紫色呼吸光效）
    gameState.swappablePieces.forEach(target => {
        const cell = document.querySelector(`.cell[data-x="${target.x}"][data-y="${target.y}"]`);
        if (cell) {
            cell.classList.add('cell-swap');
            cell.dataset.swap = 'true';
            cell.dataset.targetId = target.id;
        }
    });
}

// 检查免疫关系
function checkImmunity(attacker, target) {
    const attackerTypeData = typeChart[attacker.type];
    return attackerTypeData && attackerTypeData.immune && attackerTypeData.immune.includes(target.type);
}

// 检查是否效果拔群
function isSuperEffective(attacker, target) {
    const attackerTypeData = typeChart[attacker.type];
    return attackerTypeData && attackerTypeData.strong && attackerTypeData.strong.includes(target.type);
}

// 检查是否效果不好
function isNotEffective(attacker, target) {
    const attackerTypeData = typeChart[attacker.type];
    return attackerTypeData && attackerTypeData.weak && attackerTypeData.weak.includes(target.type);
}

// 处理移动
function handleMove(newX, newY, oldX, oldY) {
    if (!gameState.selectedPiece) return;
    
    const targetPiece = getPieceAtPosition(newX, newY);
    if (targetPiece) {
        addMessage('目标位置已有棋子，无法移动！', 'error');
        return;
    }
    
    // 更新棋子位置
    gameState.selectedPiece.x = newX;
    gameState.selectedPiece.y = newY;
    
    // 重新渲染并保持高亮
    renderPieces();
    
    addMessage(`${gameState.selectedPiece.name} 从 (${oldX},${oldY}) 移动到 (${newX},${newY})`);
    
    // 减少移动次数
    gameState.movesRemaining--;
    updateMoveCounter();
    
    // 同步到Firebase
    syncGameState();
    
    // 检查是否需要切换回合
    if (gameState.movesRemaining <= 0) {
        switchTurn();
    } else {
        // 仍然有移动次数，保持选中状态
        selectPiece(gameState.selectedPiece);
    }
    
    // 确保移动后边框正确显示
    updatePieceBorders();
}

// 处理位置交换
function handleSwap(targetId) {
    if (!gameState.selectedPiece || gameState.selectedPiece.type !== 'psychic') return;
    
    const swapper = gameState.selectedPiece;
    const target = gameState.pieces.find(p => p.id === targetId);
    
    if (!target || target.player !== swapper.player) return;
    
    // 保存原始位置
    const swapperOldX = swapper.x;
    const swapperOldY = swapper.y;
    const targetOldX = target.x;
    const targetOldY = target.y;
    
    // 交换位置
    swapper.x = targetOldX;
    swapper.y = targetOldY;
    target.x = swapperOldX;
    target.y = swapperOldY;
    
    // 交换动画
    const swapperEl = document.querySelector(`.piece[data-id="${swapper.id}"]`);
    const targetEl = document.querySelector(`.piece[data-id="${target.id}"]`);
    
    if (swapperEl) swapperEl.classList.add('swapping');
    if (targetEl) targetEl.classList.add('swapping');
    
    // 显示交换提示
    showSwapPopup((swapperOldX + targetOldX) / 2, (swapperOldY + targetOldY) / 2);
    
    setTimeout(() => {
        if (swapperEl) swapperEl.classList.remove('swapping');
        if (targetEl) targetEl.classList.remove('swapping');
        
        // 重新渲染
        renderPieces();
        
        addMessage(`${swapper.name} 与 ${target.name} 交换了位置`);
        
        // 减少移动次数
        gameState.movesRemaining--;
        updateMoveCounter();
        
        // 同步到Firebase
        syncGameState();
        
        // 检查是否需要切换回合
        if (gameState.movesRemaining <= 0) {
            switchTurn();
        } else {
            // 仍然有移动次数，保持选中状态
            selectPiece(swapper);
        }
        
        // 确保交换后边框正确显示
        updatePieceBorders();
    }, 800);
}

// 处理攻击
function handleAttack(targetId) {
    if (!gameState.selectedPiece) return;
    
    const attacker = gameState.selectedPiece;
    const target = gameState.pieces.find(p => p.id === targetId);
    
    if (!target) return;
    
    // 检查是否为恶食大王的吞噬友军攻击
    if (pokemonAbilities.guzzlord.isGuzzlord(attacker) && target.player === attacker.player) {
        // 如果已经吞噬过友军，完全阻止攻击
        if (gameState.devouredPieces.length > 0) {
            addMessage(`${attacker.name} 已经吞噬过友军，无法再次攻击友军！`);
            return;
        }
        
        // 处理吞噬友军攻击
        if (pokemonAbilities.guzzlord.handleDevourAttack(attacker, targetId)) {
            return; // 吞噬攻击已处理，直接返回
        }
    }
    
    const isImmune = checkImmunity(attacker, target);
    const isSuper = !isImmune && isSuperEffective(attacker, target);
    const isNot = !isImmune && !isSuper && isNotEffective(attacker, target);
    
    // 计算攻击方向
    const dx = target.x > attacker.x ? 1 : (target.x < attacker.x ? -1 : 0);
    const dy = target.y > attacker.y ? 1 : (target.y < attacker.y ? -1 : 0);
    
    // 移动到目标相邻的位置
    const adjacentX = attacker.x + dx;
    const adjacentY = attacker.y + dy;
    
    const isAdjacentValid = adjacentX >= 0 && adjacentX < gameState.boardSize.x && 
                          adjacentY >= 0 && adjacentY < gameState.boardSize.y &&
                          !(adjacentX === target.x && adjacentY === target.y);
    
    const adjacentHasPiece = getPieceAtPosition(adjacentX, adjacentY);
    
    // 记录原始位置
    const oldX = attacker.x;
    const oldY = attacker.y;
    
    // 移动攻击者
    if (isAdjacentValid && !adjacentHasPiece) {
        attacker.x = adjacentX;
        attacker.y = adjacentY;
    } else {
        addMessage(`${attacker.name} 在原地对 ${target.name} 发起攻击！`);
    }
    
    // 攻击动画
    const attackerEl = document.querySelector(`.piece[data-id="${attacker.id}"]`);
    if (attackerEl) {
        attackerEl.classList.add('attacking');
    }
    
    // 计算伤害
    const damage = isImmune ? 0 : calculateDamage(attacker, target);
    
    // 显示伤害数字
    showDamagePopup(target.x, target.y, damage, isImmune);
    
    // 应用伤害
    if (!isImmune) {
        target.currentHp -= damage;
    }
    
    setTimeout(() => {
        if (attackerEl) {
            attackerEl.classList.remove('attacking');
        }
        
        // 显示攻击结果消息
        let effectText = '';
        if (isImmune) {
            effectText = `效果免疫！`;
        } else if (isSuper) {
            effectText = `效果拔群！`;
        } else if (isNot) {
            effectText = `效果不好...`;
        }
        
        if (isImmune) {
            addMessage(`${target.name} 对 ${attacker.name} 的攻击${effectText} 没有造成任何伤害！`);
        } else {
            addMessage(`${attacker.name} 攻击了 ${target.name}，${effectText} 造成了 ${damage} 点伤害！`);
            
            // 检查目标是否被击败
            if (target.currentHp <= 0) {
                gameState.pieces = gameState.pieces.filter(p => p.id !== target.id);
                attacker.x = target.x;
                attacker.y = target.y;
                addMessage(`${target.name} 被击败了！${attacker.name} 占据了其位置`);
                checkGameEnd();
            }
        }
        
        // 重新渲染并保持高亮
        renderPieces();
        
        // 减少移动次数
        gameState.movesRemaining--;
        updateMoveCounter();
        
        // 同步到Firebase
        syncGameState();
        
        // 检查是否需要切换回合
        if (gameState.movesRemaining <= 0) {
            switchTurn();
        } else {
            // 仍然有移动次数，保持选中状态
            selectPiece(attacker);
        }
        
        // 确保攻击后边框正确显示
        updatePieceBorders();
    }, 500);
}

// 显示伤害数字弹窗
function showDamagePopup(x, y, damage, isImmune = false) {
    const popup = document.createElement('div');
    popup.classList.add('damage-popup');
    
    if (isImmune) {
        popup.textContent = '免疫';
    } else {
        popup.textContent = damage;
    }
    
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const cellWidth = boardWidth / gameState.boardSize.x;
    const cellHeight = boardHeight / gameState.boardSize.y;
    
    const left = x * cellWidth + cellWidth / 2;
    const top = (gameState.boardSize.y - 1 - y) * cellHeight + cellHeight / 4;
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.transform = 'translate(-50%, 0)';
    
    gameBoard.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// 显示交换提示弹窗
function showSwapPopup(x, y) {
    const popup = document.createElement('div');
    popup.classList.add('swap-popup');
    popup.textContent = '交换';
    
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const cellWidth = boardWidth / gameState.boardSize.x;
    const cellHeight = boardHeight / gameState.boardSize.y;
    
    const left = x * cellWidth + cellWidth / 2;
    const top = (gameState.boardSize.y - 1 - y) * cellHeight + cellHeight / 4;
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.transform = 'translate(-50%, 0)';
    
    gameBoard.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

// 计算伤害 - 双属性伤害最大化版本
function calculateDamage(attacker, target) {
    let baseDamage = attacker.atk;
    
    // 处理攻击方和目标方的双属性
    const attackerTypes = Array.isArray(attacker.type) ? attacker.type : [attacker.type];
    const targetTypes = Array.isArray(target.type) ? target.type : [target.type];
    
    let maxDamage = -Infinity; // 记录最大伤害
    
    // 检查免疫关系：如果任一攻击属性被任一目标属性免疫，该属性攻击无效
    for (const attackerType of attackerTypes) {
        const attackerTypeData = typeChart[attackerType];
        if (attackerTypeData && attackerTypeData.immune) {
            for (const targetType of targetTypes) {
                if (attackerTypeData.immune.includes(targetType)) {
                    // 该攻击属性被免疫，跳过这个属性的计算
                    continue;
                }
            }
        }
    }
    
    // 分别计算攻击方每个属性的伤害，取最大值
    for (const attackerType of attackerTypes) {
        const attackerTypeData = typeChart[attackerType];
        if (!attackerTypeData) continue;
        
        // 检查该攻击属性是否被目标任一属性免疫
        let isImmune = false;
        for (const targetType of targetTypes) {
            if (attackerTypeData.immune && attackerTypeData.immune.includes(targetType)) {
                isImmune = true;
                break;
            }
        }
        if (isImmune) continue; // 该属性攻击被免疫，跳过
        
        let typeModifier = 0;
        
        // 计算该攻击属性对目标所有属性的总修正
        for (const targetType of targetTypes) {
            // 检查克制关系（+1）
            if (attackerTypeData.strong && attackerTypeData.strong.includes(targetType)) {
                typeModifier += 1;
            }
            // 检查抵抗关系（-1）
            if (attackerTypeData.weak && attackerTypeData.weak.includes(targetType)) {
                typeModifier -= 1;
            }
        }
        
        // 计算该属性造成的伤害
        const damageForThisType = baseDamage + typeModifier;
        
        // 取最大值
        if (damageForThisType > maxDamage) {
            maxDamage = damageForThisType;
        }
    }
    
    // 如果所有属性都被免疫，返回0伤害
    if (maxDamage === -Infinity) {
        return 0;
    }
    
    // 确保伤害不为负数，但最低伤害为0.5（除非免疫）
    if (maxDamage <= 0) {
        return 0.5;
    }
    
    return maxDamage;
}

// 更新移动计数器
function updateMoveCounter() {
    movesRemainingEl.textContent = gameState.movesRemaining;
}

// 切换回合 - 修改为通过消息区域播报
function switchTurn() {
    gameState.currentPlayer = gameState.currentPlayer === 'blue' ? 'red' : 'blue';
    
    gameState.movesRemaining = 2;
    updateMoveCounter();
    
    // 清除选择状态
    deselectPiece();
    
    // 修改：通过消息区域播报回合信息，而不是浮窗显示
    addMessage(`<span class="${gameState.currentPlayer === 'blue' ? 'text-primary' : 'text-secondary'} font-bold">${gameState.currentPlayer === 'blue' ? '蓝色' : '红色'}方回合开始</span>`);
    
    // 同步到Firebase
    syncGameState();
    
    // 确保回合切换后边框正确显示
    updatePieceBorders();
}

// 检查游戏是否结束
function checkGameEnd() {
    const blueHasPieces = gameState.pieces.some(p => p.player === 'blue');
    const redHasPieces = gameState.pieces.some(p => p.player === 'red');
    
    if (!blueHasPieces) {
        addMessage('红色方获胜！游戏结束');
        gameState.gameStarted = false;
        
        // 同步游戏结束状态
        if (onlineState.isOnline) {
            const roomRef = database.ref('rooms/' + onlineState.roomId);
            roomRef.update({
                gameOver: true,
                winner: 'red'
            });
        }
    } else if (!redHasPieces) {
        addMessage('蓝色方获胜！游戏结束');
        gameState.gameStarted = false;
        
        // 同步游戏结束状态
        if (onlineState.isOnline) {
            const roomRef = database.ref('rooms/' + onlineState.roomId);
            roomRef.update({
                gameOver: true,
                winner: 'blue'
            });
        }
    }
}

// 添加消息 - 支持HTML内容以显示彩色文本
function addMessage(text) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('bg-gray-800/50', 'border-l-4', 'border-primary', 'p-3', 'rounded', 'text-sm');
    
    // 移除时间戳，只保留消息内容
    messageEl.innerHTML = `<span>${text}</span>`;
    
    messageArea.appendChild(messageEl);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// 开始游戏
function startGame() {
    if (gameState.selectedPieces.blue.length !== 6) {
        addMessage('请先从棋包中选择6个宝可梦！');
        openPackBtn.click();
        return;
    }
    
    gameState.gameStarted = true;
    gameState.currentPlayer = 'blue';
    gameState.movesRemaining = 2;
    
    placeInitialPieces();
    
    updateMoveCounter();
    
    // 修改：通过消息区域播报游戏开始信息
    addMessage('游戏开始！<span class="text-primary font-bold">蓝色方先行</span>');
    
    // 同步游戏状态
    if (onlineState.isOnline) {
        syncGameState();
    }
    
    // 确保游戏开始时边框正确显示
    updatePieceBorders();
}

// 重置游戏
function resetGame() {
  if (onlineState.isOnline && onlineState.roomId) {
    // 联机模式下发起投票
    if (!onlineState.resetVote.requested) {
      const roomRef = database.ref('rooms/' + onlineState.roomId);
      roomRef.update({
        resetVote: {
          requestedBy: onlineState.playerId,
          blueVoted: false,
          redVoted: false,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        }
      });
      
      onlineState.resetVote.requested = true;
      onlineState.resetVote.voted = true;
      
      addMessage('<span class="text-yellow-300">已发起重置游戏投票，等待对方同意...</span>');
      return;
    } else if (!onlineState.resetVote.voted) {
      // 玩家投票同意重置
      const roomRef = database.ref('rooms/' + onlineState.roomId + '/resetVote');
      const voteKey = onlineState.playerRole === 'blue' ? 'blueVoted' : 'redVoted';
      roomRef.update({
        [voteKey]: true
      });
      
      onlineState.resetVote.voted = true;
      addMessage('<span class="text-green-300">已同意重置游戏</span>');
      return;
    }
  }
  
  // 清理定时器
  if (borderUpdateInterval) {
      clearInterval(borderUpdateInterval);
      borderUpdateInterval = null;
  }
  
  // 实际重置游戏逻辑
  gameState.gameStarted = false;
  gameState.currentPlayer = 'blue';
  gameState.movesRemaining = 2;
  gameState.selectedPiece = null;
  gameState.availableMoves = [];
  gameState.attackablePieces = [];
  gameState.swappablePieces = []; // 清空可交换列表
  gameState.pieces = [];
  gameState.devouredPieces = []; // 新增：清空已吞噬的棋子记录
  
  document.querySelectorAll('.piece').forEach(piece => piece.remove());
  
  // 移除所有血量条
  document.querySelectorAll('.vertical-health-container').forEach(healthBar => healthBar.remove());
  
  clearAllHighlights();
  
  // 清空所有格子的角落信息
  document.querySelectorAll('.cell-corner-info').forEach(info => {
    info.innerHTML = '';
  });
  
  updateMoveCounter();
  
  // 重置投票状态
  if (onlineState.isOnline) {
    onlineState.resetVote.requested = false;
    onlineState.resetVote.voted = false;
    onlineState.resetVote.opponentVoted = false;
  }
  
  // 恢复联机按钮（如果处于AI模式）
  if (aiGameState && aiGameState.isAIMode) {
    document.getElementById('online-btn').style.display = 'block';
    aiGameState.isAIMode = false;
    aiGameState.currentLevel = null;
    aiGameState.aiTurn = false;
  }
  
  addMessage('游戏已重置，请点击开始游戏');
}

// 实际执行重置的函数
function performActualReset() {
  // 清理定时器
  if (borderUpdateInterval) {
      clearInterval(borderUpdateInterval);
      borderUpdateInterval = null;
  }
  
  gameState.gameStarted = false;
  gameState.currentPlayer = 'blue';
  gameState.movesRemaining = 2;
  gameState.selectedPiece = null;
  gameState.availableMoves = [];
  gameState.attackablePieces = [];
  gameState.swappablePieces = [];
  gameState.pieces = [];
  gameState.devouredPieces = []; // 新增：清空已吞噬的棋子记录
  
  document.querySelectorAll('.piece').forEach(piece => piece.remove());
  
  // 移除所有血量条
  document.querySelectorAll('.vertical-health-container').forEach(healthBar => healthBar.remove());
  
  clearAllHighlights();
  
  document.querySelectorAll('.cell-corner-info').forEach(info => {
    info.innerHTML = '';
  });
  
  updateMoveCounter();
  
  onlineState.resetVote.requested = false;
  onlineState.resetVote.voted = false;
  onlineState.resetVote.opponentVoted = false;
  
  // 恢复联机按钮（如果处于AI模式）
  if (aiGameState && aiGameState.isAIMode) {
    document.getElementById('online-btn').style.display = 'block';
    aiGameState.isAIMode = false;
    aiGameState.currentLevel = null;
    aiGameState.aiTurn = false;
  }
  
  addMessage('<span class="text-green-300">投票通过！游戏已重置</span>');
}

// 设置事件监听器
function setupEventListeners() {
    openPackBtn.addEventListener('click', () => {
        packModal.classList.remove('hidden');
    });
    
    closePackBtn.addEventListener('click', () => {
        packModal.classList.add('hidden');
    });
    
    confirmPiecesBtn.addEventListener('click', () => {
        packModal.classList.add('hidden');
        addMessage('已选择6个宝可梦，可以开始游戏了');
        
        // 根据游戏模式选择不同的开始方式
        if (aiGameState && aiGameState.isAIMode) {
            // AI模式下，重新调用startAIChallenge来开始游戏
            startAIChallenge(aiGameState.currentLevel);
        } else if (onlineState.isOnline) {
            // 联机模式下，同步选择的棋子
            syncSelectedPieces();
            // 联机游戏会在双方都准备后自动开始
        } else {
            // 单机模式下，直接开始游戏
            startGame();
        }
    });
   
    resetGameBtn.addEventListener('click', resetGame);
    
    rulesBtn.addEventListener('click', () => {
        rulesModal.classList.remove('hidden');
    });
    
    closeRulesBtn.addEventListener('click', () => {
        rulesModal.classList.add('hidden');
    });
    
    // 发送消息函数
    function sendUserMessage() {
        const messageText = messageInput.value.trim();
        if (!messageText) return;
        
        if (onlineState.isOnline && onlineState.roomId) {
            // 联机模式下通过Firebase发送消息
            const roomRef = database.ref('rooms/' + onlineState.roomId + '/chat');
            const messageId = Date.now();
            
            roomRef.update({
                [messageId]: {
                    sender: onlineState.playerId,
                    message: messageText,
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }
            });
        } else {
            // 单机模式下直接在本地显示
            addMessage(`<span class="text-blue-300">你: ${messageText}</span>`);
        }
        
        messageInput.value = '';
    }
    
    // 按钮点击发送
    sendMessageBtn.addEventListener('click', sendUserMessage);
    
    // 回车键发送
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    // 窗口大小变化时重新绘制
window.addEventListener('resize', () => {
    const wasSelected = !!gameState.selectedPiece;
    const selectedPieceId = gameState.selectedPiece?.id;
    
    createBoard();
    if (gameState.gameStarted) {
        renderPieces();
        
        // 恢复选中状态
        if (wasSelected && selectedPieceId) {
            const piece = gameState.pieces.find(p => p.id === selectedPieceId);
            if (piece) {
                selectPiece(piece);
            }
        }
        
        // 确保窗口大小变化后边框正确显示
        updatePieceBorders();
    }
    
    // 如果河流实例存在，更新其大小
    if (flowingRiver && riverCanvas) {
        flowingRiver.resize(riverCanvas.width, riverCanvas.height);
    }
});
    
    // 增加定时检查，确保高亮状态 - 修改为可清理的定时器
    if (borderUpdateInterval) {
        clearInterval(borderUpdateInterval);
    }
    
    borderUpdateInterval = setInterval(() => {
        if (gameState.gameStarted) {
            // 定期更新边框，确保不会消失
            updatePieceBorders();
            
            if (gameState.selectedPiece) {
                forceHighlightSelectedPiece();
            }
        }
    }, 1000);
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', init);
