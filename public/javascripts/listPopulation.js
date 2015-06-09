



//populate db selection

function populateCollectionList(data) {



    for (var item in data) {

        console.log(data[item]);

        if (data[item].name == "germline" || data[item].name == "tumor") {
            $('#selectDb')
                .append($("<option></option>")
                    .text(data[item].name));
        }
    }

    $("#loading").hide();

}



//populate list of samples

function populateSampleList(data) {

    data = data.sort();

    $.each(data, function(key, value) {
        $('#zz')
            .append($("<option></option>")
                .attr("value", value)
                .on("click", addToList)
                .text(value));
    });



    $("#zz").val('-- select projectRun --').trigger("chosen:updated");
    $("#loading").hide();

}




//get list of samples after clicking get samples button

function getSampleList() {

    //$("#zz").empty();

    $.post('/ia/loadList', {
        option: $("#selectDb option:selected").val()
    }, function(res) {

        $("#loading").show();

        if (!res) {
            console.log("null");
            $("#loading").text("timed out");
        }

        else{
            if(!res.error){
                populateSampleList(res);
            }
        }

    });


}



//get DBs on load


function getDBs() {

    $("#loading").hide();

    $.get("/ia/loadDb", function(data) {
        populateCollectionList(data);
    });


}





/*

This adds a user's sample selection from the DB list to the area above the accordion
 (that shows the samples selected thus far).

*/

function addToList() {

    if ($("#chosen").find('p').length >= 4) {
        alert("only four samples currently supported... please remove at least one before adding");
    } else {

        var e = document.getElementById("zz");
        var strUser = e.options[e.selectedIndex].value;

        $("#chosen").append("<p>" + strUser + " <a href=\"#\" style=\"color:red;\" onclick=\"rem(this)\">X</a></p>");


    }

}




/*

This removes a sample when the user clicks the red X.

*/


function rem(a) {

    $(a).parent().remove();

}






/*

These two helper functions are involved in toggling how the main page displays.
If fromDb(), it shows the appropriate display for using samples, and from_csv() shows the appropriate
display for entering gene lists.

*/

function fromDb() {
    $("#in_csv_tab").hide();
    $("#in_db_tab").show();
    $("#query_db").show();
}

function from_csv() {
    $("#in_db_tab").hide();
    $("#in_csv_tab").show();
    $("#query_db").hide();
}





/*

Resets the accordion lists

*/

function clearLists() {

    $("#accordion").find("div").each(function(i) {
        $(this).find("h5").empty();
        this.getElementsByTagName('p')[0].innerHTML = "";
    });


}






/*

Populates the accordion lists. Has conditionals for two or three samples.

*/


function populateLists(res, m) {



    if (m == 2) {

        $("#accordion").find("div").each(function(i) {
            if (this.id == "cA") {
                $(this).find("h5").append(res.a);
                this.getElementsByTagName('p')[0].innerHTML = res.origA.join(", ");
            }
            if (this.id == "cB") {
                $(this).find("h5").append(res.b);
                this.getElementsByTagName('p')[0].innerHTML = res.origB.join(", ");
            }
            if (this.id == "cAB") {
                $(this).find("h5").append(res.ab);
                this.getElementsByTagName('p')[0].innerHTML = res.iab.join(", ");
            }

        });
    }

    if (m == 3) {
        $("#accordion").find("div").each(function(i) {


            var il, orig;
            if (this.id == "cA") {
                il = res.a;
                orig = res.origA;
            }
            if (this.id == "cB") {
                il = res.b;
                orig = res.origB;
            }
            if (this.id == "cC") {
                il = res.c;
                orig = res.origC;
            }
            if (this.id == "cAB") {
                il = res.ab;
                orig = res.iab;
            }
            if (this.id == "cAC") {
                il = res.ac;
                orig = res.iac;
            }
            if (this.id == "cBC") {
                il = res.bc;
                orig = res.ibc;
            }
            if (this.id == "cABC") {
                il = res.abc;
                orig = res.iabc;
            }

            if (il && orig) {

                $(this).find("h5").append(il);
                this.getElementsByTagName('p')[0].innerHTML = orig.join(", ");

            }



        });

    }


    if (m == 4) {


        $("#accordion").find("div").each(function(i) {




            var il, orig;
            if (this.id == "cA") {
                il = res.a;
                orig = res.origA;
            }
            if (this.id == "cB") {
                il = res.b;
                orig = res.origB;
            }
            if (this.id == "cC") {
                il = res.c;
                orig = res.origC;
            }
            if (this.id == "cD") {
                il = res.d;
                orig = res.origD;
            }



            if (this.id == "cAB") {
                il = res.ab;
                orig = res.iab;
            }
            if (this.id == "cAC") {
                il = res.ac;
                orig = res.iac;
            }
            if (this.id == "cAD") {
                il = res.ad;
                orig = res.iad;
            }


            if (this.id == "cBC") {
                il = res.bc;
                orig = res.ibc;
            }
            if (this.id == "cBD") {
                il = res.bd;
                orig = res.ibd;
            }
            if (this.id == "cCD") {
                il = res.cd;
                orig = res.icd;
            }



            if (this.id == "cABC") {
                il = res.abc;
                orig = res.iabc;
            }
            if (this.id == "cABD") {
                il = res.abd;
                orig = res.iabd;
            }
            if (this.id == "cACD") {
                il = res.acd;
                orig = res.iacd;
            }
            if (this.id == "cBCD") {
                il = res.bcd;
                orig = res.ibcd;
            }


            if (this.id == "cABCD") {
                il = res.abcd;
                orig = res.iabcd;
            }


            if (il && orig) {

                $(this).find("h5").append(il);
                this.getElementsByTagName('p')[0].innerHTML = orig.join(", ");

            }



        });



    }



}