/**
 * Created by imeeder on 2/29/16.
 */

function renderCampusList()
{
	$.ajax({
		type: 'GET',
		url: '/connections/index',
		success: function(view) {
			$('#connections-crumb ~ li').remove();
			$('#connections-crumb').html($('#connections-crumb a').html());
			$('.content').html(view);
		}
	})
}

function renderMinistries(campusID, campusName) { 
	$.ajax({
		type: 'GET',
		url: '/connections/campus/' + campusID,
		success: function(view) {
			$('#campus-crumb ~ li').remove();
			$('#campus-crumb').remove();
			var previous = $('.breadcrumb li').last();
			previous.html("<a href='#' onclick='renderCampusList()'>Connections</a>");
			$('.breadcrumb').append("<li id='campus-crumb' data-campus-name='" + campusName + "' data-campus-id='" + campusID + "'>" + campusName + "</li>");
			$('.content').html(view);
		}
	});
}

function renderCommunityGroups(ministryID, ministryName) {
	$.ajax({
		type: "GET",
		url: '/connections/ministry/' + ministryID,
		success: function(view) {
			$('#ministry-crumb ~ li').remove();
			$('#ministry-crumb').remove();
			var previous = $('.breadcrumb li').last();
			previous.html("<a href='#' onclick='renderMinistries(\"" + previous.attr('data-campus-id') + "\", \"" + previous.attr('data-campus-name') + "\")'>" + previous.attr('data-campus-name') + "</a>");
			$('.breadcrumb').append("<li id='ministry-crumb' data-ministry-name='" + ministryName + "' data-ministry-id='" + ministryID + "'>" + ministryName + "</li>");
			$('.content').html(view);
            $('textarea').keyup(function() {
                var id = $(this).parent().siblings('input').val();
                $.ajax({
                    type: 'PATCH',
                    url: '/api/ministryquestions/' + id,
                    data: {
                        question: $(this).val()
                    }
                });
            });
            $('select').change(function() {
                var id = $(this).parent().siblings('input').val();
                $.ajax({
                    type: 'PATCH',
                    url: '/api/ministryquestions/' + id,
                    data: {
                        type: $(this).val()
                    }
                });
            });
            $('input[type="checkbox"]').change(function() {
                var id = $(this).parent().siblings('input').val();
                $.ajax({
                    type: 'PATCH',
                    url: '/api/ministryquestions/' + id,
                    data: {
                        required: $(this).is(':checked')
                    }
                });
            });
            $("#add-question").click(function() {
                console.log('click');
                window.location.href = '/keystone/ministry-questions';
            });
		}
	})
}

function renderCommunityGroupInfo(groupID, groupName) {
	var previous = $('.breadcrumb li').last();
	previous.html("<a href='#' onclick='renderCommunityGroups(\"" + previous.attr('data-ministry-id') + "\", \"" + previous.attr('data-ministry-name') + "\")'>" + previous.attr('data-ministry-name') + "</a>");
	$('.breadcrumb').append("<li id='ministry-crumb'>" + groupName + "</li>");
	$('.content').load('/connections/communityGroup/' + groupID);  
}

function backOne() {
	var crumbs = $(".breadcrumb li a");
	if (crumbs.length > 1)
		crumbs.last().click();
}

function initTagit()
{
	$.ajax({
		type: 'GET',
		url: '/api/ministryquestionoptions',
		success: function(options) {
			var tags = [];
			options.forEach(function(option) {
				tags.push(option.value);
			})
			$('.taggable').tagit({
				showAutocompleteOnFocus: true,
			});
            $('.taggable').tagit("option", "beforeTagAdded", function(event, ui) {
                var val = ui.tag.find('.tagit-label').html();
                if ($('.taggable').tagit("option", "availableTags").indexOf(val) == -1) {
                    $("#new-option").html(val);
                    $("#active-tagit").html(ui.tag.parent().attr("id"));
                    $(".modal").modal();
                    return false;
                }
                return true;
            });
            $('.taggable').tagit("option", "afterTagAdded", function(event, ui) {
                $.ajax({
                    type: 'PATCH',
                    url: '/api/ministryquestions/' + ui.tag.parent().attr("id").split('_')[1] + "/options/",
                    data: {
                        value: ui.tag.find('.tagit-label').html()
                    }
                });
            });
            $('.taggable').tagit("option", "beforeTagRemoved", function(event, ui) {
                $.ajax({
                    type: 'DELETE',
                    url: '/api/ministryquestions/' + ui.tag.parent().attr("id").split('_')[1] + "/options/" + ui.tag.find('.tagit-label').html()
                });
            });
			$('.taggable').tagit("option", "availableTags", tags);
		}
	})
}

function typeSelectInit()
{
	$('select').change(function(){
		if ($(this).val() != 'select') {
			$(this).parent().siblings().last().hide();
		}
		else {
			$(this).parent().siblings().last().show();
		}
	})
}

function addNewOption(option, tagit_id)
{
    $.ajax({
        type: 'POST',
        url: '/api/ministryquestionoption',
        data: {
            value: option
        },
        success: function(res) {
            $('.taggable').tagit("option", "availableTags").push(option);
            $('#' + tagit_id).tagit("createTag", option);
        } 
    });
}