( function( $ ) {

	$.widget( "vui.vui_moreLess", {



		_create: function() {

		},

		_destroy: function() {

		}

	} );

	vui.addClassInitializer(
			'vui-moreLess',
			function( node ) {
				$( node ).vui_moreLess();
			}
		);

} )( window.jQuery );