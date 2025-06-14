'use strict';

import $ from 'jquery';
// プラグインのカルーセル機能
// slick.css,slick-theme.cssはビルドエラーが出るため、
// node_module内のscssをコピーして同じスタイルを作成し、layout.scss内で読み込み
import 'slick-carousel';
//import 'slick-carousel/slick/slick.css';
//import 'slick-carousel/slick/slick-theme.css';

$(function() {

    // ハンバーガーメニューを開く処理
    $('.openbtn').on('click', function() {
        $(this).toggleClass('active');
        $('#g-nav').toggleClass('panelactive');
        $('#header, #container').toggleClass('mainblur');
    });

    $('#g-nav a').on('click', function() {
        $('.openbtn').removeClass('active');
        $('#g-nav').removeClass('panelactive');
        $('#header, #container').removeClass('mainblur');
    });

    // #page-topをクリックした際の設定
    $('#page-top').on('click', function() {
        $('body, html').animate({
            scrollTop: 0
        }, 500);

        return false; // リンク自体の無効化
    });

    // 読み込み時の処理
    $(window).on('load', function() {

        // ロゴを1.2秒（1200ms）待機してからフェードアウト
        $('#splash-logo').delay(1200).fadeOut('slow');

        // ローディング画面を1.5秒（1500ms）待機してからフェードアウト
        $('#splash').delay(1500).fadeOut('slow', function() {
            $('body').addClass('appear');

            /* テキストがほのかに光りながら出現 */
            let element = $('.glow-anime');
            element.each(function() {
                let text = $(this).text();
                let textbox = '';
                text.split('').forEach(function(t, i) {
                    if (t !== ' ') {
                        if (i < 10) {
                            textbox += '<span style="animation-delay:.' + i + 's;">' + t + '</span>';
                        } else {
                            let n = i / 10;
                            textbox += '<span style="animation-delay:' + n + 's;">' + t + '</span>';
                        }
                    } else {
                        textbox += t;
                    }
                });
                $(this).html(textbox);
            });

            glowAnimeControl();
        });


        // 背景が伸びた後に動かしたい挙動
        $('.splash-bg1').on('animationend', function() {
            setFadeElementControl();
            fadeAnimeControl();
            slideAnimeControl();
            BlurTextAnimeControl();
        });

        /*===========================================================*/
        /* 複数画像を並列に見せる*/
        /*===========================================================*/
        $('.slider').slick({
            autoplay: true,     // 自動的に動き出すか。初期値はfalse。
            infinite: true,     // スライドをループさせるかどうか。初期値はtrue。
            slidesToShow: 4,    // スライドを画面に3枚見せる
            slidesToScroll: 4,  // 1回のスクロールで3枚の写真を移動して見せる
            prevArrow: '<div class="slick-prev"></div>',    // 矢印部分PreviewのHTMLを変更
            nextArrow: '<div class="slick-next"></div>',    // 矢印部分NextのHTMLを変更
            dots: true,                                     // 下部ドットナビゲーションの表示
            responsive: [
                {
                    breakpoint: 1200,       // モニターの横幅が1200px以下の見せ方
                    settings: {
                        slidesToShow: 3,    // スライドを画面に2枚見せる
                        slidesToScroll: 3,  // 1回のスクロールで2枚の写真を移動して見せる
                    }
                },
                {
                    breakpoint: 769,        // モニターの横幅が769px以下の見せ方
                    settings: {
                        slidesToShow: 2,    // スライドを画面に2枚見せる
                        slidesToScroll: 2,  // 1回のスクロールで2枚の写真を移動して見せる
                    }
                },
                {
                    breakpoint: 426,        // モニターの横幅が426px以下の見せ方
                    settings: {
                        slidesToShow: 1,    // スライドを画面に1枚見せる
                        slidesToScroll: 1,  // 1回のスクロールで1枚の写真を移動して見せる
                    }
                }
            ]
        });
    });

    // スクロール時の挙動
    $(window).on('scroll', function () {
        setFadeElementControl();
        scrollHeaderImage();
        slideAnimeControl();
        fadeAnimeControl();
        BlurTextAnimeControl();
    });

/*===========================================================*/
/* テキストが流れるように出現（左から右）
/*===========================================================*/

function slideAnimeControl() {
    $('.left-anime').each(function() {

        let elemPos = $(this).offset().top - 50;
        let scroll = $(window).scrollTop();
        let windowHeight = $(window).height();

        // テキスト要素を挟む親要素（左側）とテキスト要素を元位置でアニメーションをおこなう
        if (scroll >= elemPos - windowHeight) {
            // 要素を左枠外にへ移動しCSSアニメーションで左から元の位置に移動
            $(this).addClass('slide-anime-left-right');
            // 子要素は親要素のアニメーションに影響されないように逆の指定をし元の位置をキープするアニメーションをおこなう
            $(this).children('.left-anime-inner').addClass('slide-anime-right-left');
        } else {
            // 左から右へ表示するクラスを取り除く
            $(this).removeClass('slide-anime-left-right');
            $(this).children('.left-anime-inner').removeClass('slide-anime-right-left');
        }
    });

    $('.right-anime').each(function() {

        let elemPos = $(this).offset().top - 50;
        let scroll = $(window).scrollTop();
        let windowHeight = $(window).height();

        // テキスト要素を挟む親要素（右側）とテキスト要素を元位置でアニメーションをおこなう
        if (scroll >= elemPos - windowHeight) {
            // 要素を右枠外にへ移動しCSSアニメーションで右から元の位置に移動
            $(this).addClass('slide-anime-right-left');
            // 子要素は親要素のアニメーションに影響されないように逆の指定をし元の位置をキープするアニメーションをおこなう
            $(this).children('.rightAnimeInner').addClass('slide-anime-left-right');
        } else {
            // 右から左へ表示するクラスを取り除く
            $(this).removeClass('slide-anime-right-left');
            $(this).children('.rightAnimeInner').removeClass('slide-anime-left-right');
        }
    });
}

/*===========================================================*/
/* テキストがほのかに光りながら出現
/*===========================================================*/

function glowAnimeControl() {
	$('.glow-anime').each(function() {

		let elemPos = $(this).offset().top - 50;
		let scroll = $(window).scrollTop();
		let windowHeight = $(window).height();

		if (scroll >= elemPos - windowHeight) {
			$(this).addClass('glow');
		} else {
			$(this).removeClass('glow');
		}
	});
}

/*===========================================================*/
/* スクロールするとヘッダー背景画像が拡大
/*===========================================================*/

function scrollHeaderImage() {
    // スクロール値を定義
    let scroll = $(window).scrollTop();

    // header-imgの背景
    $('#header-img').css({
        // スクロール値を代入してscale1から拡大.scroll/10の値を小さくすると拡大値が大きくなる
        transform: 'scale('+(100 + scroll / 10) / 100 +')',
        // スクロール値を代入してtopの位置をマイナスにずらす
        top: -(scroll / 50) + '%',
    });
}

/*===========================================================*/
/* 動きのきっかけの起点となるアニメーション属性を定義
/*===========================================================*/

function fadeAnimeControl() {
    // その場でふわっと出現するアニメーションを使用
	$('.fade-in-trigger').each(function() {
		let elemPos = $(this).offset().top - 50;
		let scroll = $(window).scrollTop();
		let windowHeight = $(window).height();

		if (scroll >= elemPos - windowHeight) {
		    // 画面内に入ったらクラス付与
            $(this).addClass('fade-in');
		} else {
            // 画面外に出たらクラスを外す
		    $(this).removeClass('fade-in');
		}
	});

    // 拡大するアニメーションを使用
	$('.zoom-out-trigger').each(function() {
		let elemPos = $(this).offset().top;
		let scroll = $(window).scrollTop();
		let windowHeight = $(window).height();

        if (scroll >= elemPos - windowHeight) {
            // 画面内に入ったらクラス付与
            $(this).addClass('zoom-out');
		} else {
            // 画面外に出たらクラスを外す
		    $(this).removeClass('zoom-out');
		}
	});
}

/*===========================================================*/
/* テキストがじわっと出現
/*===========================================================*/

function BlurTextAnimeControl() {
	$('.blur-trigger').each(function() {
		let elemPos = $(this).offset().top - 50;
		let scroll = $(window).scrollTop();
		let windowHeight = $(window).height();

		if (scroll >= elemPos - windowHeight) {
            // 画面内に入ったらクラス付与
		    $(this).addClass('blur');
		} else {
            // 画面外に出たらクラスを外す
		    $(this).removeClass('blur');
		}
	});
}

/*===========================================================*/
/* ページ内にある指定の範囲内で下から出現
/*===========================================================*/

function setFadeElementControl() {
	let windowH = $(window).height();	// ウィンドウの高さを取得
	let scroll = $(window).scrollTop(); // スクロール値を取得

    // 出現範囲の指定
	let contentsTop = Math.round($('#blog').offset().top); // 要素までの高さを取得
	let contentsH = $('#blog').outerHeight(true);

    // 2つ目の出現範囲の指定
	let contentsTop2 = Math.round($('#footer').offset().top); // 要素までの高さを取得
	let contentsH2 = $('#footer').outerHeight(true);

    // 出現範囲内に入ったかどうかをチェック
	if (scroll + windowH >= contentsTop && scroll + windowH  <= contentsTop + contentsH) {
		$('#page-top').addClass('up-move');
		$('#page-top').removeClass('down-move');
		$('.hide-btn').removeClass('hide-btn');
	}
    // 2つ目の出現範囲に入ったかどうかをチェック
    else if (scroll + windowH >= contentsTop2 && scroll + windowH <= contentsTop2 + contentsH2) {
		$('#page-top').addClass('up-move');
		$('#page-top').removeClass('down-move');
	}
    else {
        // サイト表示時にdown-moveクラスを一瞬付与させないためのクラス付け。
        // hide-btnがなければ下記の動作を行う
        // TODO: .hide-btnが付かず、動作していない
        if (!$('.hide-btn').length) {
            $('#page-top').addClass('down-move');
            $('#page-top').removeClass('up-move');
        }
	}
}


});