I was finally able to dive into HTML5 localStorage, one of the new specs that I was confused and excited about. I thought it would be interesting to use it for data storage for a web app prototype I was working on, so I [dove in](http://diveintohtml5.org/storage.html) and learned more about it.

My plan was to create and store Javascript objects in localStorage so I could recall them later throughout the prototype. I figured I'd be making objects and storing them as hashes. Much to my dismay HTML5 localStorage only stores key/value combinations, so instead of hashes I was forced to stringify the objects with the `JSON.stringify` function	.

    // Object model
    function guitar(make,model,year,pickupConfig) {
      this.make = make;
      this.model = model;
      this.year = year;
      this.pickupConfig = pickupConfig;
    }
    
    // Making a new object    
    var telecaster = new guitar('Fender','Telecaster','1952','SS');
    
    // Putting the created object in storage
    localStorage.setItem('Fender Tele', JSON.stringify(telecaster));

With `setItem` I pass in a key and a value. Now my new object is stored in localStorage. I can take a peek in the browser console by typing `localStorage`. Inside I see

    Fender Tele: "{"make":"Fender","model":"Telecaster","year":"1952","pickupConfig":"SS"}"

That's fine and dandy, but what if I want to pull it out of storage and interact with it like an object again? This is where jQuery's `parseJSON` function comes in:

    var storedGuitar = jQuery.parseJSON(localStorage.getItem('Fender Tele'));

Then I can use the storedGuitar variable to access its properties like normal:

    storedGuitar.model
    // => 'Telecaster'

Now say I wanted to store multiple Guitar objects and be able to  iterate over them on page load and create markup with their properties. Since I couldn't think of a good way to "search" through localStorage keys, I created a guitarCount key/value that incremented each time a new Guitar object was created, then updated guitarCount and stored the object with a unique key.

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
    }

Now I can create two guitars with unique keys and store them in localStorage:

    createNewGuitar("Gibson","Les Paul","1963","HH"); 
    // guitar_1
    createNewGuitar("Gretsch","G6128T-DSV Duo Jet","1962","HH"); 
    // guitar_2

If I wanted to do something with these objects on page load, I can loop through each unique key id:
    
    var guitarCount = localStorage.getItem('guitarCount');  
    for (i=1;i<=guitarCount;i++)
      {
        var number = parseInt(i) + 1;
		  var guitar = jQuery.parseJSON(localStorage.getItem("guitar_" + i));
        createMarkup(guitar);
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

I pulled `createMarkup()` into its own function so it can be easily called on form submission. That way the page doesn't need to be reloaded to show new data.
