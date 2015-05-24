var tetris = new Tetris(10, 22);
tetris.addIPiece();

Mousetrap.bind('x', function() { 
  tetris.rotateActivePieceRight(); 
});

Mousetrap.bind('z', function() { 
  tetris.rotateActivePieceLeft(); 
});

Mousetrap.bind('down', function() { 
  tetris.dropActivePiece(); 
});

Template.tetris.helpers({
  grid: function() {
    return tetris.grid();
  } 
});