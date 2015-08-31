var App = React.createClass({
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
            <div className="App">
                <FoodList data={this.state.data} />
            </div>
        );
    }
});


var Food = React.createClass({
    getInitialState: function() {
          return {
              isSelected:false
          };
    },
    countFirstRowItems: function(){
        var count = 0, theTop = undefined;

        $(".FoodList > .Food").each(function(){
            var thisTop = $(this).offset().top;
            if(theTop === undefined){
                theTop = thisTop;
            }
            if(thisTop != theTop){
                return false;
            }
            count++;
        });
        return count;
    },
    handleClick: function(e) {

        this.setState({isSelected:! this.state.isSelected})
        var deltaX = 0;
        var deltaY = 0;
        var scale = 4;

        windowWidth = $(window).outerWidth();
        windowHeight = $(window).outerHeight();
        windowCenterX = windowWidth / 2;
        windowCenterY = windowHeight / 2;

        element = this.getDOMNode();
        $element = $(element);
        $parent = $element.parent();

        parentOffset = $parent.offset();
        elOffset = $element.offset();
        elementCenterX = elOffset.left + $element.outerWidth()/2;
        elementCenterY = elOffset.top + $element.outerHeight()/2;

        var numberOfColumns = this.countFirstRowItems();
        var columnWidth = windowWidth / numberOfColumns;

        deltaX = parentOffset.left + ((windowCenterX * scale) - (elementCenterX * scale));
        deltaY = parentOffset.top + (windowCenterY - (elementCenterY * scale));

        if(this.state.isSelected){
          $parent.css('transform', 'translate(' + 0 + 'px,' + 0 + 'px)' + ' scale(' + 1 + ')');
        } else{
          $parent.css('transform', 'translate(' + deltaX + 'px,' + deltaY + 'px)' + ' scale(' + scale + ')');
        }

    },
    render: function() {
        return (
            <div className="Food" onTouchStart={this.handleClick} onClick={this.handleClick} data-type={this.props.type} style={{backgroundColor: this.props.hue}}>
                <span className="foodName">
                    {this.props.name}
                </span>
            </div>
        );
    }
});


var FoodList = React.createClass({
    sortByKey: function(array, key){
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
    },
    render: function() {
        sortedArray = this.sortByKey(this.props.data, "name");
        foodNodes = sortedArray.map(function(food, index) {
            return (
                <Food key={index} name={food.name} type={food.type} hue={food.hue}>
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



React.render(
    <App url="foods.json" pollInterval={2000} />,
    document.getElementById('content')
);
