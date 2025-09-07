// 兑换码功能的独立实现
// 这个文件应该在index.html中的所有其他脚本之后引入

document.addEventListener('DOMContentLoaded', function() {
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
    confirmRedeemBtn.addEventListener('click', function() {
        const code = redeemCodeInput.value.trim();
        
        if (code.toLowerCase() === 'hanfongyds') {
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
                    
                    // 在消息区域播报获得精灵的信息
                    if (typeof addMessage === 'function') {
                        addMessage('🎉恭喜获得隐藏精灵 巨钳螳螂🎉！', 'success');
                    } else {
                        console.log('🎉恭喜获得隐藏精灵 巨钳螳螂🎉！');
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
                } else {
                    // 在输入框内显示信息
                    showInputMessage('您已经拥有巨钳螳螂了！', 'info');
                }
            } else {
                showInputMessage('数据加载失败，请刷新页面重试', 'error');
            }
        } else {
            // 在输入框内显示错误消息
            showInputMessage('兑换码错误，请重试', 'error');
        }
    });
});