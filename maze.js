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
		this.distance = null;
	}

	reset() {
		this.checked = false;
		this.wall = {
			left: true,
			right: true,
			up: true,
			down: true,
		};
		this.distance = null;
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
		this.shortestPath = [];

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				this.nodes.push(new Node(x, y));
			}
		}

		// Generate Maze
		this.checkNextNode(this.nodes[startY * columns + startX]);

		// Find Shortest Path
		this.checkNodeDistance(endX, endY, Infinity);
	}

	checkNextNode(node, path = []) {
		if (!node) throw new Error("Node not found.");

		node.checked = true;
		path.push(node);
		node.distance = path.length - 1;

		// Randomly Select Next Neighbour
		this.checkNeighbours(node, path);

		// No Unchecked Neighbours Left
		this.checkNeighbours(path[path.length - 1], path);
		path.pop();
	}

	checkNeighbours(node, path) {
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
			return this.checkNextNode(nextNode, path);
		}
	}

	checkNodeDistance(x, y, currentDistance) {
		const node = this.nodes[y * this.columns + x];
		if (!node || node.distance >= currentDistance) return;
		const { wall, distance } = node;
		
		this.shortestPath.unshift({x, y});
		
		if (x > 0 && !wall.left) {
			this.checkNodeDistance(x - 1, y, distance);
		}
		if (x < this.columns - 1 && !wall.right) {
			this.checkNodeDistance(x + 1, y, distance);
		}
		if (y > 0 && !wall.up) {
			this.checkNodeDistance(x, y - 1, distance);
		}
		if (y < this.rows - 1 && !wall.down) {
			this.checkNodeDistance(x, y + 1, distance);
		}
	}

	reset() {
		this.shortestPath = [];
		this.nodes.forEach(node => node.reset());

		do {
			this.startX = Math.floor(Math.random() * this.columns);
			this.startY = Math.floor(Math.random() * this.rows);
			this.endX = Math.floor(Math.random() * this.columns);
			this.endY = Math.floor(Math.random() * this.rows);
		}
		while (this.startX === this.endX && this.startY === this.endY)
		
		this.checkNextNode(this.nodes[this.startY * this.columns + this.startX]);
		this.checkNodeDistance(this.endX, this.endY, Infinity);
	}
}
