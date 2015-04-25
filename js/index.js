(function() {

	$(window).load(function() {
		var canvas = $("#Canvas")[0],
			ctx = canvas.getContext("2d"),
			cellWidth = 25,					// set cell width/height in px
			numCellsLength = 25,			// set number of cells along grid edge
			w = cellWidth*numCellsLength,
			h = cellWidth*numCellsLength,
			g, start;

		ctx.canvas.width  = w;
  		ctx.canvas.height = h;

		generateGrid();

		// paint grid with random obstacles
		function paintGrid () {
			ctx.fillStyle = "#DDDDDD";
			ctx.fillRect(0,0,w,h);
			ctx.strokeStyle = "gray";
			ctx.strokeRect(0,0,w,h);

			ctx.fillStyle = "green";
			ctx.fillRect(start.pos.x*cellWidth, start.pos.y*cellWidth, cellWidth, cellWidth);

			for(var y = 0; y < g.cells[0].length; y++) {
				
				for(var x = 0; x < g.cells.length; x++) {
					if(!g.cells[x][y].legal) {

						ctx.fillStyle = "black";
						ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
						ctx.strokeStyle = "#DDDDDD";
						ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);

					} else {
						ctx.strokeStyle = "white";
						ctx.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
					}
				}
			}
		}

		// paint animated path
		function paintPath (path) {
			if (path.length > 2) { // only paint path if current and target nodes are not adjacent to each other

				var i = 1, n = 1, twice = false;

				var handle = setInterval( function() {
					if(n === 1) {
						ctx.fillStyle = "#0ABAFF";
					} else {
						ctx.fillStyle = "#DDDDDD";
					}
					ctx.fillRect(path[i].pos.x*cellWidth, path[i].pos.y*cellWidth, cellWidth, cellWidth);
					ctx.strokeStyle = "white";
					ctx.strokeRect(path[i].pos.x*cellWidth, path[i].pos.y*cellWidth, cellWidth, cellWidth);
					
					i++;
					if(i >= ( path.length - 1 ) && twice) {
						// this is the second pass, so stop animating
						clearInterval(handle);
					} else if(i >= ( path.length - 1 )) {
						twice = true;
						i = 1;
						n++;
					}
				}, 50);
			}
		}

		// used to generate and repaint a grid
		function generateGrid () {
			g = new Grid(numCellsLength, numCellsLength);

			// generate grid with random obstacles
			g.generate(); 

			// get a random starting point
			start = g.getRandomLegalNode(); 

			// now paint the grid with starting cells and obstacles
			paintGrid();
		}

		// event listener for canvas clicks
		// when user clicks a legal cell, the path will be computed and plotted
		$("#Canvas").mousedown( function (e) {
			var x = Math.floor((e.pageX-this.offsetLeft) / cellWidth),
				y = Math.floor((e.pageY-this.offsetTop) / cellWidth);
			
			end = g.findNode(x, y);

			if (end) {
				var astar = new AStar(g.cells, start, end, $("#cbx").is(':checked')),
					path = astar.path();

				paintGrid();

				ctx.fillStyle = "red";
				ctx.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
				
				paintPath(path);
			} 
		});

		// regenerate the grid when button is clicked
		$("#regen").click ( function (e) {
			generateGrid();
		});
	});

})();