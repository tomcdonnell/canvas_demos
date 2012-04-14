/*
 * vim: ts=3 sw=3 et wrap co=100 go-=b
 */

/*
 *
 */
function Mousetrails(maxParticles)
{
   var f = 'Mousetrails()';
   UTILS.checkArgs(f, arguments, [Number]);

   // Privileged functions. ////////////////////////////////////////////////////////////////////////

   this.getCanvas = function () {return _canvas;}

   // Private functions. ///////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _init()
   {
      var f = 'Mousetrails._init()';
      UTILS.checkArgs(f, arguments, []);

      $(window).mousemove(_onMousemove);
      window.setInterval(_onIntervalTimeout, 50);
   }

   /*
    *
    */
   function _onIntervalTimeout(ev)
   {
      try
      {
         var f = 'Mousetrails._onTimeout()';
         // No argument checking here because Firefox sends parameter but other browsers do not.

         ++_timeSinceLastCreate;

         for (var i = 0; i < _particles.length; ++i)
         {
            var p   = _particles[i];
            var r   = p.getRadius();
            var pos = p.pos;
            var vel = p.vel;
            var aX  = (450 - pos.getX()) / 900;
            var aY  = (450 - pos.getY()) / 900;

            vel.setX(vel.getX() + aX);
            vel.setY(vel.getY() + aY);
            pos.setX(pos.getX() + vel.getX());
            pos.setY(pos.getY() + vel.getY());

            var x = pos.getX() - r;
            var y = pos.getY() - r;

            _ctx.beginPath();
            _ctx.strokeStyle = p.color;
            _ctx.moveTo(x - 1, y);
            _ctx.lineTo(x, y);
            _ctx.stroke();
            _ctx.closePath();
         }

         if (_timeSinceLastCreate > _particleMaxAge)
         {
            var p = _particles.shift();
            delete p;
         }

         if (_mouseHasMovedSinceLastDraw)
         {
            if (_particles.length == maxParticles)
            {
               var p = _particles.shift();
               delete p;
            }

            if (_particles.length < maxParticles)
            {
               var vel = _mousePos.subtract(_mousePosPrev);
               var vel = vel.divide(vel.getMagnitude() / 4);
               var p   = new Particle
               (
                  _mousePos, // Position.
                  vel      , // Velocity.
                  1        , // Mass.
                  10         // Radius.
               );

               p.color = _getColor();
               _particles.push(p);
               _timeSinceLastCreate = 0;
            }
         }

         _mouseHasMovedSinceLastDraw = false;
         _echoStatus();
      }
      catch (e)
      {
         UTILS.printExceptionToConsole(f, e);
      }
   }

   /*
    *
    */
   function _getColor()
   {
      var colorNo = Math.floor(_particles.length / (maxParticles / 4));

      switch (colorNo)
      {
       case 0: return '#000000';
       case 1: return '#0000ff';
       case 2: return '#00ff00';
       case 3: return '#ff0000';
       default: throw new Exception(f, 'Unexpected value for colorNo "' + colorNo + '".', '');
      }
   }

   /*
    *
    */
   function _echoStatus()
   {
      _ctx.beginPath();
      _ctx.fillStyle = '#000000';
      _ctx.fillRect(0, 0, 150, 55);
      _ctx.stroke();
      _ctx.fillStyle = '#ffffff';
      _ctx.fillText('nParticles: '          + _particles.length   , 10, 12, 100);
      _ctx.fillText('timeSinceLastCreate: ' + _timeSinceLastCreate, 10, 27, 100);
      _ctx.fillText('maxParticleLifetime: ' + _particleMaxAge     , 10, 43, 100);
      _ctx.fillText('maxParticles: '        + maxParticles        , 10, 68, 100);
   }

   /*
    *
    */
   function _onMousemove(ev)
   {
      // No arugument checking to keep this function fast.
      _mousePosPrev               = _mousePos;
      _mousePos                   = new VectorRec2d(ev.clientX, ev.clientY);
      _mouseHasMovedSinceLastDraw = true;
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvas = CANVAS({width: 1000, height: 1080, style: 'border 1px solid red;'});
   var _ctx    = _canvas.getContext('2d');

   var _mousePos                   = new VectorRec2d(0, 0);
   var _mousePosPrev               = new VectorRec2d(0, 0);
   var _particles                  = [];
   var _particleIndexesFree        = [];
   var _particleMaxAge             = 500;
   var _timeSinceLastCreate        = null;
   var _mouseHasMovedSinceLastDraw = false;

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}
