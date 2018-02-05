class Player
{
    constructor(name, funds)
    {
        /* Players name */
        this.name  = name;

        /* The amount of money the player has */
        this.funds = funds;

        /* Holds the array of cards a player */
        this.cards = [];
    }

    /* Used to assign this player with a set of cards */
    cardsOnHand(card)
    {
        this.cards.push(card);
    }

    /* Let this player place a bet of a certain amount */
    placeBet(betAmount)
    {
        /* Player cannot bet with more money than he has */
        if (betAmount <= funds)
        {
            this.funds -= betAmount;
        }
    }

}
