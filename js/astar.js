function AStar (grid, start, end, diagonals) {
	this.grid = grid;
	this.start = start;
	this.target = end;
	this.diagonals = diagonals;
}

AStar.prototype.path = function() {
	var open = [];
	var closed = [];
	var path = [];

	open.push(this.start);

	while(open.length > 0) {
		var currNode = open[0];
		open.map(function (node) {
			if(node.f < currNode.f)
				currNode = node;
		});
		if (this.target.pos === currNode.pos) {
			
			var c = currNode;
			while(c.parent) {
				path.push(c);
				c = c.parent;
			}
			path.push(c); // push start node
			return path.reverse();
		}

		// remove current node with lowest f from open and move to closed
		var index = open.indexOf(currNode);
		if (index > -1) 
			open.splice(index, 1);

		closed.push(currNode);

		// for each neighbor
		var adjNodes = this.adjacentNodes(currNode);
		var diagNodes = [];

		if(this.diagonals) {
			diagNodes = this.diagonalNodes(currNode);
		}

		for ( var n = 0; n < adjNodes.length; n++ ) {
			var g = currNode.g + 1;
			this.updateNode(adjNodes[n], currNode, g, open, closed);
		}

		for ( var d = 0; d < diagNodes.length; d++ ) {
			var g = currNode.g + 1.414;
			this.updateNode(diagNodes[d], currNode, g, open, closed);
		}
	}

	return path;
};

AStar.prototype.manhattan = function(current, target) {
    return Math.abs(current.x - target.x) + Math.abs(current.y - target.y);
};

AStar.prototype.diagonal = function(current, target){
	return Math.max(Math.abs(current.x-target.x), Math.abs(current.y-target.y));
};

AStar.prototype.euclidean = function(current, target) {
	return Math.sqrt(Math.pow((current.x - target.x), 2) + Math.pow((current.y - target.y), 2));
};
		

AStar.prototype.updateNode = function(node, parent, g, open, closed) {
	var update = false;
	if(node.legal && closed.indexOf(node) < 0) {
		if(open.indexOf(node) < 0) {
			update = true;
			open.push(node);
		} else if (g < parent.g) {
			update = true;
		}
	}
	if(update) {
		node.g = g;
		node.h = node.h || (this.diagonals) ? this.euclidean(node.pos, this.target.pos) : this.manhattan(node.pos, this.target.pos);
		
		node.f = node.g + node.h;
		node.parent = parent;
	}
};

AStar.prototype.adjacentNodes = function(node) {
	var x = node.pos.x;
	var y = node.pos.y;
	var g = this.grid;

	var north = (g[x]) ? g[x][y-1] : null;
	var south = (g[x]) ? g[x][y+1] : null;
	var east = (g[x+1]) ? g[x+1][y] : null;
	var west = (g[x-1]) ? g[x-1][y] : null;

	var adj = [];

	if(north) 
		adj.push(north);

	if(east) 
		adj.push(east);

	if(south) 
		adj.push(south);

	if(west) 
		adj.push(west);

	return adj;

};

AStar.prototype.diagonalNodes = function (node) {
	var x = node.pos.x;
	var y = node.pos.y;
	var g = this.grid;

	var adj = [];

	var ne = (g[x+1]) ? g[x+1][y-1] : null;
	var nw = (g[x-1]) ? g[x-1][y-1] : null;
	var se = (g[x+1]) ? g[x+1][y+1] : null;
	var sw = (g[x-1]) ? g[x-1][y+1] : null;


	if(sw) { // southwest
		adj.push(sw);
	}
	
	if(se) { // southeast
		adj.push(se);
	}

	if(nw) { // northwest
		adj.push(nw);
	}

	if(ne) { // northeast
		adj.push(ne);
	}
	
	return adj;
}