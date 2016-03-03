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
		}
	})
}

function renderCommunityGroupInfo(groupID, groupName) {
	var previous = $('.breadcrumb li').last();
	previous.html("<a href='#' onclick='renderCommunityGroups(\"" + previous.attr('data-ministry-id') + "\", \"" + previous.attr('data-ministry-name') + "\")'>" + previous.attr('data-ministry-name') + "</a>");
	$('.breadcrumb').append("<li id='ministry-crumb'>" + groupName + "</li>");
	$('.content').html('');
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
		url: '/api/ministryquestionoption',
		success: function(options) {
			var tags = [];
			options.forEach(function(option) {
				tags.push(option.value);
			})
			$('.taggable').tagit({
				availableTags: tags,
				showAutocompleteOnFocus: true,
			});
			
			console.log($('.taggable').tagit("option", "availableTags"));
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
