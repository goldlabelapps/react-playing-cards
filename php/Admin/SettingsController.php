<?php

declare(strict_types=1);

namespace ModernFlash\Admin;

/**
 * Admin settings controller implementing canonical Modern WordPress two-column design.
 */
final class SettingsController
{
    public const PARENT_PAGE_SLUG = 'modern-wordpress-settings';
    public const PAGE_SLUG = 'modern-flash-settings';
    public const OPTION_GROUP = 'modern_flash_options';
    public const OPTION_NAME = 'modern_flash_settings';

    public static function register(): void
    {
        $controller = new self();

        add_action('admin_menu', [$controller, 'registerMenu']);
        add_action('admin_init', [$controller, 'registerSettings']);
        add_filter('plugin_action_links_' . plugin_basename(MODERN_FLASH_FILE), [$controller, 'addSettingsLink']);
    }

    /**
     * Binds direct Settings link to the plugin card on wp-admin/plugins.php.
     *
     * @param array<string, string> $links
     * @return array<string, string>
     */
    public function addSettingsLink(array $links): array
    {
        $settingsUrl = admin_url('options-general.php?page=' . self::PAGE_SLUG);
        $settingsLink = sprintf(
            '<a href="%s">%s</a>',
            esc_url($settingsUrl),
            esc_html__('Settings', 'modern-flash')
        );

        array_unshift($links, $settingsLink);
        return $links;
    }

    /**
     * Registers settings menu item under Modern WordPress parent if present, falling back to Settings menu.
     */
    public function registerMenu(): void
    {
        global $submenu;

        $parentSlug = isset($submenu[self::PARENT_PAGE_SLUG]) ? self::PARENT_PAGE_SLUG : 'options-general.php';

        add_submenu_page(
            $parentSlug,
            __('Modern Flash Settings', 'modern-flash'),
            __('Modern Flash', 'modern-flash'),
            'manage_options',
            self::PAGE_SLUG,
            [$this, 'renderPage']
        );
    }

    public function registerSettings(): void
    {
        register_setting(self::OPTION_GROUP, self::OPTION_NAME, [
            'type'              => 'array',
            'sanitize_callback' => [$this, 'sanitizeSettings'],
            'default'           => [
                'default_speed' => '1.0',
                'auto_mount'    => '1',
            ],
        ]);

        add_settings_section(
            'modern_flash_main_section',
            __('Runtime Engine Configuration', 'modern-flash'),
            static function (): void {
                echo '<p>' . esc_html__('Configure defaults for vector stage embedding and ActionScript execution.', 'modern-flash') . '</p>';
            },
            self::PAGE_SLUG
        );

        add_settings_field(
            'default_speed',
            __('Default Playback Speed', 'modern-flash'),
            [$this, 'renderSpeedField'],
            self::PAGE_SLUG,
            'modern_flash_main_section'
        );

        add_settings_field(
            'auto_mount',
            __('Automatic Stage Discovery', 'modern-flash'),
            [$this, 'renderAutoMountField'],
            self::PAGE_SLUG,
            'modern_flash_main_section'
        );
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function sanitizeSettings(array $input): array
    {
        $output = [];
        $output['default_speed'] = isset($input['default_speed']) ? (string) floatval($input['default_speed']) : '1.0';
        $output['auto_mount'] = !empty($input['auto_mount']) ? '1' : '0';

        return $output;
    }

    public function renderSpeedField(): void
    {
        $options = get_option(self::OPTION_NAME, ['default_speed' => '1.0']);
        $speed = esc_attr($options['default_speed'] ?? '1.0');

        printf(
            '<input type="number" step="0.1" min="0.1" max="5.0" name="%s[default_speed]" value="%s" class="regular-text" />',
            esc_attr(self::OPTION_NAME),
            $speed
        );
        echo '<p class="description">' . esc_html__('Playback multiplier for ActionScript choreographies (e.g. 1.0 = normal, 1.5 = faster).', 'modern-flash') . '</p>';
    }

    public function renderAutoMountField(): void
    {
        $options = get_option(self::OPTION_NAME, ['auto_mount' => '1']);
        $checked = !empty($options['auto_mount']) ? 'checked' : '';

        printf(
            '<label><input type="checkbox" name="%s[auto_mount]" value="1" %s /> %s</label>',
            esc_attr(self::OPTION_NAME),
            $checked,
            esc_html__('Automatically scan DOM for .mwp-flash-stage elements on DOMContentLoaded', 'modern-flash')
        );
    }

    /**
     * Renders responsive two-column layout conforming to Wolfpack Modern WordPress standards.
     */
    public function renderPage(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $bundlePath = MODERN_FLASH_DIR . 'dist/flash-bundle.min.js';
        $bundleExists = file_exists($bundlePath);
        $bundleSize = $bundleExists ? round((filesize($bundlePath) ?: 0) / 1024, 1) . ' KB' : 'Missing';
        ?>
        <div class="wrap" style="max-width: 1200px; margin-top: 20px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; background: #15868F; border-radius: 8px; color: #ffffff; margin-bottom: 24px; border: 2px solid #2A2A2A; box-shadow: 3px 3px 0 0 #2A2A2A;">
                <div style="display: flex; align-items: center; gap: 14px;">
                    <div style="width: 44px; height: 44px; border-radius: 6px; background: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; color: #15868F; border: 2px solid #2A2A2A;">⚡</div>
                    <div>
                        <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; line-height: 1.2;">Modern Flash</h1>
                        <p style="margin: 4px 0 0; font-size: 13px; color: #e0f2f1;">SVG Vector Animation Engine & ActionScript Runtime for WordPress</p>
                    </div>
                </div>
                <div style="background: rgba(0,0,0,0.25); padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid rgba(255,255,255,0.3);">
                    v<?php echo esc_html(MODERN_FLASH_VERSION); ?>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
                <!-- Primary Column: Settings Form -->
                <div class="mwp-col-primary" style="background: #ffffff; border: 1px solid #ccd0d4; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                    <form method="post" action="options.php">
                        <?php
                        settings_fields(self::OPTION_GROUP);
                        do_settings_sections(self::PAGE_SLUG);
                        submit_button(__('Save Configuration', 'modern-flash'), 'primary', 'submit', true, [
                            'style' => 'background: #15868F; border-color: #2A2A2A; border-width: 2px; box-shadow: 2px 2px 0 0 #2A2A2A; font-weight: 600; text-shadow: none;'
                        ]);
                        ?>
                    </form>

                    <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;" />

                    <h3 style="margin-top: 0; font-size: 16px;"><?php esc_html_e('Shortcode Usage Guide', 'modern-flash'); ?></h3>
                    <p style="font-size: 13px; color: #64748b;"><?php esc_html_e('Embed vector animations anywhere using declarative shortcodes:', 'modern-flash'); ?></p>
                    <pre style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>[modern_flash prompt="Deal Ace of Spades with a 3D flip on dark slate stage" speed="1.2" loop="true"]</code></pre>
                    <pre style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;"><code>[modern_flash movie="FlashStory" height="420px"]</code></pre>
                </div>

                <!-- Secondary Column: Runtime Telemetry -->
                <div class="mwp-col-secondary">
                    <div style="background: #ffffff; border: 1px solid #ccd0d4; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h3 style="margin-top: 0; font-size: 15px; border-bottom: 2px solid #15868F; padding-bottom: 8px;">
                            <?php esc_html_e('Runtime Telemetry', 'modern-flash'); ?>
                        </h3>

                        <table class="widefat striped" style="margin-top: 12px; font-size: 12px;">
                            <tbody>
                                <tr>
                                    <td><strong><?php esc_html_e('Bundle Status', 'modern-flash'); ?></strong></td>
                                    <td>
                                        <?php if ($bundleExists): ?>
                                            <span style="color: #059669; font-weight: bold;">● <?php esc_html_e('Compiled', 'modern-flash'); ?></span>
                                        <?php else: ?>
                                            <span style="color: #dc2626; font-weight: bold;">● <?php esc_html_e('Missing', 'modern-flash'); ?></span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong><?php esc_html_e('Bundle Size', 'modern-flash'); ?></strong></td>
                                    <td><?php echo esc_html($bundleSize); ?></td>
                                </tr>
                                <tr>
                                    <td><strong><?php esc_html_e('Engine Target', 'modern-flash'); ?></strong></td>
                                    <td>React 19 + GSAP 3</td>
                                </tr>
                                <tr>
                                    <td><strong><?php esc_html_e('Global Handle', 'modern-flash'); ?></strong></td>
                                    <td><code>window.mwpFlash</code></td>
                                </tr>
                                <tr>
                                    <td><strong><?php esc_html_e('Active Hook', 'modern-flash'); ?></strong></td>
                                    <td><code>DOMContentLoaded</code></td>
                                </tr>
                                <tr>
                                    <td><strong><?php esc_html_e('Supported Movies', 'modern-flash'); ?></strong></td>
                                    <td><code>FlashStory</code>, <code>logo</code>, <code>starfighter</code>, <code>cardFlip</code>, <code>hudMacromedia</code></td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="margin-top: 16px; padding: 10px; background: #f0fdf4; border-left: 4px solid #15868F; font-size: 11px; color: #166534;">
                            <?php esc_html_e('The runtime bundle mounts directly into .mwp-flash-stage containers with zero layout shift.', 'modern-flash'); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}
