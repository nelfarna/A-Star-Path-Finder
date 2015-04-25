(function(exports) {

	function AStar(grid, start, end, diagonals) {
		this.grid = grid;
		this.start = start;
		this.target = end;
		this.diagonals = diagonals; // allow diagonals or not
	}

	exports.AStar = AStar;

	AStar.prototype = {
		euclidean: function(current, target) {
			return Math.floor(10*Math.sqrt(Math.pow((current.x - target.x), 2) + Math.pow((current.y - target.y), 2)));
		},
		manhattan: function(current, target) {
		    return Math.floor(10*Math.abs(current.x - target.x) + Math.abs(current.y - target.y));
		},
		diagonal: function(current, target){
			return Math.floor(10*Math.max(Math.abs(current.x-target.x), Math.abs(current.y-target.y)));
		},
		path: function() {
			var open = [],
				closed = [],
				path = [];

			open.push(this.start);

			while(open.length > 0) {
				var currNode = open[0];
				for (var n = 0; n < open.length; n++) {
					if(open[n].f < currNode.f)
						currNode = open[n];
				}

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
				open.splice(index, 1);

				closed.push(currNode);

				// for each neighbor do some stuff
				var neighbors = this.adjacentNodes(currNode);

				if(this.diagonals) {
					neighbors = neighbors.concat(this.diagonalNodes(currNode));
				}

				for (var n = 0; n < neighbors.length; n++) {
					var g = currNode.g + this.euclidean(currNode.pos, neighbors[n].pos);
					this.updateNode(neighbors[n], currNode, g, open, closed);
				}
			}

			return path;
		},
		// update g, h, and f of node if it is a legal move and not already in closed list
		updateNode: function(node, parent, g, open, closed) {
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
				node.h = this.euclidean(node.pos, this.target.pos);
				
				node.f = node.g + node.h;
				node.parent = parent;
			}
		},

		// get neighboring nodes (N, S, E, W)
		adjacentNodes: function(node) {
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

		},
		// get neighboring diagonal nodes (NE, SE, SW, NW)
		diagonalNodes: function (node) {
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
	};
	
})(typeof exports === 'undefined' ? this : exports); 