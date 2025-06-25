function getPedestal() {
    return [
        vec4(0.5, 0, -5.75, 1),
        vec4(0.5, 1.75, -5.75, 1),
        vec4(-0.5, 0, -5.75, 1),
        vec4(-0.5, 1.75, -5.75, 1),

        vec4(-0.5, 0, -6.75, 1),
        vec4(-0.5, 1.75, -6.75, 1),
        vec4(0.5, 0, -6.75, 1),
        vec4(0.5, 1.75, -6.75, 1)
    ];
}

function getIndicesPedestal(x) {
    return [   
        0, 1, 2, 3,
        4, 5, 6, 7,
        0, 1, 7, 3, 5
    ].map(i => i + x)
}

function getTexturePedestal() {
    return [
        vec2(0, 0), vec2(1, 0), vec2(0, 1), vec2(1, 1),
        vec2(0, 0), vec2(1, 0), vec2(0, 1), vec2(1, 1)
    ]
}