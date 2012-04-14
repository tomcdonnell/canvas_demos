/*
 * vim: ts=3 sw=3 et wrap co=104 go-=b
 */

/*
 *
 */
function Helicaloops()
{
   // Privileged functions. /////////////////////////////////////////////////////////////////////////

   this.getCanvas = function () {return _canvas;}

   // Private functions. ////////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _init()
   {
      var f = 'Helicaloops._init()';
      UTILS.checkArgs(f, arguments, []);

      for (var helixNo = 0; helixNo < _nHelixes; ++helixNo)
      {
         _helixesXbyY.push([]);
         _initHelix(helixNo);
         _drawHelix(helixNo, true);
      }

      _onTimeout();
   }

   /*
    *
    */
   function _initHelix(helixNo)
   {
      var f = 'Hexicaloops._initHelix()';
      UTILS.checkArgs(f, arguments, [Number]);

      for (var y = 0; y < 1080; ++y)
      {
         _helixesXbyY[helixNo][y] = _helixFunctionsOfYt[helixNo](y, 0);
      }
   }

   /*
    *
    */
   function _onTimeout()
   {
      var f = 'Hexicaloops._onTimeout()';
      //UTILS.checkArgs(f, arguments, [Number]);

      for (var helixNo = 0; helixNo < _nHelixes; ++helixNo)
      {
         _drawHelix(helixNo, false);
      }

      _t += 0.1;
      if (_t > 2 * Math.PI) {_t -= 2 * Math.PI;}


      for (var helixNo = 0; helixNo < _nHelixes; ++helixNo)
      {
         for (var y = 0; y < 1080; ++y)
         {
            _helixesXbyY[helixNo][y] = _helixFunctionsOfYt[helixNo](y, _t);
         }

         _drawHelix(helixNo, true);
      }

      window.setTimeout(_onTimeout, 50);
   }

   /*
    *
    */
   function _drawHelix(helixNo, boolNotErase)
   {
      var f = 'Hexicaloops._drawHelix()';
      //UTILS.checkArgs(f, arguments, [Number, Boolean]);

      var helixXbyY = _helixesXbyY[helixNo];

      switch (boolNotErase)
      {
       case true:
         _ctx.strokeStyle = '#000';
         _ctx.lineWidth   = 1;
         break;
       case false:
         _ctx.strokeStyle = '#fff';
         _ctx.lineWidth   = 3;
         break;
      }

      _ctx.beginPath();
      _ctx.moveTo(helixXbyY[0], 0);

      for (var y = 0, len = helixXbyY.length; y < len; ++y)
      {
         _ctx.lineTo(helixXbyY[y], y);
      }

      _ctx.stroke();
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////////

   var _canvas             = CANVAS({width: 1000, height: 1080, style: 'border 1px solid red;'});
   var _ctx                = _canvas.getContext('2d');
   var _helixesXbyY        = [];
   var _t                  = 0;
   var _helixFunctionsOfYt =
   [
      function (y, t) {return 100 + 100 * Math.sin(t) *  Math.sin(((y     ) * Math.PI) / 180);},
      function (y, t) {return 100 + 100 * Math.sin(t) *  Math.cos(((y + 60) * Math.PI) / 180);},
      function (y, t) {return 900 + 100 * Math.sin(t) * -Math.sin(((y     ) * Math.PI) / 180);},
      function (y, t) {return 900 + 100 * Math.sin(t) * -Math.cos(((y + 60) * Math.PI) / 180);}
   ];
   var _nHelixes = _helixFunctionsOfYt.length;

   // Initialisation code. //////////////////////////////////////////////////////////////////////////

   _init();
}
