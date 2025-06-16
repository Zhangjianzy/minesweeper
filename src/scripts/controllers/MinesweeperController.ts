import { MinesweeperModel, GameStatus } from '@/scripts/models/MinesweeperModel';
import { MinesweeperView } from '@/scripts/views/MinesweeperView';
import I18n from '@/scripts/utils/i18n';

export class MinesweeperController {
  constructor(
    private model: MinesweeperModel,
    private view: MinesweeperView,
    private i18n: I18n
  ) {}

  // 处理鼠标点击事件
  public handleClick(x: number, y: number): void {
    const row = Math.floor(y / (this.view['cellSize'] + this.view['margin']));
    const col = Math.floor(x / (this.view['cellSize'] + this.view['margin']));
    
    this.model.revealCell(row, col);
    this.view.render(this.model);
  }

  // 处理鼠标右键点击事件
  public handleRightClick(x: number, y: number): void {
    const row = Math.floor(y / (this.view['cellSize'] + this.view['margin']));
    const col = Math.floor(x / (this.view['cellSize'] + this.view['margin']));
    
    this.model.toggleFlag(row, col);
    this.view.render(this.model);
  }

  // 创建新游戏
  public newGame(rows: number, cols: number, mines: number): void {
    // 验证输入参数
    rows = Math.max(2, Math.min(50, rows));
    cols = Math.max(2, Math.min(50, cols));
    mines = Math.max(1, Math.min(rows * cols - 1, mines));
    
    // 更新输入字段
    (document.getElementById('rows') as HTMLInputElement).value = rows.toString();
    (document.getElementById('cols') as HTMLInputElement).value = cols.toString();
    (document.getElementById('mines') as HTMLInputElement).value = mines.toString();
    
    // 设置新游戏参数并重置
    this.model.setGameParameters(rows, cols, mines);
    
    // 隐藏游戏结束弹窗
    const modal = document.getElementById('gameOverModal') as HTMLDivElement;
    modal.classList.remove('active');
    
    // 重新渲染视图
    this.view.render(this.model);
  }

  // 更新UI语言
  public updateUI(): void {
    // 重新翻译界面元素
    this.i18n.translatePage();
    
    // 如果游戏已结束，更新游戏结束弹窗
    if (this.model.getGameStatus() === GameStatus.WON || 
        this.model.getGameStatus() === GameStatus.LOST) {
      const isWin = this.model.getGameStatus() === GameStatus.WON;
      const timeElapsed = this.model.getTimeElapsed();
      this.showGameOverModal(isWin, timeElapsed);
    }
  }

  // 显示游戏结束弹窗
  private showGameOverModal(isWin: boolean, timeElapsed: number): void {
    const modal = document.getElementById('gameOverModal') as HTMLDivElement;
    const title = document.getElementById('gameOverTitle') as HTMLHeadingElement;
    const message = document.getElementById('gameOverMessage') as HTMLParagraphElement;
    const icon = document.getElementById('gameOverIcon') as HTMLDivElement;
    
    // 设置弹窗内容
    if (isWin) {
      this.i18n.translateElement('gameOverTitle', 'gameOver.win');
      this.i18n.translateElement('gameOverMessage', 'gameOver.winMessage', { time: formatTime(timeElapsed) });
      modal.classList.add('win');
      modal.classList.remove('lose');
      icon.textContent = '🎉';
    } else {
      this.i18n.translateElement('gameOverTitle', 'gameOver.lose');
      this.i18n.translateElement('gameOverMessage', 'gameOver.loseMessage');
      modal.classList.add('lose');
      modal.classList.remove('win');
      icon.textContent = '💣';
    }
    
    // 显示弹窗
    modal.classList.add('active');
    
    // 为"再玩一次"按钮添加事件监听
    document.getElementById('playAgainBtn')?.addEventListener('click', () => {
      const rows = parseInt((document.getElementById('rows') as HTMLInputElement).value);
      const cols = parseInt((document.getElementById('cols') as HTMLInputElement).value);
      const mines = parseInt((document.getElementById('mines') as HTMLInputElement).value);
      this.newGame(rows, cols, mines);
    });
  }
}

// 格式化时间为 MM:SS 格式
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}