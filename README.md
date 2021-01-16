# hxl_tables

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

####Branding
Defines the image branding for the documents

Images: contains list of image each with the following attributes
- src: src for the image, usually contained in the asset files
- height: the height of the image

####Tables
List of table definitions

- src: HXL proxy JSON list output
