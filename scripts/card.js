class Card{
    
    constructor(figure, value, symbol, imagePath){
        this.figure = figure;
        this.symbol = symbol;
        this.value = value;
        this.imagePath = imagePath;
        this.visible = true;
    }

    flip(){
        this.visible = !this.visible;
    }

    loadImage(){
        let tempImage= new Image();
        tempImage.onload(()=>{
            tempImage.src = this.image;
        });
        this.image = tempImage;
        return tempImage;
    }


}