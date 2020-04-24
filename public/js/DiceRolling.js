console.log("Start");
function getDiceRolls() {
     console.log("Diceroller called");
     var name = document.getElementsByName("diceText");
     var xhr1 = new XMLHttpRequest();
     var nameVar = name.item(0).value;
     var destURL = ('https://rolz.org/api/?').concat(nameVar).concat('.json');
    
     destURL = destURL.toLowerCase();
     destURL = destURL.replace(/\s/g, '');
     console.log(destURL);
     xhr1.open('GET', destURL);
     xhr1.send();
     var theoutput = document.getElementsByName("diceoutput");
     theoutput = theoutput.item(0);
     xhr1.onreadystatechange = function() {
          if (xhr1.readyState == 4 && xhr1.status == 200) {
               console.log("responseReceived");
               theoutput.innerHTML = 'Response Received';
               console.log(xhr1.responseText);
               var response = JSON.parse(xhr1.responseText);
               console.log(response);
               var outputString = formOutputString(response);
               console.log(JSON.stringify(response, undefined, 4));
               //theoutput.textContent = JSON.stringify(response, undefined, 4);
               //theoutput.textContent = outputString;
               theoutput.innerHTML = outputString;
          }
     }
}
function tableDiceRoller(){
     var dice = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"]
     var count = 0;
     console.log("table dice roller called");
     var requestString = '';
     var i;
     for( i = 0; i < dice.length; i++){
          var currDiceBox = document.getElementsByName(dice[i]);
          var currDiceCount = currDiceBox.item(0).value;
          if (currDiceCount > 0){
               var stringAdd = currDiceCount.toString();
               stringAdd = stringAdd.concat(dice[i]);
               stringAdd = stringAdd.concat('+');
               requestString = requestString.concat(stringAdd);
               count++;
          }
     }
     console.log(count);
     if (count > 0){
          var constantnumber = 0;
          requestString = requestString.concat(constantnumber.toString());
          console.log(requestString);
          var destURL = ('https://rolz.org/api/?').concat(requestString).concat('.json');
          var xhr2 = new XMLHttpRequest();
          xhr2.open('GET', destURL);
          xhr2.send();
          xhr2.onreadystatechange = function() {
               if (xhr2.readyState == 4 && xhr2.status == 200) {
                    console.log("responseReceived");
                    console.log(xhr2.responseText);
                    var response = JSON.parse(xhr2.responseText);
                    console.log(JSON.stringify(response, undefined, 4));
                    var theoutput = document.getElementsByName("diceoutput");
                    theoutput = theoutput.item(0);
                    var stringOutput = formOutputString(response);
                    //theoutput.textContent = stringOutput;
                    theoutput.innerHTML = stringOutput;
               }
          }

     }

}
function formOutputString(response){
     //var outString = response.input.concat(" =");
     //outString = outString.replace(/[+]/g, " + ");//regex time
     //outString = outString.concat("<br>");
     //outString = outString.concat(response.details);
     //outString = outString.concat("<br><br><br>");
     //outString = outString.concat("= ");
     //outString = outString.concat(response.result.toString());
     return response.result.toString();
}