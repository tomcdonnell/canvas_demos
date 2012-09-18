/*
 * vim: ts=3 sw=3 et wrap co=100 go-=b
 */

/*
 *
 */
function RandomTessellationGenerator(canvas)
{
   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _onIntervalTimeout()
   {
      try
      {
         var f = 'RandomTessellationGenerator._onIntervalTimeout()';
         UTILS.checkArgs(f, arguments, []);

         _clearCanvas();

         var swastikloverConfig = {armSegmentLength: 128, armSegmentLengthMin: 3};
         var delayMs            = 1000;

         switch (Math.floor(Math.random() * 2))
         {
          case 0 : _tessellatorSwastiklover.sketch(swastikloverConfig, 1, null, delayMs); break;
          case 1 : _tessellatorSwastiklover.sketch(swastikloverConfig, 2, null, delayMs); break;
          default: throw new Exception(f, 'Unknown version number.');
         }
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _onResize(ev)
   {
      try
      {
         var f = 'RandomTessellationGenerator._onResize()';
         UTILS.checkArgs(f, arguments, []);

      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _clearCanvas()
   {
      var f = 'RandomTessellationGenerator._clearCanvas()';
      UTILS.checkArgs(f, arguments, []);

      _ctx.save();
      _ctx.fillStyle = '#fff';
      _ctx.fillRect(0, 0, $(canvas).width(), $(canvas).height());
      _ctx.restore();
   }

   /*
    *
    */
   function _init()
   {
      var f = 'RandomTessellationGenerator._init()';
      UTILS.checkArgs(f, arguments, []);

      setInterval(_onIntervalTimeout, 10000);
      _onIntervalTimeout();
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _tessellatorSwastiklover = new TessellatorSwastiklover(canvas);
   var _ctx                     = canvas.getContext('2d');

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}
