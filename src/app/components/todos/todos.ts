import {
	Inject,
	ViewEncapsulation,
	Component,
	View,
	NgIf,
	FormBuilder,
	DefaultValueAccessor,
	ControlGroup,
	NgControlName,
	NgForm,
	NgFormModel,
	Validators
} from 'angular2/angular2';
import { ComponentInstruction, OnActivate, OnDeactivate } from 'angular2/router';

import { isNativeShadowDOMSupported } from 'common/shadow_dom';
import { TodoStore } from 'app/services';
import { TodoList } from '../todo_list/todo_list';
import { Icon } from '../icon/icon';

@Component({
	selector: 'todos'
})

@View({
	encapsulation: isNativeShadowDOMSupported ? ViewEncapsulation.NATIVE : ViewEncapsulation.EMULATED, // EMULATED, NATIVE, NONE (default)
	templateUrl: 'app/components/todos/todos.html',
	styleUrls: [
		'app/components/todos/todos.css'
	],
	directives: [
		NgIf,
		DefaultValueAccessor,
		NgControlName,
		NgForm,
		NgFormModel,
		Icon,
		TodoList
	]
})

export class Todos implements OnActivate, OnDeactivate {
	form: ControlGroup;
	private ts: TodoStore;
	constructor(fb: FormBuilder, @Inject(TodoStore) tsp: Promise<TodoStore>) {
		this.form = fb.group({
			desc: ['', Validators.required]
		});
		tsp.then(ts => this.ts = ts);
	}
	onActivate(next: ComponentInstruction, prev: ComponentInstruction) {}
	onDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {}
	add(value) {
		if (!value || !value.length) return;
		this.ts.add(value);
		this.form.controls.desc.updateValue('');
		return false;
	}
}