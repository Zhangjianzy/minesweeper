import { Cell, CellState } from './Cell';

// 游戏状态枚举
export enum GameStatus {
  NOT_STARTED,  // 未开始
  IN_PROGRESS,  // 进行中
  WON,          // 已胜利
  LOST          // 已失败
}

export class MinesweeperModel {
  private board: Cell[][] = [];
  private gameStatus: GameStatus = GameStatus.NOT_STARTED;
  private minesLeft: number = 0;
  private timeElapsed: number = 0;
  private timerInterval: NodeJS.Timer | null = null;
  private firstClick: boolean = true;

  constructor(
    private rows: number,
    private cols: number,
    private mines: number
  ) {
    this.initializeBoard();
  }

  // 初始化游戏板
  private initializeBoard(): void {
    this.board = [];
    this.minesLeft = this.mines;
    this.gameStatus = GameStatus.NOT_STARTED;
    this.timeElapsed = 0;
    this.firstClick = true;

    if (this.timerInterval) {
      // @ts-ignore
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    // 创建单元格
    for (let r = 0; r < this.rows; r++) {
      this.board[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.board[r][c] = new Cell(r, c);
      }
    }
  }

  // 开始游戏（首次点击时调用）
  public startGame(firstRow: number, firstCol: number): void {
    this.gameStatus = GameStatus.IN_PROGRESS;
    this.generateMines(firstRow, firstCol);
    this.calculateAdjacentMines();
    this.startTimer();
  }

  // 生成地雷（避开首次点击位置及其周围）
  private generateMines(safeRow: number, safeCol: number): void {
    let minesPlaced = 0;
    
    // 安全区域（首次点击位置及其周围8个格子）
    const safeZone: { row: number; col: number }[] = [];
    for (let r = Math.max(0, safeRow - 1); r <= Math.min(this.rows - 1, safeRow + 1); r++) {
      for (let c = Math.max(0, safeCol - 1); c <= Math.min(this.cols - 1, safeCol + 1); c++) {
        safeZone.push({ row: r, col: c });
      }
    }
    
    // 随机放置地雷
    while (minesPlaced < this.mines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      
      // 检查是否在安全区域且尚未放置地雷
      const isInSafeZone = safeZone.some(pos => pos.row === r && pos.col === c);
      if (!isInSafeZone && !this.board[r][c].isMine) {
        this.board[r][c].isMine = true;
        minesPlaced++;
      }
    }
  }

  // 计算每个单元格周围的地雷数
  private calculateAdjacentMines(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.board[r][c].isMine) {
          this.board[r][c].adjacentMines = this.countAdjacentMines(r, c);
        }
      }
    }
  }

  // 计算指定位置周围的地雷数
  private countAdjacentMines(row: number, col: number): number {
    let count = 0;
    
    for (let r = Math.max(0, row - 1); r <= Math.min(this.rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(this.cols - 1, col + 1); c++) {
        if (r === row && c === col) continue; // 跳过自身
        if (this.board[r][c].isMine) count++;
      }
    }
    
    return count;
  }

  // 揭开单元格
  public revealCell(row: number, col: number): void {
    // 检查坐标合法性
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return;
    }
    
    // 首次点击，开始游戏
    if (this.firstClick) {
      this.startGame(row, col);
      this.firstClick = false;
    }
    
    const cell = this.board[row][col];
    
    // 如果游戏已结束或单元格已揭开/标记，不做处理
    if (this.gameStatus !== GameStatus.IN_PROGRESS || 
        cell.state === CellState.REVEALED || 
        cell.state === CellState.FLAGGED) {
      return;
    }
    
    // 揭开单元格
    cell.reveal();
    
    // 如果点击到地雷，游戏失败
    if (cell.isMine) {
      this.gameOver(false);
      return;
    }
    
    // 如果周围没有地雷，递归揭开周围的单元格
    if (cell.adjacentMines === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(this.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(this.cols - 1, col + 1); c++) {
          if (r === row && c === col) continue; // 跳过自身
          this.revealCell(r, c);
        }
      }
    }
    
    // 检查游戏是否胜利
    if (this.checkWin()) {
      this.gameOver(true);
    }
  }

  // 切换标记状态
  public toggleFlag(row: number, col: number): void {
    // 检查坐标合法性
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return;
    }
    
    const cell = this.board[row][col];
    
    // 如果游戏未开始或已结束，或单元格已揭开，不做处理
    if (this.gameStatus === GameStatus.NOT_STARTED || 
        this.gameStatus !== GameStatus.IN_PROGRESS || 
        cell.state === CellState.REVEALED) {
      return;
    }
    
    // 如果是首次点击，先开始游戏
    if (this.firstClick) {
      this.startGame(row, col);
      this.firstClick = false;
    }
    
    // 切换标记状态
    const oldState = cell.state;
    cell.toggleFlag();
    
    // 更新剩余地雷数
    if (oldState === CellState.HIDDEN && cell.state === CellState.FLAGGED) {
      this.minesLeft--;
    } else if (oldState === CellState.FLAGGED && cell.state !== CellState.FLAGGED) {
      this.minesLeft++;
    }
    
    // 检查游戏是否胜利
    if (this.checkWin()) {
      this.gameOver(true);
    }
  }

  // 检查游戏是否胜利
  private checkWin(): boolean {
    // 胜利条件：所有非地雷单元格都被揭开
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.board[r][c];
        if (!cell.isMine && cell.state !== CellState.REVEALED) {
          return false;
        }
      }
    }
    return true;
  }

  // 游戏结束
  private gameOver(isWin: boolean): void {
    this.gameStatus = isWin ? GameStatus.WON : GameStatus.LOST;
    
    // 停止计时器
    if (this.timerInterval) {
      // @ts-ignore
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    
    // 显示所有地雷和错误标记
    if (!isWin) {
      this.revealAllMines();
    }
  }

  // 显示所有地雷
  private revealAllMines(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.board[r][c];
        if (cell.isMine) {
          cell.reveal();
        } else if (cell.state === CellState.FLAGGED) {
          // 错误标记的单元格
          cell.state = CellState.REVEALED;
        }
      }
    }
  }

  // 开始计时器
  private startTimer(): void {
    if (this.timerInterval) {
      // @ts-ignore
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      if (this.gameStatus === GameStatus.IN_PROGRESS) {
        this.timeElapsed++;
      }
    }, 1000);
  }

  // 重置游戏
  public reset(): void {
    this.initializeBoard();
  }

  // 获取游戏板
  public getBoard(): Cell[][] {
    return this.board;
  }

  // 获取游戏状态
  public getGameStatus(): GameStatus {
    return this.gameStatus;
  }

  // 获取剩余地雷数
  public getMinesLeft(): number {
    return this.minesLeft;
  }

  // 获取游戏时间
  public getTimeElapsed(): number {
    return this.timeElapsed;
  }

  // 获取行数
  public getRows(): number {
    return this.rows;
  }

  // 获取列数
  public getCols(): number {
    return this.cols;
  }

  // 获取地雷数
  public getMines(): number {
    return this.mines;
  }

  // 设置新的游戏参数并重置游戏
  public setGameParameters(rows: number, cols: number, mines: number): void {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.reset();
  }
}