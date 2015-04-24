'use strict';

let React = require('react');
let TodoApp = React.createFactory(require('./components/MyApp'));

let renderComponent = function(){
  let mountNode = document.getElementById('app-container');
  React.render(TodoApp(), mountNode);
};

if (typeof window !== 'undefined') {
	console.log("BOOTSTRAP APPLICATION ON CLIENT");
    window.onload = () => {
    	//When window is loaded, render the main component
      renderComponent();
    }
}
