( function( $ ) {

	$.widget( "vui.vui_moreless", {
		
		options: {
			height: '4em',
			lineHeight: 'normal',
			title: {
				more: "More",
				less: "Less"
			}
		},

		_create: function() {
			var me = this;
			
			var $moreless = $( this.element );
			var $morelink = $( '<div>' );
			$moreless.after( $morelink );

			var $moreblur = $( '<div class="vui-moreless-blur">');
			$moreless.after( $moreblur );
			
			this.options.title.more = $moreless.attr( 'data-moreless-moretitle' ) !== undefined ? $moreless.attr( 'data-moreless-moretitle' ) : this.options.title.more; 
			this.options.title.less = $moreless.attr( 'data-moreless-lesstitle' ) !== undefined ? $moreless.attr( 'data-moreless-lesstitle' ) : this.options.title.less; 
			this.options.accessible = $moreless.attr( 'data-moreless-accessible' ) !== undefined ? true : false;

			$morelink.addClass( 'vui-moreless-link' );
			$morelink.addClass( 'vui-link' );

			var lineHeight = $moreless.attr( 'data-moreless-lineHeight' ) !== undefined ? $moreless.attr( 'data-moreless-lineHeight' ) : this.options.lineHeight;
			$moreless.css( 'line-height', lineHeight );
	
			$breakafter = $moreless.find( '.vui-moreless-breakafter' );
			var height = 0;

			if( $breakafter.length ) {
				$breakafter = $( $breakafter[0] );
				height = ( $breakafter.position().top - $moreless.position().top ) + $breakafter.get(0).scrollHeight;
			} else {
				height = $moreless.attr( 'data-moreless-height' ) !== undefined ? $moreless.attr( 'data-moreless-height' ) : this.options.height; 

				if( height.indexOf( '%' ) > -1 ) { //convert percent to px to prevent loss of transition
					height = parseInt( ( $moreless.get( 0 ).scrollHeight * ( parseInt( height, 10 ) / 100 ) ) + 0.5, 10 );
				}
			}

			$moreless.height( height );
			
			if( !parseInt( height, 10 ) ) { // if height 0 force accessibility. 
				this.options.accessible = true; 
			}
			
			this._accessibileButton( this.options.title.more, $morelink );

			$morelink.on( 'click', function( e ) {
				me._switchMoreLess( $moreless, height, $morelink, $moreblur );
			} );

			if( $moreless.height() >= $moreless.get( 0 ).scrollHeight ) {
				$morelink.css( 'display', 'none' );
				$moreblur.css( 'display', 'none' );
			} else {
				$moreless.addClass( 'gradient-vertical' );
			}

		},

		_switchMoreLess: function( $moreless, inHeight, $morelink, $moreblur ) {
			if( $moreless.hasClass( 'vui-moreless-more' ) ) {
				$moreless.removeClass( 'vui-moreless-more' );
				$moreless.addClass( 'gradient-vertical' );
				$moreblur.css( 'display', 'block' );
				$moreless.css( 'height', inHeight );
				this._accessibileButton( this.options.title.more, $morelink );
			} else {
				$moreless.addClass( 'vui-moreless-more' );
				$moreless.removeClass( 'gradient-vertical' );
				$moreblur.css( 'display', 'none' );
				$moreless.css( 'height', $moreless.get( 0 ).scrollHeight );
				this._accessibileButton( this.options.title.less, $morelink );
			}
		},

		_accessibileButton: function( title, $morelink ) {

			$morelink.empty();

			if( !this.options.accessible ) {
				$morelink.attr( 'aria-hidden', 'true' );
				$morelink.text( title );
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