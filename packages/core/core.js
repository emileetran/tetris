/*
  Represents a game of tetris
*/
var iPiece = [   
  [
    [0,0,0,0], 
    [1,1,1,1], 
  ], 
  [
    [0,0,1], 
    [0,0,1], 
    [0,0,1], 
    [0,0,1]
  ],
  [
    [0,0,0,0], 
    [0,0,0,0], 
    [1,1,1,1]
  ], 
  [
    [0,1], 
    [0,1], 
    [0,1], 
    [0,1]
  ]
];

var tPiece = {
  blocks: [
    [
      [0,0,0,0], 
      [1,1,1,0], 
      [0,1,0,0], 
      [0,0,0,0]
    ],
    [
      [0,1,0,0], 
      [1,1,0,0], 
      [0,1,0,0], 
      [0,0,0,0]
    ],
    [
      [0,1,0,0], 
      [1,1,1,0], 
      [0,0,0,0], 
      [0,0,0,0]
    ], 
    [
      [0,1,0,0], 
      [0,1,1,0], 
      [0,1,0,0], 
      [0,0,0,0]
    ]
  ],
  
  color: '#767676'  
};

var lPiece = {
  blocks: [
    [
      [0,0,0,0], 
      [1,1,1,0], 
      [1,0,0,0], 
      [0,0,0,0]
    ], 
    [
      [1,1,0,0], 
      [0,1,0,0], 
      [0,1,0,0], 
      [0,0,0,0]
    ], 
    [
      [0,0,1,0], 
      [1,1,1,0], 
      [0,0,0,0],  
      [0,0,0,0]
    ], 
    [
      [0,1,0,0], 
      [0,1,0,0], 
      [0,1,1,0], 
      [0,0,0,0]
    ]
  ],
  
  color: '#ffa500'
};

var jPiece = {
  blocks: [ 
    [
      [1,0,0,0], 
      [1,1,1,0], 
      [0,0,0,0], 
      [0,0,0,0]
    ], 
    [
      [0,1,1,0], 
      [0,1,0,0], 
      [0,1,0,0], 
      [0,0,0,0]
    ], 
    [
      [0,0,0,0], 
      [1,1,1,0], 
      [0,0,1,0],  
      [0,0,0,0]
    ], 
    [
      [0,1,0,0], 
      [0,1,0,0], 
      [1,1,0,0],  
      [0,0,0,0]
    ]
  ],
  
  color: '0000ff'
};

var zPiece = {
  blocks: [ 
    [
      [0,0,0,0], 
      [1,1,0,0], 
      [0,1,1,0], 
      [0,0,0,0]
    ], 
    [
      [0,0,1,0], 
      [0,1,1,0], 
      [0,1,0,0], 
      [0,0,0,0]
    ] 
  ],

  color: 'ff0000'
};

var sPiece = {
  blocks: [ 
    [
      [0,0,0,0], 
      [0,1,1,0], 
      [1,1,0,0], 
      [0,0,0,0]
    ],
    [
      [0,1,0,0], 
      [0,1,1,0], 
      [0,0,1,0], 
      [0,0,0,0]
    ]
  ],

  color: '00ff00'
};

var oPiece = {
  blocks: [
    [
      [0,1,1,0], 
      [0,1,1,0], 
      [0,0,0,0], 
      [0,0,0,0]
    ]
  ],

  color: 'ffff00'
};


Tetris = function(width, height) {
  if(width < 4) {
    throw new Error('grid must be at least 4 squares wide');
  }

  if(height < 4) {
    throw new Error('grid must be at least 4 squares high');
  }

  var createGrid = function() {
    var grid = [];
    for(var i = 0; i < height; i++) {
      var column = [];
      for(var j = 0; j < width; j++) {
        column.push({occupied: false});        
      }
      grid.push(column);
    };
    return grid;
  }

  var reactiveGrid = new ReactiveVar(createGrid());

  this.grid = function() {
    return reactiveGrid.get();
  };

  this.height = function() {
    return height;
  };

  this.width = function() {
    return width;
  };

  var isInRange = function(x, y) {
    return (
      (x >= 0) &&
      (x < width) &&
      (y >= 0) &&
      (y < height)
    );
  }

  var checkRange = function(x, y) {
    if(x >= width || x < 0) {
      throw new RangeError("x out of range");
    }

    if(y >= height || y < 0) {
      throw new RangeError("y out of range");
    }
  };

  this.at = function(x, y) {
    checkRange(x, y);
    return this.grid()[y][x];
  };

  var checkNotOccupied = function(x, y) {
    if(this.at(x, y).occupied) {
      throw new Error('square (' + x + ", " + y + ') already occupied');
    }
  }.bind(this);

  this.add = function(x, y, active) {
    checkRange(x, y);
    checkNotOccupied(x, y);
    var grid = this.grid();
    grid[y][x] = {
      occupied: true,
      active: active
    };
    reactiveGrid.set(grid);
  };

  this.remove = function(x, y) {
    checkRange(x, y);
    var grid = this.grid();
    grid[y][x] = {
      occupied: false
    };
    reactiveGrid.set(grid);
  };

  this.startingAreaCoords = function() {
    return {
      x: Math.ceil(width/2) - 2,
      y: 0
    };
  };

  var activePieceCoords = this.startingAreaCoords();
  this.activePieceCoords = function() {
    return activePieceCoords;
  };

  var activePieceRotation = 0;
  this.activePieceRotation = function() {
    return activePieceRotation;
  };

  var forEachOccupiedSquare = function(xOffset, yOffset, occupancy, callback) {
    for(var y = 0; y < occupancy.length; y++) {
      for(var x = 0; x < occupancy[y].length; x++) {
        if(occupancy[y][x] === 1) { 
          callback(x + xOffset, y + yOffset);
        }
      }
    }
  };

  this.activePieceCanDrop = function() {
    var occupancy = iPiece[activePieceRotation];
    var xOffset = this.activePieceCoords().x;
    var yOffset = this.activePieceCoords().y;

    var canDrop = true;
    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      if(!isInRange(x, y + 1)) {
        canDrop = false;
        return;
      }

      var square = this.at(x, y + 1);
      if(square.occupied && !square.active) {
        canDrop = false;
      }
    }.bind(this));

    return canDrop;
  };

  this.dropActivePiece = function() {
    if(!this.activePieceCanDrop()) {
      return;
    }
    var occupancy = iPiece[activePieceRotation];
    var xOffset = this.activePieceCoords().x;
    var yOffset = this.activePieceCoords().y;

    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.remove(x, y);
    }.bind(this));

    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.add(x, y + 1, true);
    }.bind(this));

    activePieceCoords = {x: xOffset, y: yOffset + 1};
  };

  this.activePieceCanRotateRight = function() {
    var nextActivePieceRotation = (activePieceRotation + 1) % 4;
    var occupancy = iPiece[nextActivePieceRotation];
    var xOffset = this.activePieceCoords().x;
    var yOffset = this.activePieceCoords().y;

    var canRotate = true;
    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      if(!isInRange(x, y)) {
        canRotate = false;
        return;
      }
      // active pieces should not block rotation,
      // only non-active 'fallen' pieces
      var square = this.at(x, y);
      if(square.occupied && !square.active) {
        canRotate = false;
      }
    }.bind(this));

    return canRotate;
  };

  this.activePieceCanRotateLeft = function() {
    var nextActivePieceRotation = (activePieceRotation + 3) % 4;
    var occupancy = iPiece[nextActivePieceRotation];
    var xOffset = this.activePieceCoords().x;
    var yOffset = this.activePieceCoords().y;

    var canRotate = true;
    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      if(!isInRange(x, y)) {
        canRotate = false;
        return;
      }
      // active pieces should not block rotation,
      // only non-active 'fallen' pieces
      var square = this.at(x, y);
      if(square.occupied && !square.active) {
        canRotate = false;
      }
    }.bind(this));

    return canRotate;
  };

  this.rotateActivePieceRight = function() {
    if(!this.activePieceCanRotateRight()) {
      return;
    }
    var occupancy = iPiece[activePieceRotation];
    var xOffset = this.activePieceCoords().x;
    var yOffset = this.activePieceCoords().y;

    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.remove(x, y);
    }.bind(this));

    activePieceRotation = (activePieceRotation + 1) % 4;
    occupancy = iPiece[activePieceRotation];

    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.add(x, y, true);
    }.bind(this));
  };

  this.rotateActivePieceLeft = function() {
    if(!this.activePieceCanRotateLeft()) {
      return;
    }
    var occupancy = iPiece[activePieceRotation];
    var xOffset = this.activePieceCoords().x;
    var yOffset = this.activePieceCoords().y;

    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.remove(x, y);
    }.bind(this));

    activePieceRotation = (activePieceRotation + 3) % 4;
    occupancy = iPiece[activePieceRotation];

    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.add(x, y, true);
    }.bind(this));
  };

  this.addIPiece = function() {
    // use rotation-0 when adding a piece
    activePieceRotation = 0;

    var occupancy = iPiece[activePieceRotation]; // 2D array of square occupancy
    var xOffset = this.startingAreaCoords().x;
    var yOffset = this.startingAreaCoords().y;  
    
    forEachOccupiedSquare(xOffset, yOffset, occupancy, function(x, y) {
      this.add(x, y, true);
    }.bind(this));
  };
}