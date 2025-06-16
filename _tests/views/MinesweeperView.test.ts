import { MinesweeperCanvasView } from '../../src/scripts/views/MinesweeperView';
import { MinesweeperModel, GameStatus } from '../../src/scripts/models/MinesweeperModel';
import { Cell, CellState } from '../../src/scripts/models/Cell';

// 模拟Canvas API
jest.mock('canvas', () => {
  const mockCanvas = {
    getContext: jest.fn(() => ({
      fillRect: jest.fn(),
      strokeRect: jest.fn(),
      fillText: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      measureText: jest.fn(() => ({ width: 10 })),
      font: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
    })),
    width: 450,
    height: 450,
  };
  return {
    createCanvas: () => mockCanvas,
  };
});

describe('MinesweeperCanvasView', () => {
  let view: MinesweeperCanvasView;
  let model: MinesweeperModel;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    // 创建真实DOM环境
    document.body.innerHTML = '<canvas id="gameCanvas"></canvas>';
    canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
    // 重置所有mock
    jest.clearAllMocks();
    
    model = new MinesweeperModel(9, 9, 10);
    view = new MinesweeperCanvasView();
    
    // 模拟Canvas尺寸
    canvas.width = 450;
    canvas.height = 450;
  });

  test('should initialize canvas with correct dimensions', () => {
    view.render(model);
    expect(canvas.width).toBe(450);
    expect(canvas.height).toBe(450);
  });

  test('should render hidden cells', () => {
    view.render(model);
    
    // 验证绘制了81个隐藏单元格
    expect(ctx.fillRect).toHaveBeenCalledTimes(81);
    expect(ctx.fillStyle).toBe('#e2e8f0'); // 隐藏单元格背景色
  });

  test('should render revealed mine', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    // 设置地雷并揭开
    board[0][0].isMine = true;
    board[0][0].state = CellState.REVEALED;
    model.gameOver(false);
    
    view.render(model);
    
    // 验证绘制了地雷
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalled();
    expect(ctx.fillStyle).toBe('#ef4444'); // 地雷颜色
  });

  test('should render flagged cell', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    // 设置标记
    board[0][0].state = CellState.FLAGGED;
    
    view.render(model);
    
    // 验证绘制了旗帜
    expect(ctx.fillText).toHaveBeenCalledWith('🚩', expect.any(Number), expect.any(Number));
  });

  test('should render number on revealed cell', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    // 设置数字
    board[0][0].state = CellState.REVEALED;
    board[0][0].adjacentMines = 3;
    
    view.render(model);
    
    // 验证绘制了数字
    expect(ctx.fillText).toHaveBeenCalledWith('3', expect.any(Number), expect.any(Number));
  });

  test('should render game over state', () => {
    model.startGame(0, 0);
    model.gameOver(false);
    
    view.render(model);
    
    // 验证绘制了游戏结束遮罩
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 450, 450);
    expect(ctx.fillStyle).toBe('rgba(0, 0, 0, 0.7)');
    
    // 验证绘制了游戏结束文本
    expect(ctx.fillText).toHaveBeenCalledWith('游戏结束', expect.any(Number), expect.any(Number));
  });

  test('should render win state', () => {
    model.startGame(0, 0);
    model.gameOver(true);
    
    view.render(model);
    
    // 验证绘制了胜利遮罩
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 450, 450);
    expect(ctx.fillStyle).toBe('rgba(0, 0, 0, 0.7)');
    
    // 验证绘制了胜利文本
    expect(ctx.fillText).toHaveBeenCalledWith('恭喜胜利！', expect.any(Number), expect.any(Number));
  });

  test('should calculate cell size correctly', () => {
    // 测试默认尺寸
    view.render(model);
    const cellSize = view['calculateCellSize'](model);
    expect(cellSize).toBe(50);
    
    // 测试自定义尺寸
    const customModel = new MinesweeperModel(16, 16, 40);
    const customCellSize = view['calculateCellSize'](customModel);
    expect(customCellSize).toBe(28); // 450 / 16 = 28.125, 取整
  });
});  