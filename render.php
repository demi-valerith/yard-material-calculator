<?php
/**
 * Server-side block render callback.
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

return ymc_render_calculator( $attributes );
