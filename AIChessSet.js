// AI对战棋子数据
const aiPokemonData = [
    {
        id: 'kyogre',
        name: '盖欧卡',
        hp: 6,
        atk: 2.5,
        move: 2,
        type: 'water',
        typeName: '水',
        image: 'ai-pokemon/盖欧卡.gif',
    },
    {
        id: 'milotic',
        name: '美纳斯',
        hp: 4.5,
        atk: 1.5,
        move: 2,
        type: 'water',
        typeName: '水',
        image: 'ai-pokemon/美纳斯.gif',
    },
        {
        id: 'kyogre-primal',
        name: '原始回归盖欧卡',
        hp: 8,
        atk: 3.5,
        move: 2,
        type: 'water',
        typeName: '水',
        image: 'ai-pokemon/原始回归盖欧卡.gif',
    },
    {
        id: 'mightyena',
        name: '大狼犬',
        hp:5 ,
        atk:2 ,
        move:2 ,
        type: 'dark',
        typeName: '恶',
        image: 'ai-pokemon/大狼犬.gif',
 },
    {
        id: 'crobat',
        name: '叉字蝠',
        hp:4.5 ,
        atk:1.5 ,
        move:3 ,
        type: ['flying','poison'],
        typeName: ['飞行','毒'],
        image: 'ai-pokemon/叉字蝠.gif',
 },
    {
        id: 'muk',
        name: '臭臭泥',
        hp:5.5 ,
        atk:2 ,
        move:1 ,
        type: 'poison',
        typeName: '毒',
        image: 'ai-pokemon/臭臭泥.gif',
 },
    {
        id: 'ludicolo',
        name: '乐天河童',
        hp:4 ,
        atk:2 ,
        move:2 ,
        type: ['grass','water'],
        typeName: ['草','水'],
        image: 'ai-pokemon/乐天河童.gif',
 },
    {
        id: 'sharpedo-mega',
        name: '超级巨牙鲨',
        hp:3 ,
        atk:2.5 ,
        move:3 ,
        type: ['water','dark'],
        typeName: ['水','恶'],
        image: 'ai-pokemon/超级巨牙鲨.gif',
 },
     {
        id: 'lapras',
        name: '拉普拉斯',
        hp:5.5,
        atk:1.5,
        move:1,
        type: ['water','ice'],
        typeName: ['水','冰'],
        image: 'ai-pokemon/拉普拉斯.gif',
         },
    {   id: 'tyranitar',
        name: '班基拉斯',
        hp: 5.5,
        atk: 2,
        move: 2,
        type: ['rock','dark'],
        typeName: ['岩石','恶'],
        image: 'ai-pokemon/班基拉斯.gif',
    },
    // 添加隆隆岩数据
    {   id: 'golem',
        name: '隆隆岩',
        hp: 5,
        atk: 1.5,
        move: 1,
        type: ['rock','ground'],
        typeName: ['岩石','地面'],
        image: 'ai-pokemon/隆隆岩.gif',
    },
        {   id: 'tyrantrum',
        name: '怪颚龙',
        hp: 5.5,
        atk: 2.5,
        move: 2,
        type: ['rock','dragon'],
        typeName: ['岩石','龙'],
        image: 'ai-pokemon/怪颚龙.gif',
    },
        { id: 'cradily',
        name: '摇篮百合',
        hp: 6.5,
        atk: 1.5,
        move: 2,
        type: ['rock','grass'],
        typeName: ['岩石','草'],
        image: 'ai-pokemon/摇篮百合.gif',
    },
        { id: 'aerodactyl',
        name: '化石翼龙',
        hp: 4.5,
        atk: 2,
        move: 3,
        type: ['rock','flying'],
        typeName: ['岩石','飞行'],
        image: 'ai-pokemon/化石翼龙.gif',
    },
        { id: 'excadrill',
        name: '龙头地鼠',
        hp: 3.5,
        atk: 2.5,
        move: 2,
        type: ['ground','steel'],
        typeName: ['地面','钢'],
        image: 'ai-pokemon/龙头地鼠.gif',
    },
        { id: 'scizor',
        name: '巨钳螳螂',
        hp: 3.5,
        atk: 2,
        move: 2,
        type: ['bug','steel'],
        typeName: ['虫','钢'],
        image: 'ai-pokemon/巨钳螳螂.gif',
    },
        { id: 'moltres',
        name: '火焰鸟',
        hp: 5.5,
        atk: 2.5,
        move: 2,
        type: ['fire','flying'],
        typeName: ['火','飞行'],
        image: 'ai-pokemon/火焰鸟.gif',
    },
        { id: 'zapdos',
        name: '闪电鸟',
        hp: 4.5,
        atk: 2,
        move: 2,
        type: ['electric','flying'],
        typeName: ['电','飞行'],
        image: 'ai-pokemon/闪电鸟.gif',
    },
        { id: 'articuno',
        name: '急冻鸟',
        hp: 6.5,
        atk: 1.5,
        move: 2,
        type: ['ice','flying'],
        typeName: ['冰','飞行'],
        image: 'ai-pokemon/急冻鸟.gif',
    },
        { 
        id: 'rock',
        name: '岩石',
        hp: 1,
        atk: 0,
        move: 0,
        type: 'rock',
        typeName: '岩石',
        image: 'ai-pokemon/rock.png',
    },
        { 
        id: 'cactus',
        name: '仙人掌',
        hp: 1,
        atk: 1,
        move: 0,
        type: 'grass',
        typeName: '草',
        image: 'ai-pokemon/cactus.png',
    },
        { 
        id: 'lugia',
        name: '洛奇亚',
        hp: 8.5,
        atk: 1.5,
        move: 2,
        type: ['psychic','flying'],
        typeName: ['超能','飞行'],
        image: 'ai-pokemon/洛奇亚.gif',
    }
];

// AI关卡配置
const aiLevels = [
    {
        level: 0,
        name: '第零关 「裂空的陨落」',
        difficulty: '无',
        redirect: '裂空的陨落.html',
        aiPieces: [],
        initialPositions: []
    },   
    {
        level: 1,
        name: '第一关 「源始的海洋」',
        difficulty: '简单',
        aiPieces: [
            aiPokemonData.find(p => p.id === 'kyogre'),
            aiPokemonData.find(p => p.id === 'mightyena'),
            aiPokemonData.find(p => p.id === 'crobat'),
            aiPokemonData.find(p => p.id === 'muk'),
            aiPokemonData.find(p => p.id === 'ludicolo'),
            aiPokemonData.find(p => p.id === 'sharpedo-mega')
        ],
        initialPositions: [
            { x: 5, y: 1 }, // 盖欧卡
            { x: 5, y: 3 },//大狼犬
             { x: 6, y: 0 },//叉字蝠
            { x: 4, y: 0 }, //臭臭泥
            { x: 6, y: 2 }, //乐天河童
            { x: 4, y: 2 }//超级巨牙鲨
        ]
    },
    {
        level: 2,
        name: '第二关 「狂怒的海洋」',
        difficulty: '中等',
        aiPieces: [
            aiPokemonData.find(p => p.id === 'kyogre-primal'), // 原始回归盖欧卡
            aiPokemonData.find(p => p.id === 'mightyena'),    //大狼犬
            aiPokemonData.find(p => p.id === 'sharpedo-mega'), // 超级巨牙鲨
            aiPokemonData.find(p => p.id === 'ludicolo'),      // 乐天河童
            aiPokemonData.find(p => p.id === 'crobat') ,  // 叉字蝠
            aiPokemonData.find(p => p.id === 'muk'),  // 臭臭泥
            aiPokemonData.find(p => p.id === 'milotic'),  // 美纳斯
            aiPokemonData.find(p => p.id === 'lapras'),   // 拉普拉斯
        ],
        initialPositions: [
            { x: 4, y: 1 },  // 原始回归盖欧卡（中心位置）
            { x: 4, y: 3 },  // 大狼犬
            { x: 7, y: 4 },  // 超级巨牙鲨
            { x: 2, y: 4 },// 乐天河童
            { x: 5, y: 3 } , // 叉字蝠
            { x: 3, y: 3 },  // 臭臭泥
            { x: 6, y: 4 },  //美纳斯
            { x: 1, y: 4 },  //拉普拉斯
        ]
    },
        {
        level: 3,
        name: '第三关 「沙漠的暴君」',
        difficulty: '普通',
        aiPieces: [
            aiPokemonData.find(p => p.id === 'tyranitar'),
            aiPokemonData.find(p => p.id === 'tyranitar'), // 班基拉斯（沙漠暴君）
            aiPokemonData.find(p => p.id === 'golem'), //隆隆岩
            aiPokemonData.find(p => p.id === 'tyrantrum'),     // 怪颚龙
            aiPokemonData.find(p => p.id === 'cradily'),// 摇篮百合
            aiPokemonData.find(p => p.id === 'aerodactyl'),//化石翼龙
            aiPokemonData.find(p => p.id === 'excadrill'), //龙头地鼠
            aiPokemonData.find(p => p.id === 'excadrill'), //龙头地鼠
             aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'rock'),
            aiPokemonData.find(p => p.id === 'cactus'),
            aiPokemonData.find(p => p.id === 'cactus'),
            aiPokemonData.find(p => p.id === 'cactus'),
            aiPokemonData.find(p => p.id === 'cactus'),
            aiPokemonData.find(p => p.id === 'cactus'),
            aiPokemonData.find(p => p.id === 'cactus'),
            aiPokemonData.find(p => p.id === 'cactus'),
        ],
        initialPositions: [
            { x: 1, y: 1 }, // 班基拉斯
            { x: 8, y: 1 }, // 班基拉斯
            { x: 4, y: 3 },  // 隆隆岩
            { x: 8, y: 4 },  //怪颚龙
            { x: 7, y: 5 },  //摇篮百合
            { x: 2, y: 5 }, //化石翼龙
            { x: 7, y: 2 },// 龙头地鼠
            { x: 2, y: 2 },//龙头地鼠
                        { x: 0, y: 0 },
 { x: 0, y: 3 },
            { x: 0, y: 7 },
            { x: 2, y: 8 },
            { x: 3, y: 5 },
            { x: 3, y: 9 },
            { x: 4, y: 8 },
            { x: 4, y: 6 },
            { x: 5, y: 8 },
            { x: 5, y: 1 },
            { x: 9, y: 7 },
            { x: 6, y: 8 },
            { x: 6, y: 6 },
            { x: 7, y: 3 },
            { x: 7, y: 7 },
            { x: 8, y: 8 },
            { x: 8, y: 2 },
            { x: 1, y: 7 },
            { x: 0, y: 3 },
            { x: 9, y: 5 },
            { x: 1, y: 5 },//仙人掌
            { x: 0, y: 9 },
            { x: 7, y: 8 },
            { x: 5, y: 6 },
            { x: 3, y: 4 },
            { x: 3, y: 7 },
            { x: 9, y: 10 },

        ]
    },
     {
        level: 4,
        name: '第四关 「高天的试炼」',
        difficulty: '较难',
        aiPieces: [
            aiPokemonData.find(p => p.id === 'moltres'),//火焰鸟
            aiPokemonData.find(p => p.id === 'zapdos'), // 闪电鸟
            aiPokemonData.find(p => p.id === 'articuno'), //急冻鸟
            aiPokemonData.find(p => p.id === 'lugia'), //急冻鸟
        ],
        initialPositions: [
            { x: 1, y: 2 }, // 火焰鸟
            { x: 4, y: 3 }, // 闪电鸟
            { x: 7, y: 2 },  // 急冻鸟
            { x: 4, y: 1 },  // 洛奇亚
        ]
    }
];
