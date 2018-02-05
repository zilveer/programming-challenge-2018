let scope = {};

((scope, $) =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null
    };
    let deck;

    /* Create the deck of cards */
    deck = new Deck();
    deck.shuffleDeck();

    /* Place 5 cards on the table */
    for (let i = 0; i < 5; i++)
    {
        let cardDrawn = deck.drawCard();
        cardDrawn.addToTable();
        GAME.cardsOnTable.push(cardDrawn);
    }

    setupPlayer("John Doe");

    // Raise amount input and slider
    const raiseInput    = document.getElementById('raiseInput');
    const raiseSlider   = document.getElementById('raiseSlider');
    raiseSlider.oninput = () =>
    {
        raiseInput.value = raiseSlider.value;
    };

    /**
     *
     * @param playerName
     */
    function setupPlayer(playerName)
    {
        let playerNameHolder = $("#playerName");

        playerNameHolder.text(playerName);

        /* Create a new player */
        let player_1 = new Player(playerName);

        /* Give the player two cards */
        for (let i = 0; i < 2; i++)
        {
            /* Draw a card from the deck and hand it to the player */
            player_1.addCard(deck.drawCard());
        }

        /* Show the card image for the 2 cards */
        for (let i = 0; i < 2; i++)
        {
            $("#playerCard" + (i+1)).attr("src", player_1.cards[i].imagePath);
        }

        // playerCard_1.attr("src", player_1.cards[0].imagePath);
        // playerCard_2.attr("src", player_1.cards[1].imagePath);
    }

})(scope, jQuery);
