
const PLAYER_DIV_CLASS_NAME = "styles__PitchElementWrap-sc-hv19ot-0 LEzSi";
const FPL_API_LINK = "https://fantasy.premierleague.com/api/bootstrap-static/";
const CACHE_DURATION = 30 * 60 * 1000;
const LOCAL_STORAGE_BASE_KEY = "FPL_FIREFOX_EXTENSION_";

function makeBadge(text, color) {
    let badge = document.createElement("span")
    badge.textContent = text

    // Apply styles to the badge
    badge.style.display = 'inline-block';
    badge.style.padding = '4px 1px';
    badge.style.borderRadius = '4px';
    badge.style.flexGrow = 1;
    badge.style.textAlign = "center"
    badge.style.backgroundColor = color;
    badge.style.color = '#2E5D32';

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
    row.style.justifyContent = "space-between"
    row.style.flexWrap = "no wrap"
    for (let child of children) {
        row.appendChild(child)
    }
    return row;
}

async function fetchTeamData() {
    const url = "https://fantasy.premierleague.com/api/bootstrap-static/"
    const data = await withCache(fetchData)(url)
    return data["teams"];
}

async function fetchFixtures() {
    const url = "https://fantasy.premierleague.com/api/fixtures/";
    const data = await withCache(fetchData)(url);
    return data;
}

const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

const withCache = (fetchFunction) => {
    return async (url) => {
        const cacheKey = `${LOCAL_STORAGE_BASE_KEY}_${url}`;
        const cacheTimestampKey = `${cacheKey}_timestamp`;

        // Get cached data and timestamp
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(cacheTimestampKey);

        // Check if cached data exists and is within the cache duration
        const now = new Date().getTime();

        if (cachedData && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
            return JSON.parse(cachedData);
        }

        // If no valid cache, fetch new data
        const data = await fetchFunction(url);

        // Store new data in localStorage with the current timestamp
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimestampKey, now.toString());

        return data;
    };
};


function filterFixturesByTeamId(fixtures, teamId) {
    return fixtures.filter(match => match.team_a === teamId || match.team_h === teamId).slice(0, 4);
}

function findTeamById(teamData, teamId) {
    return teamData.find(team => team.id == teamId);
}

function getNextOpponents(fixtures, teamId) {
    return fixtures
        .filter(match => match.team_a === teamId || match.team_h === teamId)
        .map(match => {
            return match.team_a === teamId ? match.team_h : match.team_a;
        })
        .slice(0, 4);
}



async function start() {
    await new Promise(r => setTimeout(r, 2000));
    let playerDivs = document.getElementsByClassName(PLAYER_DIV_CLASS_NAME);
    let teamsData = await fetchTeamData();
    let fixtures = await fetchFixtures();
    for (let playerDiv of playerDivs) {
        playerDiv.style.border = "1px solid red";
        let teamName = findTeamNameFromPlayerDiv(playerDiv);
        let currentPlayerTeam = teamsData.find(team => team.name == teamName);
        let nextOpponentsIds = getNextOpponents(fixtures, currentPlayerTeam.id);


        playerDiv.appendChild(
            makeBar(
                nextOpponentsIds.map(team_id =>
                    makeBadge(findTeamById(teamsData, team_id).short_name, "lightblue")
                )
            )
        );

    }
}



start();

