// 横屏检测和提示功能
(function() {
    // 检测屏幕方向和尺寸
    function checkOrientation() {
        // 检查是否是移动设备
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 检查屏幕宽度和高度的比例，判断是否为横屏
            const isLandscape = window.innerWidth > window.innerHeight;
            
            // 获取或创建横屏提示元素
            let orientationHint = document.getElementById('orientation-hint');
            
            if (!orientationHint) {
                // 创建横屏提示元素
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
            
            // 根据屏幕方向显示或隐藏提示
            if (!isLandscape) {
                orientationHint.style.display = 'flex';
                document.body.classList.add('portrait-mode');
            } else {
                orientationHint.style.display = 'none';
                document.body.classList.remove('portrait-mode');
            }
        } else {
            // 不是移动设备，移除提示
            const orientationHint = document.getElementById('orientation-hint');
            if (orientationHint) {
                orientationHint.style.display = 'none';
            }
            document.body.classList.remove('portrait-mode');
        }
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkOrientation);
    
    // 页面加载完成后检查
    document.addEventListener('DOMContentLoaded', checkOrientation);
    
    // 立即检查一次
    checkOrientation();
})();