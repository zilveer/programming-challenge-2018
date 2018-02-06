const scope = {};

((scope, $) =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null,
        players: [],
        currentPlayer: null,
        bigBlind: 200,
        smallBlind: null,
        winningPlayer: null,
        foldedPlayers: []
    };
    GAME.smallBlind = GAME.bigBlind / 2;
    const pot = $("#pot");

    scope.thing = GAME;

    let currentPlayerIndex = 0;
    let deck;

    // Raise amount input and slider
    const raiseInput  = $("#raiseInput");
    const raiseSlider = $("#raiseSlider");

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

    scope.players = GAME;

    raiseSlider.change(() =>
    {
        raiseInput.val(raiseSlider.val());
    });

    raiseInput.change = () =>
    {
        /* magic that should not be used in real thingy, but i like it c:
         sets max value to 100 and min to 1 */
        raiseInput.val(Math.min(Math.max(raiseInput.val(), 1), 100));
        raiseSlider.val(raiseInput.val());
        console.log(raiseInput.val());
    };

    foldButton.click(() =>
    {
        /* Add the folded player to the array of currently folded players */
        GAME.foldedPlayers.push(GAME.players[currentPlayerIndex]);

        /* Remove the current player from the players array */
        GAME.players.splice(currentPlayerIndex, 1);

        console.log(GAME.players);

        /* Advance the current player index by 1 if the advanced/next index value is not greater than
         * the length of the players array. If it is then it sets the current player index to 0.
         */
        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? ++currentPlayerIndex : 0;

        /* Move to the next player */
        setNextPlayer(nextPlayerIndex);
        console.log(GAME.players);

    });

    /* Check matches the last bet */
    checkButton.click(() =>
    {
        let currentHighestBet = 0;


        /* loop though players to get the highest be amount */
        for (let i=0; i<GAME.players.length; i++)
        {
            if(GAME.players[i].betAmount >= currentHighestBet)
            {
                currentHighestBet = GAME.players[i].betAmount;
            }
        }


        if(GAME.players[currentPlayerIndex].betAmount < currentHighestBet)
        {
            // Then call
            /* Make the player match the current highest bet */
            GAME.players[currentPlayerIndex].betAmount = parseInt(currentHighestBet);
            /* Move to the next player */
            setNextPlayer();
        }

        if(GAME.players[currentPlayerIndex].betAmount === currentHighestBet)
        {
            // Then check
            GAME.players[currentPlayerIndex].check = true;
            /* Move to the next player */
            setNextPlayer();
        }


        /* Make the player match the bet/money in the pot */
        // GAME.players[currentPlayerIndex].betAmount = parseInt(GAME.pot);

        /* Advance the current player index by 1 if the advanced/next index value is not greater than
         * the length of the players array. If it is then it sets the current player index to 0.
         */
        const nextPlayerIndex = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;

        // /* Move to the next player */
        // setNextPlayer();
        console.log(GAME.players);
        console.log(GAME.foldedPlayers);
    });

    /* Raise the bet amount by the value in the raiseInput text field */
    raiseButton.click(() =>
    {
        /* Raise the pot amount by the amount specified in the raiseInput input field */
        GAME.pot += parseInt(GAME.pot + parseInt(raiseInput.val()) );
        pot.text(GAME.pot);

        GAME.players[currentPlayerIndex].betAmount = parseInt(GAME.pot);
        setNextPlayer();
    });

    function startGame()
    {
        deck                 = new Deck();
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake   = document.getElementById('initalStake').value;

        /* Put each player inside an array */
        for (let i = 0; i < GAME.numberOfPlayers; i++)
        {
            GAME.players.push(setupPlayer("Player " + (i + 1), initialStake));
        }

        allocateBlindRoles();

        GAME.pot = GAME.bigBlind + GAME.smallBlind;
        pot.text(GAME.pot);

        /* Make the third player the current player */
        setCurrentPlayer(2);



        /* Show the card image for the 2 cards the first player has*/
        $("#playerCard1").attr("src", GAME.players[currentPlayerIndex].cards[0].imagePath);
        $("#playerCard2").attr("src", GAME.players[currentPlayerIndex].cards[1].imagePath);

        console.log(GAME.players);
    }

    function allocateBlindRoles()
    {
        GAME.players[0].role = "SMALL BLIND";
        GAME.players[0].betAmount = parseInt(GAME.smallBlind);

        GAME.players[1].role = "BIG BLIND";
        GAME.players[1].betAmount = parseInt(GAME.bigBlind);
    }


    function setCurrentPlayer(playerIndex)
    {
        let playerNameHolder  = $("#playerName");
        let playerStakeHolder = $("#playerStake");
        currentPlayerIndex    = (playerIndex < GAME.players.length) ? playerIndex : 0;

        /* Show the current players name on screen */
        playerNameHolder.text(GAME.players[currentPlayerIndex].name);

        /* Show the current players stake on the screen */
        playerStakeHolder.text(GAME.players[currentPlayerIndex].stake);
    }

    function setNextPlayer()
    {
        let playerNameHolder = $("#playerName");
        const playerIndex    = (currentPlayerIndex + 1 < GAME.players.length) ? currentPlayerIndex + 1 : 0;

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

        /* Creates div with player detail in the main tag */
        createPlayerDiv(player);

        /* Give the player two cards */
        player.addCard(deck.drawCard());
        player.addCard(deck.drawCard());
        console.log(player.cards);
        return player;
    }

    function createPlayerDiv(player)
    {
        const name = player.name.replace(" ", "_");
        const stake = player.stake;
        const playerDiv = document.createElement('div');
        playerDiv.className = "col-sm-4";
        playerDiv.innerHTML = name + " " + stake;

        $('#playerList').append(`
          <div id='${name}' class='col-sm-4 border border-dark'>
            <div>Name: ${player.name}<div/>
            <div>Stake: ${player.stake}<div/>
          </div>
          `);
    }
})(scope, jQuery);
