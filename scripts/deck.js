class Deck{
    constructor(){
        this.cards = [];
        populateDeck();
    }

    addCard(card){
        this.cards.push(card);
    }

    populateDeck(){
        for(let i=0; i<13; i++){
            let card = new Card("figure1", i+1, `symbol ${i}`, "/assets/stuffs.stuffs");
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

    drawCard(){
        let card = a.shift();
        return card;
    }

    numberOfCards(){
        return this.cards.length;
    }
}