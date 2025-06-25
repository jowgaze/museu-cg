function getPicture(x) {
    return [
        vec4(0.5 - x, 1.5, -7.9, 1.0),
        vec4(0.5 - x, 3.5, -7.9, 1.0),
        vec4(-0.5 - x, 3.5, -7.9, 1.0),
        vec4(-0.5 - x, 1.5, -7.9, 1.0),
    ];
}


function getIndicesPicture(x) {
    return [
        0, 1, 3, 2
    ].map(i => i + x)
}

function getTexturePicture() {
    return [
        vec2(0, 1), vec2(0, 0), vec2(1, 0), vec2(1, 1)
    ]
}