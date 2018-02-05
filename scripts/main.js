let scope = {};

(scope =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    window.onload = function ()
    {
        /* Set up the cards */
        let card_1 = new Card("Figure 1", "Value 1", "Symbol 1", "Image Path 1");
        let card_2 = new Card("Figure 2", "Value 2", "Symbol 2", "Image Path 2");
        let card_3 = new Card("Figure 3", "Value 3", "Symbol 3", "Image Path 3");

        /* Set up the deck */
        let deck_1 = new Deck();

        /* Add the cards to the deck */
        deck_1.addCard(card_1);
        deck_1.addCard(card_2);
        deck_1.addCard(card_3);

        deck_1.shuffleDeck();

        for (let i = 0; i < deck_1.cards.length; i++)
        {
            console.log(deck_1.cards[i].value);
        }
    }

})(scope);

