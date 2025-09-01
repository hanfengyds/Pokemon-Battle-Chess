// 精灵特性实现
const pokemonAbilities = {
    // 盖欧卡的下雨特效
    kyogre: {
        // 检查是否为盖欧卡
        isKyogre: function(piece) {
            return piece && piece.id && piece.id.includes('kyogre');
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
    }
};

// 初始化精灵特性
function initPokemonAbilities() {
    // 这里可以添加全局的精灵特性初始化代码
    console.log('精灵特性模块已加载');
}

// 导出到全局作用域
window.pokemonAbilities = pokemonAbilities;
window.initPokemonAbilities = initPokemonAbilities;