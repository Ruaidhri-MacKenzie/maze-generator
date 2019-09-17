const shuffle = array => {
  let currentIndex = array.length;
  let temp;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};

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
}

class Maze {
	constructor(columns, rows, startX = 0, startY = 0) {
		this.columns = columns;
		this.rows = rows;
		this.size = columns * rows;
		this.nodes = [];
		this.path = [];

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				this.nodes.push(new Node(x, y));
			}
		}

		this.checkNextNode(this.nodes[startY * this.columns + startX]);
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
	ctx.clearRect(0, 0, width, height);
	
	ctx.fillStyle = '#fff';
	ctx.strokeStyle = '#000';
	maze.nodes.forEach(node => {
		const { x, y, wall } = node;

		ctx.fillRect(x * tilesize, y * tilesize, tilesize, tilesize);

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
