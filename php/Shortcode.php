<?php

declare(strict_types=1);

namespace ModernFlash;

/**
 * Shortcode handler for rendering Flash stages in content and templates.
 */
final class Shortcode
{
    public static function register(): void
    {
        add_shortcode('modern_flash', [self::class, 'render']);
        add_shortcode('mwp_flash', [self::class, 'render']);
    }

    /**
     * Renders declarative stage markup discovered and mounted by window.mwpFlash.autoMount().
     *
     * @param array<string, mixed>|string $atts
     */
    public static function render(array|string $atts = []): string
    {
        $attributes = shortcode_atts(
            [
                'prompt'   => '',
                'movie'    => 'FlashStory',
                'color'    => 'transparent',
                'loop'     => 'true',
                'autoplay' => 'true',
                'speed'    => '1',
                'width'    => '100%',
                'height'   => '360px',
                'class'    => '',
            ],
            is_array($atts) ? $atts : [],
            'modern_flash'
        );

        $prompt = esc_attr(trim((string) $attributes['prompt']));
        $movie = esc_attr(trim((string) $attributes['movie']));
        $color = esc_attr(trim((string) $attributes['color']));
        $loop = ($attributes['loop'] === 'false') ? 'false' : 'true';
        $autoplay = ($attributes['autoplay'] === 'false') ? 'false' : 'true';
        $speed = esc_attr((string) floatval($attributes['speed']));
        $width = esc_attr(trim((string) $attributes['width']));
        $height = esc_attr(trim((string) $attributes['height']));
        $customClass = esc_attr(trim((string) $attributes['class']));

        $classes = 'mwp-flash-stage' . ($customClass !== '' ? ' ' . $customClass : '');

        return sprintf(
            '<div class="%s" data-flash-stage="true" data-movie="%s" data-prompt="%s" data-color="%s" data-loop="%s" data-autoplay="%s" data-speed="%s" style="width:%s;min-height:%s;position:relative;"></div>',
            $classes,
            $movie,
            $prompt,
            $color,
            $loop,
            $autoplay,
            $speed,
            $width,
            $height
        );
    }
}
