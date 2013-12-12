
function Grid (width, height) {
	this.height = height;
	this.width = width;
    this.grid;
}

Grid.prototype.generate = function() {
	var grid = [];
	for(var i = 0; i < this.height; i++) {
		grid[i] = [];
		for(var j = 0; j < this.width; j++) {
			grid[i][j] = new GridNode(i, j, Boolean((i*j) % 7 !== 0 ? Math.floor(Math.random() * 200) % 2 : 1));
		}
	}
	this.grid = grid;
};

Grid.prototype.findRandomLegalNode = function() {
	var found = false;
	var x, y, node;
	while(!found) {
		x = Math.floor(Math.random() * this.width);
		y = Math.floor(Math.random() * this.height);
		node = this.grid[x][y];
		if (node.legal) found = true;
	}
	return node;
};

Grid.prototype.findNode = function(x, y) {
	var node;
	for(var j = 0; j < this.grid.length; j++) {
		for (var i = 0; i < this.grid[0].length; i++) {

			if(this.grid[i][j].pos.x === x 
				&& this.grid[i][j].pos.y === y
				&& this.grid[i][j].legal) {
				node = this.grid[i][j];
			}
		}
	}
	return node;
};


function GridNode (x, y, legal) {
	this.parent = null;
	this.legal = legal;
	this.f = 0;
	this.g = 0;
	this.h = 0;

	this.pos = {
		x: x,
		y: y
	}
};



