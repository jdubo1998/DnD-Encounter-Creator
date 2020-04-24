
console.log("Start");
var ourForm1 = document.getElementsByName("search");
function getMonsterStats() {
     console.log("getMonsterStats called");
     var name = document.getElementsByName("name");
     var xhr1 = new XMLHttpRequest();
     var nameVar = name.item(0).value;
     var destURL = ('https://www.dnd5eapi.co/api/monsters/').concat(nameVar);
     destURL = destURL.toLowerCase();
     destURL = destURL.replace(/\s/g, '');
     console.log(destURL);
     xhr1.open('GET', destURL);
     xhr1.send();
     var theoutput = document.getElementsByName("monsterstats")
     theoutput = theoutput.item(0);
     theoutput.textContent = 'Request Sent';
     xhr1.onreadystatechange = function() {
          if (xhr1.readyState == 4 && xhr1.status == 200) {
               console.log("responseReceived");
               theoutput.innerHTML = 'Response Received';
               var response = JSON.parse(xhr1.responseText);
               console.log(JSON.stringify(response, undefined, 4));
               theoutput.textContent = JSON.stringify(response, undefined, 4);
          }
     }
}
