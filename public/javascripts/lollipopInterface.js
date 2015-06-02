    $("#prs").chosen({
        width: "95%"
    });
    $("#genes").chosen({
        width: "95%"
    });
    $(".spinner").hide();
    //  $("#tog").hide();


    $('#right-button').click(function() {
        console.log($('#mysvg').find("svg").attr("width"));
        var totalwidth = $('#mysvg').find("svg").attr("width");
        event.preventDefault();

        if ($('#mysvg').css('marginLeft').replace(/[^-\d\.]/g, '') > -(totalwidth - 600)) {

            $('#mysvg').animate({

                marginLeft: "-=200px"
            }, "fast");

        }
        console.log($('#mysvg').css('marginLeft').replace(/[^-\d\.]/g, ''));
    });


    $('#left-button').click(function() {
        console.log($('#mysvg').find("svg").attr("width"));
        var totalwidth = $('#mysvg').find("svg").attr("width");
        event.preventDefault();

        if ($('#mysvg').css('marginLeft').replace(/[^-\d\.]/g, '') < 0) {

            $('#mysvg').animate({

                marginLeft: "+=200px"
            }, "fast");

        }
        console.log($('#mysvg').css('marginLeft').replace(/[^-\d\.]/g, ''));
    });

    var findGenes = function() {

        $("#mysvg").empty();
        $("#aaa").empty();
        $(".spinner").show();

        $('#genes').empty();
        var pr = {
            qy: $("#prs").val()
        };


        $.getJSON("/lol/genes", pr, function(data) {

            console.log(data);

            $('#genes').append($("<option disabled selected> -- select a gene -- </option>  "));
            $.each(data, function(index, val) {

                $('#genes')
                    .append($("<option></option>")
                        .attr("value", val)
                        .text(val));

            });

            $(".spinner").hide();
            //    $("#tog").show();

            $("#genes").trigger("chosen:updated");


        });


    };



    var geneSelected = function() {

        $(".spinner").show();
        $("#mysvg").empty();
        var pr = {
            qy: $("#prs").val(),
            qy2: $("#genes").val()
        };



        $.getJSON("/lol/LOLLIPOP", pr, function(data) {

            console.log(data);

            //    $("#tog").hide();
            $("#mysvg").append(data.svg);
            console.log("test");



        });

        $("#aaa").text(pr.qy2);
        $(".spinner").hide();





    };