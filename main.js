class Node {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.checked = false;
		this.wall = {
			left: true,
			right: true,
			up: true,
			down: true,
		};
	}

	reset() {
		this.checked = false;
		this.wall = {
			left: true,
			right: true,
			up: true,
			down: true,
		};
	}
}

class Maze {
	constructor(columns, rows, startX = 0, startY = 0, endX = columns - 1, endY = rows - 1) {
		this.columns = columns;
		this.rows = rows;
		this.size = columns * rows;
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.nodes = [];
		this.path = [];

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				this.nodes.push(new Node(x, y));
			}
		}

		this.checkNextNode(this.nodes[startY * columns + startX]);
	}

	checkNextNode(node) {
		if (!node) throw new Error("Node not found.");

		node.checked = true;
		this.path.push(node);

		// Randomly Select Next Neighbour
		this.checkNeighbours(node);

		// No Unchecked Neighbours Left
		this.checkNeighbours(this.path.pop());
	}

	checkNeighbours(node) {
		const neighbours = [];
		const { x, y } = node;

		// Left Neighbour
		if (x > 0) {
			const neighbourNode = this.nodes[y * this.columns + (x - 1)];
			if (!neighbourNode.checked) neighbours.push(neighbourNode);
		}
		// Right Neighbour
		if (x < this.columns - 1) {
			const neighbourNode = this.nodes[y * this.columns + (x + 1)];
			if (!neighbourNode.checked) neighbours.push(neighbourNode);
		}
		// Up Neighbour
		if (y > 0) {
			const neighbourNode = this.nodes[(y - 1) * this.columns + x];
			if (!neighbourNode.checked) neighbours.push(neighbourNode);
		}
		// Down Neighbour
		if (y < this.rows - 1) {
			const neighbourNode = this.nodes[(y + 1) * this.columns + x];
			if (!neighbourNode.checked) neighbours.push(neighbourNode);
		}
		
		if (neighbours.length > 0) {
			let randomIndex = Math.floor(Math.random() * neighbours.length);
			let nextNode = neighbours[randomIndex];

			// Remove Walls
			if (nextNode.x < node.x) {
				node.wall.left = false;
				nextNode.wall.right = false;
			}
			else if (nextNode.x > node.x) {
				node.wall.right = false;
				nextNode.wall.left = false;
			}
			else if (nextNode.y < node.y) {
				node.wall.up = false;
				nextNode.wall.down = false;
			}
			else if (nextNode.y > node.y) {
				node.wall.down = false;
				nextNode.wall.up = false;
			}

			// Check Next Node
			return this.checkNextNode(nextNode);
		}
	}

	reset() {
		this.nodes.forEach(node => node.reset());

		do {
			this.startX = Math.floor(Math.random() * this.columns);
			this.startY = Math.floor(Math.random() * this.rows);
			this.endX = Math.floor(Math.random() * this.columns);
			this.endY = Math.floor(Math.random() * this.rows);
		}
		while (this.startX === this.endX && this.startY === this.endY)
		
		this.checkNextNode(this.nodes[this.startY * this.columns + this.startX]);
	}
}

const maze = new Maze(32, 32);

// Render
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const tilesize = 16;
const width = maze.columns * tilesize;
const height = maze.rows * tilesize;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

const draw = () => {
	ctx.strokeStyle = '#000';
	
	// Clear Canvas
	ctx.clearRect(0, 0, width, height);

	// Draw Nodes
	maze.nodes.forEach(node => {
		const { x, y, wall } = node;

		// Draw Node
		if (x === maze.startX && y === maze.startY) ctx.fillStyle = '#00f';
		else if (x === maze.endX && y === maze.endY) ctx.fillStyle = '#f00';
		else ctx.fillStyle = '#fff';
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

window.onload = draw;
window.addEventListener('keydown', e => {
	if (e.key === "Enter") {
		maze.reset();
		draw();
	}
});
