import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	input,
} from "@angular/core";

@Component({
	selector: "app-ui-switch",
	standalone: true,
	imports: [],
	providers: [],
	template: `
        <div [classList]="['rounded-full w-[45px] h-6 relative transition-colors', this.value ? 'bg-primary' : 'bg-text/20', class].join(' ')" (click)="handleClick($event)">
            <div [classList]="['rounded-full absolute inset-y-[1px] bg-background transition-all aspect-square pointer-events-none', this.value ? 'left-[22px]' : 'left-[1px]'].join(' ')"></div>
        </div>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent {
	@Input() class = "";
	@Input() initialValue: boolean | null = false;
	@Input() value = this.initialValue;
	@Output() click = new EventEmitter();
	@Output() change = new EventEmitter<boolean>();

	protected handleClick(evt: Event) {
		this.click.emit();
		this.change.emit(!this.value);
		evt.stopPropagation();
	}
}
