const blockKeys = {


    //--------------------core blocks--------------------

    // Logic category
    controlsIf: 'controls_if',
    logicCompare: 'logic_compare',
    logicOperation: 'logic_operation',
    logicNegate: 'logic_negate',
    logicBoolean: 'logic_boolean',
    logicNull: 'logic_null',
    logicTernary: 'logic_ternary',

    // Loops category
    controlsRepeatExt: 'controls_repeat_ext',
    controlsRepeat: 'controls_repeat',
    controlsWhileUntil: 'controls_whileUntil',
    controlsFor: 'controls_for',
    controlsForEach: 'controls_forEach',
    controlsFlowStatements: 'controls_flow_statements',

    // Math category
    mathNumber: 'math_number',
    mathArithmetic: 'math_arithmetic',
    mathSingle: 'math_single',
    mathTrig: 'math_trig',
    mathConstant: 'math_constant',
    mathNumberProperty: 'math_number_property',
    mathRound: 'math_round',
    mathOnList: 'math_on_list',
    mathModulo: 'math_modulo',
    mathConstrain: 'math_constrain',
    mathRandomInt: 'math_random_int',
    mathRandomFloat: 'math_random_float',
    mathAtan2: 'math_atan2',

    // Text category
    text: 'text',
    textMultiline: 'text_multiline',
    textJoin: 'text_join',
    textAppend: 'text_append',
    textLength: 'text_length',
    textIsEmpty: 'text_isEmpty',
    textIndexOf: 'text_indexOf',
    textCharAt: 'text_charAt',
    textGetSubstring: 'text_getSubstring',
    textChangeCase: 'text_changeCase',
    textTrim: 'text_trim',
    textCount: 'text_count',
    textReplace: 'text_replace',
    textReverse: 'text_reverse',
    textPrint: 'text_print',
    textPromptExt: 'text_prompt_ext',

    // Lists category
    listsCreateWith: 'lists_create_with',
    listsRepeat: 'lists_repeat',
    listsLength: 'lists_length',
    listsIsEmpty: 'lists_isEmpty',
    listsIndexOf: 'lists_indexOf',
    listsGetIndex: 'lists_getIndex',
    listsSetIndex: 'lists_setIndex',
    listsGetSublist: 'lists_getSublist',
    listsSplit: 'lists_split',
    listsSort: 'lists_sort',
    listsReverse: 'lists_reverse',

    // Colour category
    colourPicker: 'colour_picker',
    colourRandom: 'colour_random',
    colourRgb: 'colour_rgb',
    colourBlend: 'colour_blend',

    //--------------------custom blocks--------------------

    //neo-pixel-matrix
    moveUp: 'moveUp',
    moveDown: 'moveDown',
    moveRight: 'moveRight',
    moveLeft: 'moveLeft',
    moveTopLeft: 'moveTopLeft',
    moveTopRight: 'moveTopRight',
    moveBottomLeft: 'moveBottomLeft',
    moveBottomRight: 'moveBottomRight',
    //Led
    turnOnLed: 'turnOnLed',
    turnOffLed: 'turnOffLed',
    blinkLed: 'blinkLed',
    //servo motor
    turnServoLeft: 'turnServoLeft',
    turnServoRight: 'turnServoRight',

    //buzzer
    turnOnBuzzer:'turnOnBuzzer',
    turnOffBuzzer:'turnOffBuzzer',

    //light-buzzer
    lightBuzzerOnStart : 'light_buzzer_on_start',

    //inputs
    lightValue: 'lightValue',

    //delay
    delay :'delay'


}

export default blockKeys;