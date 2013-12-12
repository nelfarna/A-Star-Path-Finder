	$(window).load(function() {
			var canvas = $("#Canvas")[0];
			var ctx = canvas.getContext("2d");

			var cellWidth = 25; 
			var g;

			var start, end, w, h;

			generateGrid(25, 25);

			// paint grid with random obstacles
			function paintGrid (grid) {
				ctx.fillStyle = "#DDDDDD";
				ctx.fillRect(0,0,w,h);
				ctx.strokeStyle = "gray";
				ctx.strokeRect(0,0,w,h);

				ctx.fillStyle = "green";
				ctx.fillRect(start.pos.x*cellWidth, start.pos.y*cellWidth, cellWidth, cellWidth);


				for(var y = 0; y < grid[0].length; y++) {
					
					for(var x = 0; x < grid.length; x++) {
						if(!grid[x][y].legal) {

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
				
				if (path.length > 0) {

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
						if(i === path.length - 1 && twice) {
							clearInterval(handle);
						} else if(i === path.length - 1) {
							twice = true;
							i = 1;
							n++;
						}
					
					}, 50);
						
					//}
				}
			}

			// used to generate and repaint a grid
			function generateGrid (width, height) {
				g = new Grid(width, height);

				g.generate(); // generate grid with random obstacles
				
				w = g.grid.length*cellWidth;
				h = g.grid[0].length*cellWidth;

				ctx.canvas.width  = w;
	  			ctx.canvas.height = h;

				start = g.findRandomLegalNode(); // get a random starting point
				
				paintGrid(g.grid);
			}

			// event listener for canvas clicks
			// when user clicks a legal cell, the path will be computed and plotted
			$("#Canvas").mousedown( function (e) {
				var x = Math.floor((e.pageX-this.offsetLeft) / cellWidth);
				var y = Math.floor((e.pageY-this.offsetTop) / cellWidth);
				end = g.findNode(x, y);

				if (end) {
					var astar = new AStar(g.grid, start, end, $("#cbx").is(':checked'));
					var path = astar.path();

					paintGrid(g.grid);

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