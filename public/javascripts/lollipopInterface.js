     $("#bb").hide();
    $("#prs").chosen({
        width: "25%"
    });
    
    $("#genes").chosen({
        width: "25%"
    });
    $(".spinner").hide();

    //  $("#tog").hide();

    $('input[type=radio][name=up]').change(function() {
        if (this.value == 'projectRun') {
            $("#aa").hide();
            $("#bb").show();
            $("#__prs").chosen({
                width: "25%"
            });
            $("#prs").val('-- select a study --').trigger("chosen:updated");
            $("#genes").val('-- select a gene --').trigger("chosen:updated");



        }
        if ( this.value == 'study') {
            $("#bb").hide();
            $("#aa").show();
            $("#genes").val('-- select a gene --').trigger("chosen:updated");
            
        }
        
    });


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

    var findGenes = function(flag) {

        $("#mysvg").empty();
        $("#aaa").empty();
        $(".spinner").show();
        $('#genes').empty();






        if(!flag){

            var q = { qy: $("#prs").val().toString() };
        
            $.getJSON("/lol/genes", q, function(data) {


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

        }

        if(flag){

            var q = { qy: $("#__prs").val().toString() };

            if ( $("#__prs").val().length > 0 ) {

                console.log(q);

                $.getJSON("/lol/genesPR", q, function(data) {

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

            }
        }


    };



    var geneSelected = function() {


        $(".spinner").show();
        $("#mysvg").empty();

        var pr = {
            qy: "",
            qy2: $("#genes").val(),
            study_or_pr: ""
        };


        if($("#bb").is(":visible")) {
            pr['study_or_pr']="__pr";
            pr['qy'] = $("#__prs").val().toString();
        } else{
            pr['study_or_pr']="__stud";
            pr['qy'] = $("#prs").val().toString();
        }

            
        $.getJSON("/lol/LOLLIPOP", pr, function(data) {

            console.log(data);

            //    $("#tog").hide();
            $("#mysvg").append(data.svg);
            console.log("test");

        });



        
        $("#aaa").text(pr.qy2);
        $(".spinner").hide();



    };