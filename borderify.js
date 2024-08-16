
let PLAYER_DIV_CLASS_NAME = "styles__PitchElementWrap-sc-hv19ot-0 LEzSi";
let FPL_API_LINK = "https://fantasy.premierleague.com/api/bootstrap-static/";

const PLAYERS_DATA = [];

function makeBadge(text, color) {
    let badge = document.createElement("span")
    badge.textContent = text

    // Apply styles to the badge
    badge.style.display = 'inline-block';
    badge.style.padding = '1px 1px';
    badge.style.borderRadius = '2px';
    badge.style.backgroundColor = color;
    badge.style.color = '#fff';
    badge.style.fontSize = '9px';

    return badge;
}

function findTeamNameFromPlayerDiv(playerDiv) {
    const imgElement = playerDiv.querySelector('img');
    const altValue = imgElement.alt;
    return altValue
}

function makeBar(children) {
    let row = document.createElement("div");
    row.style.display = "flex"
    row.style.flexWrap = "no wrap"
    for (let child of children) {
        row.appendChild(child)
    }
    return row;
}

async function fetchTeamData() {
    const url = "https://fantasy.premierleague.com/api/bootstrap-static/"
    const data = await fetchData(url)
    return data["teams"];
}

async function fetchFixtures() {
    const url = "https://fantasy.premierleague.com/api/fixtures/";
    const data = await fetchData(url);
    return data;
}

const fetchData = async (url) => {
    console.log("FETCHING MY FIREND");
    const response = await fetch(url)
    const data = await response.json()
    return data
}




async function start() {
    await new Promise(r => setTimeout(r, 2000));
    let playerDivs = document.getElementsByClassName(PLAYER_DIV_CLASS_NAME);
    console.log("BEFORE BEFORE")
    let teamData = await fetchTeamData();
    let fixtures = await fetchFixtures();
    console.log("XXXXXXXXXXXXXXX")
    for (let playerDiv of playerDivs) {
        let teamName = findTeamNameFromPlayerDiv(playerDiv);
        playerDiv.style.border = "2px solid red";


        playerDiv.appendChild(
            makeBar([
                makeBadge(teamName, "blue"),
                makeBadge(teamName, "blue"),
                makeBadge(teamName, "blue"),
            ])
        )
    }
}



start();

