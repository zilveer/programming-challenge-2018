let scope = {};

(scope =>
{
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    window.onload = function ()
    {
        let deck_1 = new Deck();

        deck_1.shuffleDeck();

        for (let i = 0; i < deck_1.cards.length; i++)
        {
            console.log(deck_1.cards[i].value);
        }
    }

})(scope);

