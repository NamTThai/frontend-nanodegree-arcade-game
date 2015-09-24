Frogger Arcade Game
===============================

A lot of the code in this project is from Udacity and is subjected to Udacity's copyrights and policies: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

# How to play #

Open the file `index.html` in a web browser to start the game (ﾉ´ヮ´)ﾉ*:･ﾟ✧

The **playable character** is located at the bottom of the screen when the game start. The player can control this character by arrow keys

The **board** is divided into 3 regions:
* The `grass` is a safe region
* The `stone` is where enemies roam and gems are generated
* The `water` is the finish zone

The **enemies** are the bugs that spawn on `stone`. They speed up after every time they reappear

The **gems** are shiny objects that periodically appear on `stone`. They are regenerated every 5 seconds.

You can press **Enter** (on a Windows keyboard) or **Return** (on a Mac keyboard) at any time to restart the game.

# Mechanics #

The objective of the game is to advance to the `water` zone. Along the way, the player can boost his/her score by collecting `gems` along the way.

The player is given 30 seconds to cross safely. After 30 seconds, if the player is not in the `water` zone, he/she will lose all accumulated scores.

The player should avoid colliding with enemies, or risk losing 1 score after every collision and being sent back to starting position.
