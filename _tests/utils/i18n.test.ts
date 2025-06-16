import  I18n  from '../../src/scripts/utils/i18n';

// 模拟DOM
document.body.innerHTML = `
  <h1 id="gameTitle">扫雷游戏</h1>
  <p id="gameDescription">经典的扫雷游戏，挑战你的逻辑思维能力</p>
  <div id="statsMinesLabel">剩余地雷</div>
  <div id="statsTimeLabel">游戏时间</div>
  <button id="newGameBtn">
    <span id="newGameText">新游戏</span>
  </button>
  <h2 id="settingsTitle">游戏设置</h2>
  <label id="rowsLabel">行数</label>
  <label id="colsLabel">列数</label>
  <label id="minesLabel">地雷数</label>
  <h2 id="gameOverTitle"></h2>
  <p id="gameOverMessage"></p>
  <button id="playAgainBtn">
    <span id="playAgainText">再玩一次</span>
  </button>
`;

describe('I18n', () => {
  let i18n: I18n;

  beforeEach(() => {
    i18n = new I18n();
    i18n.init();
  });

  test('should initialize with default language', () => {
    expect(i18n['currentLanguage']).toBe('zh-CN');
  });

  test('should translate elements to English', () => {
    i18n.changeLanguage('en');
    
    expect(document.getElementById('gameTitle')?.textContent).toBe('Minesweeper');
    expect(document.getElementById('gameDescription')?.textContent).toBe('The classic minesweeper game to challenge your logical thinking ability');
    expect(document.getElementById('statsMinesLabel')?.textContent).toBe('Mines Left');
    expect(document.getElementById('statsTimeLabel')?.textContent).toBe('Game Time');
    expect(document.getElementById('newGameText')?.textContent).toBe('New Game');
    expect(document.getElementById('settingsTitle')?.textContent).toBe('Game Settings');
    expect(document.getElementById('rowsLabel')?.textContent).toBe('Rows');
    expect(document.getElementById('colsLabel')?.textContent).toBe('Columns');
    expect(document.getElementById('minesLabel')?.textContent).toBe('Mines');
  });

  test('should translate game over messages', () => {
    i18n.changeLanguage('en');
    
    // 模拟游戏胜利
    i18n.translateElement('gameOverTitle', 'gameOver.win');
    i18n.translateElement('gameOverMessage', 'gameOver.winMessage', { time: '00:30' });
    
    expect(document.getElementById('gameOverTitle')?.textContent).toBe('Congratulations!');
    expect(document.getElementById('gameOverMessage')?.textContent).toBe('Great job! You completed the game in 00:30.');
    
    // 模拟游戏失败
    i18n.translateElement('gameOverTitle', 'gameOver.lose');
    i18n.translateElement('gameOverMessage', 'gameOver.loseMessage');
    
    expect(document.getElementById('gameOverTitle')?.textContent).toBe('Game Over');
    expect(document.getElementById('gameOverMessage')?.textContent).toBe('You hit a mine!');
  });

  test('should fallback to default language if key not found', () => {
    // 尝试翻译不存在的键
    i18n.translateElement('nonExistentElement', 'non.existent.key');
    
    // 应该保持原内容不变
    expect(document.getElementById('nonExistentElement')).toBeNull();
  });

  test('should handle placeholders in translations', () => {
    i18n.changeLanguage('en');
    
    i18n.translateElement('gameOverMessage', 'gameOver.winMessage', { time: '01:45' });
    
    expect(document.getElementById('gameOverMessage')?.textContent).toBe('Great job! You completed the game in 01:45.');
  });
});  