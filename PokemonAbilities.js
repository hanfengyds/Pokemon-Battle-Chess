// 精灵特性实现
const pokemonAbilities = {
    // 盖欧卡的下雨特效
    kyogre: {
        // 检查是否为盖欧卡
        isKyogre: function(piece) {
            return piece && piece.id && piece.id.includes('kyogre') && !piece.id.includes('kyogre-primal');
        },
        
        // 检查是否为水系宝可梦
        isWaterType: function(piece) {
            if (!piece || !piece.type) return false;
            
            // 处理单属性和双属性
            if (Array.isArray(piece.type)) {
                return piece.type.includes('water');
            } else {
                return piece.type === 'water';
            }
        },
        
        // 检查宝可梦是否在盖欧卡的降雨范围内
        isInRainRange: function(kyogrePiece, targetPiece) {
            if (!this.isKyogre(kyogrePiece) || !targetPiece) return false;
            
            // 计算曼哈顿距离（1格范围内）
            const distanceX = Math.abs(kyogrePiece.x - targetPiece.x);
            const distanceY = Math.abs(kyogrePiece.y - targetPiece.y);
            
            return distanceX <= 1 && distanceY <= 1;
        },
        
        // 获取降雨范围内的水系宝可梦
        getWaterPokemonInRainRange: function() {
            const kyogrePieces = gameState.pieces.filter(piece => this.isKyogre(piece) && piece.currentHp > 0);
            const affectedPieces = [];
            
            kyogrePieces.forEach(kyogrePiece => {
                gameState.pieces.forEach(piece => {
                    if (this.isWaterType(piece) && this.isInRainRange(kyogrePiece, piece)) {
                        affectedPieces.push({
                            piece: piece,
                            kyogre: kyogrePiece,
                            boostedAtk: piece.atk + 1 // 攻击力+1
                        });
                    }
                });
            });
            
            return affectedPieces;
        },
        
        // 创建下雨特效
        createRainEffect: function(piece, cellWidth, cellHeight) {
            if (!this.isKyogre(piece) || piece.currentHp <= 0) return null;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 1格范围内的区域（自身周围一圈）
            const effectLeft = Math.max(0, (piece.x - 1) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + 1)) * cellHeight);
            const effectWidth = Math.min(boardWidth, (3 * cellWidth));
            const effectHeight = Math.min(boardHeight, (3 * cellHeight));
            
            const rainEffect = document.createElement('div');
            rainEffect.className = 'rain-effect';
            rainEffect.style.left = `${effectLeft}px`;
            rainEffect.style.top = `${effectTop}px`;
            rainEffect.style.width = `${effectWidth}px`;
            rainEffect.style.height = `${effectHeight}px`;
            
            // 增加雨滴数量到80个使其更密集
            for (let i = 0; i < 80; i++) {
                const rainDrop = document.createElement('div');
                rainDrop.className = 'rain-drop';
                rainDrop.style.left = `${Math.random() * effectWidth}px`;
                rainDrop.style.animationDelay = `${Math.random() * 0.8}s`;
                rainEffect.appendChild(rainDrop);
            }
            
            return rainEffect;
        },
        
        // 移除下雨特效
        removeRainEffects: function() {
            document.querySelectorAll('.rain-effect').forEach(effect => effect.remove());
        },
        
        // 更新下雨特效位置
        updateRainEffectPosition: function(piece, cellWidth, cellHeight) {
            if (!this.isKyogre(piece) || piece.currentHp <= 0) return;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 计算新的特效位置
            const effectLeft = Math.max(0, (piece.x - 1) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + 1)) * cellHeight);
            const effectWidth = Math.min(boardWidth, (3 * cellWidth));
            const effectHeight = Math.min(boardHeight, (3 * cellHeight));
            
            // 找到对应的特效并更新位置
            const rainEffect = document.querySelector('.rain-effect[data-piece-id="' + piece.id + '"]');
            if (rainEffect) {
                rainEffect.style.left = `${effectLeft}px`;
                rainEffect.style.top = `${effectTop}px`;
                rainEffect.style.width = `${effectWidth}px`;
                rainEffect.style.height = `${effectHeight}px`;
            }
        },
        
        // 更新攻击力显示（在renderPieces中调用）
        updateAttackDisplay: function() {
            const waterPokemon = this.getWaterPokemonInRainRange();
            
            // 重置所有攻击力圆圈为红色
            document.querySelectorAll('.attack-circle').forEach(circle => {
                circle.style.backgroundColor = '#F44336'; // 红色
            });
            
            // 为受影响的宝可梦更新显示
            waterPokemon.forEach(({piece, boostedAtk}) => {
                const cornerInfo = document.querySelector(`.cell-corner-info[data-x="${piece.x}"][data-y="${piece.y}"]`);
                if (cornerInfo) {
                    const attackValueEl = cornerInfo.querySelector('.attack-value');
                    const attackCircleEl = cornerInfo.querySelector('.attack-circle');
                    if (attackValueEl && attackCircleEl) {
                        attackValueEl.textContent = boostedAtk;
                        attackCircleEl.style.backgroundColor = '#3b82f6'; // 蓝色
                    }
                }
            });
        }
    },
    
    // 恶食大王的吞噬友军特效
    guzzlord: {
        // 检查是否为恶食大王
        isGuzzlord: function(piece) {
            return piece && piece.id && piece.id.includes('guzzlord');
        },
        
        // 创建吞噬友军特效（紫色光效）
        createDevourEffect: function(piece, cellWidth, cellHeight) {
            if (!this.isGuzzlord(piece) || piece.currentHp <= 0) return null;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 移动范围内的区域
            const effectLeft = Math.max(0, (piece.x - piece.move) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + piece.move)) * cellHeight);
            const effectWidth = Math.min(boardWidth, ((piece.move * 2 + 1) * cellWidth));
            const effectHeight = Math.min(boardHeight, ((piece.move * 2 + 1) * cellHeight));
            
            const devourEffect = document.createElement('div');
            devourEffect.className = 'devour-effect';
            devourEffect.style.left = `${effectLeft}px`;
            devourEffect.style.top = `${effectTop}px`;
            devourEffect.style.width = `${effectWidth}px`;
            devourEffect.style.height = `${effectHeight}px`;
            
            return devourEffect;
        },
        
        // 移除吞噬特效
        removeDevourEffects: function() {
            document.querySelectorAll('.devour-effect').forEach(effect => effect.remove());
        },
        
        // 处理吞噬友军攻击
        handleDevourAttack: function(attacker, targetId) {
            if (!this.isGuzzlord(attacker)) return false;
            
            const target = gameState.pieces.find(p => p.id === targetId);
            if (!target || target.player !== attacker.player) return false;
            
            // 检查是否已经吞噬过友军（只能吞噬一次）
            if (gameState.devouredPieces.length > 0) {
                addMessage(`${attacker.name} 已经吞噬过友军，无法再次吞噬！`);
                return false;
            }
            
            // 计算吞噬获得的体力（最多5点）
            const hpGain = Math.min(target.currentHp, 5);
            
            // 增加恶食大王的体力
            attacker.currentHp += hpGain;
            
            // 移除被吞噬的棋子
            gameState.pieces = gameState.pieces.filter(p => p.id !== targetId);
            
            // 记录已经吞噬过的棋子
            gameState.devouredPieces.push(targetId);
            
            // 播放吞噬音效
            try {
                const audio = new Audio('sound/吞噬.MP3');
                audio.volume = 0.7;
                audio.play().catch(error => {
                    console.warn('无法播放吞噬音效:', error);
                });
            } catch (error) {
                console.warn('创建音频元素失败:', error);
            }
            
            addMessage(`${attacker.name} 吞噬了友方 ${target.name}，获得了 ${hpGain} 点体力！`);
            
            // 重新渲染
            renderPieces();
            
            // 减少移动次数
            gameState.movesRemaining--;
            updateMoveCounter();
            
            // 同步到Firebase（如果在线）
            if (onlineState.isOnline) {
                syncGameState();
            }
            
            // 检查是否需要切换回合
            if (gameState.movesRemaining <= 0) {
                switchTurn();
            } else {
                // 仍然有移动次数，保持选中状态
                selectPiece(attacker);
            }
            
            return true;
        }
    },
    
    // 班基拉斯的沙尘暴特效
    tyranitar: {
        // 检查是否为班基拉斯
        isTyranitar: function(piece) {
            return piece && piece.id && piece.id.includes('tyranitar');
        },
        
        // 创建沙地图案背景
        createSandBackgroundEffect: function(piece, cellWidth, cellHeight) {
            if (!this.isTyranitar(piece) || piece.currentHp <= 0) return null;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 1格范围内的区域（自身周围一圈）
            const effectLeft = Math.max(0, (piece.x - 1) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + 1)) * cellHeight);
            const effectWidth = Math.min(boardWidth, (3 * cellWidth));
            const effectHeight = Math.min(boardHeight, (3 * cellHeight));
            
            const sandBackground = document.createElement('div');
            sandBackground.className = 'sand-background-effect';
            sandBackground.setAttribute('data-piece-id', piece.id);
            sandBackground.style.left = `${effectLeft}px`;
            sandBackground.style.top = `${effectTop}px`;
            sandBackground.style.width = `${effectWidth}px`;
            sandBackground.style.height = `${effectHeight}px`;
            
            return sandBackground;
        },
        
        // 移除所有沙地图案背景
        removeSandBackgroundEffects: function() {
            document.querySelectorAll('.sand-background-effect').forEach(effect => effect.remove());
        },
        
        // 移除特定班基拉斯的沙地图案背景
        removeSpecificSandBackgroundEffect: function(pieceId) {
            const effect = document.querySelector('.sand-background-effect[data-piece-id="' + pieceId + '"]');
            if (effect) {
                effect.remove();
            }
        },
        
        // 更新沙地图案背景位置
        updateSandBackgroundEffectPosition: function(piece, cellWidth, cellHeight) {
            if (!this.isTyranitar(piece) || piece.currentHp <= 0) return;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 计算新的特效位置
            const effectLeft = Math.max(0, (piece.x - 1) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + 1)) * cellHeight);
            const effectWidth = Math.min(boardWidth, (3 * cellWidth));
            const effectHeight = Math.min(boardHeight, (3 * cellHeight));
            
            // 找到对应的特效并更新位置
            const sandBackground = document.querySelector('.sand-background-effect[data-piece-id="' + piece.id + '"]');
            if (sandBackground) {
                sandBackground.style.left = `${effectLeft}px`;
                sandBackground.style.top = `${effectTop}px`;
                sandBackground.style.width = `${effectWidth}px`;
                sandBackground.style.height = `${effectHeight}px`;
            }
        },
        
        // 创建沙尘暴特效（原有的方法，保持不变）
        createSandstormEffect: function(piece, cellWidth, cellHeight) {
            if (!this.isTyranitar(piece) || piece.currentHp <= 0) return null;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 1格范围内的区域（自身周围一圈）
            const effectLeft = Math.max(0, (piece.x - 1) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + 1)) * cellHeight);
            const effectWidth = Math.min(boardWidth, (3 * cellWidth));
            const effectHeight = Math.min(boardHeight, (3 * cellHeight));
            
            const sandstormEffect = document.createElement('div');
            sandstormEffect.className = 'sandstorm-effect';
            sandstormEffect.setAttribute('data-piece-id', piece.id);
            sandstormEffect.style.left = `${effectLeft}px`;
            sandstormEffect.style.top = `${effectTop}px`;
            sandstormEffect.style.width = `${effectWidth}px`;
            sandstormEffect.style.height = `${effectHeight}px`;
            
            // 创建沙尘暴粒子
            for (let i = 0; i < 100; i++) {
                const sandParticle = document.createElement('div');
                sandParticle.className = 'sand-particle';
                sandParticle.style.left = `${Math.random() * effectWidth}px`;
                sandParticle.style.animationDelay = `${Math.random() * 1}s`;
                sandParticle.style.opacity = `${0.3 + Math.random() * 0.7}`;
                sandParticle.style.width = `${2 + Math.random() * 4}px`;
                sandParticle.style.height = `${2 + Math.random() * 4}px`;
                sandstormEffect.appendChild(sandParticle);
            }
            
            return sandstormEffect;
        },
        
        // 移除沙尘暴特效
        removeSandstormEffects: function() {
            document.querySelectorAll('.sandstorm-effect').forEach(effect => effect.remove());
        },
        
        // 更新沙尘暴特效位置
        updateSandstormEffectPosition: function(piece, cellWidth, cellHeight) {
            if (!this.isTyranitar(piece) || piece.currentHp <= 0) return;
            
            const boardWidth = gameBoard.clientWidth;
            const boardHeight = gameBoard.clientHeight;
            
            // 计算新的特效位置
            const effectLeft = Math.max(0, (piece.x - 1) * cellWidth);
            const effectTop = Math.max(0, (gameState.boardSize.y - 1 - (piece.y + 1)) * cellHeight);
            const effectWidth = Math.min(boardWidth, (3 * cellWidth));
            const effectHeight = Math.min(boardHeight, (3 * cellHeight));
            
            // 找到对应的特效并更新位置
            const sandstormEffect = document.querySelector('.sandstorm-effect[data-piece-id="' + piece.id + '"]');
            if (sandstormEffect) {
                sandstormEffect.style.left = `${effectLeft}px`;
                sandstormEffect.style.top = `${effectTop}px`;
                sandstormEffect.style.width = `${effectWidth}px`;
                sandstormEffect.style.height = `${effectHeight}px`;
            }
        },
        
        // 移除特定班基拉斯的特效（用于移动后删除原有特效）
        removeSpecificSandstormEffect: function(pieceId) {
            const effect = document.querySelector('.sandstorm-effect[data-piece-id="' + pieceId + '"]');
            if (effect) {
                effect.remove();
            }
        }
    },
    
    // 巨钳螳螂的攻击模式特效
    scizor: {
        // 存储各巨钳螳螂实例的攻击模式状态
        attackModeMap: {},
        
        // 检查是否为巨钳螳螂
        isScizor: function(piece) {
            return piece && piece.id && piece.id.includes('scizor');
        },
        
        // 切换攻击模式状态
        toggleAttackMode: function(pieceId) {
            this.attackModeMap[pieceId] = !this.attackModeMap[pieceId];
            return this.attackModeMap[pieceId];
        },
        
        // 检查是否处于攻击模式
        isInAttackMode: function(pieceId) {
            return !!this.attackModeMap[pieceId];
        },
        
        // 清除攻击模式状态
        clearAttackMode: function(pieceId) {
            delete this.attackModeMap[pieceId];
        }
    }
};

// 初始化精灵特性
function initPokemonAbilities() {
    // 这里可以添加全局的精灵特性初始化代码
    console.log('精灵特性模块已加载');
}

// 原始盖欧卡独立特效模块
const primalKyogreEffects = {
    // 检查是否为原始盖欧卡
    isPrimalKyogre: function(piece) {
        return piece && piece.id && piece.id.includes('kyogre-primal');
    },
    
    // 检查是否为水系宝可梦（复用普通盖欧卡的逻辑）
    isWaterType: function(piece) {
        if (!piece || !piece.type) return false;
        
        // 处理单属性和双属性
        if (Array.isArray(piece.type)) {
            return piece.type.includes('water');
        } else {
            return piece.type === 'water';
        }
    },
    
    // 获取全棋盘范围内的水系宝可梦（所有水系宝可梦都受影响）
    getWaterPokemonInFullBoardRange: function() {
        const primalKyogrePieces = gameState.pieces.filter(piece => this.isPrimalKyogre(piece) && piece.currentHp > 0);
        const affectedPieces = [];
        
        // 如果有原始盖欧卡在场，所有水系宝可梦都获得攻击力加成
        if (primalKyogrePieces.length > 0) {
            gameState.pieces.forEach(piece => {
                if (this.isWaterType(piece) && piece.currentHp > 0) {
                    affectedPieces.push({
                        piece: piece,
                        kyogre: primalKyogrePieces[0], // 使用第一个原始盖欧卡作为来源
                        boostedAtk: piece.atk + 1 // 攻击力+1
                    });
                }
            });
        }
        
        return affectedPieces;
    },
    
    // 更新攻击力显示（全棋盘范围）
    updateAttackDisplay: function() {
        const waterPokemon = this.getWaterPokemonInFullBoardRange();
        
        // 为受影响的宝可梦更新显示
        waterPokemon.forEach(({piece, boostedAtk}) => {
            const cornerInfo = document.querySelector(`.cell-corner-info[data-x="${piece.x}"][data-y="${piece.y}"]`);
            if (cornerInfo) {
                const attackValueEl = cornerInfo.querySelector('.attack-value');
                const attackCircleEl = cornerInfo.querySelector('.attack-circle');
                if (attackValueEl && attackCircleEl) {
                    attackValueEl.textContent = boostedAtk;
                    attackCircleEl.style.backgroundColor = '#3b82f6'; // 蓝色
                }
            }
        });
    },
    
    // 创建全棋盘下雨特效
    createFullBoardRainEffect: function() {
        if (!this.hasPrimalKyogre()) return null;
        
        const rainEffect = document.createElement('div');
        rainEffect.className = 'primal-kyogre-full-rain';
        rainEffect.style.position = 'absolute';
        rainEffect.style.top = '0';
        rainEffect.style.left = '0';
        rainEffect.style.width = '100%';
        rainEffect.style.height = '100%';
        rainEffect.style.pointerEvents = 'none';
        rainEffect.style.zIndex = '7';
        rainEffect.style.overflow = 'hidden';
        
        // 创建500个雨滴覆盖整个棋盘
        for (let i = 0; i < 500; i++) {
            const rainDrop = document.createElement('div');
            rainDrop.className = 'primal-rain-drop';
            rainDrop.style.left = `${Math.random() * 100}%`;
            rainDrop.style.animationDelay = `${Math.random() * 2}s`;
            rainEffect.appendChild(rainDrop);
        }
        
        return rainEffect;
    },
    
    // 检查棋盘上是否有原始盖欧卡
    hasPrimalKyogre: function() {
        return gameState.pieces.some(piece => this.isPrimalKyogre(piece) && piece.currentHp > 0);
    },
    
    // 移除特效
    removeEffects: function() {
        document.querySelectorAll('.primal-kyogre-full-rain').forEach(effect => effect.remove());
    },
    
    // 更新特效状态
    updateEffects: function() {
        // 不再移除特效，只更新攻击力显示
        // this.removeEffects();
        
        // 检查是否需要创建特效（如果特效不存在且原始盖欧卡存在）
        if (this.hasPrimalKyogre()) {
            if (!document.querySelector('.primal-kyogre-full-rain')) {
                const rainEffect = this.createFullBoardRainEffect();
                if (rainEffect) {
                    gameBoard.appendChild(rainEffect);
                }
            }
        } else {
            // 如果没有原始盖欧卡，则移除特效
            this.removeEffects();
        }
        
        // 更新攻击力显示
        this.updateAttackDisplay();
    }
};

// 导出到全局作用域
window.primalKyogreEffects = primalKyogreEffects;
window.pokemonAbilities = pokemonAbilities;
window.initPokemonAbilities = initPokemonAbilities;
