/*global Backbone:false,_:false */

$(function() {

  //********************************************************************************
  // Defines one Address
  var Address = Backbone.Model.extend({

    defaults: {
      name: '', // Name of contact
      email: '' // Email address of contact
    },

  });


  //********************************************************************************
  // Renders one address
  var AddressView = Backbone.View.extend({

    tagName: "form",

    // Render the whole form; must be called explicitly
    render: function() {
      // Compile the template from the targeted <script> tag in our HTML file
      var addrObj = this.model.toJSON();
      var template = _.template($('#addr-data-template').html(), addrObj);

      // Inject the compiled HTML into this View object's target element
      this.$el.html(template);

      return this;
    },

    // React to events
    events: {
      // User clicks Save button; save Address in model and DB
      "click button.save-button": "saveAddress",

      // User clicks Delete button
      'click button.del-button': 'delAddress'
    },

    // Delete model associated with this View, and remove View from DOM.
    // Removes model from all owning Collections, or the AddressBook in this case.
    delAddress: function() {
      this.model.destroy();
      this.remove();
    },

    // Called when any field value changes in the form. Save the changed field
    // into the corresponding attribute of our model
    saveAddress: function(e) {
      // Changed element in 'e' parm. Get its attribute name. We made attr name match
      // corresponding model member name
      var addrName = $(e.target).prev().find('#addr-name').val();
      var addrEmail = $(e.target).prev().find('#addr-email').val();
      this.model.set({name: addrName, email: addrEmail});
    }

  });


  //********************************************************************************
  // Keeps track of entire address book of addresses
  var AddressBook = Backbone.Collection.extend({

    model: Address,
    localStorage: new Backbone.LocalStorage('AddressBook')

  });


  //********************************************************************************
  // Renders entire address book
  var AddressBookView = Backbone.View.extend({

    // Keep an eye out for changes on the #addr-panel div
    el: $('#addr-panel'),

    // Set up a new collection for this view, and bind the 'add' event
    // to the function to render one address
    initialize: function() {
      this.addressBook = new AddressBook();
      this.addressBook.on('add', this.renderAddress, this);
      this.render();
    },

    // Detect events on the '+' button to add an address
    events: {
      'click button#add-button': 'addAddress'
    },

    // Create a new address and add it to our collection
    addAddress: function() {
      var addr = new Address();
      this.addressBook.add(addr);
    },

    // Render the entire address book
    render: function() {
      var that = this;
      _.each(this.addressBook.models, function(item) {
        that.renderAddress(item);
      }, this);
    },

    // Render one address
    renderAddress: function(address) {
      var addressView = new AddressView({ model: address });
      this.$el.find('#add-button').before(addressView.render().el);
    }

  });


  //********************************************************************************
  // Create and render entire address book
  var addressView = new AddressBookView();

});