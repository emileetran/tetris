/*
  TODO: 

  Tetris()
    - addLinePiece, addSquarePiece etc
    - addPiece('square') => adds a piece of the specified type
    - dropPiece() => drops player piece 1 square
    - pieceDropped() => returns true if player piece has dropped fully
    - clearLines() => clears completed lines and returns score
    - addPiece() => throw error if no space... ie, game over
    - reset() => starts a new game

  PieceGenerator()
    - next() => returns a random piece type (eg: 'square')
*/

lPiece = [
  [
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false],
    [false, false, false, false],
  ],
  [
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
    [false, true, false, false],
  ],
]

describe('Tetris', function() {
  describe('height', function() {
    it('returns the height', function(test) {
      var tetris = new Tetris(3, 2);
      var height = tetris.height();
      test.equal(height, 2);
    });
  });

  describe('width', function() {
    it('returns the width', function(test) {
      var tetris = new Tetris(3, 5);
      var width = tetris.width();
      test.equal(width, 3);
    });
  });

  describe('grid', function() {
    it('returns the grid of the right height', function(test) {
      var tetris = new Tetris(4, 7);
      var grid = tetris.grid();
      test.equal(grid.length, 7);
    });

    it('returns the grid of the right width', function(test) {
      var tetris = new Tetris(8, 9);
      var grid = tetris.grid();
      for(var i = 0; i < 9; i++) {
        test.equal(grid[i].length, 8);
      }
    });

    it('returns the grid of empty cells', function(test) {
      var tetris = new Tetris(5, 8);
      var grid = tetris.grid();
      for(var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
          var square = grid[i][j];
          test.equal(square.occupied, false);
        }
      }
    });
  });

  describe('add', function() {
    it('adds the square to the grid', function(test) {
      var tetris = new Tetris(6, 9);
      tetris.add(3, 5);
      test.equal(tetris.at(3, 5).occupied, true);
    });

    context('when x is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.add(10, 0);
        }

        test.throws(throwExpectedError, "x out of range");
      });
    });

    context('when y is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.add(4, 10);
        };

        test.throws(throwExpectedError, "y out of range");
      });
    });

    context('when the square is already occupied', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(3, 5);
          tetris.add(2, 3);
          tetris.add(2, 3);
        };

        test.throws(throwExpectedError, "square (2, 3) already occupied");
      });
    });
  });

  describe('remove', function() {
    it('removes the square to the grid', function(test) {
      var tetris = new Tetris(6, 9);
      tetris.add(3, 5);
      test.equal(tetris.at(3, 5).occupied, true);
      tetris.remove(3, 5);
      test.equal(tetris.at(3, 5).occupied, false);
    });

    context('when x is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.remove(10, 0);
        }

        test.throws(throwExpectedError, "x out of range");
      });
    });

    context('when y is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.remove(4, 10);
        }

        test.throws(throwExpectedError, "y out of range");
      });
    });
  });

  describe('at', function() {
    it('returns the square at the grid', function(test) {
      var tetris = new Tetris(6, 9);
      tetris.add(3, 5);
      test.equal(tetris.at(3, 5).occupied, true);
    });

    context('when x is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.at(10, 0);
        }

        test.throws(throwExpectedError, "x out of range");
      });
    });

    context('when y is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.at(4, 10);
        }

        test.throws(throwExpectedError, "y out of range");
      });
    });
  });
});
