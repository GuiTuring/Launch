// Page loader
var loaderPage = function() {
    $(".page-loader").fadeOut("slow");
}

var mobileMenuControl = function() {
    
    // click burger menu
    $('.page-burger-menu').on('click', function(e) {
        e.preventDefault();
        if($('body').hasClass('show')) {
            $('.page-burger-menu').removeClass('active');
            $('body').removeClass('show');
        } else {
            $('.page-burger-menu').addClass('active');
            $('body').addClass('show');
        }
    })

    if ($(window).width() > 750) {
        $('body').removeClass('page-mobile-menu-active');
        $('.page-burger-menu').removeClass('active');        
    } else {
        $('body').addClass('page-mobile-menu-active');
    }

    $(window).resize(function() {
        if ($(window).width() > 750) {
            $('body').removeClass('page-mobile-menu-active');
            $('.page-burger-menu').removeClass('active');
        } else {
            $('body').addClass('page-mobile-menu-active');
        }
    })

    $(document).click(function(e) {
        var container = $(".page-nav, .page-burger-menu");

        if (!container.is(e.target) && container.has(e.target).length === 0) {
            if ($('body').hasClass('show')) {
                $('body').removeClass('show');
                $('.page-burger-menu').removeClass('active');
            }
        }
    })
}
/**
 * Document ready
 */
$(document).ready(function() {
    loaderPage();
    mobileMenuControl();
});