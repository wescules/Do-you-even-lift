var weights = [100, 55, 45, 35, 25, 10, 5, 2.5, 1.25];
var defaultUnchecked = [100, 55, 1.25];

// returns array of weights
function howToRack(weight, barWeight, weights) {
    var toRack = [];
    var left = weight - barWeight;
    var time = 0;
    while (left > 0) {
        // find largest possible weight to add
        var found = false;
        for(var i=0; i<weights.length; i++) {
            var amt = weights[i]*2;
            if ( amt <= left ) {
                left -= amt;
                toRack[time] = weights[i];
                time++;
                found = true;
                break;
            }
        }
        if (!found) {
	    toRack = []
            break;
        }
    }
    return toRack;
}

function outputResultTable() {
    var form = document.forms[0];
    var res = howToRack(
        Number(form.weight.value),
        Number(form.barweight.value));
    var out = document.getElementById('result');
    var outStr = '<table><tr><th>Weights Required</th></tr>';
    for(var i=0; i<res.length; i++) {
        outStr += '<tr><td>' + res[i] + '</td></tr>';
    }
    outStr += '</table>';
    out.innerHTML = outStr;
}

function outputResultList() {
    var form = document.forms[0];
    var res = howToRack(
			Number(form.weight.value),
			Number(form.barweight.value),
			convertFormChecks(form.weightsInc));
    var out = document.getElementById('result');
    var outStr = '<dl><dt>Weights Required</dt></dl><ul>';
    for (i = 0; i < res.length; i++) {
        outStr += '<li>' + res[i] + '</li>';
    }
    outStr += '</ul>';
    out.innerHTML = outStr;
}


function outputResultPre() {
    var form = document.forms[0];
    var res = howToRack(
			Number(form.weight.value),
			Number(form.barweight.value),
			convertFormChecks(form.weightsInc));
    res = res.reverse();
    var out = document.getElementById('result');
    var outStr = '<h3>Weights Required</h3><pre>';

    var outA = []
    for (i = 0; i < res.length; i++) {
	outA[i] = txtWeight(res[i]);
    }

    var arrMax = 0;
    for (var i=0; i<outA.length; i++) {
	if ( outA[i].length > arrMax ) {
	    arrMax = outA[i].length;
	}
    }

    for (var i=0; i<outA.length; i++) {
	var space = repeat(' ', (arrMax - outA[i].length)/2);
	outStr += space + outA[i] + '\n';
    }
    outStr += '</pre>';
    out.innerHTML = outStr;
}

function outputResultSVG() {
    var form = document.forms[0];
    var res = howToRack(
	Number(form.weight.value),
	Number(form.barweight.value),
	convertFormChecks(form.weightsInc));
    res = res.reverse();

    d3.select("#svgresult")
	.remove();

    var svg = d3.select("#result")
	.append("svg")
	.attr("id", "svgresult")
        .attr("width", 200)
        .attr("height", 450);

    if (res.length === 0) {
	/* Not Rackable */
	svg.append("text")
	    .attr("x", 10)
	    .attr("y", 200)
	    .text("Not Rackable!");

    } else {
	console.log(res);

	var barTop = 50;
	var barBottom = 450;
	var barWidth = 10;
	var barHorizCenter = 100 + barWidth/2;

	svg.append("rect")
	    .attr("id", "thebar")
	    .attr("width", barWidth)
            .attr("height", barBottom - barTop)
            .attr("x", barHorizCenter - barWidth/2)
            .attr("y", barTop);

	var plateWidth = 50;
	var plateHeight = 20;

	function drawPlate(svg, x, y) {
	    svg.append("rect")
		.attr("class", "plate")
		.attr("width", plateWidth)
		.attr("height", plateHeight)
		.attr("x", x)
		.attr("y", y);
	}

	function drawPlateLabel(svg, x, y, label) {
	    svg.append("text")
		.attr("class", "plateLabel")
		.attr("x", x)
		.attr("y", y)
		.text(label);
	}

	var numPlates = res.length;
//window.alert(numPlates);
	for (var plate = 0; plate<numPlates; plate++) {
	    var weight = res[plate];
	    drawPlate(svg, barHorizCenter - (plateWidth / 2), 5 + barTop + plate*25);
	    drawPlateLabel(svg, barHorizCenter, 5 + barTop + plate*25 + plateHeight - 2, weight);

	    drawPlate(svg, barHorizCenter - (plateWidth / 2), barBottom - (1+plate)*25);
	    drawPlateLabel(svg, barHorizCenter, barBottom - (1+plate)*25 + plateHeight - 2, weight);

	}
    }
}


function repeat(str, num) {
    var out = '';
    for(var i=0; i<num; i++) {
	out+=str;
    }
    return out;
}

function txtWeight(weight) {
    var size = Math.min(weight/3, 50/3) - (String(weight).length+1/2);
    var out = '';
    for(var c=0; c<size; c++) {
	out+=' ';
    }
    return '['+out+weight+out+']';
}

function convertFormChecks(frm) {
    var a = [];
    var ai = 0;
    for(i=0; i<frm.length; i++) {
	if ( frm[i].checked ) {
	    a[ai] = Number(frm[i].value);
	    ai++;
	}
    }
    return a;
}

function matchValue(matchMe, textElem) {
    document.getElementById(textElem).value = matchMe.value;
}

function populateChecks() {
    var checksDiv = document.getElementById('weightChecks');
    var checkTemplate = '<div class="small-4 columns"><input type="checkbox" name="weightsInc" value="{0}" {1}><label>{0}</label></div>';
    var outStr = '<div class="row">';

    for (i=0; i<weights.length; i++) {
	checked = true;

	for(j=0; j<defaultUnchecked.length; j++) {
	    if (weights[i] == defaultUnchecked[j]) {
		checked = false;
	    }
	}
	outStr += checkTemplate.replace(/\{0\}/g, weights[i]).replace(/\{1\}/g, checked?'checked':'');
    }
    outStr += '</div>';
    checksDiv.innerHTML = outStr;

}

window.onload = function () { populateChecks(); };
