const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
const fs = require("fs");
const { table } = require("console");

//const footballUrl = "https://www.espn.com/nfl/boxscore/_/gameId/401326638";

//async function to scrape data
async function scrape(url) {
    try {
        //fetch HTML from url
        const { data } = await axios.get(url);
        //load fetched data
        const $ = cheerio.load(data);

        let output = $("tr").toString();

        output = pretty(output);

        let stats = parseRows($);

        return stats
    }
    catch(err){
        console.log(err)
    }
}

//this function is tested and works
let getPlayerNames = (cheerio_obj) => {
    let output = cheerio_obj(".name").toString();
    output = pretty(output);

    //regular expression extracts full name of players found between <span> tags
    const re = /<span>{1}\w*\s\w*<\/span>{1}/g;

    let found = output.match(re);
    for(let i = 0; i < found.length; i++){

        //remove html tags
        let temp = found[i].replace('<span>', '');
        temp = temp.replace('</span>', '');
        
        found[i] = temp;
    }

    //get rid of duplicates
    let outputArr = [...new Set(found)];
    return outputArr;
}

let getName = (str) => {
    const re = /<span>{1}.*<\/span>{1}/g;
    let found = str.match(re);

    let index = found[0].indexOf('</span>');
    let string = found[0].substring(0,index)

    let temp = string.replace('<span>', '');
    temp = temp.replace('</span>', '');
    
    return temp;
}

//go through all rows of box score tables and create objects
let parseRows = (cheerio_obj) => {
    let output = (cheerio_obj("tr").toString());

    //remove edge-cases
    let arr = output.split('</tr>');

    arr = removeExtraRows(arr);
    
    let players = [];
    let names = [];

    for(let i = 0; i < arr.length; i++){
        let temp = makePlayerObject(arr[i]);

        //if player not seen before 
        if(names[temp.name] === undefined){
            //players.push(temp);
            players[temp.name] = temp;

            //names array to allows for easy appending of stats (pass and rush yards)
            names[temp.name] = Object.entries(temp);
        }
        else{
            let newEntries = Object.entries(temp);
            
            let oldEntries = names[temp.name];

            oldEntries.push(...newEntries)

            players[temp.name] = Object.fromEntries(oldEntries);
        }
    }
    return players;
}

let makePlayerObject = (tableRow) => {
    //parse rest of object and get fields
    let obj = getFields(tableRow);

    return obj;
}

let getFields = (tableRow) => {
    let arr = tableRow.split('</td>');
    let obj = {}

    //fence post for name field
    obj['name'] = getName(tableRow);

    for(let i = 1; i < arr.length; i++){
        let str = arr[i].match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ''); // gets class name of <td>
        let value = arr[i].match(/>{1}.*/g); //gets value from <td>


        if(value !== null){
            value = value[0].replace(">", '');
        }

        if(str.length > 0) {
            obj[str] = value;
        }
    }

    return obj;
}


//ensures only rows with player data are preserved
let removeExtraRows = (arr) => {
    let formattedArr = [];
    
    for(let i = 0; i < arr.length; i++){

        if(arr[i].includes('data-player-uid')){
            let temp = arr[i]

            //"carries" are only used for rushing stat
            if(temp.includes("class=\"car\"")){
                temp = temp.replace("yds", "rush_yards");
            }

            formattedArr.push(pretty(temp.replace('<tr>', '')));
        }
    }

    return formattedArr;
}