class Deck
{

    /**
     * Creates an array and populates the deck when creating new instance of an object.
     */
    constructor()
    {
        this.cards = [];
        this.populateDeck();
        this.shuffleDeck();
        // console.log("Deck after shuffle ", this.cards.slice());
    }

    /**
     * Add certain cards, probably will not be used anymore
     */
    addCard(card)
    {
        this.cards.push(card);
    }

    /**
     * Populates the deck with all of the cards
     */
    populateDeck()
    {
        this.cards = [];
        //jack 11
        //queen 12
        //king 13
        //ace 14

        for (let i = 2; i < 15; i++)
        {
            let card = new Card("Spades", i, `./assets/Playing Cards/Playing Cards (.SVG)/${i}_of_spades.svg`);
            this.cards.push(card);
        }

        for (let i = 2; i < 15; i++)
        {
            let card = new Card("Clubs", i, `./assets/Playing Cards/Playing Cards (.SVG)/${i}_of_clubs.svg`);
            this.cards.push(card);
        }

        for (let i = 2; i < 15; i++)
        {
            let card = new Card("Hearts", i, `./assets/Playing Cards/Playing Cards (.SVG)/${i}_of_hearts.svg`);
            this.cards.push(card);
        }

        for (let i = 2; i < 15; i++)
        {
            let card = new Card("Diamonds", i, `./assets/Playing Cards/Playing Cards (.SVG)/${i}_of_diamonds.svg`);
            this.cards.push(card);
        }
        this.shuffleDeck();
    }

    shuffleDeck()
    {
        /* Shuffle the card deck 5 times */
        for (let j = 0; j < 5; j++)
        {
            for (let i = 0; i < this.cards.length; i++)
            {
                /* Get random position between i and the number of cards in the array */
                let randomPos         = Math.floor((Math.random() * (this.cards.length - i)) + i);
                let tempCard          = this.cards[randomPos];
                this.cards[randomPos] = this.cards[i];
                this.cards[i]         = tempCard;
            }
        }
    }

    /**
     * Draws card from the top of the deck and deletes if from the card array
     * The returned card will be removed from the deck of cards
     * @returns {*}
     */
    drawCard()
    {
        let card = this.cards.shift();
        return card;
    }

    //idk why, more methods cuz why not, just returns length of array
    numberOfCards()
    {
        return this.cards.length;
    }
}