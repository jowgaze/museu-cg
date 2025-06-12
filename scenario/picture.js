function getPicture() {
    return [
        vec4(0.5, 1.5, -7.9, 1.0),
        vec4(0.5, 3.5, -7.9, 1.0),
        vec4(-0.5, 3.5, -7.9, 1.0),
        vec4(-0.5, 1.5, -7.9, 1.0),
    ];
}


function getIndicesPicture(x) {
    return [
        0, 1, 3, 2
    ].map(i => i + x)
}

function getTexturePicture(repeat) {
    return [
        vec2(0, repeat), vec2(0, 0), vec2(repeat, 0), vec2(repeat, repeat)
    ]
}