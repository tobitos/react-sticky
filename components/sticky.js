var React = require('react'),
  raf = require('raf');

var Sticky = React.createClass({

  hasClass: function (el, cls) {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  },

  getClosest: function(el, cls) {
    do {
      if (this.hasClass(el, cls)) {
        // class found, return!
        return el;
      }
    } while (el = el.parentNode);

    return null;
  },

  reset: function() {
    var html = document.documentElement, body = document.body;
    var node = this.getDOMNode();
    var unstickyNode = this.getClosest(node, this.props.containerByClassName);

    this.fixedOffset = this.props.fixedOffset || 0;

    var windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop;
    var classes = node.className;
    node.className = '';
    this.elementOffset = node.getBoundingClientRect().top + windowOffset;
    this.unstickyOffset = unstickyNode.getBoundingClientRect().bottom + windowOffset;
    node.className = classes;
  },

  tick: function() {
    if (!this.unmounting) {
      raf(this.tick);
    }

    if (this.resizing) {
      this.resizing = false;
      this.reset();
    }

    if (this.scrolling) {
      this.scrolling = false;
      if (pageYOffset + this.fixedOffset > this.elementOffset && pageYOffset < this.unstickyOffset) {
        this.setState({ className: this.props.stickyClassName || 'sticky' });
      } else {
        this.setState({ className: '' });
      }
    }
  },

  handleResize: function() {
    this.resizing = true;
  },

  handleScroll: function() {
    this.scrolling = true;
  },

  getInitialState: function() {
    return { className: '' };
  },

  componentDidMount: function() {
    this.reset();
    this.tick();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.unmounting = true;
  },

  render: function() {
    return React.DOM.div({
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
