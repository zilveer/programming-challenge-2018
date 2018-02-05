class Player
{
    constructor(name, funds = 5000)
    {
        /* Players name */
        this.name = name;

        /* The amount of money the player has */
        this.funds = funds;

        /* Holds the array of cards a player */
        this.cards = [];

        /* Used to determine if a player has folded */
        this.fold = false;

    }

    /* Used to assign this player with a set of cards */
    addCard(card)
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
