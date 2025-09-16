// AI对战状态
// 修改aiGameState对象，添加狂风特效触发标志
const aiGameState = {
    isAIMode: false,
    currentLevel: null,
    aiTurn: false,
    aiPieces: [],
    whirlwindEffectTriggered: false // 新增：狂风特效触发标志
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
    
    // 添加关卡特殊样式
    const gameBoard = document.getElementById('game-board');
    
    // 先移除所有可能的关卡特殊类
    gameBoard.classList.remove('ai-level-1', 'ai-level-2', 'ai-level-3', 'ai-level-4');
    
    // 移除之前可能存在的特殊层
    const existingSandyLayer = document.querySelector('.sandy-bottom-layer');
    if (existingSandyLayer) {
        existingSandyLayer.remove();
    }
    
    const existingMountainLayer = document.querySelector('.mountain-overlay');
    if (existingMountainLayer) {
        existingMountainLayer.remove();
    }
    
    if (level === 3) {
        // 第三关添加沙漠背景
        gameBoard.classList.add('ai-level-3');
        
        // 创建并添加底部沙漠覆盖层
        const sandyLayer = document.createElement('div');
        sandyLayer.className = 'sandy-bottom-layer';
        gameBoard.appendChild(sandyLayer);
    } else if (level === 4) {
        // 第四关添加山脉背景
        gameBoard.classList.add('ai-level-4');
        
        // 创建并添加山脉遮罩层
        const mountainLayer = document.createElement('div');
        mountainLayer.className = 'mountain-overlay';
        gameBoard.appendChild(mountainLayer);
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
     } else if (level === 3) {
        addMessage(`<span style="color:rgb(242, 129, 0);">你居然来到了第三关 「沙漠的暴君」！沙漠中散布着许多岩石，除了飞行系宝可梦，其他宝可梦都无法直接越过它们！！</span>`);
    } else {
        addMessage(`<span style="color:rgb(255, 60, 0);">你居然来到了第四关 「高天的试炼」！传说中的大鸟袭来了！挺过它们的试炼，兴许能得到神明的眷顾也说不定！！</span>`);
        
        addMessage(`开始${levelConfig.name}！你是蓝色方，对战AI控制的红色方`);
    }
    addMessage(`AI拥有 ${levelConfig.aiPieces.length} 个宝可梦棋子`);
    
    renderPieces();
    updateMoveCounter();
}

// AI回合逻辑
// 在aiTurn函数中修改动画状态设置逻辑
function aiTurn() {
    if (!aiGameState.isAIMode || !aiGameState.aiTurn) return;

    addMessage('AI正在思考...');

    // 记录已执行的行动次数
    let actionsTaken = 0;
    
    // 初始化AI的剩余行动点
    gameState.movesRemaining = 2;
    updateMoveCounter();
    
    function executeAIAction() {
        if (actionsTaken >= 2) {
            // 已经执行了两次行动，结束回合
            aiGameState.aiTurn = false;
            // 确保所有动画完成后再切换回合
            setTimeout(() => {
                // 再次检查动画状态，确保安全切换回合
                if (!window.animationPlaying) {
                    switchTurn();
                } else {
                    // 如果动画还在播放，继续等待
                    setTimeout(() => {
                        // 强制重置动画状态，防止死锁
                        window.animationPlaying = false;
                        switchTurn();
                    }, 1000);
                }
            }, 500);
            return;
        }
        
        // 如果有动画正在播放，等待动画完成
        if (window.animationPlaying) {
            setTimeout(executeAIAction, 500);
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
                executeAIAttack(aiPiece, bestTarget, () => {
                    // 动画完成回调
                    window.animationPlaying = false; // 修复：使用全局的window.animationPlaying
                    actionsTaken++;
                    // 减少AI剩余行动点并更新UI
                    gameState.movesRemaining--;
                    updateMoveCounter();
                    // 确保第二次行动有足够的延迟，让视觉效果更好
                    setTimeout(executeAIAction, 1000);
                });
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

                            // 新添加：检查移动路径上是否有障碍物阻挡
                            if (aiGameState.currentLevel === 3) { // 只在第三关应用此逻辑
                                // 获取从当前位置到目标位置的直线路径上的所有格子
                                const pathClear = checkPathClear(aiPiece.x, aiPiece.y, move.x, move.y);
                                if (pathClear) {
                                    score += 10; // 路径清晰的格子额外加分
                                }
                            }
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
                
                // 移动完成后更新行动点
                actionsTaken++;
                gameState.movesRemaining--;
                updateMoveCounter();
            }
        }

        // 3. 如果没有任何行动，结束回合
        if (!actionTaken) {
            addMessage('AI没有可执行的行动，结束回合');
        }

        // 如果是移动操作而不是攻击，直接进行下一次行动
        if (!animationPlaying && actionTaken) {
            setTimeout(() => {
                executeAIAction();
            }, 1500);
        }
    };

    // 开始执行第一次行动，但先检查动画状态
    if (window.animationPlaying) {
        setTimeout(aiTurn, 100);
    } else {
        setTimeout(executeAIAction, 1000);
    }
}

// 在executeAIAttack函数中修改动画状态设置
function executeAIAttack(attacker, target, actionCompleteCallback) {
    selectPiece(attacker);
    
    // 计算伤害
    const damage = calculateDamage(attacker, target);
    
    // 定义处理伤害结算的函数
    function processDamage() {
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
        
        // 伤害结算完成后，通知行动完成
        if (actionCompleteCallback) {
            actionCompleteCallback();
        }
    }
    
    // 设置动画播放标志 - 使用window前缀
    window.animationPlaying = true;
    
    // 检查是否需要播放攻击动画
    let animationDelayNeeded = false;
    if (window.AttackAnimation && window.AttackAnimation.playAttackAnimation) {
        // 调用与玩家攻击相同的动画系统
        animationDelayNeeded = window.AttackAnimation.playAttackAnimation(attacker, target, processDamage);
    }
    
    // 如果不需要延迟伤害结算，则立即处理
    if (!animationDelayNeeded) {
        setTimeout(() => {
            window.animationPlaying = false;
            processDamage();
        }, 500);
    }
    
    // 在伤害处理完成后添加检测
    if (aiGameState.currentLevel === 4) {
        const legendaryBirds = gameState.pieces.filter(p => 
            ['zapdos', 'moltres', 'articuno'].some(bird => p.id.includes(bird))
        );

        if (legendaryBirds.length === 0) {
            // 生成洛奇亚
            const lugia = aiPokemonData.find(p => p.id === 'lugia');
            gameState.pieces.push({
                ...lugia,
                currentHp: lugia.hp,
                x: 4,
                y: 5,
                player: 'red',
                id: 'lugia-final-boss'
            });

            // 显示阶段结束提示
            showPhase1EndMessage();
            renderPieces();
        }
    }
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
    
    // 检测是否是三神鸟（闪电鸟、火焰鸟、急冻鸟）在第四关移动
    // 并且检查是否已经触发过这个特效（防止重复触发）
    // 修改这里：使用includes检查piece.id是否包含三神鸟的基础id
    if (aiGameState.currentLevel === 4 && 
        ['zapdos', 'moltres', 'articuno'].some(birdId => piece.id.includes(birdId)) && 
        !aiGameState.whirlwindEffectTriggered) {
        
        // 标记特效已触发
        aiGameState.whirlwindEffectTriggered = true;
        
        // 1. 创建全屏狂风特效
        createFullscreenWhirlwind();
        
        // 2. 显示文字提示浮窗 - 使用game-messages.js中的函数
        showLegendaryBirdsMessage();
        
        // 3. 移除玩家最后选择的三个精灵，只保留前三个
        removePlayerLastThreePieces();
    }
}
// 重写回合切换函数以支持AI
const originalSwitchTurn = switchTurn;
switchTurn = function() {
    // 确保在动画播放中不切换回合
    if (window.animationPlaying) {
        setTimeout(switchTurn, 100);
        return;
    }
    
    originalSwitchTurn();
    
    // 移除这里的额外AI触发逻辑，统一由game.js中的switchTurn函数处理
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
    
    // 新增：重置狂风特效触发标志
    aiGameState.whirlwindEffectTriggered = false;
    
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

// 添加检查路径是否清晰的辅助函数
function checkPathClear(startX, startY, endX, endY) {
    // 检查从起点到终点的直线路径上是否有障碍物
    const dx = Math.sign(endX - startX);
    const dy = Math.sign(endY - startY);
    
    let x = startX + dx;
    let y = startY + dy;
    
    // 沿着路径检查每个格子
    while (x !== endX || y !== endY) {
        const piece = getPieceAtPosition(x, y);
        if (piece && (piece.id.includes('rock') || piece.id.includes('cactus'))) {
            // 路径上有岩石或仙人掌阻挡
            return false;
        }
        
        x += dx;
        y += dy;
        
        // 确保不超出棋盘范围
        if (x < 0 || x >= gameState.boardSize.x || y < 0 || y >= gameState.boardSize.y) {
            break;
        }
    }
    
    return true;
}

// 在文件末尾添加新函数
// 创建全屏狂风特效
function createFullscreenWhirlwind() {
    // 移除已存在的狂风特效
    const existingWhirlwind = document.querySelector('.fullscreen-whirlwind');
    if (existingWhirlwind) {
        existingWhirlwind.remove();
    }
    
    const whirlwindContainer = document.createElement('div');
    whirlwindContainer.className = 'fullscreen-whirlwind';
    
    // 创建20个云朵粒子
    for (let i = 0; i < 20; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'whirlwind-cloud';
        
        // 随机设置云朵大小、位置和动画持续时间
        const size = 50 + Math.random() * 150;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.5}px`;
        cloud.style.top = `${Math.random() * 100}vh`;
        cloud.style.animationDuration = `${5 + Math.random() * 10}s`;
        cloud.style.animationDelay = `${Math.random() * 5}s`;
        
        whirlwindContainer.appendChild(cloud);
    }
    
    document.body.appendChild(whirlwindContainer);
    
    // 10秒后移除狂风特效
    setTimeout(() => {
        if (whirlwindContainer.parentNode) {
            whirlwindContainer.style.opacity = '0';
            whirlwindContainer.style.transition = 'opacity 2s ease-out';
            setTimeout(() => {
                if (whirlwindContainer.parentNode) {
                    whirlwindContainer.parentNode.removeChild(whirlwindContainer);
                }
            }, 2000);
        }
    }, 10000);
}


// 移除玩家最后选择的三个精灵，只保留前三个
function removePlayerLastThreePieces() {
    // 获取所有蓝色方（玩家）的棋子
    const playerPieces = gameState.pieces.filter(piece => piece.player === 'blue');
    
    // 如果玩家棋子数量大于3，则移除最后选择的三个
    if (playerPieces.length > 3) {
        // 按id排序，假设id较小的是先选择的
        playerPieces.sort((a, b) => a.id.localeCompare(b.id));
        
        // 获取最后三个需要移除的棋子
        const piecesToRemove = playerPieces.slice(-3);
        
        // 从游戏状态中移除这些棋子
        gameState.pieces = gameState.pieces.filter(piece => !piecesToRemove.includes(piece));
        
        // 重新渲染
        renderPieces();
    }
}
