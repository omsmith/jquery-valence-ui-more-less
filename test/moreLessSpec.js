( function() {
	'use strict';

	describe( 'vui.moreLess', function() {

		var node, $container1;

		beforeEach( function () {

			jasmine.addMatchers( d2l.jasmine.matchers );

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

	} );

} )();
