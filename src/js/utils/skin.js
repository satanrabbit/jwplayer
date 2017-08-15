import _ from 'utils/underscore';
import { prefix } from 'utils/strings';
import { css } from 'utils/css';

export function normalizeSkin(skinConfig = {}) {

    const active = skinConfig.active;
    const inactive = skinConfig.inactive;
    const background = skinConfig.background;

    const colors = {};

    colors.controlbar = getControlBar(skinConfig.controlbar);

    colors.timeslider = getTimeSlider(skinConfig.timeslider);

    colors.menus = getMenus(skinConfig.menus);

    colors.tooltips = getTooltips(skinConfig.tooltips);

    function getControlBar(controlBarConfig = {}) {
        const config = {};

        config.iconsActive = controlBarConfig.iconsActive || active;
        config.icons = controlBarConfig.icons || inactive;
        config.text = controlBarConfig.text || inactive;
        config.background = controlBarConfig.background || background;

        return config;
    }

    function getTimeSlider(timesliderConfig = {}) {
        const config = {};

        config.progress = timesliderConfig.progress || active;
        config.rail = timesliderConfig.rail;

        return config;
    }

    function getMenus(menusConfig = {}) {
        const config = {};

        config.text = menusConfig.text || inactive;
        config.textActive = menusConfig.textActive || active;
        config.background = menusConfig.background || background;

        return config;
    }

    function getTooltips(tooltipsConfig = {}) {
        const config = {};

        config.text = tooltipsConfig.text || inactive;
        config.background = tooltipsConfig.background || background;

        return config;
    }

    return colors;
}

export function handleColorOverrides(playerId, skin = {}) {

    function addStyle(elements, attr, value, extendParent) {
        if (!value) {
            return;
        }
        /* if extendParent is true, bundle the first selector of
         element string to the player element instead of defining it as a
         child of the player element (default). i.e. #player.sel-1 .sel-2 vs. #player .sel-1 .sel-2 */
        elements = prefix(elements, '#' + playerId + (extendParent ? '' : ' '));

        const o = {};
        o[attr] = value;
        css(elements.join(', '), o, playerId);
    }

    // These will use standard style names for CSS since they are added directly to a style sheet
    // Using background instead of background-color so we don't have to clear gradients with background-image

    if (_.size(skin.controlbar)) {
        styleControlbar(skin.controlbar);
    }
    if (_.size(skin.timeslider)) {
        styleTimeslider(skin.timeslider);
    }
    if (_.size(skin.menus)) {
        styleMenus(skin.menus);
    }
    if (_.size(skin.tooltips)) {
        styleTooltips(skin.tooltips);
    }

    insertGlobalColorClasses(skin.menus);

    function styleControlbar(config) {

        addStyle([
            // controlbar button colors
            '.jw-controlbar .jw-text',
        ], 'color', config.text);

        addStyle([
            // controlbar button colors
            '.jw-button-color',
            '.jw-button-color.jw-toggle.jw-off',
        ], 'color', config.icons);

        // Apply active color
        addStyle([
            // Toggle and menu button active colors
            '.jw-button-color.jw-toggle',
            '.jw-button-color:hover',
            '.jw-button-color.jw-toggle.jw-off:hover'
        ], 'color', config.iconsActive);

        // chromecast overrides
        addStyle([
            '.jw-icon-cast button',
            '.jw-icon-cast button:hover',
        ], '--disconnected-color', config.icons);

        addStyle([
            '.jw-icon-cast button',
            '.jw-icon-cast button:focus',
        ], '--connected-color', config.iconsActive);

        addStyle([
            '.jw-icon-cast button:focus',
            '.jw-icon-cast button:hover',
        ], '--disconnected-color', config.iconsActive);


        addStyle([
            '.jw-icon-cast button.jw-off',
        ], '--connected-color', config.icons);

        addStyle([
            '.jw-background-color.jw-controlbar'
        ], 'background', config.background);
    }

    function styleTimeslider(config) {

        addStyle([
            '.jw-progress',
            '.jw-buffer',
            '.jw-slider-time .jw-cue',
            '.jw-knob'
        ], 'background', 'none ' + config.progress);

        addStyle([
            '.jw-buffer',
        ], 'opacity', 0.5);

        addStyle([
            '.jw-rail'
        ], 'background', 'none ' + config.rail);

        addStyle([
            '.jw-background-color.jw-slider-time'
        ], 'background', config.background);
    }

    function styleMenus(config) {

        addStyle([
            '.jw-option',
            '.jw-toggle.jw-off',
            '.jw-skip .jw-skip-icon',
            '.jw-nextup-body',
            '.jw-nextup-header'
        ], 'color', config.text);

        addStyle([
            '.jw-nextup-body.jw-background-color',
            '.jw-slider-volume.jw-background-color',
            '.jw-menu.jw-background-color',
            '.jw-nextup-body',
            '.jw-nextup-header'
        ], 'background', config.background);

        addStyle([
            '.jw-menu.jw-background-color',
            '.jw-nextup-body',
        ], 'opacity', 0.7);

        addStyle([
            '.jw-option.jw-active-option',
            '.jw-option:not(.jw-active-option):hover',
        ], 'color', config.textActive);
    }

    function styleTooltips(config) {
        addStyle([
            '.jw-tooltip-time .jw-time-tip'
        ], 'background', config.background);
    }

    // Set global colors, used by related plugin
    // If a color is undefined simple-style-loader won't add their styles to the dom
    function insertGlobalColorClasses(config = {}) {
        if (config.textActive) {
            const activeColorSet = {
                color: config.textActive,
                borderColor: config.textActive,
                stroke: config.textActive
            };
            css('#' + playerId + ' .jw-color-active', activeColorSet, playerId);
            css('#' + playerId + ' .jw-color-active-hover:hover', activeColorSet, playerId);
        }
        if (config.text) {
            const inactiveColorSet = {
                color: config.text,
                borderColor: config.text,
                stroke: config.text
            };
            css('#' + playerId + ' .jw-color-inactive', inactiveColorSet, playerId);
            css('#' + playerId + ' .jw-color-inactive-hover:hover', inactiveColorSet, playerId);
        }
    }
}
