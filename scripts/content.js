var mouseStartX, mouseStartY;
var element, elementX, elementY;
var button = $("<div type='button' class='dbutton'>undock</div>");
var focusedTextarea=null;
//var keyDownCode;
//var CTRL_KEYCODE = 17;

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
        button.remove(); //don't show button when dragging
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
         "top":$(focusedTextarea).offset().top-17}
    );
}

//undock button
function undockbuttonOnClick(e) {
    console.log("undocking");
    $(focusedTextarea).addClass("undocked");
    positionButton(); //when textarea is undocked, positions might change
}

//// when scroll, and make undocked textarea stay in viewport
//function whenscroll(textarea){
//    var origtop = textarea.data("origtop");
//    textarea.toggleClass( "fixed", window.pageYOffset > origtop );
//
//    if ( textarea.hasClass("fixed") ) {
//        textarea.css("left", textarea.data("origleft"));
//    } else {
//        textarea.css("left", "");
//    }
//}

$(document).ready( function() {

    // record original position of undocked textarea
    $("textarea").each( function(){
        $(this).data("origtop", $(this).offset().top);
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
            button.appendTo("html");
            focusedTextarea=e.target;
            positionButton();
            button.click(undockbuttonOnClick);
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
            button.remove();
            focusedTextarea=null;
        }, 3000);
        //button.remove();
    });


    //$(window).resize( function() {
    //    $("textarea").each( function(){
    //        $(this).data("origleft", $(this).offset().left);
    //    });
    //}).trigger("resize");

    //$(window).scroll( function() {
    //    $("textarea").each( function(){whenscroll($(this))} );
    //});

    $(window).mousedown(onMouseDown);
    $(window).mousemove(onMouseMove);
    $(window).mouseup(onMouseUp);

//    $(window).keydown( function(e) {
//        keyDownCode=e.keyCode;
//    });
//    $(window).keyup( function(e) {
//        keyDownCode=null;
//    });
});