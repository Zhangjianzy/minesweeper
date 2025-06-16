import { MinesweeperModel, GameStatus } from '@/scripts/models/MinesweeperModel';
import { Cell, CellState } from '@/scripts/models/Cell';

export class MinesweeperView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 30;
  private margin: number = 2;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  // 渲染整个游戏界面
  public render(model: MinesweeperModel): void {
    const rows = model.getRows();
    const cols = model.getCols();
    
    // 设置Canvas尺寸
    this.canvas.width = cols * (this.cellSize + this.margin) + this.margin;
    this.canvas.height = rows * (this.cellSize + this.margin) + this.margin;
    
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制游戏板
    this.drawBoard(model);
    
    // 更新UI元素
    this.updateUI(model);
  }

  // 绘制游戏板
  private drawBoard(model: MinesweeperModel): void {
    const board = model.getBoard();
    
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        const cell = board[r][c];
        this.drawCell(cell, r, c);
      }
    }
  }

  // 绘制单个单元格
  private drawCell(cell: Cell, row: number, col: number): void {
    const x = col * (this.cellSize + this.margin) + this.margin;
    const y = row * (this.cellSize + this.margin) + this.margin;
    
    // 绘制单元格背景
    this.ctx.fillStyle = this.getCellColor(cell);
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    
    // 绘制边框
    this.ctx.strokeStyle = '#ccc';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
    
    // 根据单元格状态绘制内容
    if (cell.state === CellState.REVEALED) {
      if (cell.isMine) {
        this.drawMine(x, y);
      } else if (cell.adjacentMines > 0) {
        this.drawNumber(cell.adjacentMines, x, y);
      }
    } else if (cell.state === CellState.FLAGGED) {
      this.drawFlag(x, y);
    } else if (cell.state === CellState.QUESTION) {
      this.drawQuestion(x, y);
    }
  }

  // 获取单元格颜色
  private getCellColor(cell: Cell): string {
    if (cell.state === CellState.HIDDEN || cell.state === CellState.FLAGGED || cell.state === CellState.QUESTION) {
      return '#e0e0e0';
    } else {
      return '#f5f5f5';
    }
  }

  // 绘制地雷
  private drawMine(x: number, y: number): void {
    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const radius = this.cellSize / 4;
    
    // 绘制地雷主体
    this.ctx.fillStyle = '#333';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制导火线
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - radius);
    this.ctx.lineTo(centerX, centerY - radius * 1.5);
    this.ctx.stroke();
    
    // 绘制十字线
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - radius, centerY);
    this.ctx.lineTo(centerX + radius, centerY);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - radius);
    this.ctx.lineTo(centerX, centerY + radius);
    this.ctx.stroke();
  }

  // 绘制数字
  private drawNumber(num: number, x: number, y: number): void {
    this.ctx.fillStyle = this.getNumberColor(num);
    this.ctx.font = `bold ${this.cellSize * 0.7}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      num.toString(),
      x + this.cellSize / 2,
      y + this.cellSize / 2
    );
  }

  // 根据数字获取颜色
  private getNumberColor(num: number): string {
    const colors = [
      '#0000FF', // 1: 蓝色
      '#008000', // 2: 绿色
      '#FF0000', // 3: 红色
      '#000080', // 4: 深蓝色
      '#800000', // 5: 深红色
      '#008080', // 6: 青色
      '#000000', // 7: 黑色
      '#808080'  // 8: 灰色
    ];
    
    return colors[num - 1] || '#000000';
  }

  // 绘制旗帜
  private drawFlag(x: number, y: number): void {
    const poleX = x + this.cellSize / 2;
    const poleY = y + this.cellSize / 4;
    const poleHeight = this.cellSize * 0.75;
    
    // 绘制旗杆
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(poleX, poleY);
    this.ctx.lineTo(poleX, poleY + poleHeight);
    this.ctx.stroke();
    
    // 绘制旗帜
    this.ctx.fillStyle = '#FF0000';
    this.ctx.beginPath();
    this.ctx.moveTo(poleX, poleY);
    this.ctx.lineTo(poleX + this.cellSize / 3, poleY + this.cellSize / 4);
    this.ctx.lineTo(poleX, poleY + this.cellSize / 2);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 绘制问号
  private drawQuestion(x: number, y: number): void {
    this.ctx.fillStyle = '#666';
    this.ctx.font = `bold ${this.cellSize * 0.7}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      '?',
      x + this.cellSize / 2,
      y + this.cellSize / 2
    );
  }

  // 更新UI元素
  private updateUI(model: MinesweeperModel): void {
    // 更新剩余地雷数
    document.getElementById('minesLeft')!.textContent = model.getMinesLeft().toString();
    
    // 更新游戏时间
    const timeElapsed = model.getTimeElapsed();
    const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const seconds = (timeElapsed % 60).toString().padStart(2, '0');
    document.getElementById('timer')!.textContent = `${minutes}:${seconds}`;
    
    // 处理游戏结束状态
    if (model.getGameStatus() === GameStatus.WON) {
      this.showGameOverModal(true, timeElapsed);
    } else if (model.getGameStatus() === GameStatus.LOST) {
      this.showGameOverModal(false, timeElapsed);
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
      title.textContent = '恭喜你！';
      message.textContent = `太棒了！你在 ${formatTime(timeElapsed)} 内完成了游戏。`;
      modal.classList.add('win');
      modal.classList.remove('lose');
      icon.textContent = '🎉';
    } else {
      title.textContent = '游戏结束';
      message.textContent = '你踩到地雷了！';
      modal.classList.add('lose');
      modal.classList.remove('win');
      icon.textContent = '💣';
    }
    
    // 显示弹窗
    modal.classList.add('active');
    
    // 为"再玩一次"按钮添加事件监听
    document.getElementById('playAgainBtn')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
}

// 格式化时间为 MM:SS 格式
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}