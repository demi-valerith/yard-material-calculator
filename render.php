<?php
/**
 * Server-side block render callback.
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Renderer escapes every dynamic attribute.
echo ymc_render_calculator( $attributes );
