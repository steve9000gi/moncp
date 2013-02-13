///////////////////////////////////////////////////////////////////////////////////
//
// user.js: Constructor for the User object. Typical usage: A User can add his or
// her data sets to the map and set restrictions on what users  and affiliations 
// can access this  data. A User can also delete his/her data sets. If a registered
// User attempts to access restricted (unpublished) ship data, his or her presence
// on the corresponding Ship's researchers list will be required prior to granting
// that access.
//
// See www.renci.org/~stevec/Cassar/moncp.html for intended application.
//
///////////////////////////////////////////////////////////////////////////////////
var User = function(firstName, lastName, affiliation, email, userName,
                    password) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.affiliation = affiliation;
  this.email = email;
  this.userName = userName;
  this.password = password;

// Array of references to ShipDataSets for which this user has read/write
// permission:
  this.dataSets = []; 
}

User.prototype.addDataSet = function(dataSet) {
  this.dataSets.push(dataSet);
}

User.prototype.deleteDataSet = function(dataSet) {
  var ix = this.dataSets.indexOf(dataSet);

  if (ix != -1) {
    this.dataSets.splice(ix, 1);
  }
}

 User.prototype.outputUser = function() {
	alert("User name: " + this.userName + "\n Password: " + this.password +
		"\n First Name: " + this.firstName + "\n Last Name: " + this.lastName 
		+ "\n Email: " + this.email + "\n Affiliation: " + this.affiliation);
} 