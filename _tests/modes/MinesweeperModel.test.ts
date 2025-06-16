import { MinesweeperModel, GameStatus } from '../../src/scripts/models/MinesweeperModel';
import { Cell, CellState } from '../../src/scripts/models/Cell';

describe('MinesweeperModel', () => {
  let model: MinesweeperModel;

  beforeEach(() => {
    model = new MinesweeperModel(9, 9, 10);
  });

  test('should initialize with correct parameters', () => {
    expect(model.getRows()).toBe(9);
    expect(model.getCols()).toBe(9);
    expect(model.getMines()).toBe(10);
    expect(model.getMinesLeft()).toBe(10);
    expect(model.getGameStatus()).toBe(GameStatus.NOT_STARTED);
  });

  test('should start game and generate mines', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    let mineCount = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isMine) mineCount++;
      });
    });
    expect(mineCount).toBe(10);
    expect(board[0][0].isMine).toBe(false);
    expect(model.getGameStatus()).toBe(GameStatus.IN_PROGRESS);
  });

  test('should ensure first click is safe', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    for (let r = Math.max(0, 0 - 1); r <= Math.min(8, 0 + 1); r++) {
      for (let c = Math.max(0, 0 - 1); c <= Math.min(8, 0 + 1); c++) {
        expect(board[r][c].isMine).toBe(false);
      }
    }
  });

  test('should reveal cell', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    board[1][1].isMine = false;
    board[1][1].adjacentMines = 2;
    
    model.revealCell(1, 1);
    expect(board[1][1].state).toBe(CellState.REVEALED);
  });

  test('should end game when hitting mine', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    board[1][1].isMine = true;
    
    model.revealCell(1, 1);
    expect(model.getGameStatus()).toBe(GameStatus.LOST);
  });

  test('should toggle flag', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    model.toggleFlag(0, 0);
    expect(board[0][0].state).toBe(CellState.FLAGGED);
    expect(model.getMinesLeft()).toBe(9);
    
    model.toggleFlag(0, 0);
    expect(board[0][0].state).toBe(CellState.HIDDEN);
    expect(model.getMinesLeft()).toBe(10);
  });

  test('should win game when all non-mine cells are revealed', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell.isMine) {
          model.revealCell(r, c);
        }
      });
    });
    
    expect(model.getGameStatus()).toBe(GameStatus.WON);
  });

  test('should recursively reveal empty cells', () => {
    model.startGame(0, 0);
    const board = model.getBoard();
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[r][c].isMine = false;
        board[r][c].adjacentMines = 0;
      }
    }
    
    model.revealCell(1, 1);
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        expect(board[r][c].state).toBe(CellState.REVEALED);
      }
    }
  });

  test('should track game time', () => {
    jest.useFakeTimers();
    
    model.startGame(0, 0);
    expect(model.getTimeElapsed()).toBe(0);
    
    jest.advanceTimersByTime(1000);
    expect(model.getTimeElapsed()).toBe(1);
    
    jest.advanceTimersByTime(5000);
    expect(model.getTimeElapsed()).toBe(6);
    
    model.gameOver(false);
    jest.advanceTimersByTime(2000);
    expect(model.getTimeElapsed()).toBe(6);
    
    jest.useRealTimers();
  });

  test('should reset game', () => {
    model.startGame(0, 0);
    
    model.revealCell(1, 1);
    model.revealCell(2, 2);
    model.toggleFlag(3, 3);
    
    model.reset();
    
    expect(model.getGameStatus()).toBe(GameStatus.NOT_STARTED);
    expect(model.getMinesLeft()).toBe(10);
    expect(model.getTimeElapsed()).toBe(0);
    
    const board = model.getBoard();
    board.forEach(row => {
      row.forEach(cell => {
        expect(cell.state).toBe(CellState.HIDDEN);
        expect(cell.isMine).toBe(false);
        expect(cell.adjacentMines).toBe(0);
      });
    });
  });
});  