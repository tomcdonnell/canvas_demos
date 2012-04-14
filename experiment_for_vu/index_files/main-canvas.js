$(document).ready(
   function () {
      window.canvasWidth  = 100; // Must match dimensions of element set in HTML.
      window.canvasHeight = 900; // Must match dimensions of element set in HTML.
      window.ctx          = document.getElementById('pixelCanvas').getContext('2d');
      window.colourBase   = new Colour(192,   0,   0);
      window.colourTarget = new Colour(  0, 255,   0);
      window.colourToUse  = new Colour(255,   0,   0);
      window.grid         = new Grid();
      grid.init();

      var lastX       = -1; // Last hit coords
      var lastY       = -1;
      var pixelCanvas = $('#pixelCanvas');

      pixelCanvas.mousemove(
         function (e) {
            var x = e.pageX - $(this).offset().left;
            var y = e.pageY - $(this).offset().top;
            var w = grid.getBlockWidth();
            var b = grid.getBlocks();

            x = Math.floor(x / w);
            y = Math.floor(y / w);

            if (x < 0 || x > grid.getNCols() - 1 || y < 0 || y > grid.getNRows() - 1) return;

            if (lastX != x || lastY != y) {
               b[y][x].hit();
               lastX = x;
               lastY = y;
            }
         }
      );

      t = setInterval(tick, 30);
   }
);

function tick() {
   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
   ctx.save();
   ctx.translate(canvasWidth / 2, canvasHeight / 2);

   var bs = grid.getBlocksSequence();

   for (b = 0; b < bs.length; ++b) {
      bs[b].magic();
      bs[b].draw();
   }

   ctx.restore();
}

/*
 * Return a colour that is c1 changed so that it is incrementally closer to c2.
 */
function getCloserColour(c, cTarget) {
   return new Colour(
      ((c.r < cTarget.r)? c.r + 1: ((c.r > cTarget.r)? c.r - 1: c.r)),
      ((c.g < cTarget.g)? c.g + 1: ((c.g > cTarget.g)? c.g - 1: c.g)),
      ((c.b < cTarget.b)? c.b + 1: ((c.b > cTarget.b)? c.b - 1: c.b))
   );
}

function Colour(r, g, b) {
   this.r = r;
   this.g = g;
   this.b = b;

   this.add = function (num) {
      this.r += num;
      this.g += num;
      this.b += num;
      if (this.r > 255) r = 255;
      if (this.g > 255) g = 255;
      if (this.b > 255) b = 255;
   };

   this.toRgba = function (alpha) {
      return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + alpha + ')';
   };
}

function Grid() {
   this.getBlockWidth     = function () {return _blockWidth    ;};
   this.getBlocks         = function () {return _blocks        ;};
   this.getBlocksSequence = function () {return _blocksSequence;};
   this.getMaxInk         = function () {return _maxInk        ;};
   this.getNCols          = function () {return _nRows         ;};
   this.getNRows          = function () {return _nRows         ;};

   this.init = function () {
      var ctx = document.getElementById('pixelCanvas').getContext('2d');

      for (var r = 0; r < _nRows; ++r) {
         var row = new Array();

         for (var c = 0; c < _nCols; ++c) {
            row[c] = new Block(ctx, c, r, this);
         }

         _blocks[r] = row;
      }

      for (var r = 0; r < _nRows; ++r) {
         for (var c = 0; c < _nCols; ++c) {
            var neighbours = Array();

            if (c < _nCols - 1) {neighbours.push(_blocks[r    ][c + 1]);}
            if (r < _nRows - 1) {neighbours.push(_blocks[r + 1][c    ]);}
            if (c > 0         ) {neighbours.push(_blocks[r    ][c - 1]);}
            if (r > 0         ) {neighbours.push(_blocks[r - 1][c    ]);}

            _blocks[r][c].setNeighbours(neighbours);
            _blocksSequence.push(_blocks[r][c]);
         }
      }
   };

   var _blockWidth     = 10;
   var _blocks         = Array();
   var _blocksSequence = Array();
   var _maxInk         = 255;
   var _nCols          = 10;
   var _nRows          = 90;
}

function Block(ctx, x, y, grid) {
   this.getColour = function () {return _colour;};
   this.getInk    = function () {return _ink   ;};

   this.setInk        = function (ink       ) {_ink        = ink       ;};
   this.setNeighbours = function (neighbours) {_neighbours = neighbours;};

   this.setColour = function (c) {
      _colour.r = c.r;
      _colour.g = c.g;
      _colour.b = c.b;
   };

   this.hit = function () {
      this.setColour(getCloserColour(colourToUse, colourTarget));
      _ink = grid.getMaxInk();
   };

   this.magic = function () {
      this.setColour(_nextColour);

      // Work out which neighbour has the most ink
      var bestNeighbour = _neighbours[0];
      for (index = 1; index < _neighbours.length; index++) {
         if (_neighbours[index].getInk() > bestNeighbour.getInk()) {
            bestNeighbour = _neighbours[index];
         }
      }

      // Only do something if the best neighbour has more ink than me
      if (bestNeighbour.getInk() > _ink && bestNeighbour.getInk() > 1) {
         this.setColour(getCloserColour(_colour, bestNeighbour.getColour()));
         _ink = Math.round(bestNeighbour.getInk() * 0.7) ;
         bestNeighbour.setInk(bestNeighbour.getInk() - Math.round(_ink / 50));
         if (bestNeighbour.getInk() < 0) bestNeighbour.setInk(0);
      }
      else if (_ink > 0) --_ink;

      // If the ink is 0, return to base
      if (_ink == 0) this.setColour(getCloserColour(_colour, colourBase));

      // Change the size of the el
      sizeDiff = Math.round(15 * (_ink / grid.getMaxInk()));
      _lastSizeDiff = sizeDiff;
   };

   this.draw = function () {
      var blockWidth     = grid.getBlockWidth();
      var halfBlockWidth = Math.floor(blockWidth / 2);

      ctx.fillStyle   = _colour.toRgba(1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.save();

      ctx.translate(
         (_xPixels) + halfBlockWidth - canvasWidth  / 2,
         (_yPixels) + halfBlockWidth - canvasHeight / 2
      );

      ctx.fillRect(
         -halfBlockWidth,
         -halfBlockWidth,
          blockWidth    ,
          blockWidth
      );

      sizeDiff = Math.round(
         (Math.floor(blockWidth / 2)) * (_ink / grid.getMaxInk())
      );

      ctx.lineWidth = sizeDiff;

      if (sizeDiff > 0) {
         ctx.strokeRect(
            -halfBlockWidth + (sizeDiff / 2),
            -halfBlockWidth + (sizeDiff / 2),
             blockWidth     - (sizeDiff    ),
             blockWidth     - (sizeDiff    )
         );
      }

      ctx.restore();
   };

   var _colour       = getCloserColour(colourToUse, colourTarget);
   var _ink          = 0;
   var _lastSizeDiff = 0;
   var _neighbours   = Array();
   var _nextColour   = _colour;
   var _xPixels      = x * grid.getBlockWidth();
   var _yPixels      = y * grid.getBlockWidth();
}
