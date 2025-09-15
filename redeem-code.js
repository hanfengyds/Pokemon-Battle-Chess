// 兑换码功能的独立实现
// 这个文件应该在index.html中的所有其他脚本之后引入

// 页面加载时检查localStorage，恢复巨钳螳螂和三神鸟
// 在 restoreSpecialPokemonFromLocalStorage 函数中添加恢复恶食大王的逻辑
function restoreSpecialPokemonFromLocalStorage() {
    try {
        // 检查全局pokemonData是否已加载
        if (!window.pokemonData) return;
        
        // 检查并恢复巨钳螳螂
        const hasScizor = localStorage.getItem('hasScizor') === 'true';
        if (hasScizor && !window.pokemonData.some(p => p.id === 'scizor')) {
            console.log('从localStorage恢复巨钳螳螂');
            
            const playerScizor = {
                id: 'scizor',
                name: '巨钳螳螂',
                hp: 3.5,
                atk: 2,
                move: 2,
                type: ['bug','steel'],
                typeName: ['虫','钢'],
                image: 'ai-pokemon/巨钳螳螂.gif'
            };
            
            window.pokemonData.push(playerScizor);
        }
        
        // 检查并恢复火焰鸟
        const hasMoltres = localStorage.getItem('hasMoltres') === 'true';
        if (hasMoltres && !window.pokemonData.some(p => p.id === 'moltres')) {
            console.log('从localStorage恢复火焰鸟');
            
            const playerMoltres = {
                id: 'moltres',
                name: '火焰鸟',
                hp: 4.5,
                atk: 2,
                move: 2,
                type: ['fire','flying'],
                typeName: ['火','飞行'],
                image: 'ai-pokemon/火焰鸟.gif'
            };
            
            window.pokemonData.push(playerMoltres);
        }
        
        // 检查并恢复闪电鸟
        const hasZapdos = localStorage.getItem('hasZapdos') === 'true';
        if (hasZapdos && !window.pokemonData.some(p => p.id === 'zapdos')) {
            console.log('从localStorage恢复闪电鸟');
            
            const playerZapdos = {
                id: 'zapdos',
                name: '闪电鸟',
                hp: 4.5,
                atk: 2,
                move: 2.5,
                type: ['electric','flying'],
                typeName: ['电','飞行'],
                image: 'ai-pokemon/闪电鸟.gif'
            };
            
            window.pokemonData.push(playerZapdos);
        }
        
        // 检查并恢复急冻鸟
        const hasArticuno = localStorage.getItem('hasArticuno') === 'true';
        if (hasArticuno && !window.pokemonData.some(p => p.id === 'articuno')) {
            console.log('从localStorage恢复急冻鸟');
            
            const playerArticuno = {
                id: 'articuno',
                name: '急冻鸟',
                hp: 6.5,
                atk: 1.5,
                move: 2,
                type: ['ice','flying'],
                typeName: ['冰','飞行'],
                image: 'ai-pokemon/急冻鸟.gif'
            };
            
            window.pokemonData.push(playerArticuno);
        }
        
        // 新增：检查并恢复恶食大王
        const hasGuzzlord = localStorage.getItem('hasGuzzlord') === 'true';
        if (hasGuzzlord && !window.pokemonData.some(p => p.id === 'guzzlord')) {
            console.log('从localStorage恢复恶食大王');
            
            const playerGuzzlord = {
                id: 'guzzlord',
                name: '恶食大王',
                hp: 5,
                atk: 2,
                move: 2,
                type: ['dark','dragon'],
                typeName: ['恶','龙'],
                image: 'player-pokemon/恶食大王.gif'
            };
            
            window.pokemonData.push(playerGuzzlord);
        }
        
        // 如果棋包已经创建，更新棋包显示
        if (typeof createPokemonPack === 'function') {
            createPokemonPack();
        }
        
        // 检查并移除已领取的三神鸟浮窗部分
        checkAndRemoveLegendaryBirdElements();
    } catch (error) {
        console.error('从localStorage恢复特殊宝可梦时出错:', error);
    }
}

// 检查并移除已领取的三神鸟浮窗部分
function checkAndRemoveLegendaryBirdElements() {
    try {
        // 获取活动精灵浮窗
        const eventsModalContent = document.querySelector('#events-modal .modal-content');
        if (!eventsModalContent) return;
        
        // 检查火焰鸟
        const hasMoltres = localStorage.getItem('hasMoltres') === 'true';
        if (hasMoltres) {
            const moltresElement = document.querySelector('#events-modal .bg-gray-700/50.border-l-4.border-red-500');
            if (moltresElement) {
                moltresElement.remove();
                console.log('已移除火焰鸟浮窗部分');
            }
        }
        
        // 检查闪电鸟
        const hasZapdos = localStorage.getItem('hasZapdos') === 'true';
        if (hasZapdos) {
            const zapdosElement = document.querySelector('#events-modal .bg-gray-700/50.border-l-4.border-yellow-500');
            if (zapdosElement) {
                zapdosElement.remove();
                console.log('已移除闪电鸟浮窗部分');
            }
        }
        
        // 检查急冻鸟
        const hasArticuno = localStorage.getItem('hasArticuno') === 'true';
        if (hasArticuno) {
            const articunoElement = document.querySelector('#events-modal .bg-gray-700/50.border-l-4.border-blue-300');
            if (articunoElement) {
                articunoElement.remove();
                console.log('已移除急冻鸟浮窗部分');
            }
        }
        
        // 检查是否所有三神鸟都已移除，如果是，可以添加提示或移除整个浮窗
        const remainingBirds = document.querySelectorAll('#events-modal .bg-gray-700/50');
        if (remainingBirds.length === 1) { // 只剩巨钳螳螂
            // 可以选择移除整个浮窗或者保留巨钳螳螂部分
            // 这里选择保留巨钳螳螂部分
        }
    } catch (error) {
        console.error('移除三神鸟浮窗部分时出错:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 首先尝试从localStorage恢复特殊宝可梦
    restoreSpecialPokemonFromLocalStorage();
    
    // 检查兑换码相关元素是否存在
    const redeemModal = document.getElementById('redeem-modal');
    const redeemBtn = document.getElementById('redeem-code-btn');
    const closeRedeemBtn = document.getElementById('close-redeem-btn');
    const confirmRedeemBtn = document.getElementById('confirm-redeem-btn');
    const redeemCodeInput = document.getElementById('redeem-code-input');
    
    // 只有当所有元素都存在时才继续
    if (!redeemModal || !redeemBtn || !closeRedeemBtn || !confirmRedeemBtn || !redeemCodeInput) {
        console.error('无法找到兑换码功能所需的DOM元素');
        return;
    }
    
    console.log('兑换码功能已加载');
    
    // 打开兑换码弹窗
    redeemBtn.addEventListener('click', function() {
        console.log('点击了兑换码按钮，打开弹窗');
        redeemModal.classList.remove('hidden');
        redeemCodeInput.value = '';
        // 清除之前可能存在的提示信息
        clearInputMessage();
    });
    
    // 关闭兑换码弹窗
    closeRedeemBtn.addEventListener('click', function() {
        redeemModal.classList.add('hidden');
    });
    
    // 点击弹窗外部关闭
    redeemModal.addEventListener('click', function(e) {
        if (e.target === redeemModal) {
            redeemModal.classList.add('hidden');
        }
    });
    
    // 在输入框内显示消息函数
    function showInputMessage(message, type = 'info') {
        // 先清除之前的消息
        clearInputMessage();
        
        // 设置输入框的值为消息
        redeemCodeInput.value = message;
        
        // 根据消息类型设置输入框样式
        if (type === 'success') {
            redeemCodeInput.style.color = 'green';
            redeemCodeInput.style.borderColor = 'green';
        } else if (type === 'error') {
            redeemCodeInput.style.color = 'red';
            redeemCodeInput.style.borderColor = 'red';
        } else {
            redeemCodeInput.style.color = 'orange';
            redeemCodeInput.style.borderColor = 'orange';
        }
        
        // 5秒后自动清除消息和样式
        setTimeout(() => {
            clearInputMessage();
        }, 5000);
    }
    
    // 清除输入框消息和样式
    function clearInputMessage() {
        redeemCodeInput.value = '';
        redeemCodeInput.style.color = '';
        redeemCodeInput.style.borderColor = '';
    }
    
    // 确认兑换
    // 修改确认兑换按钮的点击事件处理函数，添加神鸟兑换限制检测
    confirmRedeemBtn.addEventListener('click', function() {
    const code = redeemCodeInput.value.trim().toLowerCase();
    let pokemonAdded = false;
    let pokemonName = '';
    let pokemonId = '';
    
    // 检查是否是神鸟兑换码
    const isLegendaryCode = ['moltres123698745', 'zapdos789632541', 'articuno457896321'].includes(code);
    
    // 如果是神鸟兑换码，先检查是否已经领取过任何一只神鸟
    if (isLegendaryCode) {
        const hasMoltres = localStorage.getItem('hasMoltres') === 'true';
        const hasZapdos = localStorage.getItem('hasZapdos') === 'true';
        const hasArticuno = localStorage.getItem('hasArticuno') === 'true';
        
        // 检查是否已经领取过任意一只神鸟
        if (hasMoltres || hasZapdos || hasArticuno) {
            // 在输入框内显示提示消息
            showInputMessage('你已经得到了神明的赐福，切勿贪心', 'error');
            
            // 在消息区域也显示提示
            if (typeof addMessage === 'function') {
                addMessage('⚠️你已经得到了神明的赐福，切勿贪心⚠️', 'warning');
            }
            
            return; // 阻止继续兑换
        }
    }
    
    // 检查巨钳螳螂兑换码
    if (code === 'hanfongyds') {
        // 检查全局pokemonData是否存在
        if (window.pokemonData) {
            // 检查巨钳螳螂是否已经在棋包中
            const scizorExists = window.pokemonData.some(p => p.id === 'scizor');
            
            if (!scizorExists) {
                // 直接定义巨钳螳螂数据
                const playerScizor = {
                    id: 'scizor',
                    name: '巨钳螳螂',
                    hp: 3.5,
                    atk: 2,
                    move: 2,
                    type: ['bug','steel'],
                    typeName: ['虫','钢'],
                    image: 'ai-pokemon/巨钳螳螂.gif'
                };
                
                // 将巨钳螳螂添加到玩家棋包
                window.pokemonData.push(playerScizor);
                
                // 在输入框内显示成功消息
                showInputMessage('兑换成功！', 'success');
                
                // 保存到localStorage
                try {
                    localStorage.setItem('hasScizor', 'true');
                    console.log('成功将巨钳螳螂信息保存到localStorage');
                } catch (error) {
                    console.error('保存到localStorage时出错:', error);
                }
                
                pokemonAdded = true;
                pokemonName = '巨钳螳螂';
                pokemonId = 'scizor';
            } else {
                // 在输入框内显示信息
                showInputMessage('您已经拥有巨钳螳螂了！', 'info');
            }
        } else {
            showInputMessage('数据加载失败，请刷新页面重试', 'error');
        }
    }
    // 检查火焰鸟兑换码
    else if (code === 'moltres123698745') {
        if (window.pokemonData) {
            const exists = window.pokemonData.some(p => p.id === 'moltres');
            
            if (!exists) {
                const playerMoltres = {
                    id: 'moltres',
                    name: '火焰鸟',
                    hp: 4.5,
                    atk: 2,
                    move: 2,
                    type: ['fire','flying'],
                    typeName: ['火','飞行'],
                    image: 'ai-pokemon/火焰鸟.gif'
                };
                
                window.pokemonData.push(playerMoltres);
                showInputMessage('兑换成功！', 'success');
                
                try {
                    localStorage.setItem('hasMoltres', 'true');
                    console.log('成功将火焰鸟信息保存到localStorage');
                } catch (error) {
                    console.error('保存到localStorage时出错:', error);
                }
                
                pokemonAdded = true;
                pokemonName = '火焰鸟';
                pokemonId = 'moltres';
            } else {
                showInputMessage('您已经拥有火焰鸟了！', 'info');
            }
        } else {
            showInputMessage('数据加载失败，请刷新页面重试', 'error');
        }
    }
    // 检查闪电鸟兑换码
    else if (code === 'zapdos789632541') {
        if (window.pokemonData) {
            const exists = window.pokemonData.some(p => p.id === 'zapdos');
            
            if (!exists) {
                const playerZapdos = {
                    id: 'zapdos',
                    name: '闪电鸟',
                    hp: 4.5,
                    atk: 2,
                    move: 2.5,
                    type: ['electric','flying'],
                    typeName: ['电','飞行'],
                    image: 'ai-pokemon/闪电鸟.gif'
                };
                
                window.pokemonData.push(playerZapdos);
                showInputMessage('兑换成功！', 'success');
                
                try {
                    localStorage.setItem('hasZapdos', 'true');
                    console.log('成功将闪电鸟信息保存到localStorage');
                } catch (error) {
                    console.error('保存到localStorage时出错:', error);
                }
                
                pokemonAdded = true;
                pokemonName = '闪电鸟';
                pokemonId = 'zapdos';
            } else {
                showInputMessage('您已经拥有闪电鸟了！', 'info');
            }
        } else {
            showInputMessage('数据加载失败，请刷新页面重试', 'error');
        }
    }
    // 检查急冻鸟兑换码
    else if (code === 'articuno457896321') {
        if (window.pokemonData) {
            const exists = window.pokemonData.some(p => p.id === 'articuno');
            
            if (!exists) {
                const playerArticuno = {
                    id: 'articuno',
                    name: '急冻鸟',
                    hp: 5.5,
                    atk: 1.5,
                    move: 2,
                    type: ['ice','flying'],
                    typeName: ['冰','飞行'],
                    image: 'ai-pokemon/急冻鸟.gif'
                };
                
                window.pokemonData.push(playerArticuno);
                showInputMessage('兑换成功！', 'success');
                
                try {
                    localStorage.setItem('hasArticuno', 'true');
                    console.log('成功将急冻鸟信息保存到localStorage');
                } catch (error) {
                    console.error('保存到localStorage时出错:', error);
                }
                
                pokemonAdded = true;
                pokemonName = '急冻鸟';
                pokemonId = 'articuno';
            } else {
                showInputMessage('您已经拥有急冻鸟了！', 'info');
            }
        } else {
            showInputMessage('数据加载失败，请刷新页面重试', 'error');
        }
    }
    // 新增：检查恶食大王兑换码
    else if (code === 'guzzlord') {
        if (window.pokemonData) {
            const exists = window.pokemonData.some(p => p.id === 'guzzlord');
            
            if (!exists) {
                const playerGuzzlord = {
                    id: 'guzzlord',
                    name: '恶食大王',
                    hp: 5,
                    atk: 2,
                    move: 2,
                    type: ['dark','dragon'],
                    typeName: ['恶','龙'],
                    image: 'player-pokemon/恶食大王.gif'
                };
                
                window.pokemonData.push(playerGuzzlord);
                showInputMessage('兑换成功！', 'success');
                
                try {
                    localStorage.setItem('hasGuzzlord', 'true');
                    console.log('成功将恶食大王信息保存到localStorage');
                } catch (error) {
                    console.error('保存到localStorage时出错:', error);
                }
                
                pokemonAdded = true;
                pokemonName = '恶食大王';
                pokemonId = 'guzzlord';
            } else {
                showInputMessage('您已经拥有恶食大王了！', 'info');
            }
        } else {
            showInputMessage('数据加载失败，请刷新页面重试', 'error');
        }
    }
    else {
        // 在输入框内显示错误消息
        showInputMessage('兑换码错误，请重试', 'error');
    }
    
    // 在pokemonAdded条件判断内部添加标记逻辑
    
    // 如果添加了新宝可梦，更新UI
    if (pokemonAdded) {
        // 在消息区域播报获得精灵的信息
        if (typeof addMessage === 'function') {
            addMessage(`🎉恭喜获得隐藏精灵 ${pokemonName}🎉！`, 'success');
        } else {
            console.log(`🎉恭喜获得隐藏精灵 ${pokemonName}🎉！`);
        }
        
        // 检查是否是神鸟
        const isLegendaryBird = ['火焰鸟', '闪电鸟', '急冻鸟'].includes(pokemonName);
        if (isLegendaryBird) {
            // 标记为已领取过神鸟
            try {
                localStorage.setItem('hasClaimedLegendaryBird', 'true');
                console.log('已标记为领取过神鸟');
            } catch (error) {
                console.error('保存神鸟领取状态时出错:', error);
            }
            
            // 移除对应的神鸟浮窗部分
            checkAndRemoveLegendaryBirdElements();
            
            // 如果updateLegendaryBirdsButtons函数存在，调用它来更新按钮状态
            if (typeof updateLegendaryBirdsButtons === 'function') {
                setTimeout(updateLegendaryBirdsButtons, 1000);
            }
        }
        
        // 强制更新棋包显示，无论棋包是否打开
        if (typeof createPokemonPack === 'function') {
            const packModal = document.getElementById('pack-modal');
            const wasPackOpen = packModal && !packModal.classList.contains('hidden');
            
            // 如果棋包没打开，先打开再关闭以刷新数据
            if (!wasPackOpen && typeof openPack === 'function' && typeof closePack === 'function') {
                openPack();
                setTimeout(() => {
                    closePack();
                }, 100);
            } else {
                // 直接更新
                createPokemonPack();
            }
        }
        
        // 3秒后关闭弹窗
        setTimeout(() => {
            redeemModal.classList.add('hidden');
        }, 3000);
    }
    });
});

// 为恶食大王领取按钮添加点击事件
const redeemGuzzlordBtn = document.getElementById('redeem-guzzlord-btn');
if (redeemGuzzlordBtn) {
    redeemGuzzlordBtn.addEventListener('click', function() {
        // 直接执行领取恶食大王的逻辑
        // 添加恶食大王到玩家的特殊宝可梦列表
        try {
            // 检查是否已经拥有恶食大王
            const exists = window.pokemonData && window.pokemonData.some(p => p.id === 'guzzlord');
            
            if (!exists) {
                // 添加恶食大王数据
                const playerGuzzlord = {
                    id: 'guzzlord',
                    name: '恶食大王',
                    hp: 5,
                    atk: 2,
                    move: 2,
                    type: ['dark','dragon'],
                    typeName: ['恶','龙'],
                    image: 'player-pokemon/恶食大王.gif'
                };
                
                // 将恶食大王添加到玩家棋包
                window.pokemonData.push(playerGuzzlord);
                
                // 保存到localStorage
                localStorage.setItem('hasGuzzlord', 'true');
                
                // 在消息区域显示成功消息
                if (typeof addMessage === 'function') {
                    addMessage('🎉恭喜获得隐藏精灵 恶食大王🎉！', 'success');
                }
                
                // 更新按钮状态为已领取
                this.textContent = '已领取';
                this.classList.remove('bg-green-600', 'hover:bg-green-500');
                this.classList.add('bg-gray-600', 'cursor-not-allowed', 'opacity-50');
                this.disabled = true;
                
                // 强制更新棋包显示
                if (typeof createPokemonPack === 'function') {
                    const packModal = document.getElementById('pack-modal');
                    const wasPackOpen = packModal && !packModal.classList.contains('hidden');
                    
                    // 如果棋包没打开，先打开再关闭以刷新数据
                    if (!wasPackOpen && typeof openPack === 'function' && typeof closePack === 'function') {
                        openPack();
                        setTimeout(() => {
                            closePack();
                        }, 100);
                    } else {
                        // 直接更新
                        createPokemonPack();
                    }
                }
            } else {
                // 已经领取过了
                if (typeof addMessage === 'function') {
                    addMessage('您已经拥有恶食大王了！', 'info');
                }
            }
        } catch (error) {
            console.error('领取恶食大王时出错:', error);
            if (typeof addMessage === 'function') {
                addMessage('领取失败，请刷新页面重试', 'error');
            }
        }
    });
}

// 在页面加载时检查恶食大王是否已领取
window.addEventListener('load', function() {
    // 检查火焰鸟兑换码
    const hasMoltres = localStorage.getItem('hasMoltres') === 'true';
    if (hasMoltres) {
        const moltresElement = document.querySelector('#events-modal .bg-gray-700/50.border-l-4.border-red-500');
        if (moltresElement) {
            moltresElement.remove();
            console.log('已移除火焰鸟浮窗部分');
        }
    }
    
    // 检查闪电鸟兑换码
    const hasZapdos = localStorage.getItem('hasZapdos') === 'true';
    if (hasZapdos) {
        const zapdosElement = document.querySelector('#events-modal .bg-gray-700/50.border-l-4.border-yellow-500');
        if (zapdosElement) {
            zapdosElement.remove();
            console.log('已移除闪电鸟浮窗部分');
        }
    }
    
    // 检查急冻鸟兑换码
    const hasArticuno = localStorage.getItem('hasArticuno') === 'true';
    if (hasArticuno) {
        const articunoElement = document.querySelector('#events-modal .bg-gray-700/50.border-l-4.border-blue-300');
        if (articunoElement) {
            articunoElement.remove();
            console.log('已移除急冻鸟浮窗部分');
        }
    }
    
    // 检查是否所有三神鸟都已移除，如果是，可以添加提示或移除整个浮窗
    const remainingBirds = document.querySelectorAll('#events-modal .bg-gray-700/50');
    if (remainingBirds.length === 1) { // 只剩巨钳螳螂
        // 可以选择移除整个浮窗或者保留巨钳螳螂部分
        // 这里选择保留巨钳螳螂部分
    }
    
    // 检查恶食大王领取状态
    const hasGuzzlord = localStorage.getItem('hasGuzzlord') === 'true';
    const redeemGuzzlordBtn = document.getElementById('redeem-guzzlord-btn');
    if (redeemGuzzlordBtn && hasGuzzlord) {
        redeemGuzzlordBtn.textContent = '已领取';
        redeemGuzzlordBtn.classList.remove('bg-green-600', 'hover:bg-green-500');
        redeemGuzzlordBtn.classList.add('bg-gray-600', 'cursor-not-allowed', 'opacity-50');
        redeemGuzzlordBtn.disabled = true;
    }
});
