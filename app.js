const gameSchedule = require("./Utils/GameSchedule");
const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");

const footballUrl = "https://www.espn.com/nfl/boxscore/_/gameId/401326638";

//async function to scrape data
//optional fields parameter to request specifics stats
async function scrape(url, fields=[]) {
    try {
        //fetch HTML from url
        const { data } = await axios.get(url);
        //load fetched data
        const $ = cheerio.load(data);

        let stats = parseRows($, fields);

        return stats
    }
    catch(err){
        console.log(err)
        return -1;
    }
}

async function getGameInfo(url) {
    //fetch HTML from url
    const { data } = await axios.get(url);
    //load fetched data
    const $ = cheerio.load(data);
    let output = $(".team-container").toString();
    output = pretty(output);

    let teamOne = {};
    let teamTwo = {};

    let [linkOne, linkTwo] = getImageLink(output);

    teamOne.imageLink = linkOne;
    teamTwo.imageLink = linkTwo;

    let [nameOne, nameTwo] = getTeamName(output);

    teamOne.name = nameOne;
    teamTwo.name = nameTwo;

    let [scoreOne, scoreTwo] = await getScores(url);

    teamOne.score = scoreOne;
    teamTwo.score = scoreTwo;

    return [teamOne, teamTwo];
}

let getImageLink = (cheerio_output) => {
    //regular expression extracts image source
    const re = /src="([^">]+)"/g;
    let [src1, src2] = cheerio_output.match(re);

    //TODO: get rid of extra characters other than url

    src1 = src1.replace('src=', '');
    src1 = src1.replace('\"', '');

    src2 = src2.replace('src=', '');
    src2 = src2.replace('\"', '');

    return [src1, src2];
}

async function getScores(url) {
    //fetch HTML from url
    const { data } = await axios.get(url);
    //load fetched data
    const $ = cheerio.load(data);
    let output = $(".score-container").toString();
    output = pretty(output);

    let re = /\d+/g
    let arr = output.match(re);

    return arr;
}

let getTeamName = (cheerio_output) => {
    //regular expression to extract team names
    const re = /<span class="short-name">(.*?)<\/span>/g
    
    let [str1, str2] = cheerio_output.match(re);

    str1 = str1.replace('<span class=\"short-name\">', '');
    str1 = str1.replace('</span>', '');

    str2 = str2.replace('<span class=\"short-name\">', '');
    str2 = str2.replace('</span>', '');
    
    let output = [str1, str2];
    
    return output;
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
let parseRows = (cheerio_obj, fields = []) => {
    let output = (cheerio_obj("tr").toString());
    
    //remove edge-cases
    let arr = output.split('</tr>');

    arr = removeExtraRows(arr);
    
    let players = {};
    let names = [];

    for(let i = 0; i < arr.length; i++){
        let temp = makePlayerObject(arr[i], fields);
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
            if(newEntries.includes('yds') || newEntries.includes('td') || newEntries.includes('rec_yards') || newEntries.includes('rush_yards')){
                
            }
            oldEntries.push(...newEntries);  
            players[temp.name] = Object.fromEntries(oldEntries);
        }
    }
    return players;
}

let makePlayerObject = (tableRow, fields = []) => {
    //parse rest of object and get fields
    let obj = getFields(tableRow, fields);

    return obj;
}

let getFields = (tableRow, fields = []) => {
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

        //if custom fields inputted, delete non-requested fields
        if((fields.length > 0) && !fields.includes(str)){
            delete obj[str];
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
                temp = temp.replace("td", "rush_td");
                temp = temp.replace("avg", "rush_avg");
                temp = temp.replace("long", "rush_long");
            }
            //"targets" only used for receiving stat
            if(temp.includes("class=\"tgts\"")){
                temp = temp.replace("yds", "rec_yards");
                temp = temp.replace("long", "rec_long");
                temp = temp.replace("td", "rec_td");
                temp = temp.replace("avg", "rec_avg");
            }

            formattedArr.push(pretty(temp.replace('<tr>', '')));
        }
    }

    return formattedArr;
}

//function that parses for all links to the box scores for given week in NFL
const getBoxScoreLinks = async (url) => {
    //fetch HTML from url
    const { data } = await axios.get(url);
    //load fetched data
    const $ = cheerio.load(data);
    //returns 3 kinds of buttons: gamecast, boxscore, play-by-play
    
    const targetClass = "Scoreboard__Callouts"
    let output = $("." + targetClass).toString();
    output = pretty(output);
    const re = /(?:href=)(\"\/nfl\/boxscore.*\">Box Score)/g
    let arr = output.match(re)
    
    for(let i = 0; i < arr.length; i++){
        arr[i] = arr[i].replace("href=\"", '');
        arr[i] = arr[i].replace("\">Box Score", '')
        arr[i] = "espn.com" + arr[i]
    }

    return arr;
}

const getBoxScoreLinksByDate = async (month = -1, day = -1) => {
    const date = new Date();
    if(month === -1){
        month = date.getMonth()
    }
    if(day === -1){
        day = date.getDate();
    }

    const nflWeek = gameSchedule.getNFLWeek(month, day);
    console.log(nflWeek)
    const links = await getBoxScoreLinks(nflWeek);
    console.log(links)
    return links;
}

module.exports = { scrape, getGameInfo, getBoxScoreLinksByDate};