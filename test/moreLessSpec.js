( function() {
	'use strict';

    // We need it to correct checking of focus of the elements
    // Solution and this bug on phantomjs described here https://code.google.com/p/phantomjs/issues/detail?id=427
	var _jQuery_is = jQuery.fn.is;
	jQuery.fn.is = function ( s ) {
	    if ( s === ':focus' ) {
	        return this.get( 0 ) === document.activeElement;
	    }
	    return _jQuery_is.apply( this, arguments );
	};

	describe( 'vui.moreLess', function() {

		var node, $container1;

		var createKeyEvent = function( eventType, keyCode ) {
			var e = $.Event( eventType );
			e.keyCode = keyCode;
			return e;
		};

		beforeEach( function () {

			jasmine.addMatchers( vui.jasmine.dom.matchers );

			node = document.body.appendChild( document.createElement( 'div' ) );

			$container1 = $( "<div class='vui-moreless'><p>some content</p></div>" )
				.appendTo( node );

		} );

		afterEach( function() {
			document.body.removeChild( node );
		} );

		describe( 'create', function() {

			it( 'binds the more-less container element using widget method', function() {
				$container1.vui_moreless();
				expect( $container1.data( 'vui-vui_moreless' ) ).toBeDefined();
			} );

			it( 'constructs a link that the user can click to toggle the state of more/less widget', function() {
				$container1.vui_moreless();
				expect( $( '.vui-moreless-link' ).length ).toBe( 1 );
			} );

			it( 'applies custom more title to more link if specified', function() {
				$container1.attr( 'data-moreless-moretitle', '+More' );
				$container1.vui_moreless();
				expect( $( '.vui-moreless-link' )[0].innerText ).toBe( '+More' );
			} );

		} );

		describe( 'destroy', function() {

			beforeEach( function () {
				$container1.vui_moreless();
			} );

			it( 'unbinds container from widget when destroy is called', function() {
				$container1.vui_moreless( 'destroy' );
				expect( $container1.data( 'vui-vui_moreless' ) )
					.not.toBeDefined();
			} );

		} );

		describe( 'show/hide more', function() {

			beforeEach( function () {
				$container1.attr( 'data-moreless-moretitle', '+More' );
				$container1.attr( 'data-moreless-lesstitle', '-Less' );
				$container1.vui_moreless();
			} );

			it( 'sets the link text when link is clicked to expand', function() {
				$( '.vui-moreless-link' ).click();
				expect( $( '.vui-moreless-link' )[0].innerText ).toBe( '-Less' );
			} );

			it( 'triggers the vui-moreless-expand event when clicking to show more content', function( done ) {
				$container1.on( 'vui-moreless-expand', function() {
					done();
				} );
				$( '.vui-moreless-link' ).click();
			} );

			it( 'triggers the vui-moreless-expand event [enter] key has been pressed to show more', function( done ) {
				$container1.on( 'vui-moreless-expand', function() {
					done();
				} );
				$( '.vui-moreless-link' ).focus();
				$( '.vui-moreless-link' ).trigger( createKeyEvent( 'keypress', 13 ) );
			} );

			it( 'sets the link text when link is clicked to collapse', function() {
				$( '.vui-moreless-link' ).click();
				$( '.vui-moreless-link' ).click();
				expect( $( '.vui-moreless-link' )[0].innerText ).toBe( '+More' );
			} );

			it( 'triggers the vui-moreless-expand event when clicking to show more content', function( done ) {
				$container1.on( 'vui-moreless-collapse', function() {
					done();
				} );
				$( '.vui-moreless-link' ).click();
				$( '.vui-moreless-link' ).click();
			} );

			it( 'triggers the vui-moreless-expand event [enter] key has been pressed to show more', function( done ) {
				$container1.on( 'vui-moreless-collapse', function() {
					done();
				} );
				$( '.vui-moreless-link' ).focus();
				$( '.vui-moreless-link' ).trigger( createKeyEvent( 'keypress', 13 ) );
				$( '.vui-moreless-link' ).trigger( createKeyEvent( 'keypress', 13 ) );
			} );

		} );

		describe( 'isExpanded', function() {

			beforeEach( function () {
				$container1.vui_moreless();
			} );

			it( 'returns false when less content is displayed', function() {
				expect( $container1.vui_moreless( 'isExpanded', $container1.get( 0 ) ) ).toBeFalsy();
			} );

			it( 'returns true when more content is displayed', function() {
				$( '.vui-moreless-link' ).click();
				expect( $container1.vui_moreless( 'isExpanded', $container1.get( 0 ) ) ).toBeTruthy();
			} );

			it( 'returns false when less content is displayed', function() {
				$( '.vui-moreless-link' ).click();
				$( '.vui-moreless-link' ).click();
				expect( $container1.vui_moreless( 'isExpanded', $container1.get( 0 ) ) ).toBeFalsy();
			} );

		} );

		describe( 'checking focus behaviour', function () {

		    beforeEach( function () {

		        $( '<a id="outerLink" href="http://focusable.com" >focusable element</a>' ).appendTo( '#outerContainer' );
		        $( '<a id="contentLink" href="http://focusable.com" >focusable element</a>' ).appendTo( '#contentContainer' );

		        $container1.vui_moreless();
		    });

		    it( 'pressing "Tab" while control is collapsed (focus should be on ".vui-moreless-link" link)', function () {

		        $( '#outerLink' ).focus();
		        $( document ).trigger( createKeyEvent( 'keydown', 9, false ) );
		        $( '#contentLink' ).focus();

		        expect( $( '.vui-moreless-link' ).is( ":focus" ) ).toBeTruthy();
		    });

		    it( 'pressing "Tab" while control is expanded (focus should be on "#contentLink" link)', function () {

		        $( '.vui-moreless-link' ).click();

		        $( '#outerLink' ).focus();
		        $( document ).trigger( createKeyEvent( 'keydown', 9, false ) );
		        $( '#contentLink' ).focus();

		        expect( $( '#contentLink' ).is( ":focus" ) ).toBeTruthy();
		    });

		    it( 'pressing "Shift + Tab" while control is collapsed (focus should be on "#outerLink" link)', function () {

		        $( '.vui-moreless-link' ).focus();
		        $( document ).trigger( createKeyEvent( 'keydown', 9, true ) );
		        $( '#contentLink' ).focus();

		        expect( $( '#outerLink' ).is( ":focus" ) ).toBeTruthy();
		    });

		    it('pressing "Shift + Tab" while control is expanded (focus should be on "#contentLink" link)', function () {

		        $( '.vui-moreless-link' ).click();

		        $( '.vui-moreless-link' ).focus();
		        $( document ).trigger( createKeyEvent( 'keydown', 9, true ) );
		        $( '#contentLink' ).focus();

		        expect( $( '#contentLink' ).is( ":focus" ) ).toBeTruthy();
		    });
		});

	} );

} )();
