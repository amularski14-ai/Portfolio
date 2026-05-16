const canvas = document.getElementById("game-of-life");
const intro_overlay = document.getElementById("intro-overlay");
let ctx = canvas.getContext("2d");

let background_color = 'rgba(50,50,50, 0.3)';
let active_cell_color = 'rgb(0, 226, 255, 0.3)'

const cols = 300;
const rows = 200;
let grid = Array.from({ length: rows }, () =>
  new Uint8Array(cols)
);

// Some performance specs
const target_framerate = 60;
let last_frame_time = 0;
const interval = 1000 / target_framerate;

// Expand or contract the grid based on canvas size
function format_grid() {
  // reset the dpr
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(cols * dpr);
  canvas.height = Math.round(rows * dpr);

  ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
}

function loop(timestamp) {

  const delta = timestamp - last_frame_time;
  if (delta > interval) {
    last_frame_time = timestamp - (delta % interval);
    animate();
  }

  requestAnimationFrame(loop);
}
function animate() {

  // Calculate the next frame iteration
  calc_game_of_life_iteration();


  const rect = canvas.getBoundingClientRect();
  // clear the canvas
  ctx.clearRect(0, 0, rect.width, rect.height);

  ctx.fillStyle = background_color;
  ctx.fillRect(0, 0, rect.width, rect.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cur = grid[row][col];
      if (cur === 1) {
        ctx.fillStyle = active_cell_color;
        ctx.fillRect(col, row, 1, 1);
      }
    }
  }
}

function calc_game_of_life_iteration() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid[row][col] = isPointAlive(grid, row, col) ? 1 : 0;
    }
  }
}

function isPointAlive(grid, row, col) {
  const point = grid[row % rows][col % cols];

  let numActiveNeighbors = 0;
  for (let rowDiff = -1; rowDiff <= 1; rowDiff++) {
    for (let colDiff = -1; colDiff <= 1; colDiff++) {
      // do not count the middle node.
      if (rowDiff === 0 && colDiff === 0) continue;

      const partner_row_index = row - rowDiff;
      const partner_col_index = col - colDiff;

      // Check bounds
      if (partner_row_index < 0 || partner_row_index >= rows) continue;
      if (partner_col_index < 0 || partner_col_index >= cols) continue;

      const partnerPoint = grid[partner_row_index][partner_col_index];
      if (partnerPoint === 1) {
        numActiveNeighbors++;
      }
    }
  }

  // First determine if the point is already populated
  if (point === 1) {
    // Now we need to determine if the cell survives or not.

    // Rule 1: A cell with no neighbors dies
    if (numActiveNeighbors === 0) return false;

    // Rule 2: Each cell with 4 or more neighbors dies (Overpopulation)
    if (numActiveNeighbors >= 4) return false;

    // Rule 3: Each cell with 2 or 3 neighbors survives
    if (numActiveNeighbors === 2 || numActiveNeighbors === 3) {
      return Math.random() < 0.95;
    };
  } else {
    // Rule 4: If the cell is unpopulated and has 3 neighbors, it becomes populated.
    if (numActiveNeighbors === 3) {
      return Math.random() < 0.95;
    };
  }

  return false;
}

let resize_callback;
window.addEventListener("resize", () => {
  clearTimeout(resize_callback);
  // It is not necessary to reset while the screen is moving so wait a short duration before making the expensive computation.
  resize_callback = setTimeout(format_grid, 100);
});

const mouseRadius = 3;
intro_overlay.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = Math.floor((e.clientX - rect.left) * (cols / rect.width));
  const mouseY = Math.floor((e.clientY - rect.top) * (rows / rect.height));

  for (let row = mouseY - mouseRadius; row <= mouseY + mouseRadius; row++) {
    for (let col = mouseX - mouseRadius; col <= mouseX + mouseRadius; col++) {
      const r = (row + rows) % rows;
      const c = (col + cols) % cols;
      if (Math.random() < 0.5) grid[r][c] = 1;
    }
  }
});

window.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches;
  if (touch.length === 0) return;
  const mouseX = Math.floor((touch[0].clientX - rect.left) * (cols / rect.width));
  const mouseY = Math.floor((touch[0].clientY - rect.top) * (rows / rect.height));

  for (let row = mouseY - mouseRadius; row <= mouseY + mouseRadius; row++) {
    for (let col = mouseX - mouseRadius; col <= mouseX + mouseRadius; col++) {
      const r = (row + rows) % rows;
      const c = (col + cols) % cols;
      if (Math.random() < 0.5) grid[r][c] = 1;
    }
  }
})

// Start the animation
format_grid();
requestAnimationFrame(loop);
