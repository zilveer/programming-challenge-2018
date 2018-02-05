class Deck{
    constructor(){
        this.cards = [];
    }

    addCard(card){
        this.cards.push(card);
    }


    shuffleDeck(){

        for(let j=0; j<5; j++){
            for(let i=0; i<this.cards.length; i++){
                let randomPos = Math.floor((Math.random()*(this.cards.length-i))+i);
                let tempCard = this.cards[randomPos];
                this.cards[randomPos] = this.cards[i];
                this.cards[i] = this.cards[randomPos];
            }
        }

    }
}