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
   function _onClickShowHideContentButton(ev)
   {
      try
      {
         var f = 'RandomTessellationGenerator._onClickShowHideContentButton()';
         UTILS.checkArgs(f, arguments, ['object']);

         var contentJq = $('*.hideable-content'       );
         var buttonJq  = $('#show-hide-content-button');

         switch (_contentIsHidden)
         {
          case false:
            contentJq.slideUp();
            buttonJq.attr('title', 'reveal content');
            buttonJq.css('background-image', "url('images/logo_30x30_show_content.png')");
            _contentIsHidden = true;
            break;

          case true:
            contentJq.slideDown();
            buttonJq.attr('title', 'hide content to view background');
            buttonJq.css('background-image', "url('images/logo_30x30_hide_content.png')");
            _contentIsHidden = false;
            break;
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

      $('#show-hide-content-button').click(_onClickShowHideContentButton);

      setInterval(_onIntervalTimeout, 10000);
      _onIntervalTimeout();
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _contentIsHidden         = false;
   var _tessellatorSwastiklover = new TessellatorSwastiklover(canvas);
   var _ctx                     = canvas.getContext('2d');

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}
