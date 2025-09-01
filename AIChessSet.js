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
        image: '棋子（正面）/盖欧卡.gif',
    },
{
        id: 'mightyena',
        name: '大狼犬',
        hp:4 ,
        atk:2 ,
        move:2 ,
        type: 'dark',
        typeName: '恶',
        image: '棋子（正面）/大狼犬.gif',
 },
{
        id: 'crobat',
        name: '叉字蝠',
        hp:4.5 ,
        atk:1.5 ,
        move:3 ,
        type: ['flying','poison'],
        typeName: ['飞行','毒'],
        image: '棋子（正面）/叉字蝠.gif',
 },
{
        id: 'muk',
        name: '臭臭泥',
        hp:5.5 ,
        atk:2 ,
        move:1 ,
        type: 'poison',
        typeName: '毒',
        image: '棋子（正面）/臭臭泥.gif',
 },
{
        id: 'ludicolo',
        name: '乐天河童',
        hp:4 ,
        atk:2 ,
        move:2 ,
        type: ['grass','water'],
        typeName: ['草','水'],
        image: '棋子（正面）/乐天河童.gif',
 },
{
        id: 'sharpedo',
        name: '巨牙鲨',
        hp:1.5 ,
        atk:2.5 ,
        move:2 ,
        type: ['water','dark'],
        typeName: ['水','恶'],
        image: '棋子（正面）/巨牙鲨.gif',
 },
];

// AI关卡配置
const aiLevels = [
    {
        level: 1,
        name: '第一关',
        difficulty: '简单',
        aiPieces: aiPokemonData.slice(0, 6), // 前3个棋子
        initialPositions: [
            { x: 5, y: 0 }, { x: 3, y: 0 }, { x: 7, y: 0 },
            { x: 2, y: 0 }, { x: 6, y: 0 }, { x: 4, y: 0 }
        ]
    },
];
