const maze = new Maze(32, 32);

// Render
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const tilesize = 16;
const width = maze.columns * tilesize;
const height = maze.rows * tilesize;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
const colours = {
	background: '#fff',
	wall: '#000',
	start: '#00f',
	end: '#f00',
	path: '#ff0',
};

const draw = () => {
	ctx.strokeStyle = colours.wall;
	
	// Clear Canvas
	ctx.clearRect(0, 0, width, height);

	// Draw Nodes
	maze.nodes.forEach(node => {
		const { x, y, wall } = node;

		// Draw Node
		if (x === maze.startX && y === maze.startY) ctx.fillStyle = colours.start;
		else if (x === maze.endX && y === maze.endY) ctx.fillStyle = colours.end;
		else ctx.fillStyle = colours.background;
		ctx.fillRect(x * tilesize, y * tilesize, tilesize, tilesize);

		// Draw Walls
		ctx.beginPath();
		if (wall.left) {
			ctx.moveTo(x * tilesize, y * tilesize);
			ctx.lineTo(x * tilesize, y * tilesize + tilesize);
		}
		if (wall.right) {
			ctx.moveTo(x * tilesize + tilesize, y * tilesize);
			ctx.lineTo(x * tilesize + tilesize, y * tilesize + tilesize);
		}		
		if (wall.up) {
			ctx.moveTo(x * tilesize, y * tilesize);
			ctx.lineTo(x * tilesize + tilesize, y * tilesize);
		}
		if (wall.down) {
			ctx.moveTo(x * tilesize, y * tilesize + tilesize);
			ctx.lineTo(x * tilesize + tilesize, y * tilesize + tilesize);
		}
		ctx.stroke();
	});
};

const drawTilemap = () => {
	ctx.clearRect(0, 0, width, height);

	const tilemap = [];
	for (let y = 0; y < maze.rows * 2; y++) {
		tilemap[y] = [];
		for (let x = 0; x < maze.columns * 2; x++) {
			tilemap[y][x] = -1;
		}
	}
	
	maze.nodes.forEach(node => {
		const x = node.x * 2;
		const y = node.y * 2;
		if (x === maze.startX * 2 && y === maze.startY * 2) tilemap[y][x] = 1;
		else if (x === maze.endX * 2 && y === maze.endY * 2) tilemap[y][x] = 2;
		else tilemap[y][x] = 0;

		if (!node.wall.right) tilemap[y][x + 1] = 0;
		if (!node.wall.down) tilemap[y + 1][x] = 0;
	});

	for (let y = 0; y < maze.rows * 2; y++) {
		for (let x = 0; x < maze.columns * 2; x++) {
			if (tilemap[y][x] === -1) ctx.fillStyle = colours.wall;
			else if (tilemap[y][x] === 0) ctx.fillStyle = colours.background;
			else if (tilemap[y][x] === 1) ctx.fillStyle = colours.start;
			else if (tilemap[y][x] === 2) ctx.fillStyle = colours.end;

			ctx.fillRect(x * (tilesize / 2), y * (tilesize / 2), tilesize / 2, tilesize / 2);
		}
	}
};

window.onload = draw;
window.addEventListener('keydown', e => {
	if (e.key === "Enter") {
		maze.reset();
		draw();
	}
});
