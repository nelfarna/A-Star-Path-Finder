(function(exports) {
	
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
	}

	function Grid (numWidthCells, numHeightCells) {
		this.numWidthCells = numWidthCells;					// number of cells along width
		this.numHeightCells = numHeightCells;				// number of cells along height

		// The grid is divided into 16 regions, like street blocks.
		// The blocks will have a mix of legal and illegal cells (randomly generated)
		this.blockDepth = Math.floor(numWidthCells / 4);	
		this.cells = [];
	}

	exports.Grid = Grid;

	Grid.prototype = {
		generate: function() {
			var g = [];
			for(var i = 0; i < this.numHeightCells; i++) {
				g[i] = [];
				for(var j = 0; j < this.numWidthCells; j++) {
					// if inside block region, then randomly generate legal value, else set to true
					g[i][j] = new GridNode(i, j, (i*j) % this.blockDepth !== 0 ? Boolean(Math.floor(Math.random() * 200) % 2) : true);
				}
			}
			this.cells = g;
		},
		getRandomLegalNode: function() {
			var found = false;
			var x, y, node;
			while(!found) {
				x = Math.floor(Math.random() * this.numWidthCells);
				y = Math.floor(Math.random() * this.numHeightCells);
				node = this.cells[x][y];
				if (node.legal) found = true;
			}
			return node;
		},
		findNode: function(x, y) {
			var node = this.cells[x][y];
			if(node.pos.x === x && node.pos.y === y && node.legal) {
				return node;
			}
		}
	};

})(typeof exports === 'undefined' ? this : exports);

