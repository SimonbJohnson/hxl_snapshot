# HXL Snapshot

Quickly table for reports from HXL sources suitable for conversion to PDFs

## Demo outputs

- [HDX Covid-19 report](https://tools.humdata.org/snap?output=pdf&pdfFormat=A4&pdfLandscape=true&pdfMarginTop=35&pdfMarginLeft=20&pdfMarginRight=20&url=https://simonbjohnson.github.io/hxl_snapshot/snapshots/hdx-covid/)
- [IFRC appeals summary](https://tools.humdata.org/snap?output=pdf&pdfFormat=A4&pdfLandscape=true&pdfMarginTop=35&pdfMarginLeft=20&pdfMarginRight=20&url=https://simonbjohnson.github.io/hxl_snapshot/snapshots/ifrc-active-appeals-drefs/)
- [UN stand By Partnerships deployment overview]()

## Getting started

Copy the template folder in the snapshot folder to start a new snapshot

This contains:

- assets folder: use this folder to store assets unqiue to your report such as branding icons
- config.json: this is used to define the branding and table tags
- extend.css: if you wish to change the default styling it can be done here
- index.html: the raw html page you. This does not have to be changed by default
- template.hmd: A markdown document for creating report structure.

### Creating your report structure

Open up template.hmd in a text editor. Using standard markdown you can create your report. Use this [guide](https://www.markdownguide.org/cheat-sheet/) for markdown syntax.

In addition you can write custom HTML as need such as to create a two column report. By default Bootstrap v3 is loaded via the index HTML file. Feel free to replace this with your preferred framework.

There are then additional custom tags you can use to create your dynamic report.

{{ branding }} - This is where to position your branding images as defined in config.json

{{ table_n }} - This inserts a table as defined in your config.json. You can have as many tables as you want by incrementing n e.g. {{ table_1 }}, {{ table_2 }}

{{ year }} - inserts current year

{{ month }} -  inserts current month

{{ day }} -  inserts current day in local language

{{ time }} - inserts current timestamp

### Creating your config.json

Before starting it is worth reviewing the config.json from the demos.

**Config file**
Defines the image branding for the documents. This is a list of images with source and height attributes that can be placed into the document.  They are presented as a horizontal row

| Attribute | Description | Type/Values | Optional |
| ----------| ----------- | -----| -------- |
| branding | where the document branding sits | object |  |
| tables | A list of table definitions | list |  |

**brandings**

| Attribute | Description | Type/Values | Optional |
| --------- | ----------- | -----| -------- |
| images | contains list of image objects | list |  |


**images**

| Attribute | Description | Type/Values | Optional |
| --------- | ----------- | -----| -------- |
| src | src for the image, usually contained in the asset files | string | |
| height | the height of the image | integer | |

**tables**

Definitions of tables to be called in template using {{ table_n }}.  {{ table_1 }} refers to first definition in this list.

| Attribute | Description | Type/Values | Optional |
| --------- | ----------- | -----| -------- |
| src | A link to a hxl Proxy source URL. It must be in JSON list format including headers | string | |
| columns | A list of column definition for the table | list | |
| include | A list with the start and end row for the table. The first row of data is row 0 | list[integer,integer] | Optional (default: include all rows) |
| width | Width of table in percent | integer | Optional (default: 100) |

**columns**
| Attribute | Description | Type/Values | Optional |
| --------- | ----------- | -----| -------- |
| hxltag | HXL tag to match for this column. Currently it uses exact matching e.g. #org != #org + implementing. If multiple matches are found then multiple columns are created | string ||
| header | Text to be displayed as header for column | string | Optional (default: header used in source file |
| align | Choose to align column to the left or right | 'left','right' | Optional (default: left |
| bar | Settings for including a bar with length based on the value of the column | list | Optional (default: no bar ) |
| arrow | Settings for including an arrow with direction based on the value of the column | list | Optional (default: no bar ) |
| format | An object with options to format a column's value | object | Optional (default: No formatting ) |
| colspan | Set the width of the column | integer |  Optional (default: 1 ) |

**bar**
| Position | Description | Type/Values | Optional |
| --------- | ----------- | -----| -------- |
| 0 | Boolean values on whether to include a bar | true, false | |
| 1 | An object stating the minimum and maximum values to cap at | {min:number,max:number,color:#hexcode} | Optional (default: min and max for the column(s), color = #1ebfb3 |

**arrow**

An arrow that rotates from -45 degrees downards to 45 degrees upwards based on the min/max value

| Position | Description | Type/Values | Optional |
| --------- | ----------- | -----| -------- |
| 0 | Boolean values on whether to include a bar | true, false | |
| 1 | An object stating the minimum and maximum values to cap at | {min:number,max:number} | Optional (default: min and max for the column(s) |

**formatting**

Options format the value for display

| Attribute | Description | Type/Values | Optional |
| --------- | ----------- | ----------- | -------- |
| pre | Text to display before the value | string | Optional |
| post | Text to display after the value | string | Optional |
| commas | Whether to insert commas per 1000s into numbers | true, false | Optional (default: false) |
| roundsf | How many significant figures to round to | integer | Optional |

