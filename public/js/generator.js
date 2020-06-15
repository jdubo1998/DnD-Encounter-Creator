var thresholds = [
[25, 50, 75, 100],
[50, 100, 150, 200],
[75, 150, 225, 400],
[125, 250, 375, 500],
[250, 500, 750, 1100],
[300, 600, 900, 1400],
[350, 750, 1100, 1700],
[450, 900, 1400, 2100],
[550, 1100, 1600, 2400],
[600, 1200, 1900, 2800],
[800, 1600, 2400, 3600],
[1000, 2000, 3000, 4500],
[1100, 2200, 3400, 5100],
[1250, 2500, 3800, 5700],
[1400, 2800, 4300, 6400],
[1600, 3200, 4800, 7200],
[2000, 3900, 5900, 8800],
[2100, 4200, 6300, 9500],
[2400, 4900, 7300, 10900],
[2800, 5700, 8500, 12700]
];

//return the xp threshold of the party
function party_threshold(numPcs, avgLev, difficulty) {
    var xp = thresholds[avgLev-1][difficulty-1];
    xp = xp * numPcs;
    return xp;
}

//load the monsters into an array of objs from the json
function load_monsters() {
    var xhr1 = new XMLHttpRequest();
    var destURL = "";
    //destURL = 'https://dungeons-and-dragons-encounter.herokuapp.com/monsters.json'
    destURL = 'http://localhost:5000/monsters.json'//only for debug
    xhr1.open('GET', destURL, false);
    xhr1.send();
    if (xhr1.readyState == 4 && xhr1.status == 200) {
            var response = JSON.parse(xhr1.responseText);
            //console.log(response.monsters);
            return response.monsters;
    }
   
    //var monsters = parsedJson.monsters;
    //return monsters;
}

//limit the monster choice to the env chosen by user
function create_monster_list(monsterData, specifiedLocation) {
    var env = '';
    switch(specifiedLocation) {
        case 0:
            env = 'City';
            break;
        case 1:
            env = 'Dungeon';
            break;
        case 2:
            env = 'Forest';
            break;
        case 3:
            env = 'Nature';
            break;
        case 4:
            env = 'Other plane';
            break;
        case 5:
            env = 'Underground';
            break;
        case 6:
            env = 'Water';
            break;
        default:
            env = 'Nature';
    }
    
    var possibleMonsters = [];
    for(var i = 0; i < monsterData.length; i++) {
        if(monsterData[i].env == env) {
            possibleMonsters.push(monsterData[i]);
        }
    }
    return possibleMonsters;
}

function encounter_gen(monsterList, xpThreshold) {
    var encounteredMonsters = [];
    var monsterCounter = 0;
    var xpMonsters = 0;
    var xpLowerLimit = Math.floor(xpThreshold / 25);

    while(xpMonsters < (xpThreshold - (3 * xpLowerLimit))) {
        var possibleMonsters = [];
        //remove monsters with too high or too low of xp values
        for(var i = 0; i < monsterList.length; i++) {
            if(xpLowerLimit < monsterList[i].xp < (xpThreshold - xpMonsters)) {
                possibleMonsters.push(monsterList[i]);
            }
        }

        //return encountered monsters if list of possible monsters 
        if(possibleMonsters.length == 0) {
            console.log('Ran out of suitable monsters :(');
            return encounteredMonsters;
        }

        //push one of the monsters from possible monsters randomly to the encounter monsters
        var r = Math.floor(Math.random() * (possibleMonsters.length - 1));
        encounteredMonsters.push(possibleMonsters[r]);
        monsterCounter = encounteredMonsters.length;

        xpMonsters = 0;
        for(var i = 0; i < encounteredMonsters.length; i++) {
            xpMonsters = xpMonsters + encounteredMonsters[i].xp;
        }

        if(monsterCounter == 2) {
            xpMonsters = xpMonsters * 1.5;
        } else if(3 <= monsterCounter <= 6) {
            xpMonsters = xpMonsters * 2;
        } else if(7 <= monsterCounter <= 10) {
            xpMonsters = xpMonsters * 2.5;
        }
    }
    return encounteredMonsters;
}
function getMonsterStats(monsterName) {
    var monsterName = String(monsterName);
    //var name = document.getElementsByName("name");
    var xhr1 = new XMLHttpRequest();
    //var nameVar = name.item(0).value;
    monsterName = monsterName.replace(/\s/g, '-');
    monsterName = monsterName.replace("'", '-');
    var destURL = ('https://www.dnd5eapi.co/api/monsters/').concat(monsterName);
    destURL = destURL.toLowerCase();
    xhr1.open('GET', destURL, false);
    xhr1.send();
    if (xhr1.readyState == 4 && xhr1.status == 200) {
        var response = JSON.parse(xhr1.responseText);
        //console.log(JSON.stringify(response, undefined, 4));
        return response;
    }
     return null;
}
function parseMonsterArr(monsterArr){
    console.log("parseMonsterArr called");
    var monsterArrLocal = monsterArr;
    var monsterListHTML = "";
    var arrlength = monsterArrLocal.length;
    var InitiativeHTML = "";
    var HealthHTML = "";
    console.log(arrlength);
    for (var i = 0; i < arrlength;  i++){
        console.log(i);
        var currMonster = monsterArrLocal[i];
        var currMonster2 = monsterArrLocal[i];
        var monsterStats = getMonsterStats(currMonster.monster_name);
        if (monsterStats=== null){
            console.log('error-monster undefined');
        }
        console.log(monsterStats.name);
        var monsterHTML = generateStatblock(monsterStats);
        monsterListHTML = monsterListHTML.concat(monsterHTML);
        var monsterInitiativeMod = Number(getModifier(monsterStats.dexterity));//assumption: we only use dex modifiers for initiative
        var monsterHealth = monsterStats.hit_points;
        var monsterHealthHTML = getHealthString(monsterHealth, i);
        var monsterInitiativeHTML = getInitiativeString(monsterInitiativeMod, i);
        InitiativeHTML = InitiativeHTML.concat(monsterInitiativeHTML);
        HealthHTML = HealthHTML.concat(monsterHealthHTML);
    }
    var outputSpotStatBlock = document.getElementById('monsterColumns');
    outputSpotStatBlock.innerHTML = monsterListHTML;
    var outputSpotInitiative = document.getElementById('InitiativeColumns');
    outputSpotInitiative.innerHTML = InitiativeHTML;
    var outputSpotHealth = document.getElementById('healthColumns');
    outputSpotHealth.innerHTML = HealthHTML;
    return;
    
}
function getStatblockTemplate(){
    var xhr1 = new XMLHttpRequest();
    //xhr1.open('GET', "https://dungeons-and-dragons-encounter.herokuapp.com/statblocktemplate.html", false);
    xhr1.open('GET', "http://localhost:5000/statblocktemplate.html", false);//for testing
    xhr1.send();
    if (xhr1.readyState == 4 && xhr1.status == 200) {
        var response = xhr1.responseText;
        return response;
    }
     return null;
}
function generateActionblock(actions){
    var actions = actions;
    var template = "<p><wbr><strong>{Action_Name}. </strong>{Action_Description}</p>";
    var actionBlockString = "";
    if (actions === undefined){
        return template;
    }
    for (i = 0; i < actions.length; i++){
        var currString = template.replace("{Action_Name}", actions[i].name);
        currString = currString.replace("{Action_Description}", actions[i].desc);
        actionBlockString = actionBlockString.concat(currString);
    }
    return actionBlockString;
}

function getImmunities(Immunities){
    var Immunities = Immunities;
    if(Immunities === undefined || Immunities.length === 0){
        return "none";
    }
    var outPutStr = "";
    for (i = 0; i < Immunities.length - 1; i++){
        outPutStr = outPutStr.concat(Immunities[i].name);
        outPutStr = outPutStr.concat(", ");
    }
    outPutStr = outPutStr.concat(Immunities[Immunities.length - 1].name);
    return outPutStr;
}
function createSkillsString(skillsSavesArr){
    var skillsString = "";
    if (skillsSavesArr.length === 0){
        return skillsString;
    }
    for(i = 0; i < skillsSavesArr.length; i++){
        var currObj = skillsSavesArr[i];
        if(currObj.name.includes("Skill: ")){
            var currString = currObj.name.replace("Skill: ", "");
            currString = currString.concat(" ");
            currString = currString.concat(currObj.value.toString());
            currString = currString.concat(", ");
            skillsString = skillsString.concat(currString);
        }
    }
    //console.log(skillsString);
    return skillsString;
}
function createSavesString(skillsSavesArr){
    if (skillsSavesArr.length === 0){
        return "";
    }
    //console.logconsole.log(skillsSavesArr);
    var savesString = "";
    for(i = 0; i < skillsSavesArr.length; i++){
        var currObj = skillsSavesArr[i];
        if(currObj.name.includes("Saving Throw: ")){
            var currString = currObj.name.replace("Saving Throw: ", "");
            currString = currString.concat(" ");
            currString = currString.concat(currObj.value.toString());
            currString = currString.concat(", ");
            savesString = savesString.concat(currString);
        }
    }
    //console.log(savesString);
    return savesString;
}
function getModifier(abilityScore){
    var abilityScore = Number(abilityScore);
    var net1 = abilityScore - 10;
    var negative = false;
    if (net1 < 0){
        negative = true;
        net1 = net1 * -1;
    }
    if ((net1 % 2) === 1){
        if(negative){
            net1++;
        }
        else{
            net1--;
        }
    }
    if(negative){
        net1 *= -1;
    }
    net1 = net1 / 2;
    var returnString = net1.toString();
    if(net1 >= 0){
        var string1 = "+"
        returnString = string1.concat(returnString);
    }
    return returnString;
}
function generateStatblock(monsterStats){
    if(monsterStats === undefined){
        return "undefined";
    }
    var blockTemplate = getStatblockTemplate();
    blockTemplate = blockTemplate.replace("{Monster_Name}", monsterStats.name);
    blockTemplate = blockTemplate.replace("{Size}", monsterStats.size);
    blockTemplate = blockTemplate.replace("{Type}", monsterStats.type);
    blockTemplate = blockTemplate.replace("{Alignment}", monsterStats.alignment);
    blockTemplate = blockTemplate.replace("{AC}", monsterStats.armor_class.toString());
    blockTemplate = blockTemplate.replace("{HP}", monsterStats.hit_points.toString());
    blockTemplate = blockTemplate.replace("{HP Dice}", monsterStats.hit_dice);
    //for speed
    var speedString = ''
    try{
        var tempStr = monsterStats.speed.walk;
        if (tempStr===undefined){
            tempStr = "0 ft. ";
        }
        speedString = speedString.concat(" Walk ");
        speedString = speedString.concat(tempStr);
    }
    catch(err){
        //no walk speed then
    }
    try{
        var tempStr = monsterStats.speed.fly;
        if (tempStr===undefined){
            tempStr = "0 ft. ";
        }
        speedString = speedString.concat(" fly ");
        speedString = speedString.concat(tempStr);
    }
    catch(err){
        //no walk fly then
    }
    try{
        var tempStr = monsterStats.speed.swim;
        if (tempStr===undefined){
            tempStr = "0 ft. ";
        }
        speedString = speedString.concat(" Swim ");
        speedString = speedString.concat(tempStr);
    }
    catch(err){
        //no swim then
    }
    blockTemplate = blockTemplate.replace("{Speed_String}", speedString);
    blockTemplate = blockTemplate.replace("{STR_S}", monsterStats.strength.toString());
    // modifier
    var mod = getModifier(monsterStats.strength);
    blockTemplate = blockTemplate.replace("{STR_M}", mod);
    blockTemplate = blockTemplate.replace("{DEX_S}", monsterStats.dexterity.toString());
    // modifier
    mod = getModifier(monsterStats.dexterity);
    blockTemplate = blockTemplate.replace("{DEX_M}", mod);
    blockTemplate = blockTemplate.replace("{CON_S}", monsterStats.constitution.toString());
    // modifier
    mod = getModifier(monsterStats.constitution);
    blockTemplate = blockTemplate.replace("{CON_M}", mod);
    blockTemplate = blockTemplate.replace("{INT_S}", monsterStats.intelligence.toString());
    // modifier
    mod = getModifier(monsterStats.intelligence);
    blockTemplate = blockTemplate.replace("{INT_M}", mod);
    blockTemplate = blockTemplate.replace("{WIS_S}", monsterStats.wisdom.toString());
    // modifier
    mod = getModifier(monsterStats.wisdom);
    blockTemplate = blockTemplate.replace("{WIS_M}", mod);
    blockTemplate = blockTemplate.replace("{CHA_S}", monsterStats.charisma.toString());
    // modifier
    mod = getModifier(monsterStats.charisma);
    blockTemplate = blockTemplate.replace("{CHA_M}", mod);
    var proficiencies = monsterStats.proficiencies;
    console.log(monsterStats.name);
    var saveThrowStr = createSavesString(proficiencies);
    blockTemplate = blockTemplate.replace("{Saving Throws}", saveThrowStr);
    var skillStr = createSkillsString(proficiencies);
    blockTemplate = blockTemplate.replace("{Skills}", skillStr);
    //senses formating TODO
    blockTemplate = blockTemplate.replace("{Senses}", JSON.stringify(monsterStats.senses, undefined, 4));
    blockTemplate = blockTemplate.replace("{Languages}", monsterStats.languages);
    blockTemplate = blockTemplate.replace("{ChallengeRating}", monsterStats.challenge_rating.toString());
    //TODO challenge rating XP
    var abilities = monsterStats.special_abilities;
    var abilitiesStr = generateActionblock(abilities);
    blockTemplate = blockTemplate.replace("{Abilities}", abilitiesStr);
    var actions = monsterStats.actions;
    var actionString = generateActionblock(actions);
    blockTemplate = blockTemplate.replace("{Actions_Str}", actionString);
    actions = monsterStats.legendary_actions;
    if (monsterStats.legendary_actions === undefined){
        actionString = "none";
    }
    else{actionString = generateActionblock(monsterStats.actions);}
    blockTemplate = blockTemplate.replace("{Legendary Actions}", actionString);
    var currImmunities = monsterStats.damage_immunities;
    blockTemplate = blockTemplate.replace("{Damage Immunities}", getImmunities(currImmunities));
    currImmunities = monsterStats.damage_resistances;
    blockTemplate = blockTemplate.replace("{Damage Resistances}", getImmunities(currImmunities));
    currImmunities = monsterStats.condition_immunities;
    blockTemplate = blockTemplate.replace("{Condition Immunities}", getImmunities(currImmunities));
    return blockTemplate;
}

function getInitiativeString(modifier, index){
    var modifier = Number(modifier);
    var index = Number(index);
    var xhr1 = new XMLHttpRequest();
    var requestString = "1d20+";
    requestString = requestString.concat(modifier.toString());
    //console.log(requestString);
    var destURL = ('https://rolz.org/api/?').concat(requestString).concat('.json');
    xhr1.open('GET', destURL, false);
    xhr1.send();
    var initiativeValue = 0;
    if (xhr1.readyState == 4 && xhr1.status == 200) {
        var response = JSON.parse(xhr1.responseText);
        initiativeValue = response.result.toString();
    }
    var iniativeHTML = getInitiativeTemplate();
    iniativeHTML = iniativeHTML.replace("{Index}", index.toString());
    iniativeHTML = iniativeHTML.replace("{Index}", index.toString());
    iniativeHTML = iniativeHTML.replace("{modifier}", modifier.toString());
    iniativeHTML = iniativeHTML.replace("{Initiative}", initiativeValue.toString());
    return iniativeHTML;
}
function getInitiativeTemplate(){
    var xhr1 = new XMLHttpRequest();
    //xhr1.open('GET', "https://dungeons-and-dragons-encounter.herokuapp.com/initiativeTemplate.html", false);
    xhr1.open('GET', "http://localhost:5000/initiativeTemplate.html", false);//for testing
    xhr1.send();
    if (xhr1.readyState == 4 && xhr1.status == 200) {
        var response = xhr1.responseText;
        return response;
    }
     return null;
}
function updateInitiative(modifier, index){
    var newInitiativeHTML = getInitiativeString(modifier, index);
    var HTMLtdID = "InitiativeTracker";
    HTMLtdID = HTMLtdID.concat(index.toString());
    var sectionToReplace = document.getElementById(HTMLtdID);
    //Issue - our HTML that we get from the initiative string includes the td name and such, but we need to replace the inner HTML
    //Solution - remove the first line and last line from our newInitiativeHTML string!
    var stringLines = newInitiativeHTML.split('\n');
    stringLines.splice(0,1);//remove first line (<td id=....>)
    stringLines.splice(stringLines.length - 1, 1); //remove last line (</td>)
    var finalString = stringLines.join('\n');
    sectionToReplace.innerHTML = finalString;
}

function getHealthTemplate(){
    var xhr1 = new XMLHttpRequest();
    //xhr1.open('GET', "https://dungeons-and-dragons-encounter.herokuapp.com/healthTemplate.html", false);
    xhr1.open('GET', "http://localhost:5000/healthTemplate.html", false);//for testing
    xhr1.send();
    if (xhr1.readyState == 4 && xhr1.status == 200) {
        var response = xhr1.responseText;
        return response;
    }
}
function getHealthString(health, index){
    var healthHTML = getHealthTemplate();
    healthHTML = healthHTML.replace("{Index}", index);
    healthHTML = healthHTML.replace("{Health}", health);
    return healthHTML;
}

function main(numPcs, avgLev, env, diff) {
    //make sure that that the variables are integers
    var numPcs = Number(numPcs);
    var avgLev = Number(avgLev);
    var env = Number(env);
    var diff = Number(diff);

    var xp = party_threshold(numPcs, avgLev, diff);
    var monsters = load_monsters();
    //console.log(monsters);
    var possible_monsters = create_monster_list(monsters, env);
    var encounter = encounter_gen(possible_monsters, xp);
    console.log(encounter);
    parseMonsterArr(encounter);
    return encounter;
}

//test to show functionality
// var encounter_monsters = main(3, 5, 1, 2);
// console.log(encounter_monsters);
