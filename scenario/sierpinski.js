var positions = [];

var a = vec4(-0.4, 1.75, -5.85, 1);
var b = vec4(0.4, 1.75, -5.85, 1);
var c = vec4(0, 1.75, -6.65, 1);
var d = vec4(0, 3, -6.25, 1);

function triangleRecursive(a, b, c, d, n) {
    if (n == 0) {
        addTriangle(a, b, c);
        addTriangle(b, d, c);
        addTriangle(d, a, c);
        addTriangle(a, b, d);
    } else {
        let ab = mix(a, b, 0.5);
        let ac = mix(a, c, 0.5);
        let ad = mix(a, d, 0.5);
        let bc = mix(b, c, 0.5);
        let bd = mix(b, d, 0.5);
        let dc = mix(d, c, 0.5);


        triangleRecursive(a, ab, ac, ad, n - 1);
        triangleRecursive(b, ab, bc, bd, n - 1);
        triangleRecursive(c, ac, bc, dc, n - 1);

        triangleRecursive(b, ab, bc, bd, n - 1);
        triangleRecursive(c, ac, bc, dc, n - 1);
        triangleRecursive(d, ad, bd, dc, n - 1);

        triangleRecursive(a, ab, ac, ad, n - 1);
        triangleRecursive(c, bc, ac, dc, n - 1);
        triangleRecursive(d, ad, bd, dc, n - 1);

        triangleRecursive(a, ab, ad, ac, n - 1);
        triangleRecursive(b, ab, bc, bd, n - 1);
        triangleRecursive(d, ad, bd, dc, n - 1);
    }
}

function addTriangle(a, b, c) {
    positions.push(a);
    positions.push(b);
    positions.push(c);
}

function getSierpinski(n) {
    triangleRecursive(a, b, c, d, n);
    return positions;
}