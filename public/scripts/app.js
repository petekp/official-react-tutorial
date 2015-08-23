
var Food = React.createClass({
  render: function() {
    return (
      <div className="Food" data-type={this.props.type}     style={{backgroundColor: this.props.hue}}>
        <span className="foodName">
          {this.props.name}
        </span>
      </div>
    );
  }
});

var FoodCart = React.createClass({
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
      <div className="FoodCart">
        <FilterFoodsForm />
        <AddFoodForm onFoodSubmit={this.handleFoodSubmit} />
        <FoodList data={this.state.data} />
      </div>
    );
  }
});


var FoodList = React.createClass({
  render: function() {
    var foodNodes = this.props.data.map(function(food, index) {
      return (
        <Food name={food.name} type={food.type} hue={food.hue} key={index}>
          {food.text}
        </Food>
      );
    });
    return (
      <div className="FoodList">
        {foodNodes}
      </div>
    );
  }
});

var AddFoodForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var type = React.findDOMNode(this.refs.type).value.trim();
    var hue = React.findDOMNode(this.refs.hue).value.trim();
    if (!name || !type || !hue) {
      return;
    }
    this.props.onFoodSubmit({name: name, type: type, hue: hue});
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.type).value = '';
    React.findDOMNode(this.refs.hue).value = '';
  },
  render: function() {
    return (
      <form className="AddFoodForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Name" ref="name" />
        <input type="text" placeholder="Type" ref="type" />
        <input type="text" placeholder="Hue" ref="hue" />
        <input type="submit" value="Add Food" />
      </form>
    );
  }
});

var FilterFoodsForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var name = React.findDOMNode(this.refs.name).value.trim();
    var type = React.findDOMNode(this.refs.type).value.trim();
    var hue = React.findDOMNode(this.refs.hue).value.trim();
    if (!name || !type || !hue) {
      return;
    }
    this.props.onFoodSubmit({name: name, type: type, hue: hue});
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.type).value = '';
    React.findDOMNode(this.refs.hue).value = '';
  },
  render: function() {
    return (
      <form className="FilterFoodsForm" onSubmit={this.handleSubmit}>
        <select name="foodTypeSelect" value="Fruits">
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Herbs">Herbs</option>
        </select>
        <select>
            <option value="Arkansas">Arkansas</option>
            <option value="California">California</option>
            <option value="Texas">Texas</option>
        </select>
        <select>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
        </select>
      </form>
    );
  }
});

React.render(
  <FoodCart url="foods.json" pollInterval={2000} />,
  document.getElementById('content')
);
