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
    
    // 检查是否有redirect属性，如果有则执行页面跳转
    if (levelConfig.redirect) {
        window.location.href = levelConfig.redirect;
        return;
    }
    
    aiGameState.isAIMode = true;
    aiGameState.currentLevel = level;
    aiGameState.aiTurn = false;
    
    // 使用专门的重置函数而不是resetGame()
    resetGameForAI();
    
    // 添加：第三关特殊样式
    const gameBoard = document.getElementById('game-board');
    
    // 先移除所有可能的关卡特殊类
    gameBoard.classList.remove('ai-level-1', 'ai-level-2', 'ai-level-3');
    
    // 移除之前可能存在的沙漠覆盖层
    const existingSandyLayer = document.querySelector('.sandy-bottom-layer');
    if (existingSandyLayer) {
        existingSandyLayer.remove();
    }
    
    if (level === 3) {
        // 第三关添加沙漠背景
        gameBoard.classList.add('ai-level-3');
        
        // 创建并添加底部沙漠覆盖层
        const sandyLayer = document.createElement('div');
        sandyLayer.className = 'sandy-bottom-layer';
        gameBoard.appendChild(sandyLayer);
    }
    
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
    
    // 修改前：
    addMessage(`开始${levelConfig.name}！你是蓝色方，对战AI控制的红色方`);
    
    // 修改后：
    if (level === 1) {
        addMessage(`<span style="color:rgb(85, 187, 255);">欢迎挑战第一关 「源始的海洋」！你将面临那片神秘而暗藏杀机的海洋，做好准备吧！</span>`);
    } else if (level === 2) {
        addMessage(`<span style="color:rgb(85, 187, 255);">你居然来到了第二关 「狂怒的海洋」！那个家伙似乎生气了，现在整个世界全部在下暴雨，赶快阻止它！！</span>`);
    } else {
        addMessage(`开始${levelConfig.name}！你是蓝色方，对战AI控制的红色方`);
    }
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
            // 找到所有可移动的AI棋子并评估最佳移动
            const moveEvaluations = [];
            
            // 记录已经移动过的棋子，避免重复移动同一个棋子
            const movedPieces = new Set();
            
            for (const aiPiece of aiGameState.aiPieces) {
                if (aiPiece.currentHp <= 0 || movedPieces.has(aiPiece.id)) continue;
                
                const { moves } = calculateAvailableMovesAndAttacks(aiPiece);
                if (moves.length > 0) {
                    // 评估每个移动位置的得分
                    for (const move of moves) {
                        let score = 0;
                        
                        // 计算到最近敌人的距离（负分，距离越近越好）
                        const playerPieces = gameState.pieces.filter(p => p.player === 'blue');
                        if (playerPieces.length > 0) {
                            const minDistance = Math.min(...playerPieces.map(p => 
                                Math.abs(move.x - p.x) + Math.abs(move.y - p.y)
                            ));
                            score -= minDistance * 2; // 距离越近得分越高
                        }
                        
                        // 如果是水系精灵，检查是否在盖欧卡降雨范围内
                        if (aiPiece.type === 'water' && window.pokemonAbilities && window.pokemonAbilities.kyogre) {
                            const kyogrePieces = gameState.pieces.filter(p => 
                                p.player === 'red' && p.id && p.id.includes('kyogre') && p.currentHp > 0
                            );
                            
                            for (const kyogre of kyogrePieces) {
                                const distanceX = Math.abs(move.x - kyogre.x);
                                const distanceY = Math.abs(move.y - kyogre.y);
                                if (distanceX <= 1 && distanceY <= 1) {
                                    score += 15; // 增加水系精灵在降雨范围内的权重
                                    break;
                                }
                            }
                        }
                        
                        // 计算潜在伤害（基于移动后能攻击的目标），考虑类型克制
                        const tempPiece = {...aiPiece, x: move.x, y: move.y, player: aiPiece.player};
                        const { attackable: potentialTargets } = calculateAvailableMovesAndAttacks(tempPiece);
                        if (potentialTargets.length > 0) {
                            const maxDamage = Math.max(...potentialTargets.map(target => 
                                calculateDamage(tempPiece, target)
                            ));
                            score += maxDamage * 4; // 增加潜在伤害的权重
                            
                            // 额外加分：如果移动后能攻击到被克制的目标
                            const typeAdvantageTargets = potentialTargets.filter(target => {
                                const damage = calculateDamage(tempPiece, target);
                                return damage > tempPiece.attack; // 伤害高于基础攻击力表示有克制
                            });
                            
                            if (typeAdvantageTargets.length > 0) {
                                score += 20; // 类型克制额外加分
                            }
                        }
                        
                        // 如果是盖欧卡，降低移动优先级，让其他水系精灵先移动
                        if (aiPiece.id && aiPiece.id.includes('kyogre')) {
                            score -= 5; // 降低盖欧卡移动优先级
                        }
                        
                        moveEvaluations.push({
                            piece: aiPiece,
                            move: move,
                            score: score
                        });
                    }
                }
            }
            
            // 选择得分最高的移动
            if (moveEvaluations.length > 0) {
                const bestMove = moveEvaluations.reduce((best, eval) => 
                    eval.score > best.score ? eval : best
                );
                
                // 记录已经移动的棋子
                movedPieces.add(bestMove.piece.id);
                
                // 执行移动
                executeAIMove(bestMove.piece, bestMove.move);
                actionTaken = true;
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
    gameState.devouredPieces = []; // 新增：重置吞噬状态
    
    document.querySelectorAll('.piece').forEach(piece => piece.remove());
    document.querySelectorAll('.vertical-health-container').forEach(healthBar => healthBar.remove());
    clearAllHighlights();
    
    document.querySelectorAll('.cell-corner-info').forEach(info => {
        info.innerHTML = '';
    });
    
    // 新增：清除盖欧卡下雨特效
    if (window.pokemonAbilities && window.pokemonAbilities.kyogre && window.pokemonAbilities.kyogre.removeRainEffects) {
        window.pokemonAbilities.kyogre.removeRainEffects();
    }
    
    // 新增：清除班基拉斯沙尘暴特效
    if (window.pokemonAbilities && window.pokemonAbilities.tyranitar && window.pokemonAbilities.tyranitar.removeSandstormEffects) {
        window.pokemonAbilities.tyranitar.removeSandstormEffects();
    }
    
    // 新增：清除底部沙漠覆盖层 (grass.png)
    const sandyLayer = document.querySelector('.sandy-bottom-layer');
    if (sandyLayer) {
        sandyLayer.remove();
    }
    
    // 新增：清除班基拉斯沙地图案背景 (grass-d.png)
    const sandBackgroundEffects = document.querySelectorAll('.sand-background-effect');
    sandBackgroundEffects.forEach(effect => effect.remove());
    
    // 新增：清除沙地图案背景
    const gameBoard = document.getElementById('game-board');
    gameBoard.classList.remove('ai-level-3');
    
    // 新增：重新初始化河流效果
    if (typeof initRiverCanvas === 'function') {
        initRiverCanvas();
    }
    updateMoveCounter();
    
    // 注意：不要重置aiGameState.isAIMode和aiGameState.currentLevel
    // 这样FlowingRiver构造函数就能正确识别第二关状态
    // 只重置aiTurn状态
    aiGameState.aiTurn = false;
}

// 初始化时启动AI对战功能
initAIGame();
