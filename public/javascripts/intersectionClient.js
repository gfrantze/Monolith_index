/* 
Globals

Only an ajax flag
*/

var ajaxInProg = false;


/*

Functions below drawDefault() and drawDefaultTwo() are helper functions for
resetting the venn.js SVG

*/

function toolTip(diagram, overlaps, sets) {

    var tooltip = d3.select("body").append("div")
        .attr("class", "venntooltip");
    d3.selection.prototype.moveParentToFront = function() {
        return this.each(function() {
            this.parentNode.parentNode.appendChild(this.parentNode);
        });
    };
    // hover on all the circles
    diagram.circles
        .style("stroke-opacity", 0)
        .style("stroke", "white")
        .style("stroke-width", "2");
    diagram.nodes
        .on("mousemove", function() {
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseover", function(d, i) {
            var selection = d3.select(this).select("circle");
            selection.moveParentToFront()
                .transition()
                .style("fill-opacity", .5)
                .style("stroke-opacity", 1);
            tooltip.transition().style("opacity", .9);
            tooltip.text(d.size + " items");
        })
        .on("mouseout", function(d, i) {
            d3.select(this).select("circle").transition()
                .style("fill-opacity", .3)
                .style("stroke-opacity", 0);
            tooltip.transition().style("opacity", 0);
        });
    // draw a path around each intersection area, add hover there as well
    diagram.svg.selectAll("path")
        .data(overlaps)
        .enter()
        .append("path")
        .attr("d", function(d) {
            return venn.intersectionAreaPath(d.sets.map(function(j) {
                return sets[j];
            }));
        })
        .style("fill-opacity", "0")
        .style("fill", "black")
        .style("stroke-opacity", 0)
        .style("stroke", "white")
        .style("stroke-width", "2")
        .on("mouseover", function(d, i) {
            d3.select(this).transition()
                .style("fill-opacity", .1)
                .style("stroke-opacity", 1);
            tooltip.transition().style("opacity", .9);
            tooltip.text(d.size + " items");
        })
        .on("mouseout", function(d, i) {
            d3.select(this).transition()
                .style("fill-opacity", 0)
                .style("stroke-opacity", 0);
            tooltip.transition().style("opacity", 0);
        })
        .on("mousemove", function() {
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
}


function drawDefault() {

    $(".dynamic").html("");
    var overlaps = [{
        sets: [0, 1],
        size: 4
    }, {
        sets: [0, 2],
        size: 4
    }, {
        sets: [1, 2],
        size: 3
    }, {
        sets: [0, 1, 2],
        size: 2
    }];
    var sets = [{
        label: "A",
        size: 16
    }, {
        label: "B",
        size: 16
    }, {
        label: "C",
        size: 16
    }];
    sets = venn.venn(sets, overlaps),
        diagram = venn.drawD3Diagram(d3.select(".dynamic"), sets, 320, 320);
    toolTip(diagram, overlaps, sets);

}


/*
Redraw Venn.js for two samples. Insert Mongo data.
*/


function twoSetBoilerPlate(res) {

    $(".dynamic").html("");
    clearLists();

    sets = [{
        label: "A".concat(res.a),
        size: res.a
    }, {
        label: "B".concat(res.b),
        size: res.b
    }, ];

    overlaps = [{
        sets: [0, 1],
        size: res.ab
    }];

    sets = venn.venn(sets, overlaps),
        diagram = venn.drawD3Diagram(d3.select(".dynamic"), sets, 320, 320);

    populateLists(res, 2);
    toolTip(diagram, overlaps, sets);

}

/*

Redraw Venn.js for three samples. Insert Mongo data.

*/


function threeSetBoilerPlate(res) {

    $(".dynamic").html("");
    clearLists();

    sets = [{
        label: "A".concat(res.a),
        size: res.a
    }, {
        label: "B".concat(res.b),
        size: res.b
    }, {
        label: "C".concat(res.c),
        size: res.c
    }];

    overlaps = [{
        sets: [0, 1],
        size: res.ab
    }, {
        sets: [0, 2],
        size: res.ac
    }, {
        sets: [1, 2],
        size: res.bc
    }, {
        sets: [0, 1, 2],
        size: res.abc
    }];

    sets = venn.venn(sets, overlaps),
        diagram = venn.drawD3Diagram(d3.select(".dynamic"), sets, 320, 320);

    populateLists(res, 3);
    toolTip(diagram, overlaps, sets);

}

/*

Redraw Venn.js for four samples. Insert Mongo data.

*/


function fourSetBoilerPlate(res) {

    clearLists();
    $(".dynamic").html("");

    sets = [{
        label: "A".concat(res.a),
        size: res.a
    }, {
        label: "B".concat(res.b),
        size: res.b
    }, {
        label: "C".concat(res.c),
        size: res.c
    }, {
        label: "D".concat(res.d),
        size: res.d
    }];


    var overlaps = [

        {
            sets: [0, 1],
            size: res.ab
        }, {
            sets: [0, 2],
            size: res.ac
        }, {
            sets: [0, 3],
            size: res.ad
        }, {
            sets: [1, 2],
            size: res.bc
        }, {
            sets: [1, 3],
            size: res.bd
        }, {
            sets: [2, 3],
            size: res.cd
        },

        {
            sets: [0, 1, 2],
            size: res.abc
        }, {
            sets: [0, 1, 3],
            size: res.abd
        }, {
            sets: [0, 2, 3],
            size: res.acd
        }, {
            sets: [1, 2, 3],
            size: res.bcd
        },


        {
            sets: [0, 1, 2, 3],
            size: res.abcd
        },


    ];


    sets = venn.venn(sets, overlaps),
        diagram = venn.drawD3Diagram(d3.select(".dynamic"), sets, 320, 320);


    populateLists(res, 4);
    toolTip(diagram, overlaps, sets);

}


/*

Client side intersection algorithm for gene lists.

*/

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a
        .filter(function(e) {
            if (b.indexOf(e) !== -1) return true;
        })
        .filter(function(e) {
            if (b.indexOf(e) !== -1) return true;
        });
}


Array.prototype.unique = function() {
    var a = [],
        l = this.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++)
            if (this[i] === this[j]) j = ++i;
        a.push(this[i]);
    }
    return a;
};


/*

Here is the logic for handling user entered gene lists. The input is split using a regular expression
and the intersection is found (entirely client side).


*/

function geneList() {

    clearLists();



    var set = {

        a: 0,
        b: 0,
        c: 0,
        d: 0,
        origA: [],
        origB: [],
        origC: [],
        origD: [],
        ab: 0,
        ac: 0,
        ad: 0,
        bc: 0,
        bd: 0,
        cd: 0,
        abc: 0,
        abd: 0,
        acd: 0,
        bcd: 0,
        iab: [],
        iac: [],
        iad: [],
        ibc: [],
        ibd: [],
        icd: [],
        abcd: 0,
        iabc: [],
        iabd: [],
        iacd: [],
        ibcd: [],
        iabcd: []

    };


    $("#load_icon").show();

    if (document.getElementById("gl1").value) {
        set.origA = document.getElementById("gl1").value.split(/[\s,]+/).unique();
        set.a = set.origA.length;
    }
    if (document.getElementById("gl2").value) {
        set.origB = document.getElementById("gl2").value.split(/[\s,]+/).unique();
        set.b = set.origB.length;
    }
    if (document.getElementById("gl3").value) {
        set.origC = document.getElementById("gl3").value.split(/[\s,]+/).unique();
        set.c = set.origC.length;
    }
    if (document.getElementById("gl4").value) {
        set.origD = document.getElementById("gl4").value.split(/[\s,]+/).unique();
        set.d = set.origD.length;
    }


    set.iab = intersect(set.origA, set.origB);
    set.iac = intersect(set.origA, set.origC);
    set.iad = intersect(set.origA, set.origD);
    set.ibc = intersect(set.origB, set.origC);
    set.ibd = intersect(set.origB, set.origD);
    set.icd = intersect(set.origC, set.origD);

    set.iabc = intersect(set.iab, set.iac);
    set.iabd = intersect(set.iab, set.ibd);
    set.iacd = intersect(set.iac, set.icd);
    set.ibcd = intersect(set.ibc, set.icd);

    set.iabcd = intersect(set.iab, set.icd);

    set.ab = set.iab.length;
    set.ac = set.iac.length;
    set.ad = set.iad.length;
    set.bc = set.ibc.length;
    set.bd = set.ibd.length;
    set.cd = set.icd.length;

    set.abc = set.iabc.length;
    set.abd = set.iabd.length;
    set.acd = set.iacd.length;
    set.bcd = set.ibcd.length;

    set.abcd = set.iabcd.length;

    if (set.a && set.b && !set.c && !set.d) {
        twoSetBoilerPlate(set);
    }

    if (set.a && set.b && set.c && !set.d) {
        threeSetBoilerPlate(set);
    }

    if (set.a && set.b && set.c && set.d) {
        fourSetBoilerPlate(set);
    }

    $("#load_icon").hide();


}


//highlight null
function hlNull(item) {
    $.each($("#chosen").find("p"), function(key, value) {
        if (item == $(value).text().split(" ")[0]) {
            $(value).css({
                "background-color": "Yellow"
            });
        }
    });
}

/*

Alerts user if DB selection is null.

*/


function nullcheck(data, a, b, c, d) {

    if (!a) {
        alert(data.s1 + " is null :-(");
        hlNull(data.s1);
    }
    if (!b) {
        alert(data.s2 + " is null :-(");
        hlNull(data.s2);
    }
    if (!c) {
        alert(data.s3 + " is null :-(");
        hlNull(data.s3);
    }
    if (!d) {
        alert(data.s4 + " is null :-(");
        hlNull(data.s4);
    }

}


function prep_export() {


    var ids = ["#cA", "#cB", "#cC", "#cD", "#cAB", "#cAC", "#cAD", "#cBC", "#cBD", "#cCD", "#cABC", "#cABD", "#cACD", "#cBCD", "#cABCD"];

    var csvContent = "data:text/tab-separated-values;charset=utf-8,";


    for (var i = 0; i < ids.length; i++) {

        csvContent += $(ids[i]).attr('id') + "\t";

    }

    csvContent += "\n";
    var longest = 0;

    for (var i = 0; i < ids.length; i++) {
        var bid = $(ids[i]).find('p').text().split(",").length;
        if (bid > longest) {
            longest = bid;
        }
    }


    for (var j = 0; j < longest; j++) {
        for (var i = 0; i < ids.length; i++) {

            var unit = $(ids[i]).find('p').text().split(",");

            if (unit[j]) {
                csvContent += $.trim(unit[j]) + "\t";
            } else {
                csvContent += "\t";
            }
        }
        csvContent += "\n";
    }



    console.log(csvContent);
    var encodedUri = encodeURI(csvContent, 'genelist.tsv');
    window.open(encodedUri);



}




/*

Fetch intersection data from the server when Find Intersection button is clicked.
The function below posts the user's selection to the server and calls either
twoSetBoilerPlate() or threeSetBoilerPlate() depending one whether or not the user
selected two or three samples.

*/


$('#somebutton').click(function() {

    //don't let the user spam ajax requests
    if (ajaxInProg) {
        alert("warning,algorithm is working")
    } else {

        var sample1 = "",
            sample2 = "",
            sample3 = "",
            sample4 = "";

        $("#load_icon").show();

        var e = document.getElementById("ddlViewBy");
        var strUser = e.options[e.selectedIndex].value;

        var sampleSize = $("#chosen").find("p").length

        sample1 = $("#chosen").find("p").eq(0).text().split(" ")[0];
        sample2 = $("#chosen").find("p").eq(1).text().split(" ")[0];
        sample3 = $("#chosen").find("p").eq(2).text().split(" ")[0];
        sample4 = $("#chosen").find("p").eq(3).text().split(" ")[0];

        var data = {
            "key": strUser,
            "s1": sample1,
            "s2": sample2,
            "s3": sample3,
            "s4": sample4,
            "u_db": $("#selectDb option:selected").val()
        };



        ajaxInProg = true;

        if (data.u_db) {


            $.ajax({
                type: "POST",
                url: "/ia/",
                data: data,
                timeout: 180000,

                success: function(res) {

                    clearLists();


                    if (res.error) {
                        alert("error");
                    } else {


                        if (sampleSize == 2) {

                            if (res.origA && res.origB) {
                                twoSetBoilerPlate(res);
                            } else {
                                nullcheck(data, res.origA, res.origB, 1, 1);
                            }
                        } else if (sampleSize == 3) {

                            if (res.origA && res.origB && res.origC) {
                                threeSetBoilerPlate(res);
                            } else {
                                nullcheck(data, res.origA, res.origB, res.origC, 1);
                            }
                        } else if (sampleSize == 4) {

                            if (res.origA && res.origB && res.origC && res.origD) {
                                fourSetBoilerPlate(res);
                            } else {
                                nullcheck(data, res.origA, res.origB, res.origC);
                            }
                        }

                    }


                    $("#load_icon").hide();
                    ajaxInProg = false;
                },

                error: function(request, status, err) {
                    if (status == "timeout") {
                        alert("uhoh... looks like the server is a bit slow; the query timed out");
                        $("#load_icon").hide();
                        ajaxInProg = false;
                    }
                }


            });


        } else{

            alert("no connect ;|");
            $("#load_icon").hide();

        }








    }
});


/*

Tabs helper function

*/


$("ul.nav-tabs a").click(function(e) {
    e.preventDefault();
    $(this).tab('show');
});


//convert to .png


d3.select("#save").on("click", function() {

    $("canvas").hide();
    $("#svgdataurl").hide();
    $("#pngdataurl").hide();

    var html = d3.select("svg")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    //console.log(html);
    var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
    var img = '<img src="' + imgsrc + '">';
    d3.select("#svgdataurl").html(img);



    var canvas = document.querySelector("canvas"),
        context = canvas.getContext("2d");

    var image = new Image;
    image.src = imgsrc;
    image.onload = function() {
        context.drawImage(image, 0, 0);

        var canvasdata = canvas.toDataURL("image/png");

        var pngimg = '<img src="' + canvasdata + '">';
        d3.select("#pngdataurl").html(pngimg);

        var a = document.createElement("a");
        a.download = "sample.png";
        a.href = canvasdata;
        a.click();
    };

    $("canvas").empty();
    $("#svgdataurl").empty();
    $("#pngdataurl").empty();

});

/*

Initialize settings below; Grab DB list from the server and
hide certain elements that are to be triggered if gene list is clicked. 
Also initialize accordion. 

*/


function init() {

    getDBs();
    from_csv();
    drawDefault();
    $("#load_icon").hide();

    $("#accordion").accordion({
        active: false,
        collapsible: true,
        heightStyle: "content",
        navigation: true
    });

}


window.onload = init;