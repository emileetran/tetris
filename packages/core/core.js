/*
  Represents a game of tetris

  pieces: T, L, J, square, line, S, Z

  line XXXX

         XX
  square XX

     X
  T XXX

     X
     X
  J XX

    X
    X
  L XX

     XX
  S XX
   
    XX
  Z  XX

*/


Tetris = function(width, height) {
  var grid = [];
  for(var i = 0; i < height; i++) {
    var column = [];
    for(var j = 0; j < width; j++) {
      column.push({occupied: false});        
    }
    grid.push(column);
  };

  this.grid = function() {
    return grid;
  };

  this.height = function() {
    return height;
  };

  this.width = function() {
    return width;
  };

  var checkRange = function(x, y) {
    if(x >= width || x < 0) {
      throw new Error("x out of range");
    }

    if(y >= height || y < 0) {
      throw new Error("y out of range");
    }
  };

  this.at = function(x, y) {
    checkRange(x, y);
    return grid[y][x];
  };

  var checkNotOccupied = function(x, y) {
    if(grid[y][x].occupied) {
      throw new Error('square (' + x + ", " + y + ') already occupied');
    }
  };

  this.add = function(x, y) {
    checkRange(x, y);
    checkNotOccupied(x, y);
    grid[y][x].occupied = true;
  };

  this.remove = function(x, y) {
    checkRange(x, y);
    grid[y][x].occupied = false;
  };

  this.addLinePiece = function() {

  };
}