/*
 * vim: ts=3 sw=3 et wrap co=100 go-=b
 */

/*
 *
 */
function Vudoo(topLeftX, topLeftY, squareSideLength, nRows, nCols)
{
   // Public functions. /////////////////////////////////////////////////////////////////////////

   this.getCanvas = function () {return _canvas;};

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _tick()
   {
      _ctx.clearRect(0, 0, _canvasWidth, _canvasHeight);
      _ctx.save();
      _ctx.translate(_canvasWidth / 2, _canvasHeight / 2);

      var bs = _grid.getSquaresSequence();

      for (b = 0; b < bs.length; ++b)
      {
         bs[b].magic();
         bs[b].draw();
      }

      _ctx.restore();
   }

   /*
    * Return a colour that is c1 changed so that it is incrementally closer to c2.
    */
   function _getCloserColour(c, cTarget)
   {
      return new _Colour
      (
         ((c.r < cTarget.r)? c.r + 1: ((c.r > cTarget.r)? c.r - 1: c.r)),
         ((c.g < cTarget.g)? c.g + 1: ((c.g > cTarget.g)? c.g - 1: c.g)),
         ((c.b < cTarget.b)? c.b + 1: ((c.b > cTarget.b)? c.b - 1: c.b))
      );
   }

   /*
    *
    */
   function _Colour(r, g, b)
   {
      this.r = r;
      this.g = g;
      this.b = b;

      /*
       *
       */
      this.add = function (num)
      {
         this.r += num;
         this.g += num;
         this.b += num;
         if (this.r > 255) r = 255;
         if (this.g > 255) g = 255;
         if (this.b > 255) b = 255;
      };

      /*
       *
       */
      this.toRgba = function (alpha)
      {
         return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + alpha + ')';
      };
   }

   /*
    *
    */
   function _init()
   {
      $(_canvas).attr('width' , _canvasWidth );
      $(_canvas).attr('height', _canvasHeight);
      $(_canvas).css('position', 'absolute');
      $(_canvas).css('left', topLeftX);
      $(_canvas).css('top' , topLeftY);

      $('body').append(_canvas);

      _grid.init();

      $(_canvas).mouseleave
      (
         function (ev)
         {
            lastCol = -1;
            lastRow = -1;
         }
      );

      $(_canvas).mouseleave();

      $(_canvas).mousemove
      (
         function (ev)
         {
            var offset  = $(this).offset();
            var squares = _grid.getSquares();
            var col     = Math.floor((ev.pageX - offset.left) / squareSideLength);
            var row     = Math.floor((ev.pageY - offset.top ) / squareSideLength);

            if (col < 0 || col > nCols - 1 || row < 0 || row > nRows - 1)
            {
               return;
            }

            if (col != lastCol || row != lastRow)
            {
               squares[row][col].hit();
               lastCol = col;
               lastRow = row;
            }
         }
      );

      setInterval(_tick, 30);
   }

   // Private classes. //////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _Grid()
   {
      // Public functions. ///////////////////////////////////////////////////////////////////

      this.getSquares          = function () {return __squares         ;};
      this.getSquaresSequence  = function () {return __squaresSequence ;};
      this.getMaxInk           = function () {return __maxInk          ;};

      /*
       *
       */
      this.init = function ()
      {
         for (var r = 0; r < nRows; ++r)
         {
            var row = new Array();

            for (var c = 0; c < nCols; ++c)
            {
               row[c] = new Square(r, c, this);
            }

            __squares[r] = row;
         }

         for (var r = 0; r < nRows; ++r)
         {
            for (var c = 0; c < nCols; ++c)
            {
               var neighbours = Array();

               if (c < nCols - 1) {neighbours.push(__squares[r    ][c + 1]);}
               if (r < nRows - 1) {neighbours.push(__squares[r + 1][c    ]);}
               if (c > 0        ) {neighbours.push(__squares[r    ][c - 1]);}
               if (r > 0        ) {neighbours.push(__squares[r - 1][c    ]);}

               __squares[r][c].setNeighbours(neighbours);
               __squaresSequence.push(__squares[r][c]);
            }
         }
      };

      // Private variables. //////////////////////////////////////////////////////////////////

      var __squareSideLength = 20;
      var __squares          = Array();
      var __squaresSequence  = Array();
      var __maxInk           = 255;
   }

   /*
    *
    */
   function Square(row, col, _grid)
   {
      // Public functions. ///////////////////////////////////////////////////////////////////

      this.getColour = function () {return __colour;};
      this.getInk    = function () {return __ink   ;};

      this.setInk        = function (ink       ) {__ink        = ink       ;};
      this.setNeighbours = function (neighbours) {__neighbours = neighbours;};

      /*
       *
       */
      this.setColour = function (c)
      {
         __colour.r = c.r;
         __colour.g = c.g;
         __colour.b = c.b;
      };

      /*
       *
       */
      this.hit = function ()
      {
         this.setColour(_getCloserColour(_colourToUse, _colourTarget));
         __ink = _grid.getMaxInk();
      };

      /*
       *
       */
      this.magic = function ()
      {
         this.setColour(__nextColour);

         var bestNeighbour = __neighbours[0];
         for (index = 1; index < __neighbours.length; index++)
         {
            if (__neighbours[index].getInk() > bestNeighbour.getInk())
            {
               bestNeighbour = __neighbours[index];
            }
         }

         if (bestNeighbour.getInk() > __ink && bestNeighbour.getInk() > 1)
         {
            this.setColour(_getCloserColour(__colour, bestNeighbour.getColour()));

            __ink = Math.round(bestNeighbour.getInk() * 0.7);
            bestNeighbour.setInk(bestNeighbour.getInk() - Math.round(__ink / 50));

            if (bestNeighbour.getInk() < 0)
            {
               bestNeighbour.setInk(0);
            }
         }
         else
         {
            if (__ink > 0)
            {
               --__ink;
            }
         }

         if (__ink == 0)
         {
            this.setColour(_getCloserColour(__colour, _colourBase));
         }
      };

      /*
       *
       */
      this.draw = function ()
      {
         var halfSquareSideLength = Math.floor(squareSideLength / 2);

         _ctx.fillStyle   = __colour.toRgba(1);
         _ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
         _ctx.save();

         _ctx.translate
         (
            __posX - _canvasWidth  / 2 + halfSquareSideLength,
            __posY - _canvasHeight / 2 + halfSquareSideLength
         );

         _ctx.fillRect
         (
            -halfSquareSideLength,
            -halfSquareSideLength,
            squareSideLength     ,
            squareSideLength
         );

         _ctx.restore();
      };

      // Private variables. //////////////////////////////////////////////////////////////////

      var __colour     = _getCloserColour(_colourToUse, _colourTarget);
      var __ink        = 0;
      var __neighbours = Array();
      var __nextColour = __colour;
      var __posX       = col * squareSideLength;
      var __posY       = row * squareSideLength;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvas       = document.createElement('canvas');
   var _colourBase   = new _Colour(192,   0,   0);
   var _colourTarget = new _Colour(  0, 255,   0);
   var _colourToUse  = new _Colour(255,   0,   0);
   var _grid         = new _Grid();
   var _canvasWidth  = squareSideLength * nCols;
   var _canvasHeight = squareSideLength * nRows;
   var _ctx          = _canvas.getContext('2d');

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}
