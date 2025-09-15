/**
 * 攻击动画管理模块
 */
window.AttackAnimation = {
    /**
     * 播放攻击动画
     * @param {Object} attacker - 攻击者宝可梦
     * @param {Object} target - 被攻击目标宝可梦
     * @param {Function} callback - 动画结束后的回调函数（用于伤害结算）
     * @returns {boolean} - 是否需要延迟伤害结算
     */
    playAttackAnimation: function(attacker, target, callback) {
        // 检查攻击者是否为大剑鬼
        if (attacker.name === '大剑鬼' || attacker.id === 'samurott') {
            this.playSamurottWaterBladeAnimation(target);
            return false; // 大剑鬼不需要延迟伤害结算
        }
        // 检查攻击者是否为巨钳螳螂
        else if (attacker.name === '巨钳螳螂' || attacker.id === 'scizor') {
            // 检查是否处于攻击模式
            if (window.pokemonAbilities && window.pokemonAbilities.scizor && 
                window.pokemonAbilities.scizor.isInAttackMode(attacker.id)) {
                this.playScizorBulletPunchAnimation(attacker, target, callback);
                return true; // 巨钳螳螂需要延迟伤害结算
            }
        }
        // 检查攻击者是否为火焰鸟
        else if (attacker.name === '火焰鸟' || attacker.id === 'moltres') {
            this.playBirdWhirlwindAnimation(attacker, target, 'red', callback);
            return true; // 需要延迟伤害结算
        }
        // 检查攻击者是否为闪电鸟
        else if (attacker.name === '闪电鸟' || attacker.id === 'zapdos') {
            this.playBirdWhirlwindAnimation(attacker, target, 'yellow', callback);
            return true; // 需要延迟伤害结算
        }
        // 检查攻击者是否为急冻鸟
        else if (attacker.name === '急冻鸟' || attacker.id === 'articuno') {
            this.playBirdWhirlwindAnimation(attacker, target, 'blue', callback);
            return true; // 需要延迟伤害结算
        }
        // 检查攻击者是否为洛奇亚
        else if (attacker.name === '洛奇亚' || attacker.id === 'lugia' || attacker.id === 'lugia-final-boss') {
            this.playLugiaCycloneAnimation(attacker, target, callback);
            return true; // 需要延迟伤害结算
        }
        // 可以在这里添加其他宝可梦的攻击动画
        return false;
    },
    
    /**
     * 播放巨钳螳螂的子弹拳攻击动画
     * @param {Object} attacker - 巨钳螳螂
     * @param {Object} target - 被攻击目标宝可梦
     * @param {Function} callback - 动画结束后的回调函数（用于伤害结算）
     */
    playScizorBulletPunchAnimation: function(attacker, target, callback) {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard || !attacker || !target) {
            console.warn('无效的参数，无法播放巨钳螳螂子弹拳动画');
            if (callback) callback(); // 如果有回调，立即执行
            return;
        }
        
        // 获取游戏面板尺寸和格子大小
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;
        const cellWidth = boardWidth / gameState.boardSize.x;
        const cellHeight = boardHeight / gameState.boardSize.y;
        
        // 获取攻击者元素
        const attackerEl = document.querySelector(`.piece[data-id="${attacker.id}"]`);
        if (!attackerEl) {
            if (callback) callback(); // 如果有回调，立即执行
            return;
        }
        
        // 记录原始样式
        const originalTransform = attackerEl.style.transform;
        const originalOpacity = attackerEl.style.opacity;
        const originalZIndex = attackerEl.style.zIndex;
        
        // 1. 放大1.75倍
        attackerEl.style.transition = 'transform 0.3s ease';
        attackerEl.style.transform = `translate(-50%, -50%) scale(1.75)`;
        attackerEl.style.zIndex = '26';
        
        // 播放音效（如果需要）
        this.playBulletPunchSound();
        
        // 计算总动画时间（确保音效和动画都完全结束后再结算伤害）
        const totalAnimationDuration = 300 + 1000 + 50 + 200 + 150 + 200 + 300; // 2200ms
        
        setTimeout(() => {
            // 2. 消失
            attackerEl.style.transition = 'opacity 0.2s ease';
            attackerEl.style.opacity = '0';
            
            // 3. 在原位置播放子弹拳gif
            const animationContainer = document.createElement('div');
            const attackerCenterX = attacker.x * cellWidth + cellWidth / 2;
            const attackerCenterY = (gameState.boardSize.y - 1 - attacker.y) * cellHeight + cellHeight / 2;
            
            animationContainer.style.position = 'absolute';
            animationContainer.style.left = `${attackerCenterX}px`;
            animationContainer.style.top = `${attackerCenterY}px`;
            animationContainer.style.transform = 'translate(-50%, -50%)';
            animationContainer.style.zIndex = '25';
            animationContainer.style.pointerEvents = 'none';
            
            const bulletPunchGif = document.createElement('img');
            bulletPunchGif.src = 'video/子弹拳.gif';
            bulletPunchGif.style.width = '120px';
            bulletPunchGif.style.height = '120px';
            bulletPunchGif.style.objectFit = 'contain';
            
            animationContainer.appendChild(bulletPunchGif);
            gameBoard.appendChild(animationContainer);
            
            // 4. 播放gif 1秒后，巨钳螳螂现身并突进
            setTimeout(() => {
                // 移除gif容器
                if (animationContainer.parentNode) {
                    gameBoard.removeChild(animationContainer);
                }
                
                // 计算目标位置（稍微错开一点，不是完全重叠）
                const targetCenterX = target.x * cellWidth + cellWidth / 2;
                const targetCenterY = (gameState.boardSize.y - 1 - target.y) * cellHeight + cellHeight / 2;
                
                // 计算攻击者到目标的向量
                const dx = targetCenterX - attackerCenterX;
                const dy = targetCenterY - attackerCenterY;
                
                // 5. 现身在原始位置
                attackerEl.style.transition = 'opacity 0.1s ease';
                attackerEl.style.opacity = '1';
                
                // 6. 短暂停顿后，高速突进到目标位置附近
                setTimeout(() => {
                    // 设置高速移动的过渡效果（速度快，持续时间短）
                    attackerEl.style.transition = 'transform 0.2s ease-out';
                    
                    // 计算稍微靠近目标但不完全重叠的位置 - 修改为正好移动到目标中心
                    const nearTargetX = attackerCenterX + dx * 1.0; // 从0.9改为1.0
                    const nearTargetY = attackerCenterY + dy * 1.0; // 从0.9改为1.0
                    
                    // 计算从当前位置到目标附近位置的偏移量
                    const translateX = nearTargetX - attackerCenterX;
                    const translateY = nearTargetY - attackerCenterY;
                    
                    // 应用移动变换
                    attackerEl.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(1.75)`;
                    
                    // 7. 攻击完成后，再高速返回到原始位置
                    setTimeout(() => {
                        attackerEl.style.transition = 'transform 0.2s ease-in';
                        attackerEl.style.transform = `translate(-50%, -50%) scale(1.75)`;
                        
                        // 8. 最后恢复原始大小
                        setTimeout(() => {
                            attackerEl.style.transition = 'transform 0.3s ease';
                            attackerEl.style.transform = originalTransform || 'translate(-50%, -50%) scale(1)';
                            attackerEl.style.opacity = originalOpacity || '1';
                            attackerEl.style.zIndex = originalZIndex || '10';
                            
                            // 所有动画完成后调用回调函数（结算伤害）
                            if (callback) {
                                callback();
                            }
                        }, 300);
                    }, 150); // 攻击停留时间
                }, 50); // 现身到突进的短暂延迟
            }, 1000); // gif播放1秒
        }, 300); // 放大动画持续300ms
    },
    
    /**
     * 播放大剑鬼的水波刀攻击动画
     * @param {Object} target - 被攻击目标宝可梦
     */
    playSamurottWaterBladeAnimation: function(target) {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard || !target || typeof target.x !== 'number' || typeof target.y !== 'number') {
            console.warn('无效的目标参数，无法播放水波刀动画');
            return;
        }
        
        // 获取游戏面板尺寸和格子大小
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;
        const cellWidth = boardWidth / gameState.boardSize.x;
        const cellHeight = boardHeight / gameState.boardSize.y;
        
        // 计算目标所在格子的中心坐标（考虑游戏面板的坐标系转换）
        const targetCenterX = target.x * cellWidth + cellWidth / 2;
        const targetCenterY = (gameState.boardSize.y - 1 - target.y) * cellHeight + cellHeight / 4;
        
        // 创建动画容器，确保每次都是新的元素
        const animationContainer = document.createElement('div');
        animationContainer.style.position = 'absolute';
        animationContainer.style.left = `${targetCenterX}px`;
        animationContainer.style.top = `${targetCenterY}px`;
        animationContainer.style.transform = 'translate(-50%, -50%)';
        animationContainer.style.zIndex = '25';
        animationContainer.style.pointerEvents = 'none';
        
        // 设置动画效果 - 只保留放大效果，移除淡出效果
        animationContainer.style.transition = 'transform 0.5s ease';
        
        // 创建gif图片元素
        const waterBladeGif = document.createElement('img');
        waterBladeGif.src = 'video/水波刀.gif';
        waterBladeGif.style.width = '80px';
        waterBladeGif.style.height = '80px';
        waterBladeGif.style.objectFit = 'contain';
        
        // 添加到容器
        animationContainer.appendChild(waterBladeGif);
        
        // 添加到游戏面板
        gameBoard.appendChild(animationContainer);
        
        // 播放音效
        this.playWaterBladeSound();
        
        // 播放动画 - 使用requestAnimationFrame确保动画流畅
        requestAnimationFrame(() => {
            setTimeout(() => {
                // 轻微放大效果
                animationContainer.style.transform = 'translate(-50%, -50%) scale(1.2)';
                
                // 动画结束后移除元素
                setTimeout(() => {
                    if (animationContainer.parentNode) {
                        // 使用removeChild移除元素
                        gameBoard.removeChild(animationContainer);
                    }
                }, 500);
            }, 10);
        });
    },
    
    /**
     * 播放水波刀音效
     */
    playWaterBladeSound: function() {
        try {
            // 创建音频元素
            const audio = new Audio('sound/水波刀.MP3');
            
            // 设置音量（可选）
            audio.volume = 0.7;
            
            // 播放音效
            audio.play().catch(error => {
                console.warn('无法播放水波刀音效:', error);
            });
        } catch (error) {
            console.warn('创建音频元素失败:', error);
        }
    },
    
    /**
     * 播放子弹拳音效
     */
    playBulletPunchSound: function() {
        try {
            // 创建音频元素
            const audio = new Audio('sound/子弹拳.MP3');
            
            // 设置音量
            audio.volume = 0.7;
            
            // 播放音效
            audio.play().catch(error => {
                console.warn('无法播放子弹拳音效:', error);
            });
        } catch (error) {
            console.warn('创建音频元素失败:', error);
        }
    },
    
    /**
     * 播放三圣鸟的旋风攻击动画
     * @param {Object} attacker - 攻击者宝可梦
     * @param {Object} target - 被攻击目标宝可梦
     * @param {string} color - 旋风颜色 ('red'|'yellow'|'blue')
     * @param {Function} callback - 动画结束后的回调函数（用于伤害结算）
     */
    playBirdWhirlwindAnimation: function(attacker, target, color, callback) {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard || !attacker || !target) {
            console.warn('无效的参数，无法播放三圣鸟旋风动画');
            if (callback) callback();
            return;
        }
    
        // 获取游戏面板尺寸和格子大小
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;
        const cellWidth = boardWidth / gameState.boardSize.x;
        const cellHeight = boardHeight / gameState.boardSize.y;
        
        // 计算攻击者和目标的中心坐标
        const attackerCenterX = attacker.x * cellWidth + cellWidth / 2;
        const attackerCenterY = (gameState.boardSize.y - 1 - attacker.y) * cellHeight + cellHeight / 2;
        const targetCenterX = target.x * cellWidth + cellWidth / 2;
        const targetCenterY = (gameState.boardSize.y - 1 - target.y) * cellHeight + cellHeight / 2;
        
        // 创建旋风GIF容器
        const whirlwindContainer = document.createElement('img');
        
        // 根据颜色选择对应的专用旋风GIF
        const gifPaths = {
            red: 'video/旋风（火焰鸟）.gif',    // 红色对应火焰鸟
            yellow: 'video/旋风（闪电鸟）.gif',  // 黄色对应闪电鸟
            blue: 'video/旋风（急冻鸟）.gif'     // 蓝色对急冻鸟
        };
        
        // 设置GIF图片，默认使用火焰鸟的GIF
        whirlwindContainer.src = gifPaths[color] || gifPaths.red;
        whirlwindContainer.alt = '旋风攻击';
        
        // 添加到游戏面板
        gameBoard.appendChild(whirlwindContainer);
        
        // 设置基础样式
        whirlwindContainer.style.position = 'absolute';
        whirlwindContainer.style.left = `${attackerCenterX}px`;
        whirlwindContainer.style.top = `${attackerCenterY}px`;
        whirlwindContainer.style.width = '180px';
        whirlwindContainer.style.height = '180px';
        whirlwindContainer.style.transform = 'translate(-50%, -50%)';
        whirlwindContainer.style.zIndex = '999';
        whirlwindContainer.style.pointerEvents = 'none';
        
        // 播放旋风音效 - 根据颜色播放对应的专用音效
        try {
            // 创建音效路径映射
            const soundPaths = {
                red: 'sound/旋风（火）.MP3',     // 火焰鸟音效
                yellow: 'sound/旋风（电）.MP3',  // 闪电鸟音效
                blue: 'sound/旋风（冰）.MP3'      // 急冻鸟音效
            };
            
            // 根据颜色选择对应的音效文件
            const audio = new Audio(soundPaths[color] || 'sound/旋风.MP3'); // 默认为旋风.MP3
            audio.volume = 0.7;
            audio.play().catch(error => {
                console.warn('无法播放旋风音效:', error);
            });
        } catch (error) {
            console.warn('创建音频元素失败:', error);
        }
        
        // 计算攻击方向和终点位置（超出棋盘边缘）
        const dx = targetCenterX - attackerCenterX;
        const dy = targetCenterY - attackerCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 计算延伸到棋盘边缘的终点位置
        const extensionFactor = (Math.sqrt(boardWidth * boardWidth + boardHeight * boardHeight) * 2) / distance;
        const endX = attackerCenterX + dx * extensionFactor;
        const endY = attackerCenterY + dy * extensionFactor;
        
        // 增加动画持续时间到3秒，确保GIF有足够时间显示
        whirlwindContainer.style.transition = 'left 3s linear, top 3s linear, opacity 3s linear';
        
        // 使用setTimeout强制浏览器重排，确保动画能正确触发
        setTimeout(() => {
            // 应用终点位置和淡出效果
            whirlwindContainer.style.left = `${endX}px`;
            whirlwindContainer.style.top = `${endY}px`;
            whirlwindContainer.style.opacity = '0';
        }, 10);
            
        // 修改回调函数，添加范围伤害处理
        const enhancedCallback = () => {
            // 处理主要目标伤害（原有逻辑）
            if (callback) {
                callback();
            }
            
            // 计算目标背后的两格内的所有敌人并根据属性造成伤害
            this.processAreaDamage(attacker, target, color);
        };
            
        // 增加动画持续时间到3秒，确保GIF能完整播放
        setTimeout(() => {
            if (whirlwindContainer.parentNode) {
                gameBoard.removeChild(whirlwindContainer);
            }
            enhancedCallback();
        }, 3000); // 增加到3秒以确保动画完全播放
    },
    
    /**
     * 播放洛奇亚的气旋攻击动画
     * @param {Object} attacker - 攻击者宝可梦（洛奇亚）
     * @param {Object} target - 被攻击目标宝可梦
     * @param {Function} callback - 动画结束后的回调函数（用于伤害结算）
     */
    playLugiaCycloneAnimation: function(attacker, target, callback) {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard || !attacker || !target) {
            console.warn('无效的参数，无法播放洛奇亚气旋动画');
            if (callback) callback();
            return;
        }
    
        // 获取游戏面板尺寸和格子大小
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;
        const cellWidth = boardWidth / gameState.boardSize.x;
        const cellHeight = boardHeight / gameState.boardSize.y;
    
        // 计算攻击者和目标的中心坐标
        const attackerCenterX = attacker.x * cellWidth + cellWidth / 2;
        const attackerCenterY = (gameState.boardSize.y - 1 - attacker.y) * cellHeight + cellHeight / 2;
        const targetCenterX = target.x * cellWidth + cellWidth / 2;
        const targetCenterY = (gameState.boardSize.y - 1 - target.y) * cellHeight + cellHeight / 2;
    
        // 创建气旋GIF容器
        const cycloneContainer = document.createElement('img');
    
        // 设置气旋GIF
        cycloneContainer.src = 'video/气旋攻击.gif';
        cycloneContainer.alt = '洛奇亚气旋攻击';
    
        // 添加到游戏面板
        gameBoard.appendChild(cycloneContainer);
    
        // 设置基础样式
        cycloneContainer.style.position = 'absolute';
        cycloneContainer.style.left = `${attackerCenterX}px`;
        cycloneContainer.style.top = `${attackerCenterY}px`;
        cycloneContainer.style.width = '180px';
        cycloneContainer.style.height = '180px';
        cycloneContainer.style.transform = 'translate(-50%, -50%)';
        cycloneContainer.style.zIndex = '999';
        cycloneContainer.style.pointerEvents = 'none';
    
        // 播放旋风（飞）音效
        try {
            const audio = new Audio('sound/气旋攻击.MP3');
            audio.volume = 0.7;
            audio.play().catch(error => {
                console.warn('无法播放旋风音效:', error);
            });
        } catch (error) {
            console.warn('创建音频元素失败:', error);
        }
    
        // 计算攻击方向和终点位置（超出棋盘边缘）
        const dx = targetCenterX - attackerCenterX;
        const dy = targetCenterY - attackerCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // 计算延伸到棋盘边缘的终点位置
        const extensionFactor = (Math.sqrt(boardWidth * boardWidth + boardHeight * boardHeight) * 2) / distance;
        const endX = attackerCenterX + dx * extensionFactor;
        const endY = attackerCenterY + dy * extensionFactor;
    
        // 增加动画持续时间到3秒，确保GIF有足够时间显示
        cycloneContainer.style.transition = 'left 3s linear, top 3s linear, opacity 3s linear';
    
        // 使用setTimeout强制浏览器重排，确保动画能正确触发
        setTimeout(() => {
            // 应用终点位置和淡出效果
            cycloneContainer.style.left = `${endX}px`;
            cycloneContainer.style.top = `${endY}px`;
            cycloneContainer.style.opacity = '0';
        }, 10);
    
        // 修改回调函数，添加范围伤害处理
        const enhancedCallback = () => {
            // 处理主要目标伤害（原有逻辑）
            if (callback) {
                callback();
            }
    
            // 计算目标背后的直线上所有敌人并造成飞行系伤害
            this.processLugiaLinearDamage(attacker, target);
        };
    
        // 增加动画持续时间到3秒，确保GIF能完整播放
        setTimeout(() => {
            if (cycloneContainer.parentNode) {
                gameBoard.removeChild(cycloneContainer);
            }
            enhancedCallback();
        }, 3000); // 增加到3秒以确保动画完全播放
    },
    
    /**
     * 处理洛奇亚的直线伤害
     * @param {Object} attacker - 攻击者宝可梦（洛奇亚）
     * @param {Object} target - 主要攻击目标
     */
    processLugiaLinearDamage: function(attacker, target) {
        // 确定攻击方向（从攻击者到目标）
        const directionX = target.x > attacker.x ? 1 : (target.x < attacker.x ? -1 : 0);
        const directionY = target.y > attacker.y ? 1 : (target.y < attacker.y ? -1 : 0);
    
        // 飞行属性
        const attackType = 'flying';
        const typeName = '飞行';
    
        // 获取目标背后的直线上的所有敌方宝可梦
        const areaTargets = [];
    
        // 沿着目标背后的直线检查所有格子
        let checkX = target.x + directionX;
        let checkY = target.y + directionY;
    
        while (checkX >= 0 && checkX < gameState.boardSize.x && 
               checkY >= 0 && checkY < gameState.boardSize.y) {
            const piece = gameState.pieces.find(p => p.x === checkX && p.y === checkY && p.player !== attacker.player);
            if (piece && piece.currentHp > 0 && piece.id !== target.id) {
                areaTargets.push(piece);
            }
            
            // 继续沿着直线检查下一个格子
            checkX += directionX;
            checkY += directionY;
        }
    
        // 对每个范围内的目标造成1.5倍飞行系伤害
        for (const areaTarget of areaTargets) {
            // 计算基于属性的伤害（考虑克制、抵抗和免疫）
            const damageInfo = this.calculateTypeDamage(attackType, areaTarget);
            
            if (!damageInfo.isImmune) {
                // 基础伤害为1.5，再乘以属性伤害倍数
                const finalDamage = Math.floor(1.5 * damageInfo.damage);
                
                // 造成伤害
                areaTarget.currentHp -= finalDamage;
    
                // 显示伤害数字
                showDamagePopup(areaTarget.x, areaTarget.y, finalDamage);
    
                // 添加范围伤害消息
                let effectText = '';
                if (damageInfo.isSuperEffective) {
                    effectText = '效果拔群！';
                } else if (damageInfo.isNotEffective) {
                    effectText = '效果不好...';
                }
    
                addMessage(`${attacker.name} 的气旋攻击对 ${areaTarget.name} ${effectText} 造成了 ${finalDamage} 点飞行系伤害！`);
    
                // 检查目标是否被击败
                if (areaTarget.currentHp <= 0) {
                    gameState.pieces = gameState.pieces.filter(p => p.id !== areaTarget.id);
                    addMessage(`${areaTarget.name} 被气旋攻击击败了！`);
                    checkGameEnd();
                }
            } else {
                // 显示免疫效果
                showDamagePopup(areaTarget.x, areaTarget.y, '免疫', true);
                addMessage(`${areaTarget.name} 对飞行属性攻击免疫！`);
            }
        }
    
        // 重新渲染棋盘
        renderPieces();
    },
    
    /**
     * 检查属性免疫关系
     * @param {string} attackerType - 攻击者属性
     * @param {Object} target - 目标宝可梦
     * @returns {boolean} - 是否免疫
     */
    checkTypeImmunity: function(attackerType, target) {
        if (!window.typeChart || !window.typeChart[attackerType]) {
            return false;
        }
        
        const typeData = window.typeChart[attackerType];
        const targetTypes = Array.isArray(target.type) ? target.type : [target.type];
        
        // 检查目标是否有任一属性免疫攻击属性
        for (const targetType of targetTypes) {
            if (typeData.immune && typeData.immune.includes(targetType)) {
                return true;
            }
        }
        
        return false;
    },
    
    /**
     * 获取属性的中文名称
     * @param {string} type - 属性英文名称
     * @returns {string} - 属性中文名称
     */
    getTypeName: function(type) {
        const typeNames = {
            fire: '火',
            electric: '电',
            ice: '冰',
            flying: '飞行'
        };
    
        return typeNames[type] || '';
    },
    
    /**
     * 获取旋风的渐变背景
     * @param {string} color - 旋风颜色
     * @returns {string} - 渐变背景CSS值
     */
    getWhirlwindGradient: function(color) {
        const gradients = {
            red: 'linear-gradient(90deg, rgba(255,0,0,0) 0%, rgba(255,100,100,0.8) 50%, rgba(255,0,0,0) 100%)',
            yellow: 'linear-gradient(90deg, rgba(255,255,0,0) 0%, rgba(255,255,100,0.8) 50%, rgba(255,255,0,0) 100%)',
            blue: 'linear-gradient(90deg, rgba(0,0,255,0) 0%, rgba(100,100,255,0.8) 50%, rgba(0,0,255,0) 100%)'
        };
        return gradients[color] || gradients.red;
    },
    
    /**
     * 获取旋风的阴影效果
     * @param {string} color - 旋风颜色
     * @returns {string} - 阴影CSS值
     */
    getWhirlwindShadow: function(color) {
        const shadows = {
            red: '0 0 20px 5px rgba(255,100,100,0.5)',
            yellow: '0 0 20px 5px rgba(255,255,100,0.5)',
            blue: '0 0 20px 5px rgba(100,100,255,0.5)'
        };
        return shadows[color] || shadows.red;
    },
    
    /**
     * 计算基于属性的伤害（考虑克制、抵抗和免疫）
     * @param {string} attackerType - 攻击者属性
     * @param {Object} target - 目标宝可梦
     * @returns {Object} - 伤害信息对象
     */
    calculateTypeDamage: function(attackerType, target) {
        const result = {
            damage: 1,          // 默认伤害为1点
            isSuperEffective: false,  // 是否效果拔群
            isNotEffective: false,    // 是否效果不好
            isImmune: false           // 是否免疫
        };
    
        // 检查属性免疫
        if (this.checkTypeImmunity(attackerType, target)) {
            result.isImmune = true;
            result.damage = 0;
            return result;
        }
    
        // 获取属性克制关系（如果有typeChart）
        if (window.typeChart && window.typeChart[attackerType]) {
            const typeData = window.typeChart[attackerType];
            const targetTypes = Array.isArray(target.type) ? target.type : [target.type];
            
            // 默认伤害倍数为1
            let damageMultiplier = 1;
            
            // 对每个目标属性计算伤害倍数
            for (const targetType of targetTypes) {
                if (typeData.weak && typeData.weak.includes(targetType)) {
                    damageMultiplier *= 0.5; // 效果不好
                    result.isNotEffective = true;
                } else if (typeData.strong && typeData.strong.includes(targetType)) {
                    damageMultiplier *= 2; // 效果拔群
                    result.isSuperEffective = true;
                }
            }
    
            // 根据伤害倍数调整伤害值
            result.damage = Math.floor(result.damage * damageMultiplier);
        }
    
        return result;
    }
};

/**
 * 创建旋风粒子效果
 * @param {HTMLElement} container - 粒子容器
 * @param {number} count - 粒子数量
 * @param {string} type - 粒子类型（颜色）
 */
function createParticles(container, count, type) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'whirlwind-particle';
        
        // 随机粒子属性
        const size = Math.random() * 8 + 4;
        const delay = Math.random() * 2;
        const duration = 4 - delay;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // 随机位置
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = Math.random() * 50 + 30;
        particle.style.left = `${50 + Math.cos(angle) * distance}%`;
        particle.style.top = `${50 + Math.sin(angle) * distance}%`;
        
        container.appendChild(particle);
    }
}
