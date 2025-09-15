// 关卡消息常量
window.LEVEL_MESSAGES = {
  VICTORY: {
    LEVEL_1: "<span style='color:rgb(85, 187, 255);'>漂亮的胜利！看样子你已经摸清了海洋的性格，踏上征途，向未知的远方航行吧。</span>",
    LEVEL_2: "<span style='color:rgb(85, 187, 255);'>恭喜你平息了大海的愤怒！暴雨已经停息了，该收拾收拾，向着下个目标进发了！</span>",
    LEVEL_3: "<span style='color:rgb(242, 129, 0);'>看来是我低估了你！如此恶劣的地形和天气都被你突破了！！</span>",
  },
  DEFEAT: {
    LEVEL_1: "<span style='color:rgb(85, 187, 255);'>真是可惜，或许你距离扬帆起航只差一艘更坚实的船也说不定...</span>",
    LEVEL_2: "<span style='color:rgb(85, 187, 255);'>惨烈！你终究没能征服巨浪...在自然的伟力面前，难道生命就如此弱小吗？</span>",
    LEVEL_3: "<span style='color:rgb(242, 129, 0);'>登山者，不必沮丧，山就在那里，你随时可以再次挑战它！</span>",
  }
};
// 旁白播报系统

/**
 * 显示游戏旁白
 * @param {string} text - 要显示的旁白文本
 * @param {number} duration - 旁白显示的持续时间（毫秒），之后自动隐藏
 */
function showNarration(text, duration = 3000) {
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

  // 将容器添加到游戏棋盘区域，确保在棋盘中央显示
  const gameBoard = document.getElementById('game-board');
  if (gameBoard) {
    gameBoard.appendChild(narrationContainer);
  } else {
    // 如果找不到游戏棋盘，就添加到body
    document.body.appendChild(narrationContainer);
  }

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
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7); /* 黑色透明背景 */
            padding: 25px 35px;
            border-radius: 10px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
            max-width: 80%;
            text-align: center;
        }
        
        .narration-text {
            color: #ffffff;
            font-size: 18px;
            font-family: 'SimHei', 'Microsoft YaHei', sans-serif;
            line-height: 1.5;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
            margin: 0;
            opacity: 0;
            transition: opacity 0.8s ease-in-out 0.3s;
        }
    `;

  // 添加到文档头部
  document.head.appendChild(styleElement);
}

/**
 * 显示AI闯关第一关特定旁白
 */
function showAILevel1Narration() {
  // 初始化旁白系统
  initNarrationSystem();

  // 显示第一关特定旁白文本
  showNarration('循着记忆里裂空座坠落的方向，你来到了这条星空中的——河？', 3000);
}

/**
 * 显示AI闯关第二关特定旁白
 */
function showAILevel2Narration() {
  // 初始化旁白系统
  initNarrationSystem();

  // 显示第二关特定旁白文本
  showNarration('你试着向水流的更深处探索，那个家伙被你彻底惹怒...', 3000);
}

/**
 * 显示AI闯关第三关特定旁白
 */
function showAILevel3Narration() {
  // 初始化旁白系统
  initNarrationSystem();

  // 显示第三关特定旁白文本
  showNarration('终于看到陆地了...那个区域怎么都是沙子、岩石、仙人掌？', 3000);
}

/**
 * 显示AI闯关第四关特定旁白
 */
function showAILevel4Narration() {
  // 初始化旁白系统
  initNarrationSystem();

  // 显示第四关特定旁白文本
  showNarration('又一个旅者来了，你也有驾驭天空的力量吗？', 3000);
}

// 监听URL参数变化，检测是否进入关卡
function checkForAILevel() {
  // 检查URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get('level');

  // 如果URL中有第一关参数
  if (level === '1') {
    setTimeout(showAILevel1Narration, 1000);
    return true;
  }

  // 如果URL中有第二关参数
  if (level === '2') {
    setTimeout(showAILevel2Narration, 1000);
    return true;
  }

  // 如果URL中有第三关参数
  if (level === '3') {
    setTimeout(showAILevel3Narration, 1000);
    return true;
  }
  
  // 如果URL中有第四关参数
  if (level === '4') {
    setTimeout(showAILevel4Narration, 1000);
    return true;
  }

  return false;
}

// 如果在浏览器环境中直接运行，初始化系统
if (typeof window !== 'undefined') {
  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', () => {
    // 检查是否已经是关卡页面
    if (checkForAILevel()) {
      return;
    }

    // 监听闯关挑战按钮的创建和点击事件
    // 创建一个MutationObserver来监听DOM变化，特别是AI挑战模态框的创建
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // 检查是否有闯关挑战按钮
        const aiButton = document.getElementById('ai-challenge-btn');
        if (aiButton && !aiButton.hasAttribute('data-narration-added')) {
          aiButton.setAttribute('data-narration-added', 'true');

          // 监听闯关挑战按钮点击，然后监听关卡选择
          aiButton.addEventListener('click', () => {
            setTimeout(() => {
              // 监听关卡选择事件
              const levelElements = document.querySelectorAll('#ai-levels > div');
              levelElements.forEach((levelEl) => {
                const level = parseInt(levelEl.dataset.level);
                if (level === 1) {
                  levelEl.addEventListener('click', () => {
                    // 第一关被选中，延迟显示旁白以确保游戏初始化完成
                    setTimeout(showAILevel1Narration, 1000);
                  });
                }
                // 处理第二关
                else if (level === 2) {
                  levelEl.addEventListener('click', () => {
                    // 第二关被选中，延迟显示旁白以确保游戏初始化完成
                    setTimeout(showAILevel2Narration, 1000);
                  });
                }
                // 处理第三关
                else if (level === 3) {
                  levelEl.addEventListener('click', () => {
                    // 第三关被选中，延迟显示旁白以确保游戏初始化完成
                    setTimeout(showAILevel3Narration, 1000);
                  });
                }
                // 处理第四关
                else if (level === 4) {
                  levelEl.addEventListener('click', () => {
                    // 第四关被选中，延迟显示旁白以确保游戏初始化完成
                    setTimeout(showAILevel4Narration, 1000);
                  });
                }
              });
            }, 500);
          });
        }
      });
    });

    // 开始观察body的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// 暴露函数到全局，以便其他脚本可以调用
window.showAILevel1Narration = showAILevel1Narration;
window.showAILevel2Narration = showAILevel2Narration;
window.showAILevel3Narration = showAILevel3Narration;
// 在showAILevel4Narration函数后添加

/**
 * 显示三神鸟提示浮窗
 */
function showLegendaryBirdsMessage() {
    // 初始化旁白系统
    initNarrationSystem();
    
    // 使用现有的旁白系统显示消息
    showNarration('神鸟卷起旋风，他们只允许三位猛士登上山顶！', 4000);
}

// 在文件末尾添加

/**
 * 更新三神鸟领取按钮状态
 */
// 如果game-messages.js文件中存在updateLegendaryBirdsButtons函数，修改它
function updateLegendaryBirdsButtons() {
    try {
        // 检查是否已通关第四关
        const hasCompletedFourthLevel = localStorage.getItem('fourthLevelCompleted') === 'true';
        
        // 获取领取按钮
        const moltresBtn = document.getElementById('redeem-moltres-btn');
        const zapdosBtn = document.getElementById('redeem-zapdos-btn');
        const articunoBtn = document.getElementById('redeem-articuno-btn');
        
        // 按钮配置数组
        const buttons = [
            { btn: moltresBtn, code: 'moltres123698745' },
            { btn: zapdosBtn, code: 'zapdos789632541' },
            { btn: articunoBtn, code: 'articuno457896321' }
        ];
        
        // 如果已通关第四关，启用按钮
        if (hasCompletedFourthLevel) {
            buttons.forEach(({ btn, code }) => {
                if (btn) {
                    // 更改按钮样式为绿色可点击状态
                    btn.classList.remove('bg-gray-600', 'hover:bg-gray-500', 'cursor-not-allowed', 'opacity-50');
                    btn.classList.add('bg-green-600', 'hover:bg-green-500', 'cursor-pointer', 'opacity-100');
                    
                    // 添加点击事件，触发兑换码输入
                    btn.addEventListener('click', function() {
                        // 查找兑换码相关元素
                        const redeemModal = document.getElementById('redeem-modal');
                        const redeemCodeInput = document.getElementById('redeem-code-input');
                        const confirmRedeemBtn = document.getElementById('confirm-redeem-btn');
                        
                        if (redeemModal && redeemCodeInput && confirmRedeemBtn) {
                            // 如果活动浮窗是打开的，先关闭它
                            const eventsModal = document.getElementById('events-modal');
                            if (eventsModal && !eventsModal.classList.contains('hidden')) {
                                eventsModal.classList.add('hidden');
                                document.body.classList.remove('overflow-hidden');
                            }
                            
                            // 打开兑换码弹窗
                            redeemModal.classList.remove('hidden');
                            document.body.classList.add('overflow-hidden');
                            
                            // 输入兑换码
                            redeemCodeInput.value = code;
                            
                            // 触发兑换码验证（短暂延迟确保弹窗已完全打开）
                            setTimeout(() => {
                                const event = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                confirmRedeemBtn.dispatchEvent(event);
                            }, 500);
                        }
                    });
                }
            });
        }
        
        // 检查是否已经领取过任意一只神鸟
        const hasMoltres = localStorage.getItem('hasMoltres') === 'true';
        const hasZapdos = localStorage.getItem('hasZapdos') === 'true';
        const hasArticuno = localStorage.getItem('hasArticuno') === 'true';
        
        // 如果已经领取过任意一只神鸟，禁用其他神鸟的领取按钮
        if (hasMoltres || hasZapdos || hasArticuno) {
            const moltresBtn = document.getElementById('redeem-moltres-btn');
            const zapdosBtn = document.getElementById('redeem-zapdos-btn');
            const articunoBtn = document.getElementById('redeem-articuno-btn');
            
            // 禁用未领取的神鸟按钮
            if (moltresBtn && !hasMoltres) {
                moltresBtn.disabled = true;
                moltresBtn.classList.add('bg-gray-600', 'cursor-not-allowed', 'opacity-50');
                moltresBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                moltresBtn.onclick = null;
            }
            
            if (zapdosBtn && !hasZapdos) {
                zapdosBtn.disabled = true;
                zapdosBtn.classList.add('bg-gray-600', 'cursor-not-allowed', 'opacity-50');
                zapdosBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
                zapdosBtn.onclick = null;
            }
            
            if (articunoBtn && !hasArticuno) {
                articunoBtn.disabled = true;
                articunoBtn.classList.add('bg-gray-600', 'cursor-not-allowed', 'opacity-50');
                articunoBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                articunoBtn.onclick = null;
            }
        }
    } catch (error) {
        console.error('更新三神鸟按钮状态时出错:', error);
    }
}

// 暴露函数到全局
window.updateLegendaryBirdsButtons = updateLegendaryBirdsButtons;

// 在DOM加载完成后检查通关状态并更新按钮
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateLegendaryBirdsButtons);
}

// 修改showFourthLevelCompletionMessage函数，添加保存通关状态的逻辑
function showFourthLevelCompletionMessage() {
    // 初始化旁白系统
    initNarrationSystem();
    
    // 使用现有的旁白系统显示通关提示消息
    showNarration('恭喜你通过了考验，选择一份力量带走吧，是熊熊的烈焰，是颤瑟的雷电，还是刺骨的寒风？', 6000);
    
    // 保存第四关通关状态到localStorage
    try {
        localStorage.setItem('fourthLevelCompleted', 'true');
        console.log('第四关通关状态已保存');
        
        // 尝试立即更新三神鸟领取按钮状态
        setTimeout(updateLegendaryBirdsButtons, 1000);
    } catch (error) {
        console.error('保存第四关通关状态时出错:', error);
    }
}

// 暴露函数到全局，以便其他脚本可以调用
window.showFourthLevelCompletionMessage = showFourthLevelCompletionMessage;
// 在文件末尾暴露函数到全局
window.showLegendaryBirdsMessage = showLegendaryBirdsMessage;
