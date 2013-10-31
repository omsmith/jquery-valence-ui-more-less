( function( $ ) {

	$.widget( "vui.vui_moreless", {

		options: {
			height: '4em',
			lineHeight: 'normal',
			title: {
				more: "more",
				less: "less"
			}
		},

		_create: function() {
			var me = this;
			var $moreblur = null;
			var $moreless = $( this.element );
			var $morelink = $( '<div class="vui-moreless-link vui-link" tabindex="0">' );

			$moreless.after( $morelink );

			me.options.title.more = $moreless.attr( 'data-moreless-moretitle' ) !== undefined ? $moreless.attr( 'data-moreless-moretitle' ) : this.options.title.more;
			me.options.title.less = $moreless.attr( 'data-moreless-lesstitle' ) !== undefined ? $moreless.attr( 'data-moreless-lesstitle' ) : this.options.title.less;
			me.options.accessible = $moreless.attr( 'data-moreless-accessible' ) !== undefined && $moreless.attr( 'data-moreless-accessible' ) !== "False"? true : false;

			var lineHeight = $moreless.attr( 'data-moreless-lineHeight' ) !== undefined ? $moreless.attr( 'data-moreless-lineHeight' ) : this.options.lineHeight;
			$moreless.css( 'line-height', lineHeight );

			$breakafter = $moreless.find( '.vui-moreless-breakafter' );
			var height = 0;

			if( $breakafter.length ) {
				$breakafter = $( $breakafter[0] );
				//determine hieght based on bottom on node with breakafter class
				height = ( $breakafter.position().top - $moreless.position().top ) + $breakafter.get( 0 ).scrollHeight;

			} else {
				height = $moreless.attr( 'data-moreless-height' ) !== undefined ? $moreless.attr( 'data-moreless-height' ) : this.options.height;

				if( height.indexOf( '%' ) > -1 ) { //convert percent to px to prevent loss of transition
					height = parseInt( ( $moreless.get( 0 ).scrollHeight * ( parseInt( height, 10 ) / 100 ) ) + 0.5, 10 );
				}

				$moreblur = $( '<div class="vui-moreless-blur">');
				$moreless.after( $moreblur );
			}

			$moreless.height( height );

			me._accessibileButton( me.options.title.more, $morelink, 'vui-icon-cheverondownblue' );

			$morelink.on( 'click', function( e ) {
				me._switchMoreLess( $moreless, height, $morelink, $moreblur );
			} );

			$morelink.on( 'keypress', function( e ) {
				var keyCode = e.keyCode || e.which;

				if( keyCode === 13 ) {
					me._switchMoreLess( $moreless, height, $morelink, $moreblur );
				}
			} );

			var  hideShowMore = function() {
				if( $moreless.height() >= $moreless.get( 0 ).scrollHeight ) {
					$morelink.css( 'display', 'none' );
					if( $moreblur ) {
						$moreblur.css( 'display', 'none' );
					}
				}
			};

			var isTab = false;

			hideShowMore();
			$moreless.ready( hideShowMore );

			$( document ).keydown( function( e ) {
				var keyCode = e.keyCode || e.which;

				if( keyCode === 9 ) {
					isTab = true;
				} else {
					isTab = false;
				}
			} );

			$moreless.focusin( function( event ) {
				if( !$moreless.hasClass( 'vui-moreless-more' ) && isTab ) {
					$moreless.get( 0 ).scrollTop = 0;
					$morelink.focus();
					isTab = false;
				}
			} );
		},

		_switchMoreLess: function( $moreless, inHeight, $morelink, $moreblur ) {
			if( $moreless.hasClass( 'vui-moreless-more' ) ) {
				$moreless.removeClass( 'vui-moreless-more' );
				if( $moreblur ) {
					$moreblur.css( 'display', 'block' );
				}
				$moreless.css( 'height', inHeight );
				this._accessibileButton( this.options.title.more, $morelink, 'vui-icon-cheverondownblue' );

			} else {
				$moreless.addClass( 'vui-moreless-more' );
				if( $moreblur ) {
					$moreblur.css( 'display', 'none' );
				}
				$moreless.css( 'height', $moreless.get( 0 ).scrollHeight );
				this._accessibileButton( this.options.title.less, $morelink, 'vui-icon-cheveronupblue' );
			}
		},

		_accessibileButton: function( title, $morelink, iconClass ) {

			$morelink.empty();
			$morelink.append( '<span class="' + iconClass + '">' );
			if( !this.options.accessible ) {
				$morelink.attr( 'aria-hidden', 'true' );
				$morelink.append( title );
			} else {
				$morelink.attr( 'aria-role', 'button' );
				title = $( '<span>' + title + '</span>' );
				$morelink.append( title );
			}
		}
	} );

	vui.addClassInitializer(
		'vui-moreless',
		function( node ) {
			$( node ).vui_moreless();
		}
	);

} )( window.jQuery );