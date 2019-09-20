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
	constructor(columns = 16, rows = 16, startX = 0, startY = 0, endX = columns - 1, endY = rows - 1) {
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
