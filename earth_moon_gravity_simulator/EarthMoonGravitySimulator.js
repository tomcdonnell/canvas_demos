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
      _intervalId = window.setInterval(_onIntervalTimeout, 10);
   }

   /*
    *
    */
   function _onIntervalTimeout()
   {
      try
      {
         var ePos     = _earth.pos;
         var mPos     = _moon.pos;
         var distance = Math.sqrt
         (
            Math.pow(ePos.getX() - mPos.getX(), 2) +
            Math.pow(ePos.getY() - mPos.getY(), 2)
         );

         var eMass          = _earth.getMass();
         var mMass          = _moon.getMass();
         var combinedMass   = eMass + mMass;
         var moonToEarthRec = ePos.subtract(mPos); // Moon must move by this much to be at Earth.
         var forceMEPol     =                      // Force on Moon due to Earth-Moon gravity.
         (
            (distance < _EARTH_RADIUS + _MOON_RADIUS)?
            new VectorPol2d(0, 0):
            new VectorPol2d
            (
               (_GRAVITATIONAL_CONSTANT * combinedMass) / (distance * distance),
               (moonToEarthRec.divide(moonToEarthRec.getMagnitude())).getAngle()
            )
         );

         var forceMERec = forceMEPol.convToRec();
         var mAccRec    = forceMERec.divide( mMass);
         var eAccRec    = forceMERec.divide(-eMass);

         _oldEarthX = _earth.pos.getX();
         _oldEarthY = _earth.pos.getY();
         _oldMoonX  = _moon.pos.getX();
         _oldMoonY  = _moon.pos.getY();

         _earth.vel = _earth.vel.add(   eAccRec.multiply(_DELTA_T));
         _earth.pos = _earth.pos.add(_earth.vel.multiply(_DELTA_T));
         _moon.vel  = _moon.vel.add(  mAccRec.multiply(_DELTA_T));
         _moon.pos  = _moon.pos.add(_moon.vel.multiply(_DELTA_T));

         _drawSystem();

         _t += 1;

         if (_t > 10000)
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
   function _drawSystem()
   {
      var earthPos = _earth.pos;
      var earthR   = _earth.getRadius();
      var earthX   = earthPos.getX();
      var earthY   = earthPos.getY();
      var moonPos  = _moon.pos;
      var moonR    = _moon.getRadius();
      var moonX    = moonPos.getX();
      var moonY    = moonPos.getY();

      var eraseER = earthR  * 1.5; // Erase earth radius.
      var eraseED = eraseER * 2.0; // Erase earth diameter.
      var eraseMR = moonR   * 1.5; // Erase moon  radius.
      var eraseMD = eraseMR * 2.0; // Erase moon  diameter.

      _ctx.save();

      _ctx.translate(450, 450);
      _ctx.scale(_SCALING_FACTOR, _SCALING_FACTOR);

      _ctx.save();

      // Erase old.
      _ctx.fillStyle = '#fff';
      _ctx.fillRect(_oldEarthX - eraseER, _oldEarthY - eraseER, eraseED, eraseED, 2 * Math.PI);
      _ctx.fillRect(_oldMoonX  - eraseMR, _oldMoonY  - eraseMR, eraseMD, eraseMD, 2 * Math.PI);

      _ctx.restore();

      // Draw new.
      _ctx.strokeStyle = '#000';
      _ctx.beginPath();
      _ctx.moveTo(earthX + earthR, earthY);
      _ctx.arc(earthX, earthY, earthR, 0, 2 * Math.PI);
      _ctx.moveTo(moonX  + moonR , moonY );
      _ctx.arc(moonX , moonY , moonR , 0, 2 * Math.PI);
      _ctx.closePath();

      _ctx.restore();

      _ctx.stroke();
   }

   // Private variables. ////////////////////////////////////////////////////////////////////////

   var _canvas     = CANVAS({width: 1000, height: 1080, style: 'border 1px solid red;'});
   var _ctx        = _canvas.getContext('2d');
   var _intervalId = null;
   var _t          = 0;

   const _EARTH_MASS                    = 5.9736e24; // Units: kg.
   const _EARTH_RADIUS                  = 6.371e6  ; // Units: m.
   const _MOON_DIST_FROM_EARTH_AVG      = 3.844e8  ; // Units: m.
   const _MOON_MASS                     = 7.349e22 ; // Units: kg.
   const _MOON_INITIAL_TANGENTIAL_SPEED = 3.623e-9 ; // Units: m/s.
   //const _MOON_INITIAL_TANGENTIAL_SPEED = 1.023e3 ; // Units: m/s.
   const _MOON_RADIUS                   = 1.7371e6 ; // Units: m.
   const _DELTA_T                       = 6e14     ; // Units: s.
   const _GRAVITATIONAL_CONSTANT        = 6.673e-11; // Units: m^3/(kg.s^2)
   const _SCALING_FACTOR                = (900 / (_MOON_DIST_FROM_EARTH_AVG)) * 0.5;

   var _earth = new Particle
   (
      new VectorRec2d(0,                                        0),
      new VectorRec2d(0, -_MOON_INITIAL_TANGENTIAL_SPEED * 1 / 80),
      _EARTH_MASS                                                 ,
      _EARTH_RADIUS
   );

   var _moon = new Particle
   (
      new VectorRec2d(_MOON_DIST_FROM_EARTH_AVG,                              0),
      new VectorRec2d(                        0, _MOON_INITIAL_TANGENTIAL_SPEED),
      _MOON_MASS                                                                ,
      _MOON_RADIUS
   );

   var _oldEarthX = _earth.pos.getX();
   var _oldEarthY = _earth.pos.getY();
   var _oldMoonX  = _moon.pos.getX();
   var _oldMoonY  = _moon.pos.getY();

   // Initialisation code. //////////////////////////////////////////////////////////////////////

   _init();
}
