if (!Object.create) {
  Object.create = function (o) {
    if (arguments.length > 1) {
      throw new Error('Object.create implementation only accepts the first parameter.');
    }
    function F() {}
    F.prototype = o;
    return new F();
  };
}


(function( $, document ){

  var enablePlaceholders = {
    init: function( el ){
      var $t = this;
      $t.el = $(el).data( 'hasplaceholder', true );
      $t.placeholder = $t.el.attr('placeholder');
      $t.addPlaceholder( $t.el );
    } // init

    ,clearValue: function( e ){
      if( $(e).val() === $(e).data('placeholder') ) {
        $(e).val('');
      }
    }//clearValue

    ,addPlaceholder: function(){
      var $t = this;
        $t.maybeShowPlaceholder();
      $t.el.bind('blur.ntz_placeholder', $.proxy( $t.maybeShowPlaceholder, $t ) );
      $t.el.bind('focus.ntz_placeholder', $.proxy( $t.maybeHidePlaceholder, $t ) );
    } //addPlaceholder

    ,maybeShowPlaceholder: function(){
      var $t = this;
      if( $.trim( $t.el.val() ) !== '' ){ return; }
      $t.el
        .addClass('placeholder')
        .val( $t.placeholder );
    }//maybeShowPlaceholder

    ,maybeHidePlaceholder: function(){
      var $t = this;
      if( $t.el.hasClass('placeholder') &&
          $t.el.val() == $t.placeholder ){
        $t.el.val('');
      }
    }//maybeHidePlaceholder
  };

  $.fn.enablePlaceholders = function() {
    var fakeInput = document.createElement("input"),
        nativePlaceholder = ("placeholder" in fakeInput);

    if (!nativePlaceholder) {

      $('input[placeholder], textarea[placeholder]').filter(function(){
        return !$(this).data('hasplaceholder');
      }).each(function(){
        var obj = Object.create( enablePlaceholders );
        obj.init( this );
      });

      return this;
    }
  };

})( jQuery, document );


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
  var lastTime = 0,
      vendors  = [ 'ms', 'moz', 'webkit', 'o' ];

  for( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ){
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame  = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if ( !window.requestAnimationFrame ){
    window.requestAnimationFrame = function( callback, element ){
      var currTime = new Date().getTime();
      var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
      var id = window.setTimeout( function(){ callback( currTime + timeToCall ); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if ( !window.cancelAnimationFrame ){
    window.cancelAnimationFrame = function( id ) {
      clearTimeout( id );
    };
  }
}());


Array.max = function( array ){return Math.max.apply( Math, array );};
Array.min = function( array ){return Math.min.apply( Math, array );};