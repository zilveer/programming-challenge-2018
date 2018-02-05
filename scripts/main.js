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

    window.onload = function ()
    {
        // /* Set up the deck */
         let deck_1 = new Deck();



        deck_1.shuffleDeck();

        // console.log("\n\n\n\n");
        let drewCard = deck_1.drawCard();


    }

})(scope);
