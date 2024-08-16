
const PLAYER_DIV_CLASS_NAME = "styles__PitchElementWrap-sc-hv19ot-0 LEzSi";
const FPL_BASE_API_LINK = "https://fantasy.premierleague.com/api";
const CACHE_DURATION = 60 * 60 * 1000;
const LOCAL_STORAGE_BASE_KEY = "FPL_FIREFOX_EXTENSION_";
const DIFFICULTY_COLORS = new Map([
    [1, '#375523'],
    [2, '#01fc7a'],
    [3, '#e7e7e7'],
    [4, '#ff1751'],
    [5, '#80072d'],
]);

function makeOpponentBadge(opponent) {
    let badge = document.createElement("span")
    let text = opponent.short_name;
    let backgroundColor = DIFFICULTY_COLORS.get(opponent.difficulty) ?? "lightblue"
    let textColor = opponent.difficulty <= 3 ? "darkblue" : "white"
    let fontWeight = opponent.atHome ? "bolder" : "normal"
    badge.textContent = text

    setStyles(badge, {
        display: 'inline-block',
        padding: '4px 1px',
        borderRadius: '4px',
        flexGrow: 1,
        textAlign: 'center',
        backgroundColor,
        color: textColor,
        fontSize: '9px',
        fontWeight: fontWeight
    });

    return badge;
}

function findTeamNameFromPlayerDiv(playerDiv) {
    const imgElement = playerDiv.querySelector('img');
    const altValue = imgElement.alt;
    return altValue
}

function makeBar(children) {
    let row = document.createElement("div");
    setStyles(row, {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "nowrap",
    });
    for (let child of children) {
        row.appendChild(child)
    }
    return row;
}

async function fetchTeamData() {
    const url = `${FPL_BASE_API_LINK}/bootstrap-static/`
    const data = await withCache(fetchData)(url)
    return data["teams"];
}

async function fetchFixtures() {
    const url = `${FPL_BASE_API_LINK}/fixtures/`;
    const data = await withCache(fetchData)(url);
    return data;
}

const fetchData = async (url) => {
    const response = await fetch(url)
    const data = await response.json()
    return data
}

const setStyles = (element, styles) => {
    Object.assign(element.style, styles);
};


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


function findTeamById(teamData, teamId) {
    return teamData.find(team => team.id == teamId);
}

function getNextOpponents(fixtures, teamsData, teamId) {
    let result = [];
    let next4Fixtures = fixtures.filter(match => match.team_a === teamId || match.team_h === teamId).slice(0, 4);

    for (let fixture of next4Fixtures) {
        let atHome = fixture.team_h === teamId;
        let difficulty = atHome ? fixture.team_h_difficulty : fixture.team_a_difficulty;
        let opponentTeamId = teamId === fixture.team_h ? fixture.team_a : fixture.team_h;
        let opponentTeam = findTeamById(teamsData, opponentTeamId);

        let opponent = {
            short_name: opponentTeam.short_name,
            teamId: opponentTeamId,
            difficulty,
            atHome,
        }
        result.push(opponent)
    }

    return result;
}



async function start() {
    await new Promise(r => setTimeout(r, 2000));
    let playerDivs = document.getElementsByClassName(PLAYER_DIV_CLASS_NAME);
    let teamsData = await fetchTeamData();
    let fixtures = await fetchFixtures();
    for (let playerDiv of playerDivs) {
        let teamName = findTeamNameFromPlayerDiv(playerDiv);
        let currentPlayerTeam = teamsData.find(team => team.name == teamName);

        if (currentPlayerTeam) {
            let nextOpponents = getNextOpponents(fixtures, teamsData, currentPlayerTeam.id);
            playerDiv.appendChild(
                makeBar(
                    nextOpponents.map(opponent => makeOpponentBadge(opponent))
                )
            );
        }
    }
}



start();

