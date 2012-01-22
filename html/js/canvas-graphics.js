window.onload = function() {

(function() { //keep the global space clean

    ///// STEP 0 - setup

    // source data table and canvas tag
    var data_table = document.getElementById('piechart-table');
    var canvas = document.getElementById('piechart');
    var td_index = 0; // which TD contains the data
    var colors = new Array();
    colors[0] = "rgb(75,175,50)";
    colors[1] = "rgb(65,148,23)";
    colors[2] = "rgb(226,23,27)";
    colors[3] = "rgb(178,27,24)"; 

    ///// STEP 1 - Get the, get the, get the data!

    // get the data[] from the table
    var tds, data = [], value = 0, total = 0;
    var trs = data_table.getElementsByTagName('tr'); // all TRs

    for (var i = 0; i < trs.length; i++) {
        tds = trs[i].getElementsByTagName('td'); // all TDs

        if (tds.length === 0) continue; //  no TDs here, move on

        // get the value, update total
        value  = parseFloat(tds[td_index].innerHTML);
        data[data.length] = value;
        total += value;

        //  color
        trs[i].style.backgroundColor = colors[i]; // color this TR

    }


    ///// STEP 2 - Draw pie on canvas


    // exit if canvas is not supported
    if (typeof canvas.getContext === 'undefined') {
        return;
    }

    // get canvas context, determine radius and center
    var ctx = canvas.getContext('2d');
    var canvas_size = [canvas.width, canvas.height];
    var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
    var center = [canvas_size[0]/2, canvas_size[1]/2];

    var sofar = 0; // keep track of progress
    // loop the data[]
    for (var piece in data) {

        var thisvalue = data[piece] / total;

        ctx.beginPath();
        ctx.moveTo(center[0], center[1]); // center of the pie
        ctx.arc(  // draw next arc
            center[0],
            center[1],
            radius,
            Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
            Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
            false
        );

        ctx.lineTo(center[0], center[1]); // line back to the center
        ctx.closePath();
        ctx.fillStyle = colors[piece];    // color
        ctx.fill();

        sofar += thisvalue; // increment progress tracker
    }


    ///// DONE!


    // utility - generates random color
    function getColor() {
        var rgb = [];
        for (var i = 0; i < 3; i++) {
            rgb[i] = Math.round(100 * Math.random() + 155) ; // [155-255] = lighter colors
        }
        return 'rgb(' + rgb.join(',') + ')';
    }


})() // exec!
}