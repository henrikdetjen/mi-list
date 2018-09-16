'use strict';

const e = React.createElement;

let data = {};

function getData(callback){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		  let res = JSON.parse(this.response);
		  data = res;
		  if (callback) callback();
	  } 
	};
	xhttp.open("GET", "/list", true);
	xhttp.send();
}

function postData(){
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
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
	
	handleClick = () => {
		this.props.item.currentAmount++;
		postData();
		renderList();
	}

	render(){
		return 	<button onClick={this.handleClick} type="button" className="btn btn-default">
				<span className="oi oi-plus"></span>
				</button>
	}
	
}

class ButtonDecreaseItemAmount extends React.Component {
	
	handleClick = () => {
		if(this.props.item.currentAmount < 1) return; 
		this.props.item.currentAmount--;
		postData();
		renderList();
	}
	
	render(){
		return 	<button onClick={this.handleClick} type="button" className="btn btn-default">
				<span className="oi oi-minus"></span>
				</button>
	}	
	
}

class ButtonFillUp extends React.Component {
	
	handleClick = () => {
		for (let i = 0, l = this.props.items.length; i < l; i++){
			let item = this.props.items[i];
			if (item.currentAmount < item.desiredAmount) item.currentAmount = item.desiredAmount;
		}
		postData();
		renderList();
	}
	
	render(){
		return <button onClick={this.handleClick} type="button" className="btn btn-default">Alles auffüllen</button>

	}	
	
}

class ButtonNewItem extends React.Component {
	
	constructor () {
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
  
	handleOpenModal () {
		this.setState({ showModal: true });
		this.setState({ name: "" });
		this.setState({ desiredAmount: 1 });
		this.setState({ nameInvalid: false });
	}
	  
	handleCloseModal () {
		this.setState({ showModal: false });
	}
	
	handleChange(event){
		if (event.target.id === "nameIn") { this.setState({name: event.target.value}); }
		if (event.target.id === "desiredAmountIn") { this.setState({desiredAmount: event.target.value}); }
	}
	
	handleOK () {
		if (!this.state.name.length > 0) {
			this.setState({nameInvalid:true});
			return;
		}
		if (typeof this.state.desiredAmount !== 'number') {
			this.setState({ desiredAmount: 1 });
			return;
		}
		this.props.items.push({id:this.state.name+Math.random(),name:this.state.name,currentAmount:0,desiredAmount:this.state.desiredAmount});
		this.setState({ showModal: false });
		postData();
		renderList();
	}
	
	render(){
		return <span>
		<button onClick={this.handleOpenModal} type="button" className="btn btn-default">Gegenstand anlegen</button>
        <ReactModal ariaHideApp={false} isOpen={this.state.showModal}>
			<form>
			<h3>Neuer Gegenstand</h3>
			<div className="form-group">
				<label className="form-check-label" htmlFor="nameIn">Namen eingeben:</label>
				<input onChange={this.handleChange} value={this.state.name} type="text" className={"form-control " + (this.state.nameInvalid ? 'is-invalid' : '')} id="nameIn" />
			</div>
			<div className="form-group">
				<label className="form-check-label" htmlFor="desiredAmountIn">Soll festlegen:</label>
				<input onChange={this.handleChange} value={this.state.desiredAmount} type="number" className="form-control" id="desiredAmountIn" />
			</div>
			<button onClick={this.handleOK} type="button" className="btn btn-primary">Hinzufügen</button>&nbsp;
			<button onClick={this.handleCloseModal} type="button" className="btn btn-default">Abbrechen</button>
			</form>
		</ReactModal>
		</span>
	}	
	
}

class ButtonDeleteItem extends React.Component {
	
	constructor (props) {
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
  
	handleOpenModal () {
		this.setState({ showModal: true });
		this.setState({ selected:this.props.items[0].id });
	}
	  
	handleCloseModal () {
		this.setState({ showModal: false });
	}
	
	handleChange(event){
		this.setState({selected:event.target.value});
	}
	
	handleOK () {
		this.setState({ showModal: false });
		for(var i = this.props.items.length - 1; i >= 0; i--) {
			if(this.props.items[i].id === this.state.selected) {
			   this.props.items.splice(i, 1);
			}
		}
		postData();
		renderList();
	}
	
	render(){
		const items = this.props.items;
		const optionItems = items.map((item) =>
			<option key={item.id} value={item.id}>{item.name}</option>
		);
		return <span>
		<button onClick={this.handleOpenModal} type="button" className="btn btn-default">Gegenstand entfernen</button>
        <ReactModal ariaHideApp={false} isOpen={this.state.showModal}>
			<form>
			<h3>Gegenstand entfernen</h3>
			<div className="form-group">
				<label className="form-check-label" htmlFor="deleteOpts">Folgenden Gegenstand entfernen (Auswahl):</label>
				<select onChange={this.handleChange} type="select" className="form-control" id="deleteOpts">
					{optionItems}
				</select>
			</div>
			<button onClick={this.handleOK} type="button" className="btn btn-primary">Entfernen</button>&nbsp;
			<button onClick={this.handleCloseModal} type="button" className="btn btn-default">Abbrechen</button>
			</form>
		</ReactModal>
		</span>
	}	
	
}

class ListItem extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render(){
		let klass = "";
		const itemRatio = this.props.item.currentAmount / this.props.item.desiredAmount;
		if (itemRatio < 1) klass = "table-warning";
		if (itemRatio < 0.5) klass = "table-danger";
		return <tr className={klass}>
			<td className="p-1">{this.props.item.name}</td>
			<td className="p-1 text-center text-secondary">{this.props.item.desiredAmount}</td>
			<td className="p-1 align-text-top text-body" style={{minWidth: "120px"}}>
				{this.props.item.currentAmount}
				<div className="btn-group float-right">
					<ButtonIncreaseItemAmount item={this.props.item} />
					<ButtonDecreaseItemAmount item={this.props.item} />
				</div>
			</td>
		</tr>;
	}
	
}

class List extends React.Component {
	render(){
	  const items = this.props.data.list;
	  const listItems = items.map((item) =>
			<ListItem key={item.id} item={item} />
	  );
	  return (
	  <div className="container p-0">
		<div className="card">
			<div className="card-header text-center">Lagerliste</div>
			<div className="card-body p-0">		
				<div className="table-responsive">
					<table className="table table-bordered mb-0">
						<thead className="">
						<tr>
							<th className="p-1">Gegenstand</th>
							<th className="p-1 text-center">Soll</th>
							<th className="p-1">Ist</th>
						</tr>
						</thead>
						<tbody>
							{listItems}
						</tbody>
					</table>
				</div>
				<div className="float-right m-1"><ButtonFillUp items={items} /></div>
				<div className="float-left">
					<div className="m-1"><ButtonNewItem items={items} /></div>
					<div className="m-1"><ButtonDeleteItem items={items} /></div>
				</div>
			</div>
			<div className="card-footer text-center text-muted">
				{this.props.data.lastChanged}
			</div>
		</div>
	  </div>
	  );
	}
}

function renderList(){
	ReactDOM.render(
		<List data={data} />,
		document.getElementById('root')
	);
}

getData(renderList);
