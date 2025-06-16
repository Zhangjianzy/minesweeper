// 单元格状态枚举
export enum CellState {
  HIDDEN,     // 隐藏
  REVEALED,   // 已揭开
  FLAGGED,    // 已标记
  QUESTION,   // 问号
}

export class Cell {
  public state: CellState = CellState.HIDDEN;
  public isMine: boolean = false;
  public adjacentMines: number = 0;

  constructor(public row: number, public col: number) {}

  // 切换标记状态：隐藏 → 标记 → 问号 → 隐藏
  toggleFlag(): void {
    switch (this.state) {
      case CellState.HIDDEN:
        this.state = CellState.FLAGGED;
        break;
      case CellState.FLAGGED:
        this.state = CellState.QUESTION;
        break;
      case CellState.QUESTION:
        this.state = CellState.HIDDEN;
        break;
    }
  }

  // 揭开单元格
  reveal(): void {
    if (this.state === CellState.HIDDEN || this.state === CellState.QUESTION) {
      this.state = CellState.REVEALED;
    }
  }
}