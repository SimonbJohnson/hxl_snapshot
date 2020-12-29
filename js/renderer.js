/** load files **/


function loadConfig(){
	$.ajax({ 
	    type: 'GET', 
	    url: 'config.json', 
	    dataType: 'json',
	    success:function(response){
	        console.log(response);
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
	        let dataHXL = hxlProxyToJSON(response);
	        config = addDataToTable(config,response,url);
	        loadSingleData(urls,config);
	        if(urls.length==0){
	        	loadTemplate(config)
	        }
	    }
	});
}

function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
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
	console.log(config);
	$.ajax({ 
	    type: 'GET', 
	    url: 'template.hmd', 
	    dataType: 'text',
	    success:function(response){
	        console.log(response);
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
	let html = '<table class="table" width="{{ width }}%"><thead>{{ header }}</thead><tbody<{{ values }}</tbody></table>';

	let headerHTML = '<tr>{{ headerValues }}</tr>';
	let headerValues = '';

	tableConfig.columns.forEach(function(column){
		let align = 'left';
		if(column.align=='right'){
			align = 'right';
		}

		headerValues += '<td class="{{ align }}">{{ value }}</td>'.replace('{{ value }}',column.header).replace('{{ align }}',align);
	});

	headerHTML = headerHTML.replace('{{ headerValues }}',headerValues);
	let valuesHTML = createTableValues(tableConfig);

	html = html.replace('{{ header }}', headerHTML).replace('{{ values }}',valuesHTML);
	html = html.replace('{{ width }}',tableConfig.width);
	return html
}

function createTableValues(tableConfig){
	let valuesHTML = '';
	let columnPositions = [];
	tableConfig.columns.forEach(function(column){
		let found = false;
		tableConfig.data[0].forEach(function(tag,i){
			if(tag==column.hxltag){
				found = true
				columnPositions.push(i);
			}
		});
		if(!found){
			columnPositions.push(null);
		}		
	});

	let start = tableConfig.include[0];
	let end = tableConfig.include[1];

	tableConfig.data.slice(start,end).forEach(function(row){

		let rowHTML = '<tr>{{ values }}</tr>';
		let values = '';



		columnPositions.forEach(function(c,i){
			let value = row[c]
			let align = 'left';
			console.log(tableConfig.columns[i]);
			if(tableConfig.columns[i].align=='right'){
				align = 'right';
			}
			values += '<td class="{{ align }}"">{{ value }}</td>'.replace('{{ value }}',value).replace('{{ align }}',align);
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
}

loadConfig();