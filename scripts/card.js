class card{
    
    constructor(figure, value, symbol){
        this.figure = figure;
        this.symbol = symbol;
        this.value = value;
        this.visible = true;
    }

    flip(){
        this.visible = !this.visible;
    }


}