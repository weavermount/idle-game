"use strict";

var resourceManager = new ResourceManager();
/**
 * Tiny Idle Game FrameWork (TIG FW / Tidle)
 * 
 * Event Handler
 * 
 * This file holds the logic for the events. It works as follows:
 * An event is captured, a callback function is called to work with the event.
 * OBS.:  not even Event handler functions are  allowed to start with lower case.
 */

// ########### Declares the logic 
//TODO: the player deduced value logic should be here, not in the onItemBought function of each item.
//TODO: define if UIUpdateHelpersList should be moved to SpendResource..
function OnItemBought(event) {
    //calls the function OnItemBought from the target item.
    //ex.: bought a helper with ID = 2. Calls the function OnItemBought from helper#2    
    var item = event.detail;    
    if (resourceManager.Spend(item.buyPrice))
    {        
        player.helpers.push(item);
        event.detail.OnItemBought();//adds +1 to quantity
        UIManager.UpdateCoinsCount(resourceManager.coins, resourceManager.maxCoins); // to display updated info of coins spent        
        UIManager.UpdateHelpersList(helperManager.helpers);
    }    
    
}

function OnLevelUp(event) {

}



//TODO: move this for a config function inside a GAME Object
var playArea = document.getElementById(__config.ui_play_area);
playArea.addEventListener('click', function () {    
    resourceManager.Produce(1);
    //should extend the total amount of clicks too

});


function PlayAreaOnClick(e) {
    console.log("Clicou!");
    
    totalAmountOfClicks++;
    UIManager.UpdateCoinsCount(resourceManager.coins, resourceManager.maxCoins); // to display the new coin added    
    //Click EFFECT
    // Remove any old one
    $(".ripple").remove();

    // Setup
    var posX = $(this).offset().left,
        posY = $(this).offset().top,
        buttonWidth = $(this).width(),
        buttonHeight = $(this).height();
    // Add the element
    $(this).prepend("<span class='ripple'></span>");


    // Make it round!
    if (buttonWidth >= buttonHeight) {
        buttonHeight = buttonWidth;
    } else {
        buttonWidth = buttonHeight;
    }

    // Get the center of the element
    var x = e.pageX - posX - buttonWidth / 2;
    var y = e.pageY - posY - buttonHeight / 2;


    // Add the ripples CSS and start the animation
    $(".ripple").css({
        width: buttonWidth,
        height: buttonHeight,
        top: y + 'px',
        left: x + 'px'
    }).addClass("rippleEffect");
}

// ########### Self Invoking function to add eventListeners 
(function () {
    //General event handlers
    document.addEventListener('OnItemBought', OnItemBought);
    document.addEventListener('OnLevelUp', OnLevelUp);

    //Event Handlers for specific areas
    const ui_play_area = document.getElementById('ui-play-area');
    ui_play_area.addEventListener('click', PlayAreaOnClick);
})();
//other functions

//GAME LOOP

function updateLogic () 
{
    resourceManager.Produce(player.currentProductionValue);
}

function updateGraphics ()
{    
    UIManager.UpdateCoinsCount(resourceManager.coins, resourceManager.maxCoins);    
    UIManager.UpdateHelpersList(helperManager.helpers);
    UIManager.UpdateRPC(helperManager.CalculateTotalProductionValue());
}


//TODO: think about how a status should affect this function(Eg.: status makes production go up 20%..)
setInterval(function () {    
    
    updateLogic();
    updateGraphics();    
    player.CalculateTotalProductionValue();
    //console.log("Valor produzido: " + player.currentProductionValue);
    //ProduceResource(player.currentProductionValue);        
    
    //logic to handle status    
}, 1000);

//