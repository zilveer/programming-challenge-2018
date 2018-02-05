const scope = {};

((scope, $) => {
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null,
        players: []
    };
    let deck;
    /*
    for (let i = 0; i < 5; i++) {
        let cardDrawn = deck.drawCard();
        cardDrawn.addToTable();
        GAME.cardsOnTable.push(cardDrawn);
    }
    */
    // Raise amount input and slider
    const raiseInput = document.getElementById('raiseInput');
    const raiseSlider = document.getElementById('raiseSlider');
    raiseSlider.oninput = () => {
        raiseInput.value = raiseSlider.value;
    }

    raiseInput.onchange = () => {
        /* magic that should not be used in real thingy, but i like it c:
        sets max value to 100 and min to 1 */
        raiseInput.value = Math.min(Math.max(raiseInput.value, 1), 100);
        raiseSlider.value = raiseInput.value;
    }

    $('#raiseButton').click(() => {
        $('#pot').html(parseInt($('#pot').html()) + parseInt(raiseInput.value));
    });

    // source: https://stackoverflow.com/questions/9894339/disallow-twitter-bootstrap-modal-window-from-closing
    // Load modal
    $('#startGameModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // Button that starts the game
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);

    function startGame() {
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake = document.getElementById('initalStake').value;

        for (var i = 0; i < GAME.numberOfPlayers; i++) {
            GAME.players.push(setupPlayer("Bob", initialStake));
        }

        console.log(GAME.players);
    }

    /**
     * Assigns 2 cards to a player and returns the Player object
     * @param playerName
     * @param stake
     * @returns {Player}
     */
    function setupPlayer(playerName, stake) {
        let playerNameHolder = $("#playerName");

        playerNameHolder.text(playerName);

        /* Create a new player */
        let player = new Player(playerName, stake);

        /* Give the player two cards */
        for (let i = 0; i < 2; i++) {
            /* Draw a card from the deck and hand it to the player */
            player.addCard(deck.drawCard());
        }

        /* Show the card image for the 2 cards */
        for (let i = 0; i < 2; i++) {
            $("#playerCard" + (i + 1)).attr("src", player.cards[i].imagePath);
        }

        return player;
    }

})(scope, jQuery);
