var fixedHeaderContainer = '.fixed-header-box';
var fixedHeader = '.fixed-header';

$(function() {
    //маска телефонов
    $('[data-mask]').each(function() {
        input = $(this);
        mask = input.attr('data-mask');
        input.inputmask({"mask": mask});
    });
    //сворачивание мобильного меню
    $('.toggle-menu').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('show-slide-menu')) {
            $('.mobile-menu').slideUp(300, function() {
                $('.mobile-menu').stop(true, true);
            });
            $('body').removeClass('show-slide-menu')
        } else {
            $('.mobile-menu').slideDown(300, function() {
                $('.mobile-menu').stop(true, true);
            });
            $('body').addClass('show-slide-menu')
        }
    });

    //сворачивание и разворачивание подменю для мобильного
    $('body').on('click', '.mobile-menu__toggle', function(e) {
        e.preventDefault();
        $(this).closest('li').toggleClass('open');
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
    setCountProducts();
    //инициализация всех табов
    initXtab();
    setHeaderHeight();

    //показ всех товаров в каталоге при клике на "Показать еще"
    $('body').on('click', '.more-js', function(e) {
        e.preventDefault();
        var box = $(this).parents('.services').find('.hidden').removeClass('hidden');
        $(this).addClass('hidden');
    });

    $('body').on('click', '.about-faq__item', function() {
        var item = $(this);
        $('.about-faq__item.active').find('.about-faq__answer').slideUp(400, function() {
            $(this).closest('.about-faq__item').removeClass('active');
        });
        $(this).find('.about-faq__answer').slideDown(400, function() {
            item.addClass('active');
        });

        //$(this).toggleClass('active');
    });

    $('select.styler').styler();
    $('select.styler-popup-form').styler({
        selectSmartPositioning: false,
        singleSelectzIndex: '999',
    });
    $('.checkbox-styler').styler();

    $('body').on('click', '[data-step-index]', function(e) {
        e.preventDefault();
        $('[data-step-index]').removeClass('active');
        $(this).addClass('active');
        var index = $(this).attr('data-step-index');
        console.log(index);
    });

    $('body').on('click', '[data-quiz-nav]', function(e) {
        e.preventDefault();
        var action = $(this).attr('data-quiz-nav');
        var quizContainer = $(this).parents('[data-quiz-step]');
        var currentStep = parseInt(quizContainer.attr('data-quiz-step'));
        if (action == 'next') {
            currentStep++;
        } else {
            currentStep--;
        }
        quizContainer.attr('data-quiz-step', currentStep);
        setQuizNav(quizContainer, currentStep);
        setQuizTab(quizContainer, currentStep);
    });

});

var setQuizNav = function(quizContainer, currentStep) {
    var navs = quizContainer.find('[data-quiz-index]');
    navs.removeClass('active');
    navs.each(function() {
        if ($(this).attr('data-quiz-index') < currentStep) {
            $(this).addClass('active');
        }
    });
};

var setQuizTab = function(quizContainer, currentStep) {
    quizContainer.find('[data-quiz-tab]').removeClass('active');
    quizContainer.find('[data-quiz-tab="'+currentStep+'"]').addClass('active');
};

var initXtab = function() {
    setTimeout(function() {
        $('.xtab-container').each(function() {
            $(this).addClass('xtab-initialized');
        });
    }, 100);
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

var setCountProducts = function() {
    var width = $(window).width();
    var selector = '.services__grid';
    var selectorItem = '.services__item';
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

var setHeaderHeight = function() {
  var headerHeight = $(fixedHeader).height();
  $(fixedHeaderContainer).css({'height': headerHeight});
};

var setFixedHeader = function() {
    var topFixedStart = parseInt($('.topline').offset().top) + parseInt($('.topline').height());
    var scroll = $(window).scrollTop();
    if (scroll > topFixedStart) {
        $('body').addClass('fix-header');
    } else {
        $('body').removeClass('fix-header');
    }
}

var doit;
$(window).resize(function(){
    clearTimeout(doit);
    doit = setTimeout(resizedw, 100);
});

var resizedw = function(){
    setCountProducts();
    setHeaderHeight();
    setFixedHeader();
    $('body').removeClass('show-slide-menu')
    $('.mobile-menu').slideUp();
};

$(document).scroll(function(){
    setFixedHeader();
});