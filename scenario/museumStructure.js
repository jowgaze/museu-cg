function getStructure() {
    return [
        // Wall
        vec4(5.0, 0.0, -8.0, 1.0),
        vec4(5.0, 4.0, -8.0, 1.0),
        vec4(-5.0, 4.0, -8.0, 1.0),
        vec4(-5.0, 0.0, -8.0, 1.0),
        vec4(-5.0, 0.0, 5.0, 1.0),
        vec4(-5.0, 4.0, 5.0, 1.0),
        vec4(5.0, 0.0, 5.0, 1.0),
        vec4(5.0, 4.0, 5.0, 1.0),

        // Floor
        vec4(5.0, 0.0, -8.0, 1.0), // 8
        vec4(-5.0, 0.0, -8.0, 1.0),
        vec4(-5.0, 0.0, 5.0, 1.0),
        vec4(5.0, 0.0, 5.0, 1.0),

        // Roof
        vec4(5.0, 4.0, -8.0, 1.0), // 12
        vec4(-5.0, 4.0, -8.0, 1.0),
        vec4(-5.0, 4.0, 5.0, 1.0),
        vec4(5.0, 4.0, 5.0, 1.0),
    ];
}

function getIndicesWall() {
    return [
        0, 1, 3, 2,
        4, 5, 6, 7,
        0, 1
    ];
}

function getIndicesFloor() {
    return [
        8, 9, 11, 10
    ];
}

function getIndicesRoof() {
    return [
        12, 15, 13, 14
    ];
}

function getTextureStructure(x){
    return [
        vec2(x, 0), vec2(x, x), vec2(0, 0), vec2(0, x),
        vec2(x, 0), vec2(x, x), vec2(0, 0), vec2(0, x),
        
        vec2(0, 0), vec2(0, x), vec2(x, x), vec2(x, 0),

        vec2(0, 0), vec2(0, x), vec2(x, x), vec2(x, 0),
    ]
}