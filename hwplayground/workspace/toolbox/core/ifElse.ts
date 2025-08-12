import inputsBlockConfig from "@/utils/playground/workspace/toolbox/core/inputs/inputsBlockConfig";

export const ifElseToolbox = [
    {
        "kind": "block",
        "type": "controls_if"
    },
    {
        "kind": "block",
        "type": "math_number"
    },
    {
        "kind": "block",
        "type": "text"
    },
    {
        "kind": "block",
        "type": "logic_compare"
    },

    {
        "kind": "block",
        "type": "variables_get",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "some"  // Change the default name here
            }
        ],
    },



]