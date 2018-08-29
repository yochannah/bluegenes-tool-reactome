import pathwayQuery from "./pathwayQuery";

//make sure to export main, with the signature
export function main(el, service, imEntity, state, config) {

  /**
    The reactome library doesn't offer modular compilation so we can't bundle
    it in. Thus, we have to work with its global methods.
    Here we're creating a handler for an event that is automatically fired
    but may or may not be fired by the time we load this script.
    The workaround is that we have a tiny global handler in globals.js that will
    run before we load reactome's firework script. It listens for reactome's
    automatically fired onFireworksReady() event and sets a global bluegenes
    config tool to true. We check if it's true recursively and give up after 5
    tries. To sum up:
    1. Globals.js listens for Reactome's fireworks script to be ready and
       sets `_toolAPIGlobals.fireworksReady = true`
    2. checkIfReactomeReady() checks for the var to be set to true and
       eventually gives up if nothing comes back...
    3. Other bits to note: We load this tool on pathways and on genes,
       but the queries are slightly different. Heavily annotated below.
  **/

  var reactomeLoadingSettings = {
      attemptsLeft: 5,
      timer: 1000 //this increases exponentially at every attempt
    },
    columnToConvert = config.columnMapping[imEntity.class][imEntity.format],
    identifier,
    imjsService = new imjs.Service(service);

  // Check if there's any point launching the reactome viewer.
  // for Kegg pathways we don't want to, because Reactome doesn't
  // know them.
  if (imEntity.class == "Pathway") {
    //build a query for the pathway we want and get its dataset
    var pq = pathwayQuery(imEntity.value);

    imjsService.records(pq).then(function(response) {
      if (response.length > 0) {
        identifier = response[0].identifier;
        checkIfReactomeReady();
      } else {
        gracefulFail("Non-reactome pathway. Removing reactome pathway viewer",
                     true,
                     el);
      }

    });
  } else {
    if (imEntity.class == "Gene") {
      imjsService.findById(imEntity.class, imEntity.value)
        .then(function(response) {
          identifier = response[columnToConvert];
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
        console.log("%cTrying to load Reactome Fireworks. Attempts left: ", "border-bottom:chartreuse solid 3px;", reactomeLoadingSettings.attemptsLeft);
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
      "width": el.clientWidth,
      "height": 500
    });

    //Highlight the identifier from the report page here:
    fireworks.onFireworksLoaded(function(loaded) {
      console.log("%cReactome Fireworks loaded successfully", "border-bottom:chartreuse solid 3px;");
      fireworks.flagItems(identifier);
    });

    //TODO: Navigate to this pathway when selected
    //
    // fireworks.onNodeSelected(function(selected) {
    //   console.info("Selected ", selected);
    // });
  }

  /**
  *  Gracefully fail if there's a problem - e.g. if the pathway is not
  *  a reactome pathway. You can choose to either leave the element in the page
  *  and display the error message to the user, or simply log it to the console.
  *
  *  The console log is good for places where you wouldn't expect to see the
  *  the pathway viewer, e.g. on a non-reactome pathway.
  *  Otherwise, it's probably better to tell the user there was an error.
  *
  * Args:
  * ---------
  *  message: String. An error message to show to the user or log in console
  *  remove: boolean. Set to true if the user doesn't need to be told of the error
  *  el: a dom element (not jquery!). This should be accessible from
  *      the main function.
  *
  *
  *  Examples calls:
  *****************
  *  var message = "Reactome viewer removed from page is this is ";
  *      message += "not a Reactome Pathway.";
  *  gracefulFail(message, true, el);
  *****************
  *  //This is one we'd want to show to the user
  *  var message = "Error fetching pathway from Reactome. ";
  *      message += "Please contact info@intermine.org to report this.";
  *  gracefulFail(message, false, el);
  **/
  function gracefulFail(message, remove, el) {
    console.log(message);
    if (remove) {
      el.parentNode.removeChild(el);
    } else {
      el.innerHTML = message;
    }
  }
}
