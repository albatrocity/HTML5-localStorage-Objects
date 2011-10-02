function guitar(make,model,year,pickupConfig) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.pickupConfig = pickupConfig;
}

function createNewGuitar(mk,md,y,pc) {
  var createdGuitar = new guitar(mk,md,y,pc);
  if ( localStorage.guitarCount == undefined ) {
  localStorage.setItem('guitarCount', 0) 
  }
  var guitarSize = parseInt(localStorage.guitarCount) + 1;
  commitToStorage(guitarSize,createdGuitar);
}

function commitToStorage(objectCount,newObject) {
  // The unique key of the object:
  var item = 'guitar_' + objectCount;
  localStorage.setItem('guitarCount', objectCount);
  
  // Put the object into storage
  localStorage.setItem(item, JSON.stringify(newObject));
  
  // Create Markup
  createMarkup(newObject);
}

function createMarkup(guitar) {
  $('ul#guitars').append(
    "<li>" + 
      guitar.year + " " +
      guitar.make + " " +
      guitar.model + " " +
      "(" + guitar.pickupConfig + ")" +
    "</li>"
  );
}


$(function() {

  $("#guitar_form").submit(function() {
    var make = $("input#make").val();
    var model = $("input#model").val();
    var year = $("input#year").val();    
    var pickupConfig = $("select#pickupConfig").val();
    createNewGuitar(make,model,year,pickupConfig);
    return false;
  });

  var guitarCount = localStorage.getItem('guitarCount');  
  for (i=1;i<=guitarCount;i++)
    {
      var number = parseInt(i) + 1;
      var guitar = jQuery.parseJSON(localStorage.getItem("guitar_" + i));
      createMarkup(guitar);
    } 
});


