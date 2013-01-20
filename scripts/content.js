var mouseStartX, mouseStartY;
var element, elementX, elementY;
var button = $("<div class='dbutton'/>");
var focusedTextarea=null;

//d&d
function onMouseDown(e) {
    element = e.target;
    if ( $(element).hasClass("undocked") ) {
        mouseStartX = e.clientX;
        mouseStartY = e.clientY;
        elementX = $(element).offset().left;
        elementY = $(element).offset().top;
    } else {
        element = null;
    }
}

//d&d
function onMouseMove(e) {
    if ( element ) {
        button.hide(); //don't show button when dragging
        var x = elementX+(e.clientX-mouseStartX);
        var y = elementY+(e.clientY-mouseStartY);
        if ( $(element).css("position") == "fixed" ) {
            x -= window.pageXOffset;
            y -= window.pageYOffset;
        } 
        $(element).css("left", x);
        $(element).css("top", y);
    }
}

//d&d
function onMouseUp() {
    element = null;
}

function positionButton() {
    button.offset(
        {"left":$(focusedTextarea).offset().left,
         "top":$(focusedTextarea).offset().top-33}
    );
}

//click undock button
function undockbuttonOnClick(e) {
    $(focusedTextarea).addClass("undocked");
    // adjust position so it's no jumping to another place
    var x = $(focusedTextarea).offset().left - window.pageXOffset;
    var y = $(focusedTextarea).offset().top - window.pageYOffset;
    console.log($(focusedTextarea).offset().top);
    console.log(window.pageYOffset);
    $(focusedTextarea).css("left", x+5);
    $(focusedTextarea).css("top", y+5);

    useRevertButton();
    positionButton(); //when textarea is undocked, positions might change
}
//click revert button
function revertbuttonOnClick(e) {
    $(focusedTextarea).removeClass("undocked");
    // revert position set
    $(focusedTextarea).css("left", "");
    $(focusedTextarea).css("top", "");
    useUndockButton();
    positionButton(); //when textarea is undocked, positions might change
}

//switch to undock button
function useUndockButton() {
    button.addClass("liftoff");
    button.removeClass("revert");
}
//switch to revert button
function useRevertButton() {
    button.addClass("revert");
    button.removeClass("liftoff");
}

$(document).ready( function() {

    // record original position of undocked textarea
    $("textarea").each( function(){
        $(this).data("origtop", $(this).offset().top);
    });

    button.appendTo("html");
    button.click( function(e) {
        if ( button.hasClass("liftoff") ) { undockbuttonOnClick(e); }
        else if ( button.hasClass("revert") ) { revertbuttonOnClick(e); }
    });

    var sb_timer; //timer to show button
    var rb_timer; //timer to remove button timer
    // hover over textarea
    $("textarea").mouseenter(function(e) {
        // if was to remove button, don't remove
        if (rb_timer) {
            clearTimeout(rb_timer);
            rb_timer = null;
        }
        sb_timer = setTimeout( function() {
            focusedTextarea=e.target;
            if ( $(focusedTextarea).hasClass("undocked") ) {
                // revert: undocked -> original
                useRevertButton();
            } else {
                // liftoff: original -> undocked
                useUndockButton();
            }
            button.show();
            positionButton();
        }, 100);
    });
    // leaving textarea, mainly to achieve delay&cancel of textarea hovering
    $("textarea").mouseleave(function(e) {
        // if was to show button, don't show
        if (sb_timer) {
            clearTimeout(sb_timer);
            sb_timer = null;
        }
        // if button is already shown, remove in delay
        rb_timer = setTimeout( function() {
            button.hide();
            focusedTextarea=null;
        }, 2500);
    });


    $(window).mousedown(onMouseDown);
    $(window).mousemove(onMouseMove);
    $(window).mouseup(onMouseUp);

});
