import { MinesweeperController } from '../../src/scripts/controllers/MinesweeperController';
import { MinesweeperModel, GameStatus } from '../../src/scripts/models/MinesweeperModel';
import { MinesweeperCanvasView } from '../../src/scripts/views/MinesweeperView';
import  I18n  from '../../src/scripts/utils/i18n';

// 模拟依赖
jest.mock('../../src/model/MinesweeperModel');
jest.mock('../../src/view/MinesweeperCanvasView');
jest.mock('../../src/utils/i18n');

describe('MinesweeperController', () => {
  let controller: MinesweeperController;
  let model: MinesweeperModel;
  let view: MinesweeperCanvasView;
  let i18n: I18n;

  beforeEach(() => {
    model = new MinesweeperModel(9, 9, 10) as jest.Mocked<MinesweeperModel>;
    view = new MinesweeperCanvasView() as jest.Mocked<MinesweeperCanvasView>;
    i18n = new I18n() as jest.Mocked<I18n>;
    
    // 模拟方法
    (model.getBoard as jest.Mock).mockReturnValue([[]]);
    (model.getRows as jest.Mock).mockReturnValue(9);
    (model.getCols as jest.Mock).mockReturnValue(9);
    (model.getMines as jest.Mock).mockReturnValue(10);
    (model.getMinesLeft as jest.Mock).mockReturnValue(10);
    (model.getGameStatus as jest.Mock).mockReturnValue(GameStatus.NOT_STARTED);
    (model.getTimeElapsed as jest.Mock).mockReturnValue(0);
    
    (view.render as jest.Mock).mockReturnValue();
    
    controller = new MinesweeperController(model, view, i18n);
  });

  test('should initialize with model and view', () => {
    expect(controller['model']).toBe(model);
    expect(controller['view']).toBe(view);
    expect(controller['i18n']).toBe(i18n);
  });

  test('should start new game', () => {
    controller.newGame(9, 9, 10);
    
    expect(model.reset).toHaveBeenCalled();
    expect(model.setDifficulty).toHaveBeenCalledWith(9, 9, 10);
    expect(view.render).toHaveBeenCalledWith(model);
  });

  test('should handle cell click', () => {
    controller.handleCellClick(1, 1);
    
    expect(model.revealCell).toHaveBeenCalledWith(1, 1);
    expect(view.render).toHaveBeenCalledWith(model);
  });

  test('should handle right click (flag)', () => {
    controller.handleCellRightClick(1, 1);
    
    expect(model.toggleFlag).toHaveBeenCalledWith(1, 1);
    expect(view.render).toHaveBeenCalledWith(model);
  });

  test('should update UI elements', () => {
    document.body.innerHTML = `
      <div id="minesLeft">0</div>
      <div id="timer">00:00</div>
      <div id="gameOverModal"></div>
      <h2 id="gameOverTitle"></h2>
      <p id="gameOverMessage"></p>
    `;
    
    // 模拟游戏胜利
    (model.getGameStatus as jest.Mock).mockReturnValue(GameStatus.WON);
    (model.getTimeElapsed as jest.Mock).mockReturnValue(30);
    
    controller.updateUI();
    
    // 验证剩余地雷数更新
    expect(document.getElementById('minesLeft')?.textContent).toBe('10');
    
    // 验证计时器更新
    expect(document.getElementById('timer')?.textContent).toBe('00:30');
    
    // 验证游戏胜利弹窗
    expect(document.getElementById('gameOverModal')?.classList.contains('active')).toBe(true);
    expect(document.getElementById('gameOverTitle')?.textContent).toBe('恭喜胜利！');
    expect(document.getElementById('gameOverMessage')?.textContent).toBe('太棒了！你在00:30内完成了游戏。');
  });

  test('should handle game over (loss)', () => {
    document.body.innerHTML = `
      <div id="gameOverModal"></div>
      <h2 id="gameOverTitle"></h2>
      <p id="gameOverMessage"></p>
    `;
    
    controller.handleGameOver(false);
    
    // 验证游戏失败弹窗
    expect(document.getElementById('gameOverModal')?.classList.contains('active')).toBe(true);
    expect(document.getElementById('gameOverTitle')?.textContent).toBe('游戏结束');
    expect(document.getElementById('gameOverMessage')?.textContent).toBe('你踩到地雷了！');
  });

  test('should handle language change', () => {
    i18n.translateElement = jest.fn();
    
    controller.changeLanguage('en');
    
    // 验证调用了i18n翻译方法
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
    expect(i18n.translateElement).toHaveBeenCalledTimes(10); // 翻译10个UI元素
  });
});  