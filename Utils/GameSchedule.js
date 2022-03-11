//getDate + getMonth

const getNFLWeek = (month, day) => {
    // const date = new Date();
    // [month, day] = [date.getMonth() + 1, date.getDate()]


    //currently built based on 2021 schedule

    //sept
    if(month === 9){
        //week 1: 9-14
        if(day >= 9 && day <= 14){
            return "https://www.espn.com/nfl/scoreboard/_/week/1/year/2021/seasontype/2"
        }
        if(day >= 15 && day <= 21){
            return "https://www.espn.com/nfl/scoreboard/_/week/2/year/2021/seasontype/2"
        }
        if(day >= 22 && day <= 28){
            return "https://www.espn.com/nfl/scoreboard/_/week/3/year/2021/seasontype/2"
        }
        if(day >= 29){
            return "https://www.espn.com/nfl/scoreboard/_/week/4/year/2021/seasontype/2"
        }
    }
    //oct
    if(month === 10){
        if(day <= 5){
            return "https://www.espn.com/nfl/scoreboard/_/week/4/year/2021/seasontype/2"
        }
        if(day >= 6 && day <= 12){
            return "https://www.espn.com/nfl/scoreboard/_/week/5/year/2021/seasontype/2"
        }
        if(day >= 13 && day <= 19){
            return "https://www.espn.com/nfl/scoreboard/_/week/6/year/2021/seasontype/2"
        }
        if(day >= 20 && day <= 26){
            return "https://www.espn.com/nfl/scoreboard/_/week/7/year/2021/seasontype/2"
        }
        if(day >= 27){
            return "https://www.espn.com/nfl/scoreboard/_/week/8/year/2021/seasontype/2"
        }
    }
    //nov
    if(month === 11){
        if(day <= 2){
            return "https://www.espn.com/nfl/scoreboard/_/week/8/year/2021/seasontype/2"
        }
        if(day >= 3 && day <= 9){
            return "https://www.espn.com/nfl/scoreboard/_/week/9/year/2021/seasontype/2"
        }
        if(day >= 10 && day <= 16){
            return "https://www.espn.com/nfl/scoreboard/_/week/10/year/2021/seasontype/2"
        }
        if(day >= 17 && day <= 23){
            return "https://www.espn.com/nfl/scoreboard/_/week/11/year/2021/seasontype/2"
        }
        if(day >= 24 && day <= 30){
            return "https://www.espn.com/nfl/scoreboard/_/week/12/year/2021/seasontype/2"
        }
    }
    //dec
    if(month === 12){
        if(day >= 1 && day <= 7){
            return "https://www.espn.com/nfl/scoreboard/_/week/13/year/2021/seasontype/2"
        }
        if(day >= 8 && day <= 14){
            return "https://www.espn.com/nfl/scoreboard/_/week/14/year/2021/seasontype/2"
        }
        if(day >= 15 && day <= 21){
            return "https://www.espn.com/nfl/scoreboard/_/week/15/year/2021/seasontype/2"
        }
        if(day >= 22 && day <= 28){
            return "https://www.espn.com/nfl/scoreboard/_/week/16/year/2021/seasontype/2"
        }
        if(day >= 29){
            return "https://www.espn.com/nfl/scoreboard/_/week/17/year/2021/seasontype/2"
        }
    }
    //jan
    if(month === 1){
        if(day <= 4){
            return "https://www.espn.com/nfl/scoreboard/_/week/17/year/2021/seasontype/2"
        }
        if(day >= 5 && day <= 11){
            return "https://www.espn.com/nfl/scoreboard/_/week/18/year/2021/seasontype/2"
        }
        if(day >= 12 && day <= 18){
            return "https://www.espn.com/nfl/scoreboard/_/week/1/year/2021/seasontype/3"
        }
        if(day >= 19 && day <= 25){
            return "https://www.espn.com/nfl/scoreboard/_/week/2/year/2021/seasontype/3"
        }
        if(day >= 26){
            return "https://www.espn.com/nfl/scoreboard/_/week/3/year/2021/seasontype/3"
        }
    }
    //feb
    if(month === 2){
        if(day <= 1){
            return "https://www.espn.com/nfl/scoreboard/_/week/3/year/2021/seasontype/3"
        }
        if(day >= 2 && day <= 8){
            return "https://www.espn.com/nfl/scoreboard/_/week/4/year/2021/seasontype/3"
        }
        if(day >= 9){
            return "https://www.espn.com/nfl/scoreboard/_/week/5/year/2021/seasontype/3"
        }
    }
}

module.exports = { getNFLWeek }