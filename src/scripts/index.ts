import '@/styles/index.css';

import { MinesweeperModel } from '@/scripts/models/MinesweeperModel';
import { MinesweeperView } from '@/scripts/views/MinesweeperView';
import { MinesweeperController } from '@/scripts/controllers/MinesweeperController';
import { I18n } from '@/scripts/utils/i18n';

const DEFAULT = {
  rows: 10,
  cols: 10,
  mines: 8
}


document.addEventListener('DOMContentLoaded', () => {
  const i18n = new I18n();
  i18n.init();

  // 从本地存储或默认值获取游戏参数
  const savedParams = localStorage.getItem('minesweeper-params');
  let rows, cols, mines;
  
  if (savedParams) {
    try {
      const params = JSON.parse(savedParams);
      rows = params.rows || DEFAULT.rows;
      cols = params.cols || DEFAULT.cols;
      mines = params.mines || DEFAULT.mines;
    } catch (e) {
      rows = DEFAULT.rows;
      cols = DEFAULT.cols;
      mines = DEFAULT.mines;
    }
  } else {
    rows = DEFAULT.rows;
    cols = DEFAULT.cols;
    mines = DEFAULT.mines;
  }

  // 初始化模型、视图和控制器
  const model = new MinesweeperModel(rows, cols, mines);
  
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  const view = new MinesweeperView(canvas);
  const controller = new MinesweeperController(model, view, i18n);

  // 渲染初始视图
  view.render(model);

  // 设置输入字段的值
  (document.getElementById('rows') as HTMLInputElement).value = rows.toString();
  (document.getElementById('cols') as HTMLInputElement).value = cols.toString();
  (document.getElementById('mines') as HTMLInputElement).value = mines.toString();

  // 设置按钮
  document.getElementById('settings')?.addEventListener('click', () => {
    const settingsDiv = document.querySelector('.game-settings');
    // @ts-ignore
    settingsDiv?.className.includes('show') ? settingsDiv.className = 'game-settings' : settingsDiv?.className = 'game-settings show'
  })

  // 新游戏按钮事件
  document.getElementById('newGameBtn')?.addEventListener('click', () => {
    const rows = parseInt((document.getElementById('rows') as HTMLInputElement).value);
    const cols = parseInt((document.getElementById('cols') as HTMLInputElement).value);
    const mines = parseInt((document.getElementById('mines') as HTMLInputElement).value);
    
    // 保存游戏参数到本地存储
    localStorage.setItem('minesweeper-params', JSON.stringify({ rows, cols, mines }));
    
    controller.newGame(rows, cols, mines);
  });

  // 语言切换事件
  document.getElementById('languageSelect')?.addEventListener('change', (e) => {
    const lang = (e.target as HTMLSelectElement).value;
    i18n.changeLanguage(lang as 'zh-CN' | 'en');
    controller.updateUI();
  });

  // Canvas点击事件（左键）
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    controller.handleClick(x, y);
  });

  // Canvas右键点击事件
  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // 阻止默认右键菜单
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    controller.handleRightClick(x, y);
  });

  // 游戏结束弹窗中的"再玩一次"按钮事件
  document.getElementById('playAgainBtn')?.addEventListener('click', () => {
    const rows = parseInt((document.getElementById('rows') as HTMLInputElement).value);
    const cols = parseInt((document.getElementById('cols') as HTMLInputElement).value);
    const mines = parseInt((document.getElementById('mines') as HTMLInputElement).value);
    controller.newGame(rows, cols, mines);
  });
});