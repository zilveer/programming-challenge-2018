class Card{
    
    constructor(figure, value, imagePath){
        this.figure = figure;
        this.value = value;
        this.imagePath = imagePath;
        this.visible = true;
        this.image = new Image();
    }

    flip(){
        this.visible = !this.visible;
    }

    addToTable(){
        this.image.onload = function(){
            $('main').append(`<img src='${this.src}'>`);
        };
        this.image.src = this.imagePath;
    }


}