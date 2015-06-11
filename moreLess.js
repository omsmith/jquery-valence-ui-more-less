/*jslint browser: true*/

( function() {

	'use strict';

	$.widget( "vui.vui_moreless", {

		options: {
			height: '4em',
			lineHeight: 'normal',
			title: {
				more: "more",
				less: "less"
			},
			color: '#FAFAFA'
		},

		_$moreblur: null,
		_$moreless: null,
		_$morelink: null,
		pollingVariable: null,

		_accessibileButton: function( title, iconClass ) {
			var me = this;
			me._$morelink.empty();
			me._$morelink.append( '<span class="' + iconClass + '">' );
			if( !this.options.accessible ) {
				me._$morelink.attr( 'aria-hidden', 'true' );
				me._$morelink.append( title );
			} else {
				me._$morelink.attr( 'aria-role', 'button' );
				title = $( '<span>' + title + '</span>' );
				me._$morelink.append( title );
			}
		},

		_create: function() {
			var me = this;

			me._$moreless = $( this.element );
			me._$morelink = $( '<div class="vui-moreless-link" tabindex="0">' );
			me._$moreless.after(  me._$morelink );

			me.options.title.more = me._$moreless.attr( 'data-moreless-moretitle' ) !== undefined ? me._$moreless.attr( 'data-moreless-moretitle' ) : me.options.title.more;
			me.options.title.less = me._$moreless.attr( 'data-moreless-lesstitle' ) !== undefined ? me._$moreless.attr( 'data-moreless-lesstitle' ) : me.options.title.less;
			me.options.accessible = me._$moreless.attr( 'data-moreless-accessible' ) !== undefined && me._$moreless.attr( 'data-moreless-accessible' ) !== "False"? true : false;
			me.options.color = me._$moreless.attr( 'data-moreless-blurcolor' ) !== undefined ? me._$moreless.attr( 'data-moreless-blurcolor' ) : me.options.color;

			var lineHeight =  me._$moreless.attr( 'data-moreless-lineHeight' ) !== undefined ? me._$moreless.attr( 'data-moreless-lineHeight' ) : me.options.lineHeight;
			me._$moreless.css( 'line-height', lineHeight );

			var $breakafter =  me._$moreless.find( '.vui-moreless-breakafter' );
			var height = 0;

			if( $breakafter.length ) {
				$breakafter = $( $breakafter[0] );
				//determine hieght based on bottom on node with breakafter class
				height = ( $breakafter.position().top - me._$moreless.position().top ) + $breakafter.get( 0 ).scrollHeight;

			} else {
				height = me._$moreless.attr( 'data-moreless-height' ) !== undefined ? me._$moreless.attr( 'data-moreless-height' ) : me.options.height;

				if( height.indexOf( '%' ) > -1 ) { //convert percent to px to prevent loss of transition
					height = parseInt( ( me._$moreless.get( 0 ).scrollHeight * ( parseInt( height, 10 ) / 100 ) ) + 0.5, 10 );
				}

				me._$moreblur = $( '<div class="vui-moreless-blur">');
				me.BlurColor( me.options.color );
				me._$moreless.after( me._$moreblur );
			}

			me._$moreless.height( height );

			me._accessibileButton( me.options.title.more, 'vui-icon-moreless-chevron-down' );

			me._$morelink.on( 'click', function( e ) {
				me._switchMoreLess( height );
			} );

			me._$morelink.on( 'keypress', function( e ) {
				var keyCode = e.keyCode || e.which;

				if( keyCode === 13 ) {
					me._switchMoreLess( height );
				}
			} );

			var isTab = false;
			var isShift = false;

			$( document ).keydown( function( e ) {
				var keyCode = e.keyCode || e.which;

				isTab = keyCode === 9;
				isShift = e.shiftKey;
			} );

			me._$moreless.focusin( function( event ) {
				if( ! me._$moreless.hasClass( 'vui-moreless-more' ) && isTab ) {
				    me._$moreless.get(0).scrollTop = 0;

				    if (isShift) {
				        $( ':tabbable' ).eq( parseInt( $( ':tabbable' ).index( $( event.target ) ), 10 ) - 1 ).focus();
				        isShift = false;
				    } else {
				        me._$morelink.focus();
				    }

				    isTab = false;
				}
			});

			var moreLessHeight = parseInt(height, 10);
			me._startPolling(125, moreLessHeight);
		},

		_hexToRgb: function( inHex) {
			if( inHex.indexOf('#') > -1 ) {
				inHex = inHex.substring(1);
			}
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			if (inHex.length === 3) {
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				inHex = inHex.replace(shorthandRegex, function (m, r, g, b) {
					return r + r + g + g + b + b;
				} );
			}

			var bigint = parseInt( inHex, 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;

			return {
				red: r,
				green: g,
				blue: b
			};
		},

		_startPolling: function (timeout, morelessHeight) {
			var me = this;

			me._fixMoreLess(morelessHeight);

			me.pollingVariable = setTimeout(
				function() {
					me._startPolling(
						timeout < 10000 ? timeout * 2 : timeout,
						morelessHeight
					);
				},
				timeout
			);
		},

		_fixMoreLess: function (morelessHeight) {
			var me = this;

			if (me._$moreless.hasClass('vui-moreless-more')) {
				return;
			}

			me._hideShowMore(morelessHeight);
			me._showShowMore(morelessHeight);
		},

		_hideShowMore: function (morelessHeight) {
			var me = this;

			var scrollHeight = me._$moreless.get(0).scrollHeight;
			var childrenHeight = me._$moreless.children().height();

			// we use the children's height instead of the scroll height because on page load,
			// the scroll height will be equal to the moreless height if the control is present
			// if they are equal then the control will stay in its same state, not changing anything
			// therefore we calculate the childrens height and use that the first time
			// we can't use the children's height everytime because it messes up when we use break after

			var h = scrollHeight == morelessHeight ? childrenHeight : scrollHeight;

			if (me._$moreless &&
				h < morelessHeight) {

				me._$moreless.height( h );
				me._$morelink.css( 'display', 'none' );

				if( me._$moreblur ) {
					me._$moreblur.css( 'display', 'none' );
				}
			} else if (me._$moreless &&
				h != me._$moreless.height()) {

				me._$moreless.height(h);
			}
		},

		_showShowMore: function(morelessHeight) {
			var me = this;

			var scrollHeight = me._$moreless.get(0).scrollHeight;
			var childrenHeight = me._$moreless.children().height();

			var h = scrollHeight == morelessHeight ? childrenHeight : scrollHeight;


			if (me._$moreless &&
				h >= morelessHeight) {

				me._$moreless.height(morelessHeight);
				me._$morelink.css( 'display', 'inherit' );

				if( me._$moreblur ) {
					me._$moreblur.css( 'display', 'inherit' );
				}
			}
		},


		_switchMoreLess: function( inHeight ) {
			var me = this;

			if (!me._$moreless.hasClass('vui-moreless-transition-effect')) {
				me._$moreless.addClass('vui-moreless-transition-effect');
			}

			if( me._$moreless.hasClass( 'vui-moreless-more' ) ) {
				me._$moreless.removeClass( 'vui-moreless-more' );
				if( me._$moreblur ) {
					me._$moreblur.css( 'display', 'block' );
				}
				me._$moreless.css( 'height', inHeight );
				me._accessibileButton(  me.options.title.more, 'vui-icon-moreless-chevron-down' );
				me._$moreless.trigger( 'vui-moreless-collapse' );
			} else {
				me._$moreless.addClass( 'vui-moreless-more' );
				if( me._$moreblur ) {
					me._$moreblur.css( 'display', 'none' );
				}
				me._$moreless.css( 'height',  me._$moreless.get( 0 ).scrollHeight );
				me._accessibileButton( this.options.title.less, 'vui-icon-moreless-chevron-up' );
				me._$moreless.trigger( 'vui-moreless-expand' );
			}
		},

		_destroy: function () {
			var me = this;
			if (me.pollingVariable !== null) {
				clearInterval(me.pollingVariable);
			}

			me.pollingVariable = false;
		},

		BlurColor: function( inColor ) {
			var me = this;
			if( me._$moreblur !== null ) {
				var rgba0 = 'rgba( 250, 250, 250, 0)';
				var rgba1 = 'rgba( 250, 250, 250, 1)';

				if( inColor.indexOf( '#' ) > -1 ) {
					var rgb = me._hexToRgb( inColor );
					rgba0 = 'rgba(' + rgb.red + ',' + rgb.green + ',' + rgb.blue + ', 0)';
					rgba1 = 'rgba(' + rgb.red + ',' + rgb.green + ',' + rgb.blue + ', 1)';
				}
				var moz = '-moz-linear-gradient(top, ' + rgba0 + ' 0%, '+ rgba1 + ' 100%)';
				var webkit1 = '-webkit-gradient(linear, left top, left bottom, color-stop(0%, ' + rgba0 + '), color-stop(100%, '+ rgba1 + '))'; /* Chrome,Safari4+ */
				var webkit2 = '-webkit-linear-gradient(top, ' + rgba0 + ' 0%, ' + rgba1 + '100%)'; /* Chrome10+,Safari5.1+ */
				var o = '-o-linear-gradient(top, ' + rgba0 + ' 0%, ' + rgba1 + ' 100%)'; /* Opera 11.10+ */
				var ms = '-ms-linear-gradient(top, ' + rgba0 + ' 0%, '+ rgba1 + ' 100%)';/* IE10+ */
				var general = 'linear-gradient(to bottom, ' + rgba0 + ' 0%, ' + rgba1 + ' 100%)';/* W3C */

				me._$moreblur.css( { 'background': 'transparent' } )
					.css( { 'background': moz } )
					.css( { 'background': webkit1 } )
					.css( { 'background': webkit2 } )
					.css( { 'background': o } )
					.css( { 'background': ms } )
					.css( { 'background': general } );
			}
		},

		isExpanded: function( node ) {
			return $( node ).hasClass( 'vui-moreless-more' );
		},

		Refresh: function( inColor ){
			if( inColor !== null ) {
				this.BlurColor( inColor );
			}
			this._fixMoreLess();
		}

	} );

} )();
