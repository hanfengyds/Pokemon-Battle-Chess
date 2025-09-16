// 战棋道具浮窗功能实现

// 定义进化石数据
const evolutionStones = [
    {
        id: "pidgeot-stone",
        name: "超级比雕进化石",
        description: "蕴含神奇的力量，可以让比雕超级进化",
        image: "items/超级比雕进化石.png"
    },
    {
        id: "absol-stone",
        name: "超级阿勃梭鲁进化石",
        description: "蕴含神奇的力量，可以让阿勃梭鲁超级进化",
        image: "items/超级阿勃梭鲁进化石.png"
    },
    {
        id: "steelix-stone",
        name: "超级大钢蛇进化石",
        description: "蕴含神奇的力量，可以让大钢蛇超级进化",
        image: "items/超级大钢蛇进化石.png"
    },
    {
        id: "alakazam-stone",
        name: "超级胡地进化石",
        description: "蕴含神奇的力量，可以让胡地超级进化",
        image: "items/超级胡地进化石.png"
    },
        {
        id: "scizor-stone",
        name: "超级巨钳螳螂进化石",
        description: "蕴含神奇的力量，可以让巨钳螳螂超级进化",
        image: "items/超级巨钳螳螂进化石.png"
    },
            {
        id: "gengar-stone",
        name: "超级耿鬼进化石",
        description: "蕴含神奇的力量，可以让耿鬼超级进化",
        image: "items/超级耿鬼进化石.png"
    },
    // 可以在这里添加其他进化石数据
];

// 创建浮窗的HTML结构
function createChessItemsModal() {
    // 检查浮窗是否已存在
    if (document.getElementById('chess-items-modal')) {
        return;
    }

    // 创建浮窗元素
    const modalHTML = `
        <div id="chess-items-modal"
            class="fixed inset-0 bg-black/70 z-50 hidden flex items-center justify-center backdrop-blur-sm">
            <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <div class="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 class="text-2xl font-bold">战棋道具</h2>
                    <button id="close-chess-items-btn" class="text-gray-400 hover:text-white text-2xl transition-colors">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div id="chess-items-container" class="flex-grow overflow-y-auto p-4">
                    <!-- 道具列表将在这里动态生成 -->
                </div>
            </div>
        </div>
    `;

    // 添加浮窗到body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 初始化道具列表
    renderChessItems();

    // 添加关闭按钮事件
    document.getElementById('close-chess-items-btn').addEventListener('click', closeChessItemsModal);

    // 添加点击浮窗外部关闭浮窗的功能
    document.getElementById('chess-items-modal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeChessItemsModal();
        }
    });
}

// 存储已佩戴的进化石状态
let wornStones = {};

// 清除其他已佩戴的进化石（互斥佩戴限制）
function clearOtherWornStones(currentStoneId) {
    // 遍历所有进化石
    evolutionStones.forEach(stone => {
        // 检查是否是进化石（id包含-stone）并且不是当前要佩戴的进化石
        if (stone.id.includes('-stone') && stone.id !== currentStoneId && wornStones[stone.id]) {
            // 取消其他进化石的佩戴状态
            wornStones[stone.id] = false;
            
            // 获取对应的宝可梦id（去掉-stone后缀）
            const pokemonBaseId = stone.id.replace('-stone', '');
            
            // 查找对应的宝可梦并恢复其普通形态
            const pokemonIndex = window.pokemonData.findIndex(pokemon => {
                // 查找对应的普通形态或超级形态
                return pokemon.id === pokemonBaseId || pokemon.id === pokemonBaseId + '-mega';
            });
            
            if (pokemonIndex !== -1) {
                const currentPokemon = window.pokemonData[pokemonIndex];
                // 检查是否是超级形态
                if (currentPokemon.id.includes('-mega')) {
                    // 实际恢复为普通形态
                    if (pokemonBaseId === 'pidgeot') {
                        // 恢复为普通比雕
                        window.pokemonData[pokemonIndex] = {
                            id: 'pidgeot',
                            name: '比雕',
                            hp: 3.5,
                            atk: 1.5,
                            move: 2.5,
                            type: ['normal', 'flying'],
                            typeName: ['一般', '飞行'],
                            image: 'player-pokemon/比雕.gif'
                        };
                    } else if (pokemonBaseId === 'absol') {
                        // 恢复为普通阿勃梭鲁
                        window.pokemonData[pokemonIndex] = {
                            id: 'absol',
                            name: '阿勃梭鲁',
                            hp: 3.5,
                            atk: 1.5,
                            move: 2.5,
                            type: 'dark',
                            typeName: '恶',
                            image: 'player-pokemon/阿勃梭鲁.gif'
                        };
                    }
                    // 可以根据需要添加更多进化石的恢复逻辑
                }
            }
        }
    });
}

// 渲染战棋道具列表
function renderChessItems() {
    const container = document.getElementById('chess-items-container');
    container.innerHTML = '';

    if (evolutionStones.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-center py-8">暂无可用道具</p>';
        return;
    }

    // 创建道具容器 - 改为垂直布局，每个道具单独一行
    const containerElement = document.createElement('div');
    containerElement.className = 'flex flex-col gap-4';

    // 为每个道具创建卡片
    evolutionStones.forEach(stone => {
        const card = document.createElement('div');
        card.className = 'bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-center hover:border-primary transition-colors';

        // 道具图片
        const image = document.createElement('img');
        image.src = stone.image;
        image.alt = stone.name;
        image.className = 'w-16 h-16 object-contain mr-4';

        // 道具信息
        const infoContainer = document.createElement('div');
        infoContainer.className = 'flex-grow';

        const name = document.createElement('h3');
        name.className = 'font-bold text-lg mb-1';
        name.textContent = stone.name;

        const description = document.createElement('p');
        description.className = 'text-gray-400 text-sm';
        description.textContent = stone.description;

        infoContainer.appendChild(name);
        infoContainer.appendChild(description);
        
        // 先添加图片和信息到卡片
        card.appendChild(image);
        card.appendChild(infoContainer);
        
        // 添加佩戴按钮 - 只对超级比雕进化石添加
        if (stone.id === 'pidgeot-stone') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mr-4'; // 与右侧保持间距
            
            const wearButton = document.createElement('button');
            wearButton.className = wornStones['pidgeot-stone'] ? 
                'bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors' : 
                'bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 transition-colors';
            wearButton.textContent = wornStones['pidgeot-stone'] ? '已佩戴' : '佩戴';
            wearButton.onclick = function() {
                togglePidgeotEvolution();
            };
            
            buttonContainer.appendChild(wearButton);
            card.appendChild(buttonContainer);
        }
        
        // 添加超级阿勃梭鲁进化石的佩戴按钮
        if (stone.id === 'absol-stone') {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'mr-4'; // 与右侧保持间距
            
            const wearButton = document.createElement('button');
            wearButton.className = wornStones['absol-stone'] ? 
                'bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors' : 
                'bg-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-400 transition-colors';
            wearButton.textContent = wornStones['absol-stone'] ? '已佩戴' : '佩戴';
            wearButton.onclick = function() {
                toggleAbsolEvolution();
            };
            
            buttonContainer.appendChild(wearButton);
            card.appendChild(buttonContainer);
        }

        containerElement.appendChild(card);
    });

    container.appendChild(containerElement);
}

// 切换比雕的进化状态
function togglePidgeotEvolution() {
    // 检查pokemonData是否存在
    if (!window.pokemonData || !Array.isArray(window.pokemonData)) {
        console.error('pokemonData不存在或格式不正确');
        showItemWornMessage('无法完成进化：数据错误');
        return;
    }
    
    const pidgeotIndex = window.pokemonData.findIndex(pokemon => pokemon.id === 'pidgeot' || pokemon.id === 'pidgeot-mega');
    
    if (pidgeotIndex !== -1) {
        // 获取当前比雕数据
        const currentPidgeot = window.pokemonData[pidgeotIndex];
        
        // 判断是否已经进化
        const isMega = currentPidgeot.id === 'pidgeot-mega';
        
        if (isMega) {
            // 恢复为普通比雕
            window.pokemonData[pidgeotIndex] = {
                id: 'pidgeot',
                name: '比雕',
                hp: 3.5,
                atk: 1.5,
                move: 2.5,
                type: ['normal', 'flying'],
                typeName: ['一般', '飞行'],
                image: 'player-pokemon/比雕.gif'
            };
            wornStones['pidgeot-stone'] = false;
        } else {
            // 清除其他已佩戴的进化石（互斥佩戴限制）
            clearOtherWornStones('pidgeot-stone');
            
            // 进化为超级比雕
            window.pokemonData[pidgeotIndex] = {
                id: 'pidgeot-mega',
                name: '超级比雕',
                hp: 3.5,
                atk: 2,
                move: 3,
                type: ['normal', 'flying'],
                typeName: ['一般', '飞行'],
                image: 'player-pokemon/超级比雕.gif'
            };
            wornStones['pidgeot-stone'] = true;
        }
        
        // 重新渲染道具列表以更新按钮状态
        renderChessItems();
        
        // 显示操作成功消息
        showItemWornMessage(isMega ? '已取消佩戴超级比雕进化石' : '比雕感受到一股强大的力量，他的模样改变了！');
        
        // 这里可以添加更新游戏界面的逻辑，比如重新加载宝可梦数据
        updateGameWithNewPokemonData();
    } else {
        // 如果棋包里没有比雕，显示提示信息
        showItemWornMessage('棋包里没有比雕，无法使用进化石');
    }
}

// 切换阿勃梭鲁的进化状态
function toggleAbsolEvolution() {
    // 检查pokemonData是否存在
    if (!window.pokemonData || !Array.isArray(window.pokemonData)) {
        console.error('pokemonData不存在或格式不正确');
        showItemWornMessage('无法完成进化：数据错误');
        return;
    }
    
    const absolIndex = window.pokemonData.findIndex(pokemon => pokemon.id === 'absol' || pokemon.id === 'absol-mega');
    
    if (absolIndex !== -1) {
        // 获取当前阿勃梭鲁数据
        const currentAbsol = window.pokemonData[absolIndex];
        
        // 判断是否已经进化
        const isMega = currentAbsol.id === 'absol-mega';
        
        if (isMega) {
            // 恢复为普通阿勃梭鲁
            window.pokemonData[absolIndex] = {
                id: 'absol',
                name: '阿勃梭鲁',
                hp: 3.5,
                atk: 1.5,
                move: 2.5,
                type: ['dark'],
                typeName: ['恶'],
                image: 'player-pokemon/阿勃梭鲁.gif'
            };
            wornStones['absol-stone'] = false;
        } else {
            // 清除其他已佩戴的进化石（互斥佩戴限制）
            clearOtherWornStones('absol-stone');
            
            // 进化为超级阿勃梭鲁
            window.pokemonData[absolIndex] = {
                id: 'absol-mega',
                name: '超级阿勃梭鲁',
                hp: 3.5,
                atk: 2,
                move: 2.5,
                type: 'dark',
                typeName: '恶',
                image: 'player-pokemon/超级阿勃梭鲁.gif'
            };
            wornStones['absol-stone'] = true;
        }
        
        // 重新渲染道具列表以更新按钮状态
        renderChessItems();
        
        // 显示操作成功消息
        showItemWornMessage(isMega ? '已取消佩戴超级阿勃梭鲁进化石' : '阿勃梭鲁感受到一股强大的力量，他的模样改变了！');
        
        // 这里可以添加更新游戏界面的逻辑，比如重新加载宝可梦数据
        updateGameWithNewPokemonData();
    } else {
        // 如果棋包里没有阿勃梭鲁，显示提示信息
        showItemWornMessage('棋包里没有阿勃梭鲁，无法使用进化石');
    }
}

// 显示佩戴/取消佩戴消息
function showItemWornMessage(message) {
    // 检查是否已存在消息元素
    let messageElement = document.getElementById('item-worn-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'item-worn-message';
        // 修改为红色透明填充
        messageElement.className = 'fixed top-4 right-4 bg-red-600/80 text-white px-4 py-2 rounded shadow-lg z-50 transition-all duration-300 transform';
        document.body.appendChild(messageElement);
        // 初始状态设置为隐藏
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(100%)';
    }
    
    // 设置消息内容
    messageElement.textContent = message;
    
    // 显示消息
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(0)';
    }, 10);
    
    // 2秒后隐藏消息
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(100%)';
        // 完全隐藏后从DOM中移除元素
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300); // 等待过渡动画完成
    }, 2000);
}

// 更新游戏数据（这里需要根据实际游戏逻辑实现）
function updateGameWithNewPokemonData() {
    // 如果游戏中有相关的更新函数，可以在这里调用
    // 例如：如果存在更新宝可梦数据的函数
    if (window.updatePokemonData) {
        window.updatePokemonData(window.pokemonData);
    }
    
    // 新增：直接调用棋包更新函数，确保界面刷新
    if (typeof updateFilteredPokemon === 'function') {
        updateFilteredPokemon();
    } else if (typeof createPokemonPack === 'function') {
        createPokemonPack();
    }
}

// 初始化时检查pokemonData是否存在
function initChessItems() {
    // 创建浮窗
    createChessItemsModal();
    
    // 确保pokemonData是全局可访问的
    if (typeof window.pokemonData === 'undefined' && typeof pokemonData !== 'undefined') {
        window.pokemonData = pokemonData;
    }

    // 为战棋道具按钮添加点击事件
    const chessItemsBtn = document.getElementById('chess-items-btn');
    if (chessItemsBtn) {
        chessItemsBtn.addEventListener('click', openChessItemsModal);
    }
}

// 打开浮窗
function openChessItemsModal() {
    const modal = document.getElementById('chess-items-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // 可以在这里添加一些打开动画
    }
}

// 关闭浮窗
function closeChessItemsModal() {
    const modal = document.getElementById('chess-items-modal');
    if (modal) {
        modal.classList.add('hidden');
        // 可以在这里添加一些关闭动画
    }
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChessItems);
} else {
    initChessItems();
}