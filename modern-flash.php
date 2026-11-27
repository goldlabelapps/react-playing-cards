<?php
/**
 * Plugin Name:       Modern Flash
 * Plugin URI:        https://github.com/goldlabelapps/modern-flash
 * Description:       SVG-based Flash vector animation engine, ActionScript runtime, and prompt-driven animation studio for React and WordPress.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.1
 * Author:            Goldlabel°
 * Author URI:        https://github.com/goldlabelapps
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       modern-flash
 * Domain Path:       /languages
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

// Runtime constants
define('MODERN_FLASH_VERSION', '1.0.0');
define('MODERN_FLASH_FILE', __FILE__);
define('MODERN_FLASH_DIR', plugin_dir_path(__FILE__));
define('MODERN_FLASH_URL', plugin_dir_url(__FILE__));

// Autoloader: Composer vendor autoload with fallback to internal PSR-4 loader
if (file_exists(MODERN_FLASH_DIR . 'vendor/autoload.php')) {
    require_once MODERN_FLASH_DIR . 'vendor/autoload.php';
} else {
    spl_autoload_register(static function (string $class): void {
        $prefix = 'ModernFlash\\';
        $baseDir = MODERN_FLASH_DIR . 'php/';

        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            return;
        }

        $relativeClass = substr($class, $len);
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require_once $file;
        }
    });
}

// Initialise plugin lifecycle
add_action('plugins_loaded', static function (): void {
    if (class_exists('ModernFlash\\Plugin')) {
        \ModernFlash\Plugin::instance();
    }
});
