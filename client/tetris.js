var tetris = new Tetris(10, 22);

Template.tetris.helpers({
  grid: function() {
    return tetris.grid();
  } 
});