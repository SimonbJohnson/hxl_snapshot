/** load files **/


function loadConfig(){
	$.ajax({ 
	    type: 'GET', 
	    url: 'config.json', 
	    dataType: 'json',
	    success:function(response){
	        loadData(response)
	    }
	});
}

function compileURLs(config){
	let urls = [];
	config.tables.forEach(function(table){
		if(urls.indexOf(table.src)==-1){
			urls.push(table.src);
		}
	});
	return urls
}

function loadSingleData(urls,config){
	let url = urls.pop();
	$.ajax({ 
	    type: 'GET', 
	    url: url, 
	    dataType: 'json',
	    success:function(response){
	        config = addDataToTable(config,response,url);
	        loadSingleData(urls,config);
	        if(urls.length==0){
	        	loadTemplate(config)
	        }
	    }
	});
}

function addDataToTable(config,data,url){
	config.tables.forEach(function(table){
		if(table.src==url){
			table.data = data;
		}
	});
	return config
}

function loadData(config){
	let urls = compileURLs(config);
	config = loadSingleData(urls,config)
}

function loadTemplate(config){
	$.ajax({ 
	    type: 'GET', 
	    url: 'template.hmd', 
	    dataType: 'text',
	    success:function(response){
	        render(response,config);
	    }
	});
}

/** parse and render files **/

function parseMarkdown(markdown){
	let html = marked(markdown);
	return html;
}

function customTags(html,config){
	html = addBranding(html,config);
	html = addDateTags(html);
	html = addLayoutTags(html);
	html = addTables(html,config);
	return html;
}

function addBranding(html,config){
	let brandingHTML = '<div class="branding">{{ images }}</div>';
	let imagesHTML = '';
	let imageHTML = '<img src="{{ source }}" height="{{ height }}"/>';

	config.branding.images.forEach(function(image){
		imagesHTML += imageHTML.replace('{{ source }}',image.src).replace('{{ height }}',image.height);
	});	

	brandingHTML = brandingHTML.replace('{{ images }}',imagesHTML);
	html = html.replaceAll('{{ branding }}',brandingHTML);

	return html
}

function addDateTags(html){
	let currentTime = new Date();
	let month = currentTime.toLocaleString('default', { month: 'long' });
	let day = currentTime.getDate();
	let year = currentTime.getFullYear();
	let time = currentTime.toUTCString().substring(17,22);

	html = html.replaceAll('{{ day }}',day);
	html = html.replaceAll('{{ month }}',month);
	html = html.replaceAll('{{ year }}',year);
	html = html.replaceAll('{{ time }}',time);

	return html;
}

function addLayoutTags(html){
	html = html.replace('{{ page break }}','<div class="page-break"></div>');
	return html;
}

function addTables(html,config){
	config.tables.forEach(function(table,i){
		let tableHTML = createTable(table);
		let tableTag = '{{ table_'+(i+1)+' }}';
		html = html.replaceAll(tableTag,tableHTML);
	});
	return html;
}

function createTable(tableConfig){

	let columnPositions = getColumnPositions(tableConfig);

	let html = '<table class="table" style="width: {{ width }}%"><thead>{{ header }}</thead><tbody<{{ values }}</tbody></table>';

	let headerHTML = '<tr>{{ headerValues }}</tr>';
	let headerValues = '';

	tableConfig.columns.forEach(function(column,i){
		let align = 'left';
		if(column.align=='right'){
			align = 'right';
		}
		console.log(columnPositions);
		console.log(columnPositions[i]);
		columnPositions[i].forEach(function(c){
			headerValues += '<td class="{{ align }}">{{ value }}</td>'.replace('{{ value }}',column.header).replace('{{ align }}',align);
		});
	});

	headerHTML = headerHTML.replace('{{ headerValues }}',headerValues);
	let valuesHTML = createTableValues(tableConfig,columnPositions);

	html = html.replace('{{ header }}', headerHTML).replace('{{ values }}',valuesHTML);
	html = html.replace('{{ width }}',tableConfig.width);
	return html
}

function addBar(value,column,i){
	let min = column.bar[1].min;
	let max = column.bar[1].max;
	let width = 50
	let length = (value-min)/(max-min)*width;
	let greenBarHTML = '<div class="bar bar_{{ i }}" style="width: {{ length }}px"></div>'.replace('{{ length }}',length).replace('{{ i }}',i);
	let greyBarHTML = '<div class="bar bar_{{ i }} greybar" style="width: {{ length }}px"></div>'.replace('{{ length }}',(width-length)).replace('{{ i }}',i);
	let barHTML = greyBarHTML + greenBarHTML;
	return barHTML;
}

function addArrow(value,column,i){
	let min = column.arrow[1].min;
	let max = column.arrow[1].max;
	let rotate = d['#affected+avg+change+infected+pct+per100000']/10*-45;
	if(rotate<-45){
		rotate = -45
	}
	if(rotate>45){
		rotate = 45
	}
	$('#arrow_'+i).css({"transform": "rotate("+rotate+"deg)"});
	return arrowHTML;
}

function getColumnPositions(tableConfig){
	let columnPositions = []
	tableConfig.columns.forEach(function(column,i){
		let found = false;
		let columnList = [];
		tableConfig.data[0].forEach(function(tag,j){
			if(tag==column.hxltag){
				found = true
				columnList.push(j);
			}
		});
		if(!found){
			columnPositions.push(null);
		} else {
			columnPositions.push(columnList);
		}
	});
	return columnPositions;
}

function setMinMax(tableConfig,columnPositions){
	tableConfig.columns.forEach(function(column,j){
		let columnsPositionSub = columnPositions[j];
		if(column.bar!=undefined && column.bar[0]){
			if(column.bar[1] ==  undefined){
				column.bar.push({});
			}
			if(column.bar[1].min == undefined){
				tableConfig.data.forEach(function(row,k){
					if(k==0){
						column.bar[1].min = tableConfig.data[1][columnsPositionSub[0]]
					} else {
						columnsPositionSub.forEach(function(colPos){
							let value =row[colPos]*1
							if(value<column.bar[1].min){
								column.bar[1].min = value;
							}							
						});

					}
				});
			}
			if(column.bar[1].max == undefined){
				tableConfig.data.forEach(function(row,k){
					if(k==0){
						column.bar[1].max = tableConfig.data[1][columnsPositionSub[0]]
					} else {
						columnsPositionSub.forEach(function(colPos){
							let value = row[colPos]*1
							if(value>column.bar[1].max){
								column.bar[1].max = value;
							}
						});
					}
				});
			}
		}
	});
	return tableConfig
}

function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
	  val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

function formatValue(value,format){
	let formattedValue = value;
	if(!isNaN(Number(formattedValue))){
		formattedValue = Number(value);
	}
	if(format!=undefined){

		/* numerical formatting */
		if(format.roundsf != undefined){
			formattedValue = parseFloat(formattedValue.toPrecision(format.roundsf));
		}

		/* string formatting */

		if(format.commas){
			formattedValue = commaSeparateNumber(formattedValue);
		}

		if(format.pre == undefined){
			format.pre = "";
		}
		if(format.post == undefined){
			format.post = "";
		}
		formattedValue = format.pre + formattedValue + format.post;
	}
	return formattedValue;
}

function createTableValues(tableConfig,columnPositions){
	let valuesHTML = '';

	console.log(columnPositions);

	tableConfig = setMinMax(tableConfig,columnPositions);
	let tableData = tableConfig.data.slice(1);
	if(tableConfig.include!=undefined){
		let start = tableConfig.include[0];
		let end = tableConfig.include[1];
		tableData =	tableConfig.data.slice(start,end)
	}


	tableData.forEach(function(row){

		let rowHTML = '<tr>{{ values }}</tr>';
		let values = '';

		columnPositions.forEach(function(columnPositionsSub,i){
			columnPositionsSub.forEach(function(c,j){
				let value = row[c]
				let align = 'left';
				let column = tableConfig.columns[i]
				if(column.align=='right'){
					align = 'right';
				}
				let barHTML = '';
				if(column.bar!=undefined && column.bar[0]){
					barHTML = addBar(value,column,j);
				}
				let formattedValue = formatValue(value,column.format);
				values += '<td class="{{ align }}"">{{ value }}{{ bar }}</td>'.replace('{{ value }}',formattedValue).replace('{{ align }}',align).replace('{{ bar }}',barHTML);
			});
		})
		rowHTML = rowHTML.replace('{{ values }}',values);
		valuesHTML += rowHTML;
	});
	return valuesHTML;
}

function render(response,config){
	let html = customTags(response,config);
	html = parseMarkdown(html);
	$('#content').html(html);
	console.log(config);
}

loadConfig();