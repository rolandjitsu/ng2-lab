import {
	CORE_DIRECTIVES,
	FORM_DIRECTIVES,
	Inject,
	Component,
	ViewEncapsulation
} from 'angular2/angular2';
import { ROUTER_DIRECTIVES } from 'angular2/router';

import { AuthClient, Chores } from '../../services';
import { Glyph } from '../glyph/glyph';
import { TodosCount } from '../todos_count/todos_count';
import { TodoList } from '../todo_list/todo_list';

class Form {
	name: string;
}

@Component({
	selector: 'todos',
	encapsulation: ViewEncapsulation.Emulated, // ViewEncapsulation.Emulated, ViewEncapsulation.Native, ViewEncapsulation.None (default)
	templateUrl: 'app/components/todos/todos.html',
	styleUrls: [
		'app/components/todos/todos.css'
	],
	directives: [
		CORE_DIRECTIVES,
		FORM_DIRECTIVES,
		ROUTER_DIRECTIVES,
		Glyph,
		TodosCount,
		TodoList
	]
})

// @CanActivate()

export class Todos {
	form: Form = new Form();
	private _chores: Chores;
	private _client: AuthClient;
	constructor(@Inject(Chores) csp: Promise<Chores>, _client: AuthClient) {
		csp.then((cs) => this._chores = cs);
		this._client = _client;
	}
	logout(event) {
		event.preventDefault();
		this._client.logout();
	}
	add() {
		this._chores.add(this.form.name);
		this.form.name = '';
		return false;
	}
}