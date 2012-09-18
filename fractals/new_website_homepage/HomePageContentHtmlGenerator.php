<?php
/*
 * vim: ts=3 sw=3 et nowrap co=100 go+=b
 */

require_once '../../lib_tom/php/utils/UtilsHtml.php';

/*
 *
 */
class HomePageContentHtmlGenerator
{
   // Public functions. ////////////////////////////////////////////////////////////////////////

   /*
    *
    */
   public function __construct()
   {
      throw new Exception('This class is not intended to be instantiated.');
   }

   /*
    *
    */
   public static function echoHtml($indent)
   {
      $i           = $indent; // Abbreviation.
      $nCategories = count(self::$_infoByNameBySubcategoryByCategory);
      $n           = 0;

      foreach (self::$_infoByNameBySubcategoryByCategory as $category => $infoByNameBySubcategory)
      {
         if (count($infoByNameBySubcategory) == 0)
         {
            continue;
         }

         $escapedIdAttributeString =
         (
            (++$n == $nCategories)? " id='rightmost-third-width-panel-div'": ''
         );

         $potdInfo = self::_getPickOfTheDayFromInfoBySubcategory($infoByNameBySubcategory);

         echo "$i<div class='overlay third-width-panel-div'$escapedIdAttributeString>\n";
         echo "$i <h2>", htmlentities($category), "</h2>\n";

         if ($potdInfo !== null)
         {
            echo "$i <div class='pick-of-the-day-div'>\n";
            echo "$i  Pick of the day:\n";
            echo "$i  <ul><li><a href='", UtilsHtml::escapeSingleQuotes($potdInfo['url']), "'>";
            echo       htmlentities($potdInfo['name']), "</a></li></ul>\n";
            echo "$i </div>\n";
         }

         foreach ($infoByNameBySubcategory as $subcategory => $infoByName)
         {
            echo "$i <h3>", htmlentities($subcategory), "</h3>\n";
            echo "$i <ul>\n";

            foreach ($infoByName as $name => $info)
            {
               echo "$i  <li>\n";
               echo "$i   <a href='" , UtilsHtml::escapeSingleQuotes($info['url' ]), "'";
               echo        " title='", UtilsHtml::escapeSingleQuotes($info['desc']), "'>";
               echo        htmlentities($name), "</a>\n";
               echo "$i  </li>\n";
            }

            echo "$i </ul>\n";
         }

         echo "$i</div>\n";
      }
   }

   // Private functions. ///////////////////////////////////////////////////////////////////////

   /*
    *
    */
   private static function _getPickOfTheDayFromInfoBySubcategory($infoByNameBySubcategory)
   {
      $eligibleInfoByConcatSubcategoryAndName = array();

      foreach ($infoByNameBySubcategory as $subcategory => $infoByName)
      {
         foreach ($infoByName as $name => $info)
         {
            if ($info['eligibleForPickOfTheDay'])
            {
               $eligibleInfoByConcatSubcategoryAndName["$subcategory: $name"] = $info;
            }
         }
      }

      if (count($eligibleInfoByConcatSubcategoryAndName) == 0)
      {
         return null;
      }

      $eligibleKeys  = array_keys($eligibleInfoByConcatSubcategoryAndName);
      $selectedIndex = rand(0, count($eligibleKeys) - 1);
      $selectedKey   = $eligibleKeys[$selectedIndex];
      $selectedInfo  = $eligibleInfoByConcatSubcategoryAndName[$selectedKey];

      return array
      (
         'name' => $selectedKey,
         'url'  => $selectedInfo['url']
      );
   }

   // Private variables. ///////////////////////////////////////////////////////////////////////

   private static $_infoByNameBySubcategoryByCategory = array
   (
      'Programming' => array
      (
         'Websites' => array
         (
            'IndoorCricketStats.net' => array
            (
               'eligibleForPickOfTheDay' => true                               ,
               'url'                     => 'http://www.indoorcricketstats.net',
               'desc'                    =>
                  'Free web-based indoor cricket statistics software.  Unfinished but functional.  Contains stats for my indoor cricket team for the period [2004, 2008].'
            ),
            'CollaborativeComic.com' => array
            (
               'eligibleForPickOfTheDay' => true                               ,
               'url'                     => 'http://www.collaborativecomic.com',
               'desc'                    =>
                  'Website allowing comics to be drawn collaboratively.  Unfinished but functional.'
            )
         ),
         'Games' => array
         (
            'Tetris Tribute' => array
            (
               'eligibleForPickOfTheDay' => true                  ,
               'url'                     => 'games/tetris_tribute',
               'desc'                    =>
                  'My version of the popular Tetris game, coded in Javascript.  I have added some scoring and mode innovations to cater for elite level players.'
            ),
            'Vector Racer' => array
            (
               'eligibleForPickOfTheDay' => true                ,
               'url'                     => 'games/vector_racer',
               'desc'                    =>
                  'Simple 2D vector-based racing game coded in Javascript.  The racer accelerates towards the mouse pointer at all times.'
            ),
            'Anagram Game' => array
            (
               'eligibleForPickOfTheDay' => true                ,
               'url'                     => 'games/anagram_game',
               'desc'                    =>
                  'Simple guessing game.  Guess the name of a person or thing from anagram clues.'
            ),
            'Risk Battle Simulator' => array
            (
               'eligibleForPickOfTheDay' => true                         ,
               'url'                     => 'games/risk_battle_simulator',
               'desc'                    =>
                  'Tool to automate dice-throwing battles in the popular board game Risk.'
            ),
         ),
         'Simulations' => array
         (
            'Earth-Moon Gravitational System' => array
            (
               'eligibleForPickOfTheDay' => true                            ,
               'url'                     => 'simulations/earth_moon_gravity',
               'desc'                    =>
                  'Simulation of the earth-moon gravitational system with the option of adding extra moons to break the monotony.'
            ),
         ),
         'Tools' => array
         (
            'Anagram Finder' => array
            (
               'eligibleForPickOfTheDay' => true                  ,
               'url'                     => 'tools/anagram_finder',
               'desc'                    =>
                  'Tool for finding anagrams of a given phrase.'
            ),
            'Anagram Checker' => array
            (
               'eligibleForPickOfTheDay' => true                   ,
               'url'                     => 'tools/anagram_checker',
               'desc'                    =>
                  'Tool for checking whether all lines of a given text are anagrams of a given string.'
            ),
            'Bracketed Text Formatter' => array
            (
               'eligibleForPickOfTheDay' => true                            ,
               'url'                     => 'tools/bracketed_text_formatter',
               'desc'                    =>
                  'General purpose text formatter designed for any structured text featuring balanced brackets eg. JSON.'
            ),
            'Colour Selector 1' => array
            (
               'eligibleForPickOfTheDay' => true                   ,
               'url'                     => 'tools/colour_selector',
               'desc'                    =>
                  'Colour selector providing complementary colours also.'
            ),
            'Colour Selector 2' => array
            (
               'eligibleForPickOfTheDay' => true                   ,
               'url'                     => 'tools/colour_selector',
               'desc'                    =>
                  'Colour selector providing complementary colours also (version 2).'
            )
         ),
         'Art' => array
         (
            'Colour Spectrum Art' => array
            (
               'eligibleForPickOfTheDay' => true                            ,
               'url'                     => 'small_apps/colour_spectrum_art',
               'desc'                    =>
                  'Experiments in blending colours.'
            ),
            'Tessellations' => array
            (
               'eligibleForPickOfTheDay' => true                            ,
               'url'                     => 'small_apps/colour_spectrum_art',
               'desc'                    =>
                  'Experiments with tessellations as seen in the background of this page.'
            ),
            'Gravitational Mousetrails' => array
            (
               'eligibleForPickOfTheDay' => true                     ,
               'url'                     => 'small_apps/canvas_demos',
               'desc'                    =>
                  'Experiments with colour and mousetrails.'
            )
         )
      ),
      'Writing' => array
      (
         'Stories' => array
         (
         ),
         'Poems' => array
         (
         ),
         'Essays' => array
         (
         ),
         'Notes' => array
         (
         )
      ),
      'Art' => array
      (
         'Paintings' => array
         (
         ),
         'Ambigrams' => array
         (
         ),
         'Printable Pieces (pdfs)' => array
         (
         ),
         'Sketches' => array
         (
         )
      )
   );
}
?>
