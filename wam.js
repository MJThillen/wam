/* --------------------------------- *
 * Javascript for MJ's Whack-a-Mole  *
 * Copyright 2014, Mary Jane Thillen *
 *   Contact: MJThillen@gmail.com    *
 *  Last Modified: 20 January 2014   *
 * --------------------------------- *
 *     Uses jQuery and jQuery UI     *
 * --------------------------------- */

$(document).ready(function () {
    "use strict";
    /* Scoreboard keeps track of the score */
    var ScoreBoard = function () {
        var score = 0;

        this.addScore = function () {
            score++;
        };

        this.updateScore = function () {
            $('#score').html(score);
        };

        this.resetScore = function () {
            score = 0;
            this.updateScore();
        };
    };
    var score = new ScoreBoard();

    /* MoleGroup represents the group of five 
     * moles that appear and disappear during 
     * each round of gameplay. */
    var MoleGroup = function (inMoles) {
        var moles = inMoles;

        var createMoleName = function (mole) {
            return '#mole' + mole;
        }

        /* Hides all moles. */
        var hideMoles = function () {
            var moleName;
            moles.forEach(function (mole) {
                moleName = createMoleName(mole);
                $(moleName).hide("puff");
                $(moleName).unbind("mousedown");
            });
        };

        /* Hides/Explodes a single mole when clicked. */
        var hideMole = function (mole) {
            var moleName = createMoleName(mole);
            /* When the mole explodes, it's gross. */
            $(moleName).hide("explode", {pieces: 144}, 250);
            $(moleName).unbind("mousedown");
        };

        /* Handles scoring and hiding a mole when clicked. */
        var handleClick = function (mole) {
            score.addScore();
            score.updateScore();
            hideMole(mole);
        };

        /* Shows the set of moles for this round, adds the click
         * event, and sets the hide timing for the set. */
        this.showMoles = function () {
            var moleName;

            moles.forEach(function (mole) {
                moleName = createMoleName(mole);
                $(moleName).one("mousedown", function () { handleClick(mole); });
                $(moleName).show("puff");
            });

            setTimeout(function () { hideMoles(); }, 2500);
        };
    };

    /* Generates the set of five unique numbers which
     * represent the position of one round of moles,
     * then creates and starts the MoleGroup for the round. */
    function generateMoles() {
        var i;
        var moles = [];
        var random;
        var found = false;
        while (moles.length < 5) {
            random = Math.ceil(Math.random() * 15);
            found = false;
            for (i = 0; i < moles.length; i++) {
                if (moles[i] === random) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                moles[moles.length] = random;
            }
        }

        var newMoles = new MoleGroup(moles);
        newMoles.showMoles();
    }

    /* Main Game Function.  
     * Hides the button bar to prevent interruption,
     * and triggers ten rounds of moles to appear, every 
     * three seconds, and then shows the congratulations 
     * window and the button bar when the game is over. */
    function runGame() {
        $("#buttonBar").hide();
        var i = 0;
        score.resetScore();
        var interval = setInterval(function () {
            generateMoles();
            i++;
            if (i >= 10) {
                clearInterval(interval);
                setTimeout(function () {
                    $("#buttonBar").show();
                    $("#congratulations").slideDown();
                }, 3000);
            }
        }, 3000);

    }
    
    /* Click handler for the start button. Closes the
     * rules and congratulations window to prevent
     * game board overlap, then starts the game. */
    $('#startButton').click(function () {
        $('#rulesWindow').hide("fold");
        $('#congratulations').slideUp();
        runGame();
    });

    /* Click handler for the rules button.
     * Toggles the rules window. */
    $("#rulesButton").click(function () {
        $('#rulesWindow').toggle("fold");
    });

    /* Click handler for the congratulations button.
     * Closes the game over window. */
    $("#winButton").click(function () {
        $('#congratulations').slideUp();
    });
});
