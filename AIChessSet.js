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
];

// AI关卡配置
const aiLevels = [
    {
        level: 1,
        name: '第一关 源始的海洋',
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
            { x: 5, y: 0 }, { x: 3, y: 0 }, { x: 7, y: 0 },
            { x: 2, y: 0 }, { x: 6, y: 0 }, { x: 4, y: 0 }
        ]
    },
    {
        level: 2,
        name: '第二关 狂怒的海洋',
        difficulty: '中等',
        aiPieces: [
            aiPokemonData.find(p => p.id === 'kyogre-primal'), // 原始回归盖欧卡
            aiPokemonData.find(p => p.id === 'mightyena'),    //大狼犬
            aiPokemonData.find(p => p.id === 'sharpedo-mega'), // 超级巨牙鲨
            aiPokemonData.find(p => p.id === 'ludicolo'),      // 乐天河童
            aiPokemonData.find(p => p.id === 'crobat') ,  // 叉字蝠
            aiPokemonData.find(p => p.id === 'muk'),  // 臭臭泥
            aiPokemonData.find(p => p.id === 'milotic')   // 美纳斯
        ],
        initialPositions: [
            { x: 8, y: 1 },  // 原始回归盖欧卡（中心位置）
            { x: 4, y: 4 },  // 大狼犬
            { x: 7, y: 4 },  // 超级巨牙鲨
            { x: 2, y: 4 },// 乐天河童
            { x: 5, y: 4 } , // 叉字蝠
            { x: 3, y: 4 },  // 臭臭泥
            { x: 6, y: 4 },  //美纳斯
        ]
    }
];
