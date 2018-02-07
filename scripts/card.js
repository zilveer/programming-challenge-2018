class Card
{

    constructor(figure, value, imagePath)
    {
        this.figure    = figure;
        this.value     = value;
        this.imagePath = imagePath;
        this.visible   = true;
        this.image     = new Image();
    }

    flip()
    {
        this.visible = !this.visible;
    }

    addToTable()
    {
        this.image.onload = () =>
        {
            $('#tableCards').append(`<img src='${this.image.src}'>`);
        };
        this.image.src    = this.imagePath;
    }

}