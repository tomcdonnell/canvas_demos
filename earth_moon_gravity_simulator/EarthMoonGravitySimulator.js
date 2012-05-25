/*
 * vim: ts=3 sw=3 et wrap co=100 go-=b
 */

/*
 *
 */
function EarthMoonGravitySimulator()
{
   // Privileged functions. /////////////////////////////////////////////////////////////////////

   this.getCanvas = function () {return _canvas;}

   // Private functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   function _init()
   {
      _drawSystem();
      $(_canvas).click(_onClickCanvas);

      for (var pName in _particles)
      {
         var p  = _particles[pName];
         p.oldX = p.pos.getX();
         p.oldY = p.pos.getY();
      }

      _intervalId = window.setInterval(_onIntervalTimeout, 10);
   }

   /*
    *
    */
   function _onIntervalTimeout()
   {
      try
      {
         var forceRecByPName = {};

         // For each particle, initialise sum-of-forces vector.
         for (var pName in _particles)
         {
            forceRecByPName[pName] = new VectorRec2d(0, 0);
         }

         // For each particle, sum forces due to attraction to each other particle.
         for (var p1Name in _particles)
         {
            for (var p2Name in _particles)
            {
               if (p1Name == p2Name)
               {
                  continue;
               }

               forceRecByPName[p1Name] = forceRecByPName[p1Name].add
               (
                  _getForceRecOnP1DueToTwoParticleGravity(_particles[p1Name], _particles[p2Name])
               );
            }
         }

         // For each particle, calculate acceleration and velocity, then update position.
         for (var pName in _particles)
         {
            var p   = _particles[pName];
            var acc = forceRecByPName[pName].divide(p.getMass());

            p.oldX = p.pos.getX();
            p.oldY = p.pos.getY();
            p.vel  = p.vel.add(acc.multiply(_DELTA_T));
            p.pos  = p.pos.add(p.vel.multiply(_DELTA_T));
         }

         _drawSystem();

         _t += 1;

         if (_t > 20000)
         {
            window.clearInterval(_intervalId);
         }
      }
      catch (e)
      {
         console.debug(e);
      }
   }

   /*
    *
    */
   function _getForceRecOnP1DueToTwoParticleGravity(p1, p2)
   {
      var p2Pos    = p2.pos;
      var p1Pos    = p1.pos;
      var distance = Math.sqrt
      (
         Math.pow(p2Pos.getX() - p1Pos.getX(), 2) +
         Math.pow(p2Pos.getY() - p1Pos.getY(), 2)
      );

      var p2Mass       = p2.getMass();
      var p1Mass       = p1.getMass();
      var combinedMass = p2Mass + p1Mass;
      var p1ToP2Rec    = p2Pos.subtract(p1Pos); // P1 must move by this much to be at P2.
      var forceP1P2Pol =                        // Force on p1 due to p1-p2 gravity.
      (
         (distance < p2.getRadius() + p1.getRadius())?
         new VectorPol2d(0, 0):
         new VectorPol2d
         (
            (_GRAVITATIONAL_CONSTANT * combinedMass) / (distance * distance),
            (p1ToP2Rec.divide(p1ToP2Rec.getMagnitude())).getAngle()
         )
      );

      return forceP1P2Pol.convToRec();
   }

   /*
    *
    */
   function _drawSystem()
   {
      var PI = Math.PI;

      _ctx.save();
      _ctx.translate(450, 450);
      _ctx.scale(_SCALING_FACTOR, _SCALING_FACTOR);
      _ctx.save();

      // Erase old.
      _ctx.fillStyle = '#fff';
      for (var pName in _particles)
      {
         var p = _particles[pName];

         if
         (
            (p.oldX < -_DRAW_BOUNDARY_X || p.oldX > _DRAW_BOUNDARY_X) ||
            (p.oldY < -_DRAW_BOUNDARY_Y || p.oldY > _DRAW_BOUNDARY_Y)
         )
         {
            continue;
         }

         var radius   = p.getRadius() * 1.5;
         var diameter = 2 * radius;

         _ctx.fillRect(p.oldX - radius, p.oldY - radius, diameter, diameter);
      }

      _ctx.restore();

      // Draw new.
      _ctx.strokeStyle = '#000';
      _ctx.beginPath();
      for (var pName in _particles)
      {
         var p    = _particles[pName];
         var pos  = p.pos;
         var posX = pos.getX();
         var posY = pos.getY();

         if
         (
            (posX < -_DRAW_BOUNDARY_X || posX > _DRAW_BOUNDARY_X) ||
            (posY < -_DRAW_BOUNDARY_Y || posY > _DRAW_BOUNDARY_Y)
         )
         {
            continue;
         }

         var radius = p.getRadius();
         _ctx.moveTo(posX + radius, posY);
         _ctx.arc(posX, posY, radius, 0, 2 * PI);
      }
      _ctx.closePath();
      _ctx.restore();
      _ctx.stroke();
   }

   // Event listeners. ------------------------------------------------------------------------//

   /*
    *
    */
   function _onClickCanvas(ev)
   {
      try
      {
         // Launch projectile.
      }
      catch (e)
      {
         console.error(e);
      }
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvas = CANVAS
   (
      {id: 'EarthMoonGravitySimulator', width: 1000, height: 1080, style: 'border 1px solid red;'}
   );

   var _ctx        = _canvas.getContext('2d');
   var _intervalId = null;
   var _t          = 0;

   const _DELTA_T                       = 6e14     ; // Units: s.
   const _EARTH_MASS                    = 5.9736e24; // Units: kg.
   const _EARTH_RADIUS                  = 6.371e6  ; // Units: m.
   const _GRAVITATIONAL_CONSTANT        = 6.673e-11; // Units: m^3/(kg.s^2)
   const _MOON_DIST_FROM_EARTH_AVG      = 3.844e8  ; // Units: m.
   const _MOON_INITIAL_TANGENTIAL_SPEED = 3.623e-9 ; // Units: m/s.
   //const _MOON_INITIAL_TANGENTIAL_SPEED = 1.023e3 ; // Units: m/s (Value according to NASA site).
   const _MOON_MASS                     = 7.349e22 ; // Units: kg.
   const _MOON_RADIUS                   = 1.7371e6 ; // Units: m.
   const _PROJECTILE_MASS               = 7.349e22 ; // Units: kg.
   const _PROJECTILE_RADIUS             = 1.7371e6 ; // Units: m.

   const _SCALING_FACTOR  = (900 / (_MOON_DIST_FROM_EARTH_AVG)) * 0.5;
   const _DRAW_BOUNDARY_X = _MOON_DIST_FROM_EARTH_AVG * 1.2;
   const _DRAW_BOUNDARY_Y = _MOON_DIST_FROM_EARTH_AVG * 1.2;

   var _particles =
   {
      earth: new Particle
      (
         new VectorRec2d(0,                                        0),
         new VectorRec2d(0, -_MOON_INITIAL_TANGENTIAL_SPEED * 1 / 80),
         _EARTH_MASS                                                 ,
         _EARTH_RADIUS
      ),
      moon: new Particle
      (
         new VectorRec2d(_MOON_DIST_FROM_EARTH_AVG,                              0),
         new VectorRec2d(                        0, _MOON_INITIAL_TANGENTIAL_SPEED),
         _MOON_MASS                                                                ,
         _MOON_RADIUS
      ),
      projectile: new Particle
      (
         new VectorRec2d(0, _EARTH_RADIUS - _PROJECTILE_RADIUS - _MOON_DIST_FROM_EARTH_AVG),
         new VectorRec2d(0.7 * _MOON_INITIAL_TANGENTIAL_SPEED, 0.5 *_MOON_INITIAL_TANGENTIAL_SPEED),
         _PROJECTILE_MASS                                      ,
         _PROJECTILE_RADIUS
      )
   };

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}
