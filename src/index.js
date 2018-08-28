//add any imports if needed, or write your script directly in this file.
import pathwayQuery from "./pathwayQuery";

//make sure to export main, with the signature
export function main(el, service, imEntity, state, config) {

  //the reactome library doesn't offer modular compilation and we can't bundle
  //it in. Thus, we have to work with its global methods.
  //here we're exposing a handler for an event that is automatically fired
  var reactomeLoadingSettings = {
      attemptsLeft: 5,
      timer: 1000 //this increases exponentially at every attempt
    },
    columnToConvert = config.columnMapping[imEntity.class][imEntity.format],
    identifier,
    imjsService = new imjs.Service(service);

  console.log("%cc", "color:turquoise;font-weight:bold;", columnToConvert, "imEntity", imEntity);




  if (imEntity.class == "Pathway") {
    //we only want reactome pathway ids,
    //it doesn't understand other types.
    imjsService.records(pathwayQuery)
    checkIfReactomeReady();
  } else {
    if (imEntity.class == "Gene") {
      imjsService.findById(imEntity.class, imEntity.value)
        .then(function(response) {
          console.log("%cresponse", "border-bottom:chartreuse solid 3px;", response);
          identifier = response[columnToConvert];

          console.log("%cidentifier", "color:darkseagreen;font-weight:bold;", identifier);
          checkIfReactomeReady();
        });
    }
  }


//pathway TODO
// var accession = new imjs.Service(service)
//     .findById(imEntity.class, imEntity.value)
//     .then(function(response) {
//     //put some code here to initialise your tool.
// });



// sample code here to convert the provided intermine object (e.g. perhaps
// an id) into an identifier the tool expects. e.g.:
// of course if your tool was built for intermine it might understand
// intermine ids already, but many others tools expect a gene symbol or
// protein accession, etc...

//The Reactome fireworks script fires a global event and we have no easy way to
//tell when it will be
function checkIfReactomeReady() {
  if ((typeof _toolAPIGlobals.fireworksReady) !== "undefined") {
    initReactome(el);
    console.log("Initialising Fireworks Reactome script")
  } else {
    if (reactomeLoadingSettings.attemptsLeft > 0) {
      console.log("%cTrying to load Reactome Fireworks. Attempts left: ", "color:darkseagreen;font-weight:bold;", reactomeLoadingSettings.attemptsLeft);
      window.setTimeout(checkIfReactomeReady, reactomeLoadingSettings.timer);
      reactomeLoadingSettings.attemptsLeft--;
      reactomeLoadingSettings.timer = reactomeLoadingSettings.timer * 2;
    }
  }
}


function initReactome(el) {
  var fireworks = Reactome.Fireworks.create({
    "proxyPrefix": "https://reactome.org",
    "placeHolder": el.id,
    //TODO, check element containing width, height
    "width": 930,
    "height": 500
  });

  //Highlight the identifier from the report page here:
  fireworks.onFireworksLoaded(function(loaded) {
    console.log("%cFireworks loaded successfully", "border-bottom:chartreuse solid 3px;");
    fireworks.flagItems(identifier);
  });

  //TODO: Navigate to this pathway when selected
  //
  // fireworks.onNodeSelected(function(selected) {
  //   console.info("Selected ", selected);
  // });
}

}
