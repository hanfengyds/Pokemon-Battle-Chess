// 横屏检测和布局适配功能 - 优化版
(function() {
    // 配置项
    const MOBILE_WIDTH_THRESHOLD = 768;
    const CHECK_INTERVAL = 200; // 定期检查的时间间隔(ms)
    let orientationHint = null;
    let lastOrientationState = null;

    // 创建横屏提示元素
    function createOrientationHint() {
        // 检查是否已存在
        orientationHint = document.getElementById('orientation-hint');
        if (!orientationHint) {
            // 创建新元素
            orientationHint = document.createElement('div');
            orientationHint.id = 'orientation-hint';
            orientationHint.className = 'orientation-hint';
            orientationHint.innerHTML = `
                <div class="orientation-hint-content">
                    <i class="fa fa-mobile text-6xl mb-4"></i>
                    <div class="text-2xl font-bold mb-2">请横屏使用</div>
                    <div class="text-lg">为了获得最佳游戏体验，请将手机横屏</div>
                    <div class="rotate-icon"><i class="fa fa-refresh text-4xl"></i></div>
                </div>
            `;
            document.body.appendChild(orientationHint);
        }
        return orientationHint;
    }

    // 检测屏幕方向和尺寸
    function checkOrientation() {
        // 检查是否是移动设备
        const isMobile = window.innerWidth <= MOBILE_WIDTH_THRESHOLD;
        
        if (isMobile) {
            // 检查屏幕宽度和高度的比例，判断是否为横屏
            const isLandscape = window.innerWidth > window.innerHeight;
            
            // 获取或创建横屏提示元素
            orientationHint = createOrientationHint();
            
            // 构建当前状态字符串用于比较
            const currentState = isLandscape ? 'landscape' : 'portrait';
            
            // 只有状态变化时才执行操作，避免不必要的DOM操作
            if (currentState !== lastOrientationState) {
                // 根据屏幕方向显示或隐藏提示，并应用相应的布局类
                if (!isLandscape) {
                    orientationHint.style.display = 'flex';
                    document.body.classList.add('portrait-mode');
                    document.body.classList.remove('mobile-landscape');
                } else {
                    orientationHint.style.display = 'none';
                    document.body.classList.remove('portrait-mode');
                    document.body.classList.add('mobile-landscape');
                }
                
                // 强制刷新页面布局
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    // 调试信息 - 可选移除
                    console.log('Orientation changed to:', currentState);
                    console.log('Body classes:', document.body.className);
                }, 100);
                
                // 更新状态
                lastOrientationState = currentState;
            }
        } else {
            // 不是移动设备，移除提示和相关类
            orientationHint = document.getElementById('orientation-hint');
            if (orientationHint) {
                orientationHint.style.display = 'none';
            }
            document.body.classList.remove('portrait-mode', 'mobile-landscape');
            lastOrientationState = 'desktop';
        }
    }

    // 使用防抖函数优化resize和orientationchange事件处理
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 初始化函数
    function init() {
        // 添加事件监听器
        window.addEventListener('resize', debounce(checkOrientation, 100));
        window.addEventListener('orientationchange', checkOrientation);
        window.addEventListener('load', checkOrientation);
        
        // 立即检查一次
        checkOrientation();
        
        // 添加定期检查，确保即使在某些特殊情况下也能正确检测
        setInterval(checkOrientation, CHECK_INTERVAL);
    }

    // 页面DOM内容加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 如果DOM已经加载完成，直接初始化
        init();
    }
})();