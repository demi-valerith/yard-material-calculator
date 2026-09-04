<?php
/**
 * Plugin Name: Demi Yard Material Calculator
 * Description: Add an imperial or metric yard material coverage calculator with a block or shortcode.
 * Version: 1.0.2
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * Author: Demi Valerith
 * Author URI: https://profiles.wordpress.org/demi1/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: demi-yard-material-calculator
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const YMC_VERSION = '1.0.2';

/**
 * Register the dynamic block and locally bundled Web Component.
 */
function ymc_register_assets() {
	wp_register_script_module(
		'yard-material-calculator-widget',
		plugins_url( 'assets/widget.js', __FILE__ ),
		array(),
		YMC_VERSION
	);

	register_block_type( __DIR__ );
}
add_action( 'init', 'ymc_register_assets' );

/**
 * Normalize one calculator configuration before rendering.
 *
 * @param array<string, mixed> $attributes Raw block or shortcode attributes.
 * @return array<string, mixed>
 */
function ymc_normalize_attributes( $attributes ) {
	$defaults = array(
		'material'        => 'Pea gravel',
		'materials'       => 'Pea gravel,Crushed stone,River rock,Topsoil,Compost,Mulch,Sand,Fill dirt',
		'area'            => 500,
		'depth'           => 3,
		'unit'            => 'imperial',
		'accent'          => '#ab4c29',
		'showAttribution' => false,
	);
	$config   = wp_parse_args( is_array( $attributes ) ? $attributes : array(), $defaults );
	$allowed  = array(
		'pea gravel'   => 'Pea gravel',
		'crushed stone' => 'Crushed stone',
		'river rock'   => 'River rock',
		'topsoil'      => 'Topsoil',
		'compost'      => 'Compost',
		'mulch'        => 'Mulch',
		'sand'         => 'Sand',
		'fill dirt'    => 'Fill dirt',
	);

	$materials = array();
	foreach ( explode( ',', (string) $config['materials'] ) as $candidate ) {
		$key = strtolower( trim( str_replace( '-', ' ', sanitize_text_field( $candidate ) ) ) );
		if ( isset( $allowed[ $key ] ) ) {
			$materials[] = $allowed[ $key ];
		}
	}
	$materials = array_values( array_unique( $materials ) );
	if ( empty( $materials ) ) {
		$materials = array_values( $allowed );
	}

	$material_key = strtolower( trim( str_replace( '-', ' ', sanitize_text_field( $config['material'] ) ) ) );
	$material     = isset( $allowed[ $material_key ] ) && in_array( $allowed[ $material_key ], $materials, true )
		? $allowed[ $material_key ]
		: $materials[0];
	$unit         = 'metric' === strtolower( sanitize_text_field( $config['unit'] ) ) ? 'metric' : 'imperial';
	$area         = min( 1000000, max( 0.01, (float) $config['area'] ) );
	$depth        = min( 10000, max( 0.01, (float) $config['depth'] ) );
	$accent       = sanitize_hex_color( $config['accent'] );
	$accent       = $accent ? $accent : '#ab4c29';
	$attribution  = filter_var( $config['showAttribution'], FILTER_VALIDATE_BOOLEAN );

	return array(
		'material'        => $material,
		'materials'       => implode( ',', $materials ),
		'area'            => $area,
		'depth'           => $depth,
		'unit'            => $unit,
		'accent'          => $accent,
		'showAttribution' => $attribution,
	);
}

/**
 * Render a calculator block or shortcode.
 *
 * @param array<string, mixed> $attributes Raw block or shortcode attributes.
 * @return string
 */
function ymc_render_calculator( $attributes ) {
	$config = ymc_normalize_attributes( $attributes );
	wp_enqueue_script_module( 'yard-material-calculator-widget' );

	return sprintf(
		'<yard-material-coverage material="%1$s" materials="%2$s" area="%3$s" depth="%4$s" unit="%5$s" accent="%6$s" attribution="%7$s" utm-source="wordpress" utm-campaign="coverage_widget"></yard-material-coverage>',
		esc_attr( $config['material'] ),
		esc_attr( $config['materials'] ),
		esc_attr( $config['area'] ),
		esc_attr( $config['depth'] ),
		esc_attr( $config['unit'] ),
		esc_attr( $config['accent'] ),
		$config['showAttribution'] ? 'visible' : 'hidden'
	);
}

/**
 * Render [yard_material_calculator].
 *
 * @param array<string, mixed> $attributes Shortcode attributes.
 * @return string
 */
function ymc_shortcode( $attributes ) {
	$attributes = shortcode_atts(
		array(
			'material'    => 'Pea gravel',
			'materials'   => 'Pea gravel,Crushed stone,River rock,Topsoil,Compost,Mulch,Sand,Fill dirt',
			'area'        => '500',
			'depth'       => '3',
			'unit'        => 'imperial',
			'accent'      => '#ab4c29',
			'attribution' => 'false',
		),
		(array) $attributes,
		'yard_material_calculator'
	);

	$attributes['showAttribution'] = $attributes['attribution'];
	unset( $attributes['attribution'] );

	return ymc_render_calculator( $attributes );
}
add_shortcode( 'yard_material_calculator', 'ymc_shortcode' );
