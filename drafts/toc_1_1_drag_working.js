$(document).ready(function(){
    
    var toc_pos = $('#toc').position();
    var current_pos = toc_pos.left;
    var initial_left_pos = toc_pos.left;
    current_pos = parseInt(current_pos);
    initial_left_pos = parseInt(initial_left_pos);
    
    var swipe_direction = "";
    
    var x = document.getElementById("touchmove_track");
    x.innerHTML=current_pos;
    
    var initial_touchX = "";
    
    $(document).on('touchstart', onTouchStart);
    $(document).on('touchmove', onTouchMove);
    $(document).on('touchend', onTouchEnd);

    function onTouchStart( event ) {

        touchStartX = event.originalEvent.touches[0].clientX;
        /*touchStartY = event.originalEvent.touches[0].clientY;
        touchMoveX = null;
        touchMoveY = null;*/
        
        initial_touchX = touchStartX;
        x.innerHTML=touchStartX;

    };
    
    function onTouchMove( event ) {
        touchMoveX = event.originalEvent.touches[0].clientX;
        touchMoveY = event.originalEvent.touches[0].clientY;

        var x = document.getElementById("touchmove_track");
        
        var diff = 0;
        
        if (current_pos < initial_left_pos){
            diff = 0;
            current_pos = initial_left_pos;
        }else if (current_pos >0){
            diff = 0;
            current_pos = 0;
        }else(
            diff = touchMoveX - initial_touchX
        );
        
        current_pos += diff;
        initial_touchX = touchMoveX;
        
        if (diff > 0){
            swipe_direction = 'right'
        }else if (diff < 0){
            swipe_direction = 'left'
        }else if (diff == 0){
            swipe_direction = 'tap'
        };
        
        x.innerHTML=current_pos+'<br>'+diff+'<br>'+swipe_direction;
        
        $('#toc').css('left', current_pos+'px');
        
    };
    //Get rid of the current position nonsense in onTouchEnd and then this is a working 1:1 drag out menu example
    function onTouchEnd( event ) {
        
        if (current_pos >= initial_left_pos/2 && swipe_direction == 'right'){
            show_tab();
        }else if (current_pos < initial_left_pos/2 && swipe_direction == 'left'){
            hide_tab();
        };
        
        initial_touchX = "";
    }
    
    
    // ################## END  meny code  ###########
    
    var toc_shown = false;
    
    $('body').on('tap click', '#toc_icon', function(){
        show_tab();
    });
    
    $('body').on('tap click', '#toc_icon_hide', function(){
        hide_tab();
    });
    
    $('body').on('click',function(){
        if (toc_shown){
            //alert('!!');
            //hide_tab();
        };
    });
    
    function show_tab(){
        $('#toc').css('left', '0%');
        $('#toc').css('-moz-transition', 'left 0.5s ease-in-out');
        $('#toc').css('-webkit-transition', 'left 0.5s ease-in-out');
        $('#toc').css('-o-transition', 'left 0.5s ease-in-out');
        $('#toc').css('transition', 'left 0.5s ease-in-out');
        toc_shown = true;
        current_pos = 0;
    };
    
    function hide_tab(){
        $('#toc').css('left', '-50%');
        $('#toc').css('-moz-transition', 'left 0.5s ease-in-out');
        $('#toc').css('-webkit-transition', 'left 0.5s ease-in-out');
        $('#toc').css('-o-transition', 'left 0.5s ease-in-out');
        $('#toc').css('transition', 'left 0.5s ease-in-out');
        toc_shown = false;
        current_pos = initial_left_pos;
    };
    
    
    $('#toc_1').on('tap click', function(){
        setTimeout(function () {
        page1Scroll.scrollToElement('li:nth-child(1)', 100);
        }, 100);
        hide_tab();
        meny.close();
    });
    $('#toc_2').on('tap click', function(){
        setTimeout(function () {
        page1Scroll.scrollToElement('li:nth-child(2)', 100);
        }, 100);
        hide_tab();
        meny.close();
    });
    $('#toc_3').on('tap click', function(){
        setTimeout(function () {
        page1Scroll.scrollToElement('li:nth-child(3)', 100);
        }, 100);
        hide_tab();
        meny.close();
    });


});