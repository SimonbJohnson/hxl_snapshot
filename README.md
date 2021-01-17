# HXL Snapshot

Quickly table for reports from HXL sources suitable for conversion to PDFs

## Demo outputs

- HDX Covid-19 report
- IFRC appeals summary
- UN stand By Partnerships deployment overview

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

| Attribute | Description | Type | Optional |
| ----------| ----------- | -----| -------- |
| branding | where the document branding sits | object |  |
| tables | A list of table definitions | list |  |

**brandings**

| Attribute | Description | Type | Optional |
| --------- | ----------- | -----| -------- |
| images | contains list of image objects | list |  |


**images**

| Attribute | Description | Type | Optional |
| --------- | ----------- | -----| -------- |
| src | src for the image, usually contained in the asset files | string | |
| height | the height of the image | integer | |

**tables**

| Attribute | Description | Type | Optional |
| --------- | ----------- | -----| -------- |
| src | A link to a hxl Proxy source URL. It must be in JSON list format including headers | string | |
| columns | A list of column definition for the table | list | |
| include | A list with the start and end row for the table. The first row of data is row 0 | list[integer,integer] | Optional (default: include all rows) |
| width | Width of table in percent | integer | Optional (default: 100) |
