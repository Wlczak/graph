$(function()
{
	var userName = $('#user-name').val();
	var media = $('#media').val();

	if (typeof(Storage) === 'undefined')
	{
		$('.missing .delete-trigger').hide();
		return;
	}



	var readHidden = function(userName)
	{
		var storageHidden = typeof(localStorage.hidden) !== 'undefined'
			? JSON.parse(localStorage.hidden)
			: {};
		if (userName in storageHidden)
		{
			return storageHidden[userName];
		}
		return [];
	}



	var writeHidden = function(userName, hidden)
	{
		//filter out duplicates
		hidden = hidden.filter(function(el,index,arr)
		{
			return index == arr.indexOf(el);
		});
		var storageHidden = typeof(localStorage.hidden) !== 'undefined'
			? JSON.parse(localStorage.hidden)
			: {};
		storageHidden[userName] = hidden;
		//filter out empty users
		for (var key in storageHidden)
		{
			if (storageHidden[key].length == 0)
			{
				delete storageHidden[key]; //it's safe in js
			}
		}
		localStorage.hidden = JSON.stringify(storageHidden);
	}

	var hide = function(target, fast)
	{
		var prevState = $.fx.off;
		if (fast)
		{
			$.fx.off = true;
		}
		target.addClass('hidden');
		target.slideUp(function()
		{
			var tr = target.parents('tr');
			var ul = target.parents('ul');
			target.hide();
			if (ul.find('li:not(.hidden)').length == 0)
			{
				tr.find('td').slideUp('fast');
			}
		});

		var hidden = readHidden(userName);
		var filtered = $.grep(hidden, function(item, index)
		{
			return item.indexOf(media) == 0;
		});
		$('.undelete-msg strong').text(filtered.length);
		$('.undelete-msg').slideDown();
		$.fx.off = prevState;
	}

	$('.delete-trigger').click(function(e)
	{
		var key = $(this).parents('li').attr('data-id');
		var hidden = readHidden(userName);
		hidden.push(key);
		writeHidden(userName, hidden);
		$('[data-id=\'' + key + '\']').each(function () {
			hide($(this), false);
		});
		e.preventDefault();
	});

	$('.missing .delete-trigger-alt-setting, .missing .delete-trigger-alt-version, .missing .delete-trigger-spin-off, .missing .delete-trigger-character, .missing .delete-trigger-summary, .missing .delete-trigger-side-story, .missing .delete-trigger-other').click(function (e) {
		e.preventDefault();

		var type = 'Other';

		var c = $(this).attr('class').replace('delete-trigger-', '');

		if (c === 'alt-setting') {
			type = 'Alt. setting';
		} else if (c === 'alt-version') {
			type = 'Alt. version';
		} else if (c === 'spin-off') {
			type = 'Spin-off';
		} else if (c === 'character') {
			type = 'Character';
		} else if (c === 'summary') {
			type = 'Summary';
		} else if (c === 'side-story') {
			type = 'Side story';
		}

		$('[data-tooltip="' + type + '"]').each(function () {
			var id = $(this).parents('li').attr('data-id');

			var ids = readHidden(userName);

			ids.push(id);

			writeHidden(userName, ids);

			$('[data-id="' + id + '"]').each(function () {
				hide($(this), true);
			});
		});
	});

	$('.undelete-trigger').click(function(e)
	{
		var hidden = readHidden(userName);
		var filtered = $.grep(hidden, function(item, index)
		{
			return item.indexOf(media) != 0;
		});
		writeHidden(userName, filtered);

		$('.undelete-msg').slideUp(function()
		{
			$('.missing li.hidden').each(function()
			{
				$(this).parents('tr').find('td').slideDown();
				$(this).slideDown();
			});
			$('.missing li.hidden').removeClass('hidden');
		});

		$('li.new-recommendation.hidden').each(function() {
    		$(this).removeClass('hidden').show();
		});


		e.preventDefault();
	});



	var hidden = readHidden(userName);
	for (var i in hidden)
	{
		var key = hidden[i];
		if (key.indexOf(media) == 0)
		{
			$('[data-id=\'' + key + '\']').each(function () {
				hide($(this), true);
			});
		}
	}

	$('#more-recs').click(function(e)
	{
		e.preventDefault();

		let params = new URLSearchParams(window.location.search);
		if (params.has('goal'))
		{
			goal = parseInt(params.get('goal'));
			params.set('goal', goal + 10);
			
			window.location.search = params.toString();
		} else {
			goal = 20;
			params.append('goal', goal);
			
			window.location.search = params.toString();
		}
	})

	$('#show-recs-in-list').click(function(e)
	{
		e.preventDefault();

		let params = new URLSearchParams(window.location.search);
		if (params.has('recommandInList'))
		{
			recommandInList = params.get('recommandInList') == "true" ? false : true;
			params.set('recommandInList', recommandInList);
			
			window.location.search = params.toString();
		} else {
			recommandInList = true;
			params.append('recommandInList', recommandInList);
			
			window.location.search = params.toString();
		}
	})

	$('.hide-recommendation').click(function(e)
	{
		e.preventDefault();

		var id = $(this).parents('li').attr('data-id');
		var hidden = readHidden(userName);
		hidden.push(id);
		writeHidden(userName, hidden);

		$('[data-id=\'' + id + '\']').each(function () {
			hide($(this), true);
		});
	})
});
