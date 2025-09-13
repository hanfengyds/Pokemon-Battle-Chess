// 宝可梦边框颜色定义
const pokemonBorderStyles = {
    // 白色边框 - 普通宝可梦
    white: {
        border: '2px solidrgb(186, 186, 186)',
        boxShadow: '0 0 8px rgba(94, 94, 94, 0.4)',
        borderRadius: '6px'
    },
    
    // 绿色边框 - 草系/恢复类宝可梦
    green: {
        border: '2px solid #4CAF50',
        boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
        borderRadius: '6px'
    },
    
    // 蓝色边框 - 水系/防御类宝可梦
    blue: {
        border: '2px solid #2196F3',
        boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)',
        borderRadius: '6px'
    },
    
    // 紫色边框 - 恶系/特殊能力宝可梦（如恶食大王）
    purple: {
        border: '3px solid #8B5FBF',
        boxShadow: '0 0 12px rgba(139, 95, 191, 0.6)',
        borderRadius: '8px'
    },
    
    // 黄色边框 - 电系/高攻击宝可梦
    yellow: {
        border: '2px solid #FFD700',
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
        borderRadius: '6px'
    }
};

// 宝可梦ID与边框颜色的映射
const pokemonBorderMapping = {
    // 恶食大王 - 紫色边框
    'guzzlord': 'purple',
    'scizor': 'blue',
    'samurott':'blue',
    
    
    // 您可以在这里添加其他宝可梦的边框映射
    // 'pikachu': 'yellow',
    // 'bulbasaur': 'green',
    // 'squirtle': 'blue',
    // 'rattata': 'white'
};

// 获取宝可梦边框样式
function getPokemonBorderStyle(pokemonId) {
    const borderColor = pokemonBorderMapping[pokemonId];
    if (borderColor && pokemonBorderStyles[borderColor]) {
        return pokemonBorderStyles[borderColor];
    }
    // 默认返回白色边框
    return pokemonBorderStyles.white;
}

// 应用边框样式到宝可梦卡片
function applyBorderToPokemonCard(cardElement, pokemonId) {
    const style = getPokemonBorderStyle(pokemonId);
    
    // 应用CSS样式
    cardElement.style.border = style.border;
    cardElement.style.boxShadow = style.boxShadow;
    cardElement.style.borderRadius = style.borderRadius;
    cardElement.style.transition = 'all 0.3s ease';
}

// 获取宝可梦介绍文本的边框和背景颜色
function getPokemonDescriptionStyle(pokemonId) {
    const borderColor = pokemonBorderMapping[pokemonId];
    
    const styleMap = {
        'purple': {
            border: 'border-purple-700',
            bg: 'bg-purple-900/50',
            text: 'text-purple-200'
        },
        'blue': {
            border: 'border-blue-700',
            bg: 'bg-blue-900/50',
            text: 'text-blue-200'
        },
        'green': {
            border: 'border-green-700',
            bg: 'bg-green-900/50',
            text: 'text-green-200'
        },
        'yellow': {
            border: 'border-yellow-700',
            bg: 'bg-yellow-900/50',
            text: 'text-yellow-200'
        },
        'white': {
            border: 'border-gray-400',
            bg: 'bg-gray-800/70',
            text: 'text-gray-200'
        }
    };
    
    if (borderColor && styleMap[borderColor]) {
        return styleMap[borderColor];
    }
    
    // 默认返回白色边框对应的样式
    return styleMap.white;
}

// 宝可梦介绍文本映射
const pokemonDescriptions = {
    // 恶食大王介绍
    'guzzlord': '吞噬一名己方棋子，至多获取其5点体力，能够突破血量上限',
    'scizor': '每回合一次，对路径上的首个敌人造成1点钢属性伤害',
    // 您可以在这里添加其他宝可梦的介绍
    'samurott': '攻击有50%概率切中要害，额外造成0.5伤害',
    // 'bulbasaur': '草系宝可梦，能够使用藤鞭攻击'
};

// 获取宝可梦介绍文本
function getPokemonDescription(pokemonId) {
    return pokemonDescriptions[pokemonId] || '';
}

// 导出函数供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        pokemonBorderStyles,
        pokemonBorderMapping,
        getPokemonBorderStyle,
        applyBorderToPokemonCard,
        getPokemonDescription,
        getPokemonDescriptionStyle  // 添加新函数到导出列表
    };
}
