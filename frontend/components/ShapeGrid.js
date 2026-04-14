"use client";
import { useRef, useEffect } from 'react';

const ShapeGrid = ({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(16, 185, 129, 0.2)', // Adjusted to match your emerald theme
  squareSize = 40,
  hoverFillColor = 'rgba(16, 185, 129, 0.15)',
  shape = 'square',
  hoverTrailAmount = 3
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef(null);
  const trailCells = useRef([]);
  const cellOpacities = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize;
      const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize;

      const cols = Math.ceil(canvas.width / squareSize) + 2;
      const rows = Math.ceil(canvas.height / squareSize) + 2;

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const sx = col * squareSize + offsetX;
          const sy = row * squareSize + offsetY;

          const cellKey = `${col},${row}`;
          const alpha = cellOpacities.current.get(cellKey);
          
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(sx, sy, squareSize, squareSize);
            ctx.globalAlpha = 1;
          }

          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(sx, sy, squareSize, squareSize);
        }
      }
    };

    const updateAnimation = () => {
      const wrap = squareSize;
      gridOffset.current.x = (gridOffset.current.x - speed + wrap) % wrap;
      gridOffset.current.y = (gridOffset.current.y - speed + wrap) % wrap;

      updateCellOpacities();
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const updateCellOpacities = () => {
      const targets = new Map();
      if (hoveredSquareRef.current) {
        targets.set(`${hoveredSquareRef.current.x},${hoveredSquareRef.current.y}`, 1);
      }
      
      trailCells.current.forEach((t, i) => {
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (hoverTrailAmount - i) / (hoverTrailAmount + 1));
        }
      });

      for (const [key] of targets) {
        if (!cellOpacities.current.has(key)) cellOpacities.current.set(key, 0);
      }

      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) || 0;
        const next = opacity + (target - opacity) * 0.1;
        if (next < 0.005) cellOpacities.current.delete(key);
        else cellOpacities.current.set(key, next);
      }
    };

    const handleMouseMove = (e) => {
      const x = (e.clientX - (gridOffset.current.x % squareSize)) / squareSize;
      const y = (e.clientY - (gridOffset.current.y % squareSize)) / squareSize;
      const col = Math.floor(x);
      const row = Math.floor(y);

      if (!hoveredSquareRef.current || hoveredSquareRef.current.x !== col || hoveredSquareRef.current.y !== row) {
        if (hoveredSquareRef.current) {
          trailCells.current.unshift({ ...hoveredSquareRef.current });
          if (trailCells.current.length > hoverTrailAmount) trailCells.current.pop();
        }
        hoveredSquareRef.current = { x: col, y: row };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [speed, borderColor, hoverFillColor, squareSize, hoverTrailAmount]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-auto" 
      style={{ zIndex: 0, background: 'transparent' }} 
    />
  );
};

export default ShapeGrid;