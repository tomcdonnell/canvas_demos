$(document).ready
(
   function (ev)
   {
      var vudoo1 = new Vudoo(0  , 0, 20, 50, 5);
      var vudoo2 = new Vudoo(900, 0, 20, 50, 5);

      $('body').append(vudoo1.getCanvas());
      $('body').append(vudoo2.getCanvas());
   }
);
