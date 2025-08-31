// 宝可梦棋子数据
    const pokemonData = [
        {
            id: 'tornadus',
            name: '龙卷云',
            hp: 3,
            atk: 2,
            move: 3,
            type: 'flying',
            typeName: '飞行',
            image: '棋子（正面）/龙卷云.gif'
        },
        {
            id: 'arcanine',
            name: '风速狗',
            hp: 3.5,
            atk: 2,
            move: 2,
            type: 'fire',
            typeName: '火',
            image: '棋子（正面）/风速狗.gif'
        },
        {
            id: 'jolteon',
            name: '雷伊布',
            hp: 2.5,
            atk: 2,
            move: 3,
            type: 'electric',
            typeName: '电',
            image: '棋子（正面）/雷伊布.gif'
        },
        {
            id: 'tangrowth',
            name: '巨蔓藤',
            hp: 5,
            atk: 1.5,
            move: 2,
            type: 'grass',
            typeName: '草',
            image: '棋子（正面）/巨蔓藤.gif'
        },
        {
            id: 'blastoise',
            name: '水箭龟',
            hp: 5,
            atk: 2,
            move: 2,
            type: 'water',
            typeName: '水',
            image: '棋子（正面）/水箭龟.gif'
        },
        { 
            id: 'sandshrew',
            name: '穿山王',
            hp: 3,
            atk: 2,
            move: 2,
            type: 'ground',
            typeName: '地面',
            image: '棋子（正面）/穿山王.gif'
        },
        {
            id: 'aggron',
            name: '波士可多拉',
            hp: 5,
            atk: 2,
            move: 2,
            type: 'steel',
            typeName: '钢',
            image: '棋子（正面）/波士可多拉.gif'
        },
        {
            id: 'accelgor',
            name: '敏捷虫',
            hp: 2,
            atk: 1.5,
            move: 4,
            type: 'bug',
            typeName: '虫',
            image: '棋子（正面）/敏捷虫.gif'
        },
        {
            id: 'suicune',
            name: '水君',
            hp: 6,
            atk: 1.5,
            move: 2,
            type: 'water',
            typeName: '水',
            image: '棋子（正面）/水君.gif'
        },
        {
            id: 'chansey',
            name: '吉利蛋',
            hp: 8,
            atk: 1,
            move: 1,
            type: 'normal',
            typeName: '一般',
            image: '棋子（正面）/吉利蛋.gif'
        },
        {
            id: 'weezing',
            name: '双弹瓦斯',
            hp: 3.5,
            atk: 2,
            move: 2,
            type: 'poison',
            typeName: '毒',
            image: '棋子（正面）/双弹瓦斯.gif'
        },
        {
            id: 'groudon',
            name: '固拉多',
            hp: 4.5,
            atk: 3,
            move: 2,
            type: 'ground',
            typeName: '地面',
            image: '棋子（正面）/固拉多.gif'
        },
        {
            id: 'alakazam',
            name: '胡地',
            hp: 1.5,
            atk: 2,
            move: 3,
            type: 'psychic',
            typeName: '超能',
            image: '棋子（正面）/胡地.gif'
        },
                {
            id: 'absol',
            name: '阿勃梭鲁',
            hp: 2.5,
            atk: 2,
            move: 2,
            type: 'dark',
            typeName: '恶',
            image: '棋子（正面）/阿勃梭鲁.gif'
        },
                        {
            id: 'machamp',
            name: '怪力',
            hp: 3.5,
            atk: 2.5,
            move: 2,
            type: 'fighting',
            typeName: '格斗',
            image: '棋子（正面）/怪力.gif'
        },
                                {
            id: 'haxorus',
            name: '双斧战龙',
            hp: 4,
            atk: 2.5,
            move: 2,
            type: 'dragon',
            typeName: '龙',
            image: '棋子（正面）/双斧战龙.gif'
        },
    ];

    // 属性克制关系表
    const typeChart = {
        "normal": {
            "strong": [],
            "weak": ["rock", "steel"],
            "immune": ["ghost"]
        },
        "fire": {
            "strong": ["grass", "ice", "bug", "steel"],
            "weak": ["fire", "water", "rock", "dragon"]
        },
        "water": {
            "strong": ["fire", "ground", "rock"],
            "weak": ["water", "grass", "dragon"]
        },
        "electric": {
            "strong": ["water", "flying"],
            "weak": ["electric", "grass", "dragon"],
            "immune": ["ground"]
        },
        "grass": {
            "strong": ["water", "ground", "rock"],
            "weak": ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"]
        },
        "ice": {
            "strong": ["grass", "ground", "flying", "dragon"],
            "weak": ["fire", "water", "ice", "steel"]
        },
        "fighting": {
            "strong": ["normal", "ice", "rock", "dark", "steel"],
            "weak": ["poison", "flying", "psychic", "bug", "fairy"],
            "immune": ["ghost"]
        },
        "poison": {
            "strong": ["grass", "fairy"],
            "weak": ["poison", "ground", "rock", "ghost"],
            "immune": ["steel"]
        },
        "ground": {
            "strong": ["fire", "electric", "poison", "rock", "steel"],
            "weak": ["grass", "bug"],
            "immune": ["flying"]
        },
        "flying": {
            "strong": ["grass", "fighting", "bug"],
            "weak": ["electric", "rock", "steel"]
        },
        "psychic": {
            "strong": ["fighting", "poison"],
            "weak": ["psychic", "steel"],
            "immune": ["dark"]
        },
        "bug": {
            "strong": ["grass", "psychic", "dark"],
            "weak": ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"]
        },
        "rock": {
            "strong": ["fire", "ice", "flying", "bug"],
            "weak": ["fighting", "ground", "steel"]
        },
        "ghost": {
            "strong": ["psychic", "ghost"],
            "weak": ["dark"],
            "immune": ["normal"]
        },
        "dragon": {
            "strong": ["dragon"],
            "weak": ["steel"],
            "immune": ["fairy"]
        },
        "dark": {
            "strong": ["psychic", "ghost"],
            "weak": ["fighting", "dark", "fairy"]
        },
        "steel": {
            "strong": ["ice", "rock", "fairy"],
            "weak": ["fire", "water", "electric", "steel"]
        },
        "fairy": {
            "strong": ["fighting", "dragon", "dark"],
            "weak": ["fire", "poison", "steel"]
        }
    };

    // 初始位置
    // 修改为全局变量
    globalThis.initialPositions = {
        blue: [
            { x: 2, y: 11 },
            { x: 3, y: 11 },
            { x: 4, y: 11 },
            { x: 5, y: 11 },
            { x: 6, y: 11 },
            { x: 7, y: 11 }
        ],
        red: [
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
            { x: 7, y: 0 }
        ]
    };
    