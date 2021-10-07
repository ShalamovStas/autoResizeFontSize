console.log("Test")

const svgText = "test test test";


var draw = SVG().addTo('#drawing').viewbox(0, 0, 300, 200);


// var text = draw.text(function (add) {
//     add.text("")
// })

var text = draw.text((add) => {
    let tspan = add.tspan(svgText);
    tspan.attr('textLength', `100%`);
    tspan.attr('lengthAdjust', `spacing`);
    tspan.attr('x', `5`);
    tspan.attr('y', `180`);
    tspan.attr('font-size', `200px`);
});

text.attr('textLength', `290`);
text.attr('lengthAdjust', `spacing`);
text.attr('x', `5`);
text.attr('y', `14`);



