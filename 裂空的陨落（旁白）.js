// 裂空的陨落 游戏旁白系统

/**
 * 显示游戏旁白
 * @param {string} text - 要显示的旁白文本
 * @param {number} duration - 旁白显示的持续时间（毫秒），之后自动隐藏
 */
function showNarration(text, duration = 5000) {
    // 检查是否已存在旁白容器，如果存在则移除
    const existingNarration = document.getElementById('game-narration');
    if (existingNarration) {
        existingNarration.remove();
    }

    // 创建旁白容器
    const narrationContainer = document.createElement('div');
    narrationContainer.id = 'game-narration';
    narrationContainer.className = 'narration-container';
    
    // 创建文本元素
    const textElement = document.createElement('p');
    textElement.className = 'narration-text';
    textElement.textContent = text;
    
    // 添加到容器
    narrationContainer.appendChild(textElement);
    document.body.appendChild(narrationContainer);
    
    // 添加淡入动画
    setTimeout(() => {
        narrationContainer.style.opacity = '1';
        textElement.style.opacity = '1';
    }, 10);
    
    // 设置自动隐藏
    setTimeout(() => {
        hideNarration(narrationContainer);
    }, duration);
}

/**
 * 隐藏旁白
 * @param {HTMLElement} container - 旁白容器元素
 */
function hideNarration(container) {
    if (!container) {
        container = document.getElementById('game-narration');
        if (!container) return;
    }
    
    container.style.opacity = '0';
    const textElement = container.querySelector('.narration-text');
    if (textElement) {
        textElement.style.opacity = '0';
    }
    
    // 等待动画完成后移除元素
    setTimeout(() => {
        container.remove();
    }, 1000);
}

/**
 * 初始化旁白系统
 * 添加必要的CSS样式
 */
function initNarrationSystem() {
    // 检查是否已存在样式，如果存在则不再添加
    if (document.getElementById('narration-styles')) {
        return;
    }
    
    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.id = 'narration-styles';
    styleElement.textContent = `
        .narration-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.65);
            padding: 30px 40px;
            border-radius: 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            z-index: 1000;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            max-width: 80%;
            text-align: center;
        }
        
        .narration-text {
            color: #ffffff;
            font-size: 20px;
            font-family: 'SimHei', 'Microsoft YaHei', sans-serif;
            line-height: 1.6;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            margin: 0;
            opacity: 0;
            transition: opacity 1s ease-in-out 0.5s;
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(styleElement);
}

/**
 * 裂空的陨落 特定旁白
 */
function showRayquazaFallenNarration() {
    // 初始化旁白系统
    initNarrationSystem();
    
    // 显示特定的回忆文本
    showNarration('那是一段遥远的回忆...天空被撕裂，诡异生物在宇宙中徘徊...', 4000);
    // 添加延迟，在第一个文本显示完后显示第二个文本
    setTimeout(() => {
        showNarration('我试着模拟我和它的战斗，去了解它的战斗逻辑...', 5000);
    }, 4000); // 与第一个文本的持续时间保持一致
        setTimeout(() => {
        showNarration('在对应的回合移动棋子，对于射程内的敌人发起攻击', 4000);
    }, 7000); 
}

// ------------------------------ 心跳音效系统 ------------------------------

// 心跳音效相关变量
let heartbeatSound = null;
let heartbeatInterval = null;
let isHeartbeatPlaying = false;
let heartbeatTimeout = null; // 用于防抖
const DEBOUNCE_DELAY = 300; // 防抖延迟时间（毫秒）

/**
 * 获取心跳音效对象（确保重用同一个音频对象）
 */
function getHeartbeatSound() {
    if (!heartbeatSound) {
        try {
            heartbeatSound = new Audio('sound/心跳.MP3');
            heartbeatSound.volume = 0.5;
        } catch (error) {
            console.error('创建心跳音效对象失败:', error);
        }
    }
    return heartbeatSound;
}

/**
 * 播放单次心跳音效
 */
function playSingleHeartbeat() {
    const sound = getHeartbeatSound();
    if (!sound) return;
    
    try {
        // 重置到开始位置然后播放
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.error('单次心跳音效播放失败:', error);
            // 尝试恢复播放（有些浏览器需要用户交互后才能播放）
            try {
                sound.play();
            } catch (innerError) {
                console.error('恢复播放失败:', innerError);
            }
        });
    } catch (error) {
        console.error('播放心跳音效时出错:', error);
    }
}

/**
 * 开始循环播放心跳音效（2秒间隔）
 */
function startHeartbeatLoop() {
    // 如果心跳已经在播放中，则不重复启动
    if (isHeartbeatPlaying) {
        console.log('心跳音效已经在播放中，不会重复启动');
        return;
    }
    
    // 确保获取到音效对象
    getHeartbeatSound();
    
    // 立即播放一次心跳，然后设置循环
    playSingleHeartbeat();
    
    // 设置2秒间隔播放心跳
    heartbeatInterval = setInterval(() => {
        playSingleHeartbeat();
    }, 2000); // 2秒间隔
    
    // 标记心跳为播放状态
    isHeartbeatPlaying = true;
    console.log('心跳音效循环已启动，间隔2秒');
}

/**
 * 停止心跳音效循环
 */
function stopHeartbeatLoop() {
    // 清除定时器
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
    
    // 停止并重置音效对象
    if (heartbeatSound) {
        heartbeatSound.pause();
        heartbeatSound.currentTime = 0;
        heartbeatSound.loop = false; // 确保循环模式被关闭
    }
    
    // 重置播放状态
    isHeartbeatPlaying = false;
    console.log('心跳音效循环已停止');
}

/**
 * 初始化心跳音效系统
 * 确保在光效显示期间稳定循环播放
 */
function initHeartbeatSystem() {
    console.log('心跳音效系统已初始化');
    
    // 保存上一次的检测结果，避免重复触发
    let lastHighlightState = false;
    
    // 监听元素变化，检测裂空座光效的显示和隐藏
    const observer = new MutationObserver(() => {
        // 检查整个文档中是否存在裂空座光效
        const hasRayquazaHighlight = document.querySelectorAll('.cell.breathing-green').length > 0;
        
        // 只有当状态发生变化时才执行后续操作
        if (hasRayquazaHighlight === lastHighlightState) {
            return; // 状态没有变化，不执行任何操作
        }
        
        console.log('裂空座光效检测:', hasRayquazaHighlight ? '存在' : '不存在');
        
        // 更新上一次的状态
        lastHighlightState = hasRayquazaHighlight;
        
        // 防抖处理：清除之前的超时
        if (heartbeatTimeout) {
            clearTimeout(heartbeatTimeout);
        }
        
        // 设置新的超时，延迟执行状态切换
        heartbeatTimeout = setTimeout(() => {
            // 如果有裂空座的光效，开始或保持循环播放心跳音效
            if (hasRayquazaHighlight) {
                if (!isHeartbeatPlaying) {
                    startHeartbeatLoop();
                }
            } else if (isHeartbeatPlaying) {
                // 只有当光效完全消失时才停止心跳音效
                stopHeartbeatLoop();
            }
        }, DEBOUNCE_DELAY);
    });
    
    // 观察所有棋盘单元格的类变化
    document.querySelectorAll('.cell').forEach(cell => {
        observer.observe(cell, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    // 监听DOM变化，以便观察动态添加的单元格
    const boardObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('cell')) {
                    observer.observe(node, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                }
            });
        });
    });
    
    // 观察游戏棋盘的变化
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
        boardObserver.observe(gameBoard, {
            childList: true,
            subtree: true
        });
    }
    
    // 添加一个简单的测试函数，方便手动测试
    window.testHeartbeat = function() {
        if (isHeartbeatPlaying) {
            stopHeartbeatLoop();
        } else {
            startHeartbeatLoop();
        }
    };
    
    console.log('可在控制台使用 testHeartbeat() 函数手动测试心跳音效');
}

// 如果在浏览器环境中直接运行，初始化系统
if (typeof window !== 'undefined') {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
        // 延迟一秒显示旁白，确保页面完全加载
        setTimeout(showRayquazaFallenNarration, 1000);
        
        // 初始化心跳音效系统
        setTimeout(initHeartbeatSystem, 2000);
    });
}