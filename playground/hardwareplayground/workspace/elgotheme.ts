import Blockly from 'blockly/core';

Blockly.registry.unregister('theme', 'elgo_theme');

export const BlocklyTheme  = Blockly.Theme.defineTheme('customTheme', {
    'name': 'customTheme',
    'blockStyles': {
        'logic_blocks': {
            'colourPrimary': '#a2bdf2', // Light Purple
            'colourSecondary': '#c5d4f7',
            'colourTertiary': '#8ea8e3'
        },
        'loop_blocks': {
            'colourPrimary': '#b6ddb1', // Light Green
            'colourSecondary': '#d0ead2',
            'colourTertiary': '#a1c79b'
        },
        'math_blocks': {
            'colourPrimary': '#93ccea', // Light Blue
            'colourSecondary': '#bde2f7',
            'colourTertiary': '#79b8da'
        },
        'text_blocks': {
            'colourPrimary': '#f9dd87', // Light Yellow
            'colourSecondary': '#fae6a7',
            'colourTertiary': '#f5d46b'
        },
        'list_blocks': {
            'colourPrimary': '#aecbbd', // Light Teal
            'colourSecondary': '#cde2d5',
            'colourTertiary': '#94b6a7'
        },
        'variable_blocks': {
            'colourPrimary': '#eaa8a8', // Light Red
            'colourSecondary': '#f4c5c5',
            'colourTertiary': '#d89090'
        },
        'procedure_blocks': {
            'colourPrimary': '#d3c2b8', // Light Grey
            'colourSecondary': '#e0d6ce',
            'colourTertiary': '#bcae9f'
        }
    },
    'categoryStyles': {
        'logic_category': {
            'colour': '#a2bdf2' // Light Purple
        },
        'loop_category': {
            'colour': '#b6ddb1' // Light Green
        },
        'math_category': {
            'colour': '#93ccea' // Light Blue
        },
        'text_category': {
            'colour': '#f9dd87' // Light Yellow
        },
        'list_category': {
            'colour': '#aecbbd' // Light Teal
        },
        'variable_category': {
            'colour': '#eaa8a8' // Light Red
        },
        'procedure_category': {
            'colour': '#d3c2b8' // Light Grey
        }
    },
    'componentStyles': {
        'workspaceBackgroundColour': '#f5f5f5', // Light grey background for the workspace
        'toolboxBackgroundColour': '#ffffff', // White background for the toolbox
        'toolboxForegroundColour': '#333333', // Dark text for toolbox items
        'flyoutBackgroundColour': '#f5f5f5', // Light grey background for the flyout
        'flyoutForegroundColour': '#000000', // Black text for flyout items
        'flyoutOpacity': 1,
        'scrollbarColour': '#c0c0c0', // Grey scrollbar color
        'scrollbarOpacity': 0.8
    },
    'fontStyle': {
        'family': 'Arial, sans-serif',
        'weight': 'normal',
        'size': 12
    },
    'startHats': true
});

export const blocklyOptions = {
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
    },
    zoom: {
        controls: true,
        wheel: false,
        startScale: 0.8,
        maxScale: 2,
        minScale: 0.5,
        scaleSpeed: 1.2
    },
    trashcan: true,
    sounds: false,
    move: {
        scrollbars: false,
        drag: false,
        wheel: false
    },
    toolboxPosition: 'start',
    horizontalLayout: false,
    scrollbars: false,
    css: true,
    rtl: false,

};