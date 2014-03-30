# facebook-graph-search

Tool to query the Facebook graph search API.

Features:

* Search for businesses of a certain kind in a certain area.

## Installation

You must have Node.js installed. I like to use [n](https://github.com/visionmedia/n) to manage my node installations.

`git clone https://github.com/clayzermk1/facebook-graph-search.git` will clone the repository from github.
`npm install && bower install && npm start` will fetch the latest dependencies and start up the web server.

## Use

Open [Facebook's Graph Search Tool](https://developers.facebook.com/tools/explorer/145634995501895/) to obtain an access token (this is something I would improve process wise, I didn't have the time to deal with OAuth and domain restrictions).
Open [the tool](http://localhost:3000/) (tested with Chrome) and enter your access token at the top.

## TODO

* Replace `center` and `distance` with a Google Maps implementation that performs reverse geocoding on the centered map location and zoom level to a latitude/longitude and distance.
* Proper authentication with Facebook instead of the `access_token` field.
* Client-side MV* instead of static pages.
* In addition to CSV download, display results in browser.
