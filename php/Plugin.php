<?php

declare(strict_types=1);

namespace ModernFlash;

use ModernFlash\Admin\SettingsController;

/**
 * Main plugin orchestrator for Modern Flash WordPress runtime.
 */
final class Plugin
{
    private static ?self $instance = null;

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct()
    {
        $this->init();
    }

    private function init(): void
    {
        Shortcode::register();
        SettingsController::register();

        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        add_action('admin_notices', [$this, 'checkBundleNotice']);
    }

    /**
     * Enqueues the pre-compiled standalone Flash runtime bundle.
     */
    public function enqueueFrontendAssets(): void
    {
        $bundlePath = MODERN_FLASH_DIR . 'dist/flash-bundle.min.js';
        $bundleUrl = MODERN_FLASH_URL . 'dist/flash-bundle.min.js';

        if (file_exists($bundlePath)) {
            $version = (string) filemtime($bundlePath);
            wp_enqueue_script(
                'modern-flash-runtime',
                $bundleUrl,
                [],
                $version,
                [
                    'in_footer' => true,
                    'strategy'  => 'defer',
                ]
            );

            // Base stage container styling
            $stylePath = MODERN_FLASH_DIR . 'dist/style.css';
            if (file_exists($stylePath)) {
                wp_enqueue_style(
                    'modern-flash-styles',
                    MODERN_FLASH_URL . 'dist/style.css',
                    [],
                    (string) filemtime($stylePath)
                );
            } else {
                wp_register_style('modern-flash-fallback', false);
                wp_enqueue_style('modern-flash-fallback');
                wp_add_inline_style(
                    'modern-flash-fallback',
                    '.mwp-flash-stage { position: relative; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }'
                );
            }
        }
    }

    /**
     * Warns administrators if the JavaScript bundle has not yet been compiled.
     */
    public function checkBundleNotice(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $bundlePath = MODERN_FLASH_DIR . 'dist/flash-bundle.min.js';
        if (!file_exists($bundlePath)) {
            echo '<div class="notice notice-warning is-dismissible">';
            echo '<p><strong>Modern Flash:</strong> JavaScript runtime bundle <code>dist/flash-bundle.min.js</code> was not found. ';
            echo 'Run <code>pnpm run build:bundle</code> to compile the frontend vector runtime.</p>';
            echo '</div>';
        }
    }
}
