require("dotenv").config();

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

function movieThis(name) {
    axios.get("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy")
        .then(
            function(response) {

                console.log("Title: " + response.data.Title);
                console.log("Release Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            })
        .catch(
            function(error) {
                if (error.response) {
                    console.log(error.response.data)
                }
            })
};

function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(
            function(response) {
                console.log("Name of the venue: " + response.data[0].venue.name);
                var place = response.data[0].venue
                console.log("Venue location: " + place.city + ", " + place.region + ", " + place.country);
                var date = response.data[0].datetime
                date = moment(date).format("MM/DD/YYYY");
                console.log("Date of the event: " + date);
            }
        );
};

function spotifySong(song) {
    spotify
        .search({ type: 'track', query: song, limit: 20 })
        .then(function(response) {
            console.log('Artist: ' + response.tracks.items[0].album.artists[0].name);
            console.log('Song Name: ' + response.tracks.items[0].name);
            console.log('Preview Link: ' + response.tracks.items[0].preview_url);
            console.log('Album Name: ' + response.tracks.items[0].album.name);
        })
        .catch(function(err) {
            console.log(err);
        });
}

if (process.argv[2] === "movie-this") {
    var movieName = "";
    if (process.argv[3] === undefined) {
        movieName = 'Mr. Nobody';
    } else {
        movieName = process.argv.slice(3).join(" ");
    };
    movieThis(movieName);

} else if (process.argv[2] === "spotify-this-song") {
    var songName = "";
    if (process.argv[3] === undefined) {
        songName = "The Sign";
    } else {
        songName = process.argv.slice(3).join(" ");
    }
    spotifySong(songName);

} else if (process.argv[2] === "concert-this") {
    var artist = "";
    artist = process.argv.slice(3).join(" ");
    concertThis(artist);

} else if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArr = data.split(",");
        console.log(dataArr);
        if (dataArr[0] === "spotify-this-song") {
            spotifySong(dataArr[1]);
        } else if (dataArr[0] === "movie-this") {
            movieThis(dataArr[1]);
        } else if (dataArr[0] === "concert-this") {
            concertThis(dataArr[1]);
        }
        // movieName = dataArr[1];
        // movieThis(movieName);

    });
} else {
    console.log("Wrong command");
};