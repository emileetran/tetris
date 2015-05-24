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

describe('Tetris', function() {
  describe('constructor', function() {
    context('when the width is less than four', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(3, 10);
        }

        test.throws(throwExpectedError, "grid must be at least 4 squares wide");
      });
    });

    context('when the height is less than four', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 3);
        }

        test.throws(throwExpectedError, "grid must be at least 4 squares high");
      });
    });
  });

  describe('height', function() {
    it('returns the height', function(test) {
      var tetris = new Tetris(5, 6);
      var height = tetris.height();
      test.equal(height, 6);
    });
  });

  describe('width', function() {
    it('returns the width', function(test) {
      var tetris = new Tetris(4, 5);
      var width = tetris.width();
      test.equal(width, 4);
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

  describe('activePieceRotation', function() {
    it('is 0 by default', function(test) {
      var tetris = new Tetris(4, 4);
      tetris.addIPiece();
      test.equal(tetris.activePieceRotation(), 0);      
    });
  });

  describe('add', function() {
    it('adds the square to the grid and sets if its active', function(test) {
      var tetris = new Tetris(6, 9);
      tetris.add(3, 5, true);
      test.equal(tetris.at(3, 5).occupied, true);
      test.equal(tetris.at(3, 5).active, true);

      tetris.add(3, 4, false);
      test.equal(tetris.at(3, 4).occupied, true);
      test.equal(tetris.at(3, 4).active, false);
    });

    context('when x is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.add(10, 0, true);
        }

        test.throws(throwExpectedError, "x out of range");
      });
    });

    context('when y is out of range', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(10, 10);
          tetris.add(4, 10, true);
        };

        test.throws(throwExpectedError, "y out of range");
      });
    });

    context('when the square is already occupied', function() {
      it('throws an error', function(test) {
        var throwExpectedError = function() {
          var tetris = new Tetris(5, 5);
          tetris.add(2, 3, true);
          tetris.add(2, 3, true);
        };

        test.throws(throwExpectedError, "square (2, 3) already occupied");
      });
    });
  });

  describe('remove', function() {
    it('removes the square to the grid', function(test) {
      var tetris = new Tetris(6, 9);
      tetris.add(3, 5, true);
      test.equal(tetris.at(3, 5).occupied, true);
      tetris.remove(3, 5, true);
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
      tetris.add(3, 5, true);
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

  var addSquares = function(tetris, occupancy) {
    for(var y = 0; y < occupancy.length; y++) {
      for(var x = 0; x < occupancy[y].length; x++) {
        if(occupancy[y][x] === 1) {
          tetris.add(x, y, false);
        }
      }
    }
  }

  var checkActive = function(test, tetris, occupancy) {
    for(var y = 0; y < occupancy.length; y++) {
      for(var x = 0; x < occupancy[y].length; x++) {
        var square = tetris.at(x, y);
        if(occupancy[y][x] === 1) {
          // square should be active and occupied
          test.equal(square.occupied, true);
          test.equal(square.active, true);
        } else {
          if(square.occupied) {
            // if occupied square should not be active
            test.equal(square.active, false);  
          } else {
            // if not occupied, square should not have key 'active'
            test.equal(square.active, undefined);
          }
        }
      }
    } 
  }

  describe('activePieceCanRotateRight', function() {
    context('when the active piece can rotate right', function(){
      it('returns true', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [1, 1, 0, 1],
          [0, 0, 0, 0],
          [1, 1, 0, 1],
          [1, 1, 0, 1]
        ]);

        test.equal(tetris.activePieceCanRotateRight(), true);
      });
    });

    context('when the active piece cannot rotate right', function() {
      it('returns false', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 0]
        ]);

        test.equal(tetris.activePieceCanRotateRight(), false);
      });
    });
  });

  describe('rotateActivePieceRight', function() {
    context('when the active piece cannot rotate right', function() {
      it('does nothing', function(test) {
        var tetris = new Tetris(4, 4);

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 0]
        ]);

        tetris.addIPiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        tetris.rotateActivePieceRight();

        // active piece should be in the same place
        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        test.equal(tetris.activePieceRotation(), 0);
      });
    });

    context('when the active piece can actually rotate right', function() {
      it('rotates it right', function(test) {
        var tetris = new Tetris(4, 4);

        addSquares(tetris, [
          [1, 1, 0, 1],
          [0, 0, 0, 0],
          [1, 1, 0, 1],
          [1, 1, 0, 1]
        ]);

        tetris.addIPiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        tetris.rotateActivePieceRight();

        checkActive(test, tetris, [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
        ]);

        test.equal(tetris.activePieceRotation(), 1);
      });
    });
  });

  describe('activePieceCanRotateLeft', function() {
    context('when the active piece can rotate left', function(){
      it('returns true', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [1, 0, 1, 1],
          [0, 0, 0, 0],
          [1, 0, 1, 1],
          [1, 0, 1, 1]
        ]);

        test.equal(tetris.activePieceCanRotateLeft(), true);
      });
    });

    context('when the active piece cannot rotate left', function() {
      it('returns false', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 0, 0]
        ]);

        test.equal(tetris.activePieceCanRotateLeft(), false);
      });
    });
  });

  describe('rotateActivePieceLeft', function() {
    context('when the active piece cannot rotate left', function() {
      it('does nothing', function(test) {
        var tetris = new Tetris(4, 4);

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 0, 0]
        ]);

        tetris.addIPiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        tetris.rotateActivePieceLeft();

        // active piece should be in the same place
        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        test.equal(tetris.activePieceRotation(), 0);
      });
    });

    context('when the active piece can actually rotate left', function() {
      it('rotates it left', function(test) {
        var tetris = new Tetris(4, 4);

        addSquares(tetris, [
          [1, 0, 1, 1],
          [0, 0, 0, 0],
          [1, 0, 1, 1],
          [1, 0, 1, 1]
        ]);

        tetris.addIPiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        tetris.rotateActivePieceLeft();

        checkActive(test, tetris, [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ]);

        test.equal(tetris.activePieceRotation(), 3);
      });
    });
  });

  describe('activePieceCanDrop', function() {
    context('when the active piece cannot drop', function() {
      it('returns false', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ]);


        test.equal(tetris.activePieceCanDrop(), false);
      });
    });


    context('when the active piece can drop', function() {
      it('returns true', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1]
        ]);

        test.equal(tetris.activePieceCanDrop(), true);
      });
    });

    context('when the piece is at the bottom of the grid', function() {
      it('returns false', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        tetris.dropActivePiece();
        tetris.dropActivePiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
        ]);

        test.equal(tetris.activePieceCanDrop(), false);
      });
    });
  });

  describe('dropActivePiece', function() {
    context('when the active piece cannot drop', function() {
      it('does nothing', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ]);

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        test.equal(tetris.activePieceCoords().x, 0);
        test.equal(tetris.activePieceCoords().y, 0);

        tetris.dropActivePiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);

        test.equal(tetris.activePieceCoords().x, 0);
        test.equal(tetris.activePieceCoords().y, 0);
      });
    });


    context('when the active piece can drop', function() {
      it('drops the piece one square', function(test) {
        
        var tetris = new Tetris(4, 4);
        tetris.addIPiece();

        addSquares(tetris, [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1]
        ]);

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]);
        
        test.equal(tetris.activePieceCoords().x, 0);
        test.equal(tetris.activePieceCoords().y, 0);

        tetris.dropActivePiece();

        checkActive(test, tetris, [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        ]);

        test.equal(tetris.activePieceCoords().x, 0);
        test.equal(tetris.activePieceCoords().y, 1);
      });
    });
  });

  describe('activePieceCoords', function() {
    it('returns the correct coordinates', function(test) {
      var tetris = new Tetris(20, 10);
      var coords = tetris.activePieceCoords();
      test.equal(coords.x, 8);
      test.equal(coords.y, 0);

      // odd-numbered widths should go on the right
      var tetris = new Tetris(5, 10);
      var coords = tetris.activePieceCoords();
      test.equal(coords.x, 1);
      test.equal(coords.y, 0);
    });
  });

  describe('startingAreaCoords', function() {
    it('returns the correct coordinates', function(test) {
      var tetris = new Tetris(4, 10);
      var coords = tetris.startingAreaCoords();
      test.equal(coords.x, 0);
      test.equal(coords.y, 0);

      var tetris = new Tetris(10, 10);
      var coords = tetris.startingAreaCoords();
      test.equal(coords.x, 3);
      test.equal(coords.y, 0);

      var tetris = new Tetris(20, 10);
      var coords = tetris.startingAreaCoords();
      test.equal(coords.x, 8);
      test.equal(coords.y, 0);

      // odd-numbered widths should go on the right
      var tetris = new Tetris(5, 10);
      var coords = tetris.startingAreaCoords();
      test.equal(coords.x, 1);
      test.equal(coords.y, 0);
    });
  });

  describe('addIPiece', function() {
    context('when a square is occupied', function() {
      it('throws an error', function(test) {
        var tetris = new Tetris(4, 4);
        tetris.add(0, 1, false);
        var throwExpectedError = function() {
          tetris.addIPiece();
        }
        test.throws(throwExpectedError, "square (0, 1) already occupied");
      });
    });

    context('with a 4x4 grid', function() {
      it('adds the piece in the correct place and makes them active', function(test) {
        var expectedSquares = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        var tetris = new Tetris(4, 4);
        
        tetris.addIPiece();

        for(var y = 0; y < tetris.height(); y++) {
          for(var x = 0; x < tetris.width(); x++) {
            if(expectedSquares[y][x] === 1) {
              test.equal(tetris.at(x, y).occupied, true);
              test.equal(tetris.at(x, y).active, true);
            } else {
              test.equal(tetris.at(x, y).occupied, false);
            }
          }
        }
      });
    });

    context('with a 7x4 grid', function() {
      it('adds the piece in the correct place and makes them active', function(test) {
        var expectedSquares = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 1, 1, 1, 1, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ];
        var tetris = new Tetris(7, 4);
        
        tetris.addIPiece();

        for(var y = 0; y < tetris.height(); y++) {
          for(var x = 0; x < tetris.width(); x++) {
            if(expectedSquares[y][x] === 1) {
              test.equal(tetris.at(x, y).occupied, true);
              test.equal(tetris.at(x, y).active, true);
            } else {
              test.equal(tetris.at(x, y).occupied, false);
            }
          }
        }
      });
    });
  });
});
