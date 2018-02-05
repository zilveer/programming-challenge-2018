class Card{
    
    constructor(figure, value, imagePath){
        this.figure = figure;
        this.value = value;
        this.imagePath = imagePath;
        this.visible = true;
        this.image = new Image();

        const ratio = 324/223;
        this.width = 100;
        this.height = this.width*ratio;
    }

    flip(){
        this.visible = !this.visible;
    }

    addToTable(){
        this.image.onload = () => {
            $('main').append(`<img src='${this.image.src}' width='${this.width}' height='${this.height}'>`);
        };
        this.image.src = this.imagePath;
    }


}