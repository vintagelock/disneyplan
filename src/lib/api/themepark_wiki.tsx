
import Themeparks from "themeparks";

debugger;
var api = new Themeparks.DestinationsApi()

api.getDestinations().then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

