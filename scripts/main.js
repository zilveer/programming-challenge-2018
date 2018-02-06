const scope = {};

((scope, $) =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME             = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null,
        players: [],
        currentPlayer: null,
        bigBlind: 200,
        smallBlind: bigBlind/2
    };

    let currentPlayerIndex = 0;
    let deck;

    // Raise amount input and slider
    const raiseInput    = $("#raiseInput");
    const raiseSlider   = $("#raiseSlider");

    const foldButton  = $("#foldButton");
    const raiseButton = $("#raiseButton");
    const checkButton = $("#checkCallButton");
    const startButton = $('#startButton');

    startButton.click(startGame);

    // source: https://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    // Load modal
    $('#startGameModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    raiseSlider.oninput = () =>
    {
        raiseInput.value = raiseSlider.value;
    }

    raiseInput.onchange = () =>
    {
        /* magic that should not be used in real thingy, but i like it c:
         sets max value to 100 and min to 1 */
        raiseInput.value  = Math.min(Math.max(raiseInput.value, 1), 100);
        raiseSlider.value = raiseInput.value;
    }

    foldButton.click(() =>
    {
        let playerNameHolder = $("#playerName");

        /* If current player has already folded */
        if (GAME.players[currentPlayerIndex].fold)
        {
            // alert(GAME.players[currentPlayerIndex].name + " has already folded");
            playerNameHolder.text(GAME.players[currentPlayerIndex].name + "(FOLDED)");
        }
        else
        {
            /* Set the fold status of the current player */
            GAME.players[currentPlayerIndex].fold = true;

            /* Advance the current player index by 1 if the advanced/next index value is not greater than
             * the length of the players array. If it is then it sets the current player index to 0.
             */
            const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? ++currentPlayerIndex : 0;

            /* Move to the next player */
            setNextPlayer(nextPlayerIndex);
            console.log(GAME.players);
        }

        //TODO Remove the cards of the folded player from the deck.

    });

    checkButton.click(() =>
    {
        /* Advance the current player index by 1 if the advanced/next index value is not greater than
         * the length of the players array. If it is then it sets the current player index to 0.
         */
        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;

        /* Move to the next player */
        setNextPlayer(nextPlayerIndex);
        console.log(GAME.players);
    });

    raiseButton.click(() =>
    {
        $('#pot').html(parseInt($('#pot').html()) + parseInt(raiseInput.value));

        setNextPlayer();
        // console.log("Next player: " + nextPlayerIndex);
    });

    function startGame()
    {
        deck                 = new Deck();
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake   = document.getElementById('initalStake').value;

        /* Put each player inside an array */
        for (var i = 0; i < GAME.numberOfPlayers; i++)
        {
            GAME.players.push(setupPlayer("Bob " + (i + 1), initialStake));
        }

        /* Make the first player the current player */
        setCurrentPlayer(0);

        console.log(GAME.players);
    }

    function setCurrentPlayer(playerIndex)
    {
        let playerNameHolder = $("#playerName");
        let playerStakeHolder = $("#playerStake");
        currentPlayerIndex   = (playerIndex < GAME.players.length) ? playerIndex : 0;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);

        /* Show the current players stake on the screen */
        playerStakeHolder.text(GAME.players[currentPlayerIndex].stake);
    }

    function setNextPlayer()
    {
        let playerNameHolder = $("#playerName");
        const playerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;

        /* If the current player has already folded then advance to the next player */
        if (GAME.players[playerIndex].fold)
        {
            /* Show the current players name on screen */
            playerNameHolder.text(GAME.players[playerIndex].name + "(FOLDED)");

            /* Advance the current player index if the index will not go over the array.
             * If the index value will be over the array length then set the index to 0.
             */
            currentPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? ++currentPlayerIndex : 0;

            /* Show the two cards the current player has */
            for (let i = 0; i < 2; i++)
            {
                $("#playerCard" + (i + 1)).attr("src", GAME.players[playerIndex].cards[i].imagePath);
            }
        }
        else
        {
            currentPlayerIndex = playerIndex;

            /* Set the current player index to the current value of the currentPlayerIndex */
            // GAME.currentPlayer = currentPlayerIndex;

            /* Show the current players name on screen */
            playerNameHolder.text(GAME.players[currentPlayerIndex].name);

            /* Show the two cards the current player has */
            for (let i = 0; i < 2; i++)
            {
                $("#playerCard" + (i + 1)).attr("src", GAME.players[playerIndex].cards[i].imagePath);
            }
        }

        console.log("Current player index: " + currentPlayerIndex);
        console.log("Current player name: " + GAME.players[currentPlayerIndex].name);
        console.log("Current player fold status: " + GAME.players[currentPlayerIndex].fold);
    }

    /**
     * Assigns 2 cards to a player and returns the Player object
     * @param playerName
     * @param stake
     * @returns {Player}
     */
    function setupPlayer(playerName, stake)
    {
        /* Create a new player */
        let player = new Player(playerName, stake);

        /* Give the player two cards */
        for (let i = 0; i < 2; i++)
        {
            /* Draw a card from the deck and hand it to the player */
            player.addCard(deck.drawCard());
        }

        /* Show the card image for the 2 cards */
        for (let i = 0; i < 2; i++)
        {
            $("#playerCard" + (i + 1)).attr("src", player.cards[i].imagePath);
        }

        return player;

    }
})(scope, jQuery);
