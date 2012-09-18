<?php
/*
 * vim: ts=3 sw=3 et wrap co=100 go-=b
 */

require_once '../../lib_tom/php/utils/UtilsError.php';
require_once '../../lib_tom/php/utils/UtilsHtml.php';
require_once 'HomePageContentHtmlGenerator.php';

$data = array
(
   'cssFilenames' => array
   (
      '../../lib_tom/css/general_styles.css',
      'style.css'
   ),
   'jsFilenames' => array
   (
      '../../lib_tom/js/canvas/SketcherGrid.js'               ,
      '../../lib_tom/js/canvas/SketcherSwastiklover.js'       ,
      '../../lib_tom/js/canvas/Tessellator.js'                ,
      '../../lib_tom/js/canvas/TessellatorSwastiklover.js'    ,
      '../../lib_tom/js/contrib/jquery/1.7/jquery_minified.js',
      '../../lib_tom/js/utils/utils.js'                       ,
      '../../lib_tom/js/utils/utilsObject.js'                 ,
      '../../lib_tom/js/utils/utilsValidator.js'              ,
      'RandomTessellationGenerator.js'                        ,
      'main.js'
   ),
   'profileLinkInfoByNameShort' => array
   (
      'stackoverflow' => array
      (
         'class' => 'profile-link-tr'                                              ,
         'style' => 'background-image: url("images/logo_30x30_stackoverflow.jpg");',
         'title' => 'stackoverflow.com profile'                                    ,
         'url'   => 'http://stackoverflow.com/users/336183/tom'
      ),
      'facebook' => array
      (
         'class' => 'profile-link-tl'                                         ,
         'style' => 'background-image: url("images/logo_30x30_facebook.jpg");',
         'title' => 'facebook.com profile'                                    ,
         'url'   => 'http://facebook.com/tomcdonnell'
      ),
      'hidecontent' => array
      (
         'class' => 'profile-link-br'                                             ,
         'style' => 'background-image: url("images/logo_30x30_hide_content.jpg");',
         'title' => 'hide content to view animated background'                    ,
         'url'   => null
      ),
      'linkedin' => array
      (
         'class' => 'profile-link-bl'                                         ,
         'style' => 'background-image: url("images/logo_30x30_linkedin.jpg");',
         'title' => 'linkedin.com profile'                                    ,
         'url'   => 'http://www.linkedin.com/profile/view?id=62173009'
      )
   )
);

UtilsError::initErrorAndExceptionHandler('log.txt');
?>
<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>
  <title>tomcdonnell.net</title>
<?php
   UtilsHtml::echoHtmlScriptAndLinkTagsForJsAndCssFiles($data['cssFilenames'],$data['jsFilenames']);
?>
 </head>
 <body>
  <div>
   <canvas id='mainCanvas' height='900pz' width='1000px'></canvas>
   <div>
    <div id='heading-div' class='overlay'>
     <img class='float-left' src='images/tom_beer_hat.jpg' alt='Tom with beer hat'/>
     <div class='float-left'>
      <h1>tomcdonnell.net</h1>
      <p>The personal website of Tom McDonnell - programmer</p>
     </div>
     <div id='profile-link-container-div' class='float-right'>
<?php
foreach ($data['profileLinkInfoByNameShort'] as $nameShort => $info)
{
   UtilsHtml::echoHtmlForElement
   (
      array
      (
         'indent'              => '      '  ,
         'tagName'             => 'a'       ,
         'value'               => $nameShort,
         'attributeValueByKey' => array
         (
            'target' => '_blank'      ,
            'class'  => $info['class'],
            'href'   => $info['url'  ],
            'style'  => $info['style'],
            'title'  => $info['title']
         )
      )
   );
}
?>
     </div>
     <div class='clear-floats'></div>
    </div>
    <div class='overlay'>
     <div id='github-log-div'>
<?php
UtilsHtml::echoHtmlForElement
(
   array
   (
      'indent'              => '      '                                                     ,
      'tagName'             => 'a'                                                          ,
      'value'               => 'Latest update: Thu Jul 19 - More refactoring and improving.',
      'attributeValueByKey' => array
      (
         'target' => '_blank'                                            ,
         'title'  => 'Click to view the changes in my github repository.',
         'href'   =>
         (
            'https://github.com/tomcdonnell/canvas_demos/commit/' .
            '75bf1a3bcba21ee964c73461a113ae8f7edb3014'
         ),
      )
   )
);
?>
     </div>
    </div>
<?php
HomePageContentHtmlGenerator::echoHtml('     ');
?>
     <div class='clear-floats'></div>
    </div>
    <div class='overlay'>
     Links
    </div>
   </div>
  </div>
 </body>
</html>
