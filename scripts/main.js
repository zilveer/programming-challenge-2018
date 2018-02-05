let scope = {};

(scope =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME = {
      pot: 0,
      tableCards: [],
      numberOfPlayers: null
    };
    let deck_1;
    // /* Set up the deck */
        deck_1 = new Deck();



    deck_1.shuffleDeck();

    // console.log("\n\n\n\n");
    let cardDrown = deck_1.drawCard();


    //adding cards to the table
    cardDrown.addToTable();
    GAME.tableCards.push(cardDrown);




})(scope);
