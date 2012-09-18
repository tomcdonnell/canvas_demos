/*
 * vim: ts=3 sw=3 et wrap co=100 go-=b
 */

$(document).ready
(
   /*
    *
    */
   function (ev)
   {
      try
      {
         var f = 'index.php onReady()';
         UTILS.checkArgs(f, arguments, ['function']);

         var backgroundGenerator = new RandomTessellationGenerator($('#mainCanvas')[0]);
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }
);
