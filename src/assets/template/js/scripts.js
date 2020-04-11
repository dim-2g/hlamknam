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
        $(this).addClass('active');
        var data_tab = $(this).attr('data-tab');
        xtab.animate({"opacity": 0.2}, 300, function() {
            xtab.removeClass('active');
            xtab.animate({"opacity": 1});
            $(data_tab).addClass('active');
        });
        return false;
    });
    //инициализация верхнего слайдера
    initMainSlider();
    //инициализация слайдера Отзывов
    initTestimonialsSlider();
    //скрываем часть товаров под кнопку Показать все
    setCountProducts();
    //инициализация слайдера Виды узлов
    initNodesSlider();
    //инициализация всех табов
    initXtab();
    //принудительно дергаем статус корзины, чтобы подтянуть аяксом корзину для заказа
    if (typeof(msMiniCartDynamic) != "undefined") {
        msMiniCartDynamic.changeDynamic('status');
    }
    //делаем полупрозрачными первый и последний слайд в Видах узлов
    $('.nodes-slider-js').on('afterChange', function(event, slick, currentSlide, nextSlide){
        setActiveSlideNodes();
    });
    //показ всех товаров в каталоге при клике на "Показать еще"
    $('body').on('click', '.more-js', function(e) {
        e.preventDefault();
        var box = $(this).parents('.xtab').find('.hidden').removeClass('hidden');
        $(this).addClass('hidden');
    });
    //изменение кол-ва товаров в заказе при клике на минус
    $("body").on("click", ".incrementer .minus", function (e) {
        e.preventDefault();
        var input = $(this).parents(".incrementer").find(".js_zcount");
        var input_val = parseInt( input.val() );

        if(input_val > 1){
            input_val--;
            input.attr("data-current", input_val);
            input.val(input_val);
        }
        if (input.hasClass('count_live')) {
            input.parents('form').submit();
        }
        input.trigger('change');
    });
    //изменение кол-ва товаров в заказе при впечатывании вручную
    $('body').on('change', '.order [name="count"]', function() {
        console.log('считаем');
        input = $(this);
        calcCartPairAll();
        if (input.hasClass('count_live')) {
            input.parents('form').submit();
        }
    });
    //изменение кол-ва товаров в заказе при клике на плюс
    $("body").on("click", ".incrementer .plus", function (e) {
        e.preventDefault();
        var input = $(this).parents(".incrementer").find(".js_zcount");
        var input_val = parseInt( input.val() );
        if(input_val < 999){
            input_val++;
            input.attr("data-current", input_val);
            input.val(input_val);
        }
        if (input.hasClass('count_live')) {
            input.parents('form').submit();
        }
        input.trigger('change');
    });
    //при изменении в заказе Длины шнурка, нужно получить новую цену и установить новое свойство
    $("body").on('change', '.order [data-option="length"]', function() {
        var form = $(this).parents('.ms2_form');
        var key = form.find('[name="key"]').val();
        var optionName = 'length';
        var optionValue = $(this).val();
        $.ajax({
            url: '/assets/components/set_options.php',
            data: {"key": key, "optionName": optionName, "optionValue": optionValue},
            dataType: 'html',
            type: 'POST',
            success: function(response) {
                refreshCart();
            },
            error: function() {
                console.log('error');
            }
        });
    });
    //показ мобильного меню
    $('.toggle-menu').on('click', function (e) {
        e.preventDefault();
        $('body').toggleClass('show-slide-menu');
    });
    //стилизуем select для выбора длины
    $('.select-length').styler();
    //при установке активности на поле - показываем нужную картинку пример
    $('body').on('focus', '.calculator-form input[type="text"]', function() {
        var calculatorImage = $('.calculator__image img');
        var imgSrc = $(this).attr('data-img');
        if (imgSrc) {
            calculatorImage.attr('src', imgSrc);
        }
        calc();
    });
    //при печатании значений в поле калькулятора - начинаем сразу считать
    $('body').on('keyup', '.calculator-form input[type="text"]', function() {
        calc();
    });
    //Инициализация калькулятора расчета длины шнурков
    calc();
    //Блок Полезное-Выбор цвета. При клике на экземпляре делаем активным и устанавливаем картинку пример
    $('.color-choice__card').on('click', function (e) {
        e.preventDefault();
        var sampleImage = $('.color-choice__image img');
        $('.color-choice__card').removeClass('active');
        $(this).addClass('active');
        var imgSrc = $(this).attr('data-img');
        if (imgSrc) {
            sampleImage.animate({"opacity": 0.2}, 300, function() {
                sampleImage.attr('src', imgSrc);
                sampleImage.animate({"opacity": 1});
            });
        }
    });
    //обновим корзину, когда произошли изменения в мини-корзины
    $(document).on('after_change_dynamic', function() {
        refreshCart();
    });
    //событие на изменение цвета в корзине товаров
    $('body').on('change', 'select.color', function() {
        setColorOneSelect($(this));
        var form = $(this).parents('.ms2_form');
        var key = form.find('[name="key"]').val();
        var optionName = 'pcolor';
        var optionValue = $(this).val();
        $.ajax({
            url: '/assets/components/set_options.php',
            data: {"key": key, "optionName": optionName, "optionValue": optionValue},
            dataType: 'html',
            type: 'POST',
            success: function(response) {
                refreshCart();
            },
            error: function() {
                console.log('error');
            }
        });
    });
    //запишем в скрытое поле новый article, чтобы передавать его в заказ
    $(document).on('msoptionsprice_product_action', function(a, action, form) {
        setTimeout(function(){
            var article = $(form).find('.product-preview__article-value').text();
            $(form).find('[name="options[article]"]').val(article);
        }, 500);
    });
    $('.jquery-background-video').bgVideo({fadeIn: 2000});
});

var refreshCart = function() {
    getAjaxCart();
    calcCartPairAll();
    $('.order input[name="phone"]').inputmask({"mask": mask});
    $('.select-length').styler();
    $('select.color').styler({
        onFormStyled: function() {
            setColorSelects();
        }
    });
};

var calcCartPairAll = function() {
    $('.pair-count').each(function() {
        calcCartPair($(this));
    });
};
var calcCartPair = function(element) {
    var row = element.parents('div[key]');
    var count = parseInt(row.find('[name="count"]').val());
    var pair = Math.floor(count / 2);
    element.text(pair);
};

var getAjaxCart = function() {
    $.ajax({
        url: '/page/cart',
        dataType: 'html',
        async: false,
        type: 'POST',
        success: function(response) {
            if ($(response).find('#msCart').length > 0) {
                console.log('Есть товары');
            } else {
                console.log('ничего нет');
            }
            if (response.length > 100) {
                $('.order').show();
                $('#order-box').html(response);
            } else {
                $('.order').hide();
            }

        },
        error: function() {
            console.log('error');
        }
    });
}

var setColorOneSelect = function(element) {
    var jqSelect = element.parents('.jqselect');
    var optionSelected = element.find('option:selected');
    var color = optionSelected.attr('data-color');
    jqSelect.find('.jq-selectbox__select').css({"background-color": color});
    jqSelect.find('.jq-selectbox__dropdown li[data-color]').each(function() {
        var color = $(this).attr('data-color');
        $(this).css({"background-color": color});
    });
};

var setColorSelects = function() {
    $('select.color').each(function() {
        setColorOneSelect($(this));
    });
};

var calc = function() {
    $('.calculator-total').text(0);
    var pairHoles = parseInt($('[name="pair-holes"]').val()); //p
    var lengthHor = parseInt($('[name="length-hor"]').val()); //h
    var lengthVert = parseInt($('[name="length-vert"]').val()); //v
    var lengthLaces = parseInt($('[name="length-laces"]').val()); //l
    if( pairHoles > 0 && lengthHor > 0 && lengthVert > 0 && lengthLaces > 0) {
        var result = Math.round((lengthHor + Math.sqrt( lengthHor*lengthHor + lengthVert*lengthVert ) * (pairHoles-1) + lengthLaces) * 2);
        if (result) {
            $('.calculator-total').text(result);
        }
    }
};

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
    var selector = '.slider-top';
    if (!isInitMainSlider) {
        $(selector).slick({
            'autoplay': false,
            'arrows': false,
            'dots': true,
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'initialSlide': 0,
            'infinite': true,
            'adaptiveHeight': true,
            'responsive': [
                {
                    breakpoint: 550,
                    settings: {
                        arrows: false,
                        vertical: false,
                        dots: true,
                        slidesToShow: 1
                    }
                }
            ]
        });
        isInitMainSlider = true;
    }
};

var isInitTestimonailsSlider = false;
var initTestimonialsSlider = function() {
    var selector = '.testimonials-slider';
    if (!isInitTestimonailsSlider) {
        $(selector).slick({
            'autoplay': false,
            'arrows': false,
            'dots': true,
            'slidesToShow': 3,
            'slidesToScroll': 1,
            'initialSlide': 0,
            'infinite': true,
            'adaptiveHeight': true,
            'responsive': [
                {
                    breakpoint: 1000,
                    settings: {
                        arrows: false,
                        vertical: false,
                        dots: true,
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 750,
                    settings: {
                        arrows: false,
                        vertical: false,
                        dots: true,
                        slidesToShow: 1
                    }
                }
            ]
        });
        isInitTestimonailsSlider = true;
    }
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
    setCountProducts();
    initTestimonialsSlider();
    initNodesSlider();
    hideSlideMenu();
}