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

    deck     = new Deck();
    deck.shuffleDeck();

    for(let i=0; i<6; i++)
    {
        let cardDrawn = deck.drawCard();
        cardDrawn.addToTable();
        GAME.cardsOnTable.push(cardDrawn);
    }

    // const playerCard_1 = $(#)

    // Raise amount input and slider
    const raiseInput    = document.getElementById('raiseInput');
    const raiseSlider   = document.getElementById('raiseSlider');
    raiseSlider.oninput = () =>
    {
        raiseInput.value = raiseSlider.value;
    }

})(scope, jQuery);
