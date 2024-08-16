
let PLAYER_DIV_CLASS_NAME = "styles__PitchElementWrap-sc-hv19ot-0 LEzSi"


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

function makeBar() {
    let row = document.createElement("div");
    row.style.display = "flex"
    row.style.flexWrap = "no wrap"
    for (let i = 0; i < 5; i++) {
        row.appendChild(
            makeBadge("SWE", "red")
        )
    }
    return row;
}

function addBar(parentNode) {
    parentNode.appendChild(
        makeBar()
    )
}

async function start() {
    await new Promise(r => setTimeout(r, 2000));
    let playerDivs = document.getElementsByClassName(PLAYER_DIV_CLASS_NAME);
    for (let playerDiv of playerDivs) {
        playerDiv.style.border = "5px solid red";
        addBar(playerDiv);
    }
}



start();