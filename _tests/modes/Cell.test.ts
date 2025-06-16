import { Cell, CellState } from '../../src/scripts/models/Cell';

describe('Cell', () => {
  test('should initialize with default values', () => {
    const cell = new Cell(0, 0);
    expect(cell.state).toBe(CellState.HIDDEN);
    expect(cell.isMine).toBe(false);
    expect(cell.adjacentMines).toBe(0);
  });

  test('should toggle flag state', () => {
    const cell = new Cell(0, 0);
    cell.toggleFlag();
    expect(cell.state).toBe(CellState.FLAGGED);
    cell.toggleFlag();
    expect(cell.state).toBe(CellState.HIDDEN);
  });

  test('should reveal cell', () => {
    const cell = new Cell(0, 0);
    cell.reveal();
    expect(cell.state).toBe(CellState.REVEALED);
  });
});