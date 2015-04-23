let React = require('react')

function getTodoState() {
    return {
      allTodos: TodoStore.getAll(),
      areAllComplete: TodoStore.areAllComplete()
    }
}

let MyApp = React.createClass({
  render() {
    return (
      <div id='my-app'>
        <p>React rendered main component</p>
      </div>
    );
  }
});

module.exports = TodoApp;
