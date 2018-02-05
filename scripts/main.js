let scope = {};

((scope, $) => {
    //let scope.smth will create "public" variable accessible by scope.smth
    //let smth will create local variable not accessible in console
    const GAME = {
        pot: 0,
        cardsOnTable: [],
        numberOfPlayers: null,
        players: []
    };
    let deck;

    deck = new Deck();
    deck.shuffleDeck();

    for(let i=0; i<5; i++)
    {
        let cardDrawn = deck.drawCard();
        cardDrawn.addToTable();
        GAME.cardsOnTable.push(cardDrawn);
    }

    // const playerCard_1 = $(#)

    // Raise amount input and slider
    const raiseInput = document.getElementById('raiseInput');
    const raiseSlider = document.getElementById('raiseSlider');
    raiseSlider.oninput = () => {
        raiseInput.value = raiseSlider.value;
    }

    raiseInput.onchange = () => {
        /* magic that should not be used in real thingy, but i like it c:
        sets max value to 100 and min to 1 */
        raiseInput.value = Math.min(Math.max(raiseInput.value, 1), 100);
        raiseSlider.value = raiseInput.value;
    }

    $('#raiseButton').click(()=>{
        $('#pot').html(parseInt($('#pot').html()) + parseInt(raiseInput.value));
    });

    // Load modal
    $('#startGameModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    // Button that starts the game
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);

    function startGame() {
        GAME.numberOfPlayers = document.getElementById('numberOfPlayers').value;
        const initialStake = document.getElementById('initalStake').value;

        for (var i = 0; i < GAME.numberOfPlayers; i++) {
            GAME.players.push(new Player('bob', initialStake));
        }

        console.log(GAME.players);
    }

})(scope, jQuery);
