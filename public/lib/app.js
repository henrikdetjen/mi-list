'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const e = React.createElement;
let data = {};

function getData(callback) {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.response);
      data = res;
      if (callback) callback();
    }
  };

  xhttp.open("GET", "/list", true);
  xhttp.send();
}

function postData() {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status != 200) {
      window.alert(this.status);
    }
  };

  xhttp.open("POST", "/list", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  const d = new Date();
  data.lastChanged = "Zuletzt geändert am " + d.toLocaleDateString() + " um " + d.toLocaleTimeString();
  xhttp.send(JSON.stringify(data));
}

class ButtonIncreaseItemAmount extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleClick", () => {
      this.props.item.currentAmount++;
      postData();
      renderList();
    });
  }

  render() {
    return React.createElement("button", {
      onClick: this.handleClick,
      type: "button",
      className: "btn btn-default"
    }, React.createElement("span", {
      className: "oi oi-plus"
    }));
  }

}

class ButtonDecreaseItemAmount extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleClick", () => {
      if (this.props.item.currentAmount < 1) return;
      this.props.item.currentAmount--;
      postData();
      renderList();
    });
  }

  render() {
    return React.createElement("button", {
      onClick: this.handleClick,
      type: "button",
      className: "btn btn-default"
    }, React.createElement("span", {
      className: "oi oi-minus"
    }));
  }

}

class ButtonFillUp extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleClick", () => {
      for (let i = 0, l = this.props.items.length; i < l; i++) {
        let item = this.props.items[i];
        if (item.currentAmount < item.desiredAmount) item.currentAmount = item.desiredAmount;
      }

      postData();
      renderList();
    });
  }

  render() {
    return React.createElement("button", {
      onClick: this.handleClick,
      type: "button",
      className: "btn btn-default"
    }, "Alles auff\xFCllen");
  }

}

class ButtonNewItem extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      name: "",
      desiredAmount: 1,
      nameInvalid: false
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOK = this.handleOK.bind(this);
  }

  handleOpenModal() {
    this.setState({
      showModal: true
    });
    this.setState({
      name: ""
    });
    this.setState({
      desiredAmount: 1
    });
    this.setState({
      nameInvalid: false
    });
  }

  handleCloseModal() {
    this.setState({
      showModal: false
    });
  }

  handleChange(event) {
    if (event.target.id === "nameIn") {
      this.setState({
        name: event.target.value
      });
    }

    if (event.target.id === "desiredAmountIn") {
      this.setState({
        desiredAmount: event.target.value
      });
    }
  }

  handleOK() {
    if (!this.state.name.length > 0) {
      this.setState({
        nameInvalid: true
      });
      return;
    }

    if (typeof this.state.desiredAmount !== 'number') {
      this.setState({
        desiredAmount: 1
      });
      return;
    }

    this.props.items.push({
      id: this.state.name + Math.random(),
      name: this.state.name,
      currentAmount: 0,
      desiredAmount: this.state.desiredAmount
    });
    this.setState({
      showModal: false
    });
    postData();
    renderList();
  }

  render() {
    return React.createElement("span", null, React.createElement("button", {
      onClick: this.handleOpenModal,
      type: "button",
      className: "btn btn-default"
    }, "Gegenstand anlegen"), React.createElement(ReactModal, {
      ariaHideApp: false,
      isOpen: this.state.showModal
    }, React.createElement("form", null, React.createElement("h3", null, "Neuer Gegenstand"), React.createElement("div", {
      className: "form-group"
    }, React.createElement("label", {
      className: "form-check-label",
      htmlFor: "nameIn"
    }, "Namen eingeben:"), React.createElement("input", {
      onChange: this.handleChange,
      value: this.state.name,
      type: "text",
      className: "form-control " + (this.state.nameInvalid ? 'is-invalid' : ''),
      id: "nameIn"
    })), React.createElement("div", {
      className: "form-group"
    }, React.createElement("label", {
      className: "form-check-label",
      htmlFor: "desiredAmountIn"
    }, "Soll festlegen:"), React.createElement("input", {
      onChange: this.handleChange,
      value: this.state.desiredAmount,
      type: "number",
      className: "form-control",
      id: "desiredAmountIn"
    })), React.createElement("button", {
      onClick: this.handleOK,
      type: "button",
      className: "btn btn-primary"
    }, "Hinzuf\xFCgen"), "\xA0", React.createElement("button", {
      onClick: this.handleCloseModal,
      type: "button",
      className: "btn btn-default"
    }, "Abbrechen"))));
  }

}

class ButtonDeleteItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selected: ""
    };
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOK = this.handleOK.bind(this);
  }

  handleOpenModal() {
    this.setState({
      showModal: true
    });
    this.setState({
      selected: this.props.items[0].id
    });
  }

  handleCloseModal() {
    this.setState({
      showModal: false
    });
  }

  handleChange(event) {
    this.setState({
      selected: event.target.value
    });
  }

  handleOK() {
    this.setState({
      showModal: false
    });

    for (var i = this.props.items.length - 1; i >= 0; i--) {
      if (this.props.items[i].id === this.state.selected) {
        this.props.items.splice(i, 1);
      }
    }

    postData();
    renderList();
  }

  render() {
    const items = this.props.items;
    const optionItems = items.map(item => React.createElement("option", {
      key: item.id,
      value: item.id
    }, item.name));
    return React.createElement("span", null, React.createElement("button", {
      onClick: this.handleOpenModal,
      type: "button",
      className: "btn btn-default"
    }, "Gegenstand entfernen"), React.createElement(ReactModal, {
      ariaHideApp: false,
      isOpen: this.state.showModal
    }, React.createElement("form", null, React.createElement("h3", null, "Gegenstand entfernen"), React.createElement("div", {
      className: "form-group"
    }, React.createElement("label", {
      className: "form-check-label",
      htmlFor: "deleteOpts"
    }, "Folgenden Gegenstand entfernen (Auswahl):"), React.createElement("select", {
      onChange: this.handleChange,
      type: "select",
      className: "form-control",
      id: "deleteOpts"
    }, optionItems)), React.createElement("button", {
      onClick: this.handleOK,
      type: "button",
      className: "btn btn-primary"
    }, "Entfernen"), "\xA0", React.createElement("button", {
      onClick: this.handleCloseModal,
      type: "button",
      className: "btn btn-default"
    }, "Abbrechen"))));
  }

}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let klass = "";
    const itemRatio = this.props.item.currentAmount / this.props.item.desiredAmount;
    if (itemRatio < 1) klass = "table-warning";
    if (itemRatio < 0.5) klass = "table-danger";
    return React.createElement("tr", {
      className: klass
    }, React.createElement("td", {
      className: "p-1"
    }, this.props.item.name), React.createElement("td", {
      className: "p-1 text-center text-secondary"
    }, this.props.item.desiredAmount), React.createElement("td", {
      className: "p-1 align-text-top text-body",
      style: {
        minWidth: "120px"
      }
    }, this.props.item.currentAmount, React.createElement("div", {
      className: "btn-group float-right"
    }, React.createElement(ButtonIncreaseItemAmount, {
      item: this.props.item
    }), React.createElement(ButtonDecreaseItemAmount, {
      item: this.props.item
    }))));
  }

}

class List extends React.Component {
  render() {
    const items = this.props.data.list;
    const listItems = items.map(item => React.createElement(ListItem, {
      key: item.id,
      item: item
    }));
    return React.createElement("div", {
      className: "container p-0"
    }, React.createElement("div", {
      className: "card"
    }, React.createElement("div", {
      className: "card-header text-center"
    }, "Lagerliste"), React.createElement("div", {
      className: "card-body p-0"
    }, React.createElement("div", {
      className: "table-responsive"
    }, React.createElement("table", {
      className: "table table-bordered mb-0"
    }, React.createElement("thead", {
      className: ""
    }, React.createElement("tr", null, React.createElement("th", {
      className: "p-1"
    }, "Gegenstand"), React.createElement("th", {
      className: "p-1 text-center"
    }, "Soll"), React.createElement("th", {
      className: "p-1"
    }, "Ist"))), React.createElement("tbody", null, listItems))), React.createElement("div", {
      className: "float-right m-1"
    }, React.createElement(ButtonFillUp, {
      items: items
    })), React.createElement("div", {
      className: "float-left"
    }, React.createElement("div", {
      className: "m-1"
    }, React.createElement(ButtonNewItem, {
      items: items
    })), React.createElement("div", {
      className: "m-1"
    }, React.createElement(ButtonDeleteItem, {
      items: items
    })))), React.createElement("div", {
      className: "card-footer text-center text-muted"
    }, this.props.data.lastChanged)));
  }

}

function renderList() {
  ReactDOM.render(React.createElement(List, {
    data: data
  }), document.getElementById('root'));
}

getData(renderList);