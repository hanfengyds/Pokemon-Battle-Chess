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
        card.appendChild(image);
        card.appendChild(infoContainer);
        containerElement.appendChild(card);
    });

    container.appendChild(containerElement);
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

// 初始化战棋道具功能
function initChessItems() {
    // 创建浮窗
    createChessItemsModal();

    // 为战棋道具按钮添加点击事件
    const chessItemsBtn = document.getElementById('chess-items-btn');
    if (chessItemsBtn) {
        chessItemsBtn.addEventListener('click', openChessItemsModal);
    }
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChessItems);
} else {
    initChessItems();
}