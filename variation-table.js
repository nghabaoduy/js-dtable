//version 1.0.0

variationTable={
	numberOfRow:0,
	numberOfCol:0,
	currentPage:0,
	numberOfPage:0,
	selectedRowIndex:-1,
	jsonData:null,
	jsonDataUrl:null,
	tableId:null,
	table:null,
	tableBody:null,
	tablePage:null,
	initTable:function(tableId, dataUrl, numOfCol, numOfRow) {
		this.tableId = tableId;
		this.jsonDataUrl = dataUrl;
		this.numberOfCol = numOfCol;
		this.numberOfRow = numOfRow;
		if (this.tableId !== null) {
			this.table = $(this.tableId);
			this.tablePage = $(this.tableId + '-pagination');
			this.tableBody = this.table.children('tbody');
			this.refeshTableData();
			this.reloadJsonData();
		}
		this.initPagination();
	},
	reloadJsonData:function() {
		////console.log('reload data');
		var parent = this;
		if (this.jsonDataUrl !== null) {
			$.ajax({
				url: this.jsonDataUrl,
				type: 'GET',
				dataType: 'json',
			})
			.done(function(){
				parent.jsonData = null;
			})
			.fail(function() {
				parent.jsonData = null;
			})
			.always(function(response) {
				parent.jsonData = response;
				parent.numberOfPage = Math.ceil(response.length / parent.numberOfRow) -1;
				parent.refeshTableData();
				parent.initPagination();
			});
		}
	},
	showRowAtIndex:function(index) {
		var currentData = this.jsonData[index];
		//console.log(currentData);
		var row = this.tableBody.append(
				$('<tr>').attr('onclick', 'variationTable.selectedRowAtElement(this)').append(
					$('<td>').text(index + 1)
				).append(
					$('<td>').text(currentData.sku)
				).append(
					$('<td>').text(currentData.option_name_1? currentData.option_name_1 : 'N/A')
				).append(
					$('<td>').text(currentData.option_name_2? currentData.option_name_2 : 'N/A')
				).append(
					$('<td>').text(currentData.option_name_3? currentData.option_name_3 : 'N/A')
				).append(
					$('<td>').text(currentData.price? 'S$'+currentData.price : 'N/A')
				)
			);
	},
	selectedRowAtElement:function(elem) {
		var row = $(elem);

		var lastRow = $('tr.selectedRow', this.table);
		lastRow.removeClass('selectedRow');

		row.addClass('selectedRow');
		var rowindex = row.index();
		if (this.selectedRowIndex === rowindex) {
			this.selectedRowIndex = -1;
			row.removeClass('selectedRow');
		} else {
			this.selectedRowIndex = rowindex;
		}


		//this.selectedRowAtIndex(rowindex);
	},
	selectedObject:function() {
		if (this.selectedRowIndex === -1) {
			return null;
		}
		var selectedObjectIndex = this.selectedRowIndex + (this.currentPage * this.numberOfRow);
		return this.jsonData[selectedObjectIndex];
	},
	selectedRowAtIndex:function(index) {
		//deselected all

		//selected 1
	},
	getRowAtIndex:function(index) {

	},
	refeshTableData:function() {
		this.emptyTable();
		if (this.jsonData === null) {
			//console.log('no data');
			this.showEmptyTable();
		} else {
			//console.log('have data');
			for(var i = 0; i < this.numberOfRow; i++){
				var currentIndex = i + ((this.currentPage) * this.numberOfRow);
				if (currentIndex < this.jsonData.length) {
					this.showRowAtIndex(currentIndex);
				}
			}
		}
	},
	initPagination:function() {
		var parent = this;
		this.tablePage.empty();
		//Prev
		var linkPrev = this.tablePage.append(
				$('<li>').addClass('disabled').attr('id', 'prevButton').append(
					$('<a>').attr('aria-label', 'Previous').attr('href', '#prev').attr('onclick', 'variationTable.showPrevPage(this)').append(
						$('<span>').attr('aria-hidden', 'true').text('«')
					)
				)
			);
		//page
		for(var i = 0; i < this.numberOfPage+1; i++){
			//console.log('11');
			var linkPage = this.tablePage.append(
				$('<li>').addClass('pageIndex').attr('id', 'pageIndex-'+(i+1)).append(
					$('<a>').attr('href', '#pageIndex' + (i+1)).attr('onclick', 'variationTable.showPageAtIndex('+i+')').text((i+1))
				).addClass((i === parent.currentPage) ? 'active' : '')
			);
		}

		//next
		var linkNext = this.tablePage.append(
			$('<li>').attr('id', 'nextButton').append(
				$('<a>').attr('aria-label', 'Previous').attr('href', '#prev').attr('onclick', 'variationTable.showNextPage(this)').append(
					$('<span>').attr('aria-hidden', 'true').text('»')
				)
			)
		);
	},
	showPrevPage:function(prevButton) {
		this.currentPage--;
		var link = $(prevButton).parent();
		if (this.currentPage <= 0) {
			link.addClass('disabled');
			this.currentPage=0;
		} else {
			link.removeClass('disabled');
		}
		$('#nextButton').removeClass('disabled');
		this.reloadPageNumber(this.currentPage+1);
		this.refeshTableData();
	},
	showNextPage:function(nextButton) {
		this.currentPage++;
		var link = $(nextButton).parent();
		//console.log('link');
		//console.log(link);
		if (this.currentPage >= this.numberOfPage) {
			link.addClass('disabled');
			this.currentPage= this.numberOfPage;
		} else {
			link.removeClass('disabled');
		}
		$('#prevButton').removeClass('disabled');
		this.reloadPageNumber(this.currentPage+1);
		this.refeshTableData();
	},
	showPageAtIndex:function(index) {

	},
	reloadPageNumber:function(newNumber) {
		var oldIndex = $('.pageIndex.active');
		oldIndex.removeClass('active');
		var newIndex = $('#pageIndex-'+newNumber+'.pageIndex');
		newIndex.addClass('active');
		//console.log('old index link '+oldIndex);
		//console.log(oldIndex);
	},
	showEmptyTable:function() {
		var row = this.tableBody.append(
				$('<tr>').append(
					$('<td>').attr('colspan', this.numberOfCol).attr('align', 'center').text('No Data')
				)
			);
	},
	emptyTable:function() {
		this.tableBody.empty();
	}
}