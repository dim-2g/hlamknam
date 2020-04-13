$(function() {
    //маска телеофнов
    $('[data-mask]').each(function() {
        input = $(this);
        mask = input.attr('data-mask');
        input.inputmask({"mask": mask});
    });
    //сворачивание мобильного меню
    $('.toggle-menu').on('click', function () {
        $('.mobile-menu').slideToggle();
        $(this).toggleClass('active');
    });
    //плавный переход по контенту
    $('body').on('click', '[data-goto]', function(e) {
        e.preventDefault();
        $('.mobile-menu').slideUp();
        var hx = 0;
        var selector = $(this).attr('data-goto');
        $('html, body').animate({ scrollTop: $(selector).offset().top + hx}, 1200);
    });
    //обрабатываем событие клика по табу
    $('[data-tab]').click(function(e){
        e.preventDefault();
        if ($(this).hasClass('active')) return false;
        var parent = $(this).parents('.xtab-container');
        var xtab = parent.find('.xtab');
        xtab.stop(true, true);
        parent.find('[data-tab]').removeClass('active');
        //$(this).addClass('active');
        var data_tab = $(this).attr('data-tab');
        $('[data-tab="'+data_tab+'"]').addClass('active');
        xtab.animate({"opacity": 0.2}, 300, function() {
            xtab.removeClass('active');
            xtab.animate({"opacity": 1});
            $(data_tab).addClass('active');
        });
        return false;
    });
    //инициализация верхнего слайдера
    initMainSlider();
    //инициализация слайдера Акций
    initActionSlider();
    //инициализация слайдера парйс-листа
    initPriceSlider();
    //инициализация слайдера машин на странице О компании
    initCarSlider();
    //скрываем часть товаров под кнопку Показать все
    //setCountProducts();
    //инициализация слайдера Виды узлов
    //initNodesSlider();
    //инициализация всех табов
    initXtab();

    //показ всех товаров в каталоге при клике на "Показать еще"
    $('body').on('click', '.more-js', function(e) {
        e.preventDefault();
        var box = $(this).parents('.xtab').find('.hidden').removeClass('hidden');
        $(this).addClass('hidden');
    });

    $('body').on('click', '.about-faq__item', function() {
        var item = $(this);
        if ($(this).hasClass('active')) {
            $(this).find('.about-faq__answer').slideUp(100, function() {
                console.log('close');
                item.removeClass('active');
            });
        } else {
            $(this).find('.about-faq__answer').slideDown(100, function() {
                console.log('open');
                item.addClass('active');
            });
        }
        //$(this).toggleClass('active');
    })

    //показ мобильного меню
    $('.toggle-menu').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('show-slide-menu');
    });

    $('select.styler').styler();

    $('body').on('click', '[data-step-index]', function(e) {
        e.preventDefault();
        $('[data-step-index]').removeClass('active');
        $(this).addClass('active');
        var index = $(this).attr('data-step-index');
        console.log(index);
    });

});

var initXtab = function() {
    setTimeout(function() {
        $('.xtab-container').each(function() {
            $(this).addClass('xtab-initialized');
        });
    }, 100);
};

var setActiveSlideNodes = function() {
    $('.nodes-slider-js .slick-active').removeClass('slide-opacity');
    $('.nodes-slider-js .slick-active:first').addClass('slide-opacity');
    $('.nodes-slider-js .slick-active:last').addClass('slide-opacity');
};

var isInitMainSlider = false;
var initMainSlider = function() {
    var selector = '.main-slider-js';
    $(selector).owlCarousel({
        loop: true,
        margin: 20,
        responsiveClass:true,
        responsive:{
            0:{
                items: 1,
                nav: false,
                dots: true,
            }
        }
    });
};

var isInitTestimonailsSlider = false;
var initActionSlider = function() {
    var selector = '.action-slider';
    $(selector).owlCarousel({
        loop: true,
        margin: 20,
        responsiveClass:true,
        responsive:{
            0:{
                items: 1,
                nav: false,
                dots: true,
            },
            1000:{
                items: 2,
                nav: false,
                dots: true,
            },
            1230:{
                items: 2,
                nav: true,
                dots: false,
            }
        }
    });
};

var initCarSlider = function() {
    var selector = '.car-slider-js';
    $(selector).owlCarousel({
        loop: true,
        margin: 0,
        responsiveClass:true,
        //autoWidth:true,
        responsive:{
            0:{
                items: 1,
                nav: true,
                dots: false,
            },
            750:{
                items: 2,
                nav: true,
                dots: false,
            },
            1000:{
                items: 3,
                nav: true,
                dots: false,
            },
            1200:{
                items: 4,
                nav: true,
                dots: false,
            }
        }
    });
};

var initPriceSlider = function() {
    var selector = '.price-slider-js';
    $(selector).owlCarousel({
        loop: true,
        margin: 0,
        responsiveClass:true,
        //autoWidth:true,
        responsive:{
            0:{
                items: 1,
                nav: true,
                dots: false,
            },
            550:{
                items: 1,
                nav: true,
                dots: false,
            },
            1000:{
                items: 2,
                nav: true,
                dots: false,
            },
            1200:{
                items: 3,
                nav: true,
                dots: false,
            }
        }
    });
};

var isInitNodesSlider = false;
var initNodesSlider = function() {
    var selector = '.nodes-slider-js';
    if (!isInitNodesSlider) {
        $(selector).slick({
            'autoplay': false,
            'arrows': false,
            'dots': false,
            'slidesToShow': 6,
            'slidesToScroll': 1,
            'initialSlide': 0,
            'infinite': true,
            'adaptiveHeight': true,
            'responsive': [
                {
                    breakpoint: 1700,
                    settings: {
                        vertical: false,
                        dots: false,
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        vertical: false,
                        dots: false,
                        slidesToShow:3
                    }
                },
                {
                    breakpoint: 875,
                    settings: {
                        vertical: false,
                        dots: false,
                        slidesToShow:2
                    }
                },
                {
                    breakpoint: 750,
                    settings: {
                        vertical: false,
                        dots: false,
                        arrows: false,
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        arrows: false,
                        vertical: false,
                        dots: false,
                        slidesToShow: 2
                    }
                }
            ]
        });
        isInitNodesSlider = true;
    }
    setActiveSlideNodes();
};

var setCountProducts = function() {
    var width = $(window).width();
    var selector = '.catalog-box__grid';
    var selectorItem = '.catalog-box__item';
    var limit = 8;
    if (width > 500) {
        //отображаем 8 товаров и кнопку Показать больше
        console.log('8 товаров');
        limit = 8;
    } else {
        //отображаем 4 товара и кнопку Показать больше
        console.log('4 товара');
        limit = 4;
    }

    $(selector).each(function(i, item) {
        var len = $(item).find(selectorItem).length;
        //скрываем кнопку Показать еще
        var box = $(item).parent();
        box.find('.more-js').addClass('hidden');
        var needMoreButton = false;
        //перебираем товары
        $(item).find(selectorItem).each(function(j, productItem) {
            if (j >= limit) {
                $(productItem).addClass('hidden');
                needMoreButton = true;
            }
        });
        if (needMoreButton) {
            box.find('.more-js').removeClass('hidden');
        }
    });
};

var hideSlideMenu = function() {
    $('body').removeClass('show-slide-menu');
};

var doit;
$(window).resize(function(){
    clearTimeout(doit);
    doit = setTimeout(resizedw, 100);
});

var resizedw = function(){
    //var width = $(window).width();
    //console.log('Перестроить слайдеры');
    //setCountProducts();
    //initTestimonialsSlider();
    //initNodesSlider();
    //hideSlideMenu();
}