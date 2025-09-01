// AI对战状态
const aiGameState = {
    isAIMode: false,
    currentLevel: null,
    aiTurn: false,
    aiPieces: []
};

// 初始化AI对战
function initAIGame() {
    // 创建闯关挑战按钮
    const aiButton = document.createElement('button');
    aiButton.id = 'ai-challenge-btn';
    aiButton.className = 'bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-300';
    aiButton.innerHTML = '<i class="fa fa-trophy mr-2"></i> 闯关挑战';
    
    // 添加到导航栏
    const header = document.querySelector('header');
    const buttonsContainer = header.querySelector('.flex.items-center.space-x-4');
    buttonsContainer.insertBefore(aiButton, buttonsContainer.firstChild);
    
    // 添加事件监听
    aiButton.addEventListener('click', openAIChallengeModal);
}

// 打开AI挑战模态窗口
function openAIChallengeModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-challenge-modal';
    modal.className = 'fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm';
    
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div class="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 class="text-2xl font-bold">闯关挑战</h2>
                <button id="close-ai-modal" class="text-gray-400 hover:text-white text-2xl transition-colors">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-grow">
                <h3 class="text-xl font-semibold mb-4 text-primary">选择关卡</h3>
                <div id="ai-levels" class="space-y-4">
                    ${aiLevels.map(level => `
                        <div class="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors" data-level="${level.level}">
                            <h4 class="text-lg font-semibold">${level.name}</h4>
                            <p class="text-gray-300">难度: ${level.difficulty}</p>
                            <p class="text-sm text-gray-400">AI棋子: ${level.aiPieces.length}个</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加事件监听
    document.getElementById('close-ai-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // 关卡选择事件
    document.querySelectorAll('#ai-levels > div').forEach(levelEl => {
        levelEl.addEventListener('click', () => {
            const level = parseInt(levelEl.dataset.level);
            startAIChallenge(level);
            modal.remove();
        });
    });
}

// 开始AI挑战
function startAIChallenge(level) {
    const levelConfig = aiLevels.find(l => l.level === level);
    if (!levelConfig) return;
    
    aiGameState.isAIMode = true;
    aiGameState.currentLevel = level;
    aiGameState.aiTurn = false;
    
    // 使用专门的重置函数而不是resetGame()
    resetGameForAI();
    
    // 设置AI棋子
    aiGameState.aiPieces = levelConfig.aiPieces.map((pokemon, index) => ({
        ...pokemon,
        currentHp: pokemon.hp,
        x: levelConfig.initialPositions[index].x,
        y: levelConfig.initialPositions[index].y,
        player: 'red',
        id: `${pokemon.id}-ai-${index}`
    }));
    
    // 设置玩家棋子（使用玩家已选择的棋子）
    const playerPieces = initialPositions.blue.map((pos, index) => {
        if (gameState.selectedPieces.blue[index]) {
            const pokemon = {...gameState.selectedPieces.blue[index]};
            return {
                ...pokemon,
                currentHp: pokemon.hp,
                x: pos.x,
                y: pos.y,
                player: 'blue',
                id: `${pokemon.id}-blue-${index}`
            };
        }
        return null;
    }).filter(Boolean);
    
    // 添加到游戏状态
    gameState.pieces = [...aiGameState.aiPieces, ...playerPieces];
    
    // 设置玩家为蓝色方
    gameState.currentPlayer = 'blue';
    gameState.movesRemaining = 2;
    gameState.gameStarted = true;
    
    // 隐藏联机按钮，显示AI模式提示
    document.getElementById('online-btn').style.display = 'none';
    
    addMessage(`开始${levelConfig.name}！你是蓝色方，对战AI控制的红色方`);
    addMessage(`AI拥有 ${levelConfig.aiPieces.length} 个宝可梦棋子`);
    
    renderPieces();
    updateMoveCounter();
}

// AI回合逻辑
function aiTurn() {
    if (!aiGameState.isAIMode || !aiGameState.aiTurn) return;
    
    addMessage('AI正在思考...');
    
    // 记录已执行的行动次数
    let actionsTaken = 0;
    
    const executeAIAction = () => {
        if (actionsTaken >= 2) {
            // 已经执行了两次行动，结束回合
            switchTurn();
            aiGameState.aiTurn = false;
            return;
        }
        
        // AI决策：优先攻击，其次移动
        let actionTaken = false;
        
        // 1. 检查是否有可攻击的目标
        for (const aiPiece of aiGameState.aiPieces) {
            if (aiPiece.currentHp <= 0) continue;
            
            const { attackable } = calculateAvailableMovesAndAttacks(aiPiece);
            if (attackable.length > 0) {
                // 选择伤害最大的目标
                const bestTarget = attackable.reduce((best, target) => {
                    const damage = calculateDamage(aiPiece, target);
                    return damage > calculateDamage(aiPiece, best) ? target : best;
                }, attackable[0]);
                
                // 执行攻击 - 使用专门的AI攻击函数
                executeAIAttack(aiPiece, bestTarget);
                actionTaken = true;
                break;
            }
        }
        
        // 2. 如果没有可攻击的目标，尝试移动
        if (!actionTaken) {
            for (const aiPiece of aiGameState.aiPieces) {
                if (aiPiece.currentHp <= 0) continue;
                
                const { moves } = calculateAvailableMovesAndAttacks(aiPiece);
                if (moves.length > 0) {
                    // 选择离玩家最近的移动位置
                    const playerPieces = gameState.pieces.filter(p => p.player === 'blue');
                    if (playerPieces.length > 0) {
                        const closestMove = moves.reduce((best, move) => {
                            const bestDist = Math.abs(best.x - playerPieces[0].x) + Math.abs(best.y - playerPieces[0].y);
                            const moveDist = Math.abs(move.x - playerPieces[0].x) + Math.abs(move.y - playerPieces[0].y);
                            return moveDist < bestDist ? move : best;
                        }, moves[0]);
                        
                        // 执行移动 - 使用专门的AI移动函数
                        executeAIMove(aiPiece, closestMove);
                        actionTaken = true;
                        break;
                    }
                }
            }
        }
        
        // 3. 如果没有任何行动，结束回合
        if (!actionTaken) {
            addMessage('AI没有可执行的行动，结束回合');
            switchTurn();
            aiGameState.aiTurn = false;
            return;
        }
        
        // 等待行动完成后增加计数并执行下一次行动
        setTimeout(() => {
            actionsTaken++;
            executeAIAction();
        }, 1500);
    };
    
    // 开始执行第一次行动
    setTimeout(executeAIAction, 1000);
}

// 专门的AI攻击函数
function executeAIAttack(attacker, target) {
    selectPiece(attacker);
    
    // 计算伤害
    const damage = calculateDamage(attacker, target);
    
    // 应用伤害
    target.currentHp -= damage;
    
    addMessage(`AI的 ${attacker.name} 攻击了 ${target.name}，造成了 ${damage} 点伤害！`);
    
    // 检查目标是否被击败
    if (target.currentHp <= 0) {
        gameState.pieces = gameState.pieces.filter(p => p.id !== target.id);
        addMessage(`${target.name} 被击败了！`);
        checkGameEnd();
    }
    
    // 重新渲染
    renderPieces();
}

// 专门的AI移动函数
function executeAIMove(piece, move) {
    const oldX = piece.x;
    const oldY = piece.y;
    
    // 更新棋子位置
    piece.x = move.x;
    piece.y = move.y;
    
    // 重新渲染
    renderPieces();
    
    addMessage(`AI的 ${piece.name} 从 (${oldX},${oldY}) 移动到 (${move.x},${move.y})`);
}
// 重写回合切换函数以支持AI
const originalSwitchTurn = switchTurn;
switchTurn = function() {
    originalSwitchTurn();
    
    // 只有在AI模式下且当前玩家是红色方时才触发AI回合
    // 并且确保不是游戏刚开始时的第一次回合切换
    if (aiGameState.isAIMode && gameState.currentPlayer === 'red' && gameState.gameStarted) {
        // 添加额外检查，确保不是连续触发
        if (!aiGameState.aiTurn) {
            aiGameState.aiTurn = true;
            setTimeout(aiTurn, 1000);
        }
    }
};

// 重写游戏结束检查
const originalCheckGameEnd = checkGameEnd;
checkGameEnd = function() {
    originalCheckGameEnd();
    
    if (aiGameState.isAIMode && !gameState.gameStarted) {
        // 游戏结束，重置AI状态
        aiGameState.isAIMode = false;
        aiGameState.currentLevel = null;
        aiGameState.aiTurn = false;
        
        // 显示联机按钮
        document.getElementById('online-btn').style.display = 'block';
    }
};

// 添加专门用于AI模式的重置函数
function resetGameForAI() {
    gameState.gameStarted = false;
    gameState.currentPlayer = 'blue';
    gameState.movesRemaining = 2;
    gameState.selectedPiece = null;
    gameState.availableMoves = [];
    gameState.attackablePieces = [];
    gameState.swappablePieces = [];
    gameState.pieces = [];
    
    document.querySelectorAll('.piece').forEach(piece => piece.remove());
    document.querySelectorAll('.vertical-health-container').forEach(healthBar => healthBar.remove());
    clearAllHighlights();
    
    document.querySelectorAll('.cell-corner-info').forEach(info => {
        info.innerHTML = '';
    });
    
    updateMoveCounter();
}

// 初始化时启动AI对战功能
initAIGame();
