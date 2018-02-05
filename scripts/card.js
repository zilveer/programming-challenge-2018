class Card{
    
    constructor(figure, value, symbol, image){
        this.figure = figure;
        this.symbol = symbol;
        this.value = value;
        this.image = image;
        this.visible = true;
    }

    flip(){
        this.visible = !this.visible;
    }

    loadImage(){
        let tempImage= new Image();
        tempImage.src = image;
    }


}