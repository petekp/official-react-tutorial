
var Food = React.createClass({
  render: function() {
    return (
      <div className="food" data-type={this.props.type} style={{backgroundColor: this.props.color}}>
        <span className="foodName">
          {this.props.name}
        </span>
      </div>
    );
  }
});

var FoodBox = React.createClass({
  loadFoodsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleFoodSubmit: function(food) {
    var foods = this.state.data;
    foods.push(food);
    this.setState({data: foods}, function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: food,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadFoodsFromServer();
    setInterval(this.loadFoodsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="foodBox">
        <h1>Foods</h1>
        <FoodList data={this.state.data} />
        <FoodForm onFoodSubmit={this.handleFoodSubmit} />
      </div>
    );
  }
});


var FoodList = React.createClass({
  render: function() {
    var foodNodes = this.props.data.map(function(food, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Food name={food.name} type={food.type} color={food.color} key={index}>
          {food.text}
        </Food>
      );
    });
    return (
      <div className="foodList">
        {foodNodes}
      </div>
    );
  }
});

var FoodForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var type = React.findDOMNode(this.refs.type).value.trim();
    if (!name || !type) {
      return;
    }
    this.props.onFoodSubmit({name: name, type: type});
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.type).value = '';
  },
  render: function() {
    return (
      <form className="foodForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Food name" ref="name" />
        <input type="text" placeholder="Food type" ref="type" />
        <input type="submit" value="Add Food" />
      </form>
    );
  }
});

React.render(
  <FoodBox url="foods.json" pollInterval={2000} />,
  document.getElementById('content')
);
