import { CellState } from '@/scripts/models/Cell';

// 绘制单元格背景
export function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, state: CellState) {
  ctx.save();
  
  if (state === CellState.HIDDEN) {
    // 未揭开的单元格
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x, y, size, size);
    
    // 绘制3D效果
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size, y + size - 2);
    ctx.stroke();
    
    ctx.strokeStyle = '#7b7b7b';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x + size - 2, y + size);
    ctx.stroke();
  } else {
    // 已揭开的单元格
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(x, y, size, size);
    
    // 边框
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, size, size);
  }
  
  ctx.restore();
}

// 绘制数字
export function drawNumber(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, num: number) {
  ctx.save();
  
  // 设置数字颜色
  const colors = [
    '#0000ff', // 1
    '#008000', // 2
    '#ff0000', // 3
    '#000080', // 4
    '#800000', // 5
    '#008080', // 6
    '#000000', // 7
    '#808080'  // 8
  ];
  
  ctx.fillStyle = colors[num - 1];
  ctx.font = `${Math.floor(size * 0.7)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(num.toString(), x + size / 2, y + size / 2);
  
  ctx.restore();
}

// 绘制地雷
export function drawMine(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  
  // 地雷主体
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // 地雷触须
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = size * 0.1;
  
  // 水平和垂直触须
  ctx.beginPath();
  ctx.moveTo(x + size * 0.3, y + size / 2);
  ctx.lineTo(x + size * 0.7, y + size / 2);
  ctx.moveTo(x + size / 2, y + size * 0.3);
  ctx.lineTo(x + size / 2, y + size * 0.7);
  ctx.stroke();
  
  // 对角线触须
  ctx.beginPath();
  ctx.moveTo(x + size * 0.35, y + size * 0.35);
  ctx.lineTo(x + size * 0.65, y + size * 0.65);
  ctx.moveTo(x + size * 0.35, y + size * 0.65);
  ctx.lineTo(x + size * 0.65, y + size * 0.35);
  ctx.stroke();
  
  ctx.restore();
}

// 绘制旗帜
export function drawFlag(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  
  // 旗杆
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = size * 0.1;
  ctx.beginPath();
  ctx.moveTo(x + size * 0.5, y + size * 0.2);
  ctx.lineTo(x + size * 0.5, y + size * 0.8);
  ctx.stroke();
  
  // 旗帜
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(x + size * 0.5, y + size * 0.2);
  ctx.lineTo(x + size * 0.8, y + size * 0.35);
  ctx.lineTo(x + size * 0.5, y + size * 0.5);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}