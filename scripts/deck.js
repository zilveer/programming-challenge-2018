class Deck{

    //creates an array and populates the deck when creating new instance of an object
    constructor(){
        this.cards = [];
        this.populateDeck();
    }

    //add certain cards, probably will not be used anymore
    addCard(card){
        this.cards.push(card);
    }

    //populates the deck with all of the cards
    populateDeck(){
        for(let i=0; i<13; i++){
            let card = new Card("figure1", i+1, `symbol ${i}`, "./assets/Playing Cards/Playing Cards (.SVG)/2_of_clubs.svg");
            this.cards.push(card);
        }
        
        for(let i=0; i<13; i++){
            let card = new Card("figure2", i+1, `symbol ${i}`, "/assets/stuffs.stuffs");
            this.cards.push(card);
        }
        for(let i=0; i<13; i++){
            let card = new Card("figure3", i+1, `symbol ${i}`, "/assets/stuffs.stuffs");
            this.cards.push(card);
        }
        for(let i=0; i<13; i++){
            let card = new Card("figure4", i+1, `symbol ${i}`, "/assets/stuffs.stuffs");
            this.cards.push(card);
        }
        
    }


    shuffleDeck(){

        /* Shuffle the card deck 5 times */
        for(let j=0; j<5; j++){
            for(let i=0; i<this.cards.length; i++){
                let randomPos = Math.floor((Math.random()*(this.cards.length-i))+i);
                let tempCard = this.cards[randomPos];
                this.cards[randomPos] = this.cards[i];
                this.cards[i] = tempCard;
            }
        }

    }

    //draws card from the top of the deck and deletes if from it
    drawCard(){
        let card = this.cards.shift();
        return card;
    }
    //idk why, more methods cuz why not, just returns length of array
    numberOfCards(){
        return this.cards.length;
    }
}