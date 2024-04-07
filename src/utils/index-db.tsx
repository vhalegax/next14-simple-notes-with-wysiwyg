export function saveToIndexedDB(note: string) {
  // Open (or create) the database
  var request = indexedDB.open("notes_database", 1);

  // Handle database opening success
  request.onsuccess = function (event) {
    var db = event.target.result;

    // Start a new transaction
    var transaction = db.transaction(["notes"], "readwrite");

    // Access the object store
    var objectStore = transaction.objectStore("notes");

    // Add the note to the object store
    var addRequest = objectStore.add(note);

    // Handle the successful addition of the note
    addRequest.onsuccess = function (event) {
      console.log("Note added to IndexedDB");
    };

    // Handle errors
    addRequest.onerror = function (event) {
      console.error("Error adding note to IndexedDB", event.target.error);
    };

    // Close the transaction
    transaction.oncomplete = function () {
      db.close();
    };
  };

  // Handle database opening errors
  request.onerror = function (event) {
    console.error("Error opening IndexedDB", event.target.error);
  };

  // Handle database upgrades (e.g., creating object store)
  request.onupgradeneeded = function (event) {
    var db = event.target.result;

    // Create the object store
    var objectStore = db.createObjectStore("notes", { keyPath: "id" });

    // Create an index for searching notes if needed
    // objectStore.createIndex('valueIndex', 'value', { unique: false });
  };
}
