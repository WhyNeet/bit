import { CdkConnectedOverlay, CdkOverlayOrigin } from "@angular/cdk/overlay";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { NgIcon, injectNgIconLoader, provideIcons } from "@ng-icons/core";
import { lucideMoreVertical } from "@ng-icons/lucide";
import { DropdownItemComponent } from "../dropdown/dropdown-item.component";

export type Option = {
  label: string;
  icon: string;
};

@Component({
  selector: "app-ui-options",
  standalone: true,
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    NgIcon,
    DropdownItemComponent,
  ],
  providers: [],
  template: `
  <button cdkOverlayOrigin #trigger="cdkOverlayOrigin" class="flex items-center gap-2 rounded-default bg-text/5 px-4 py-2 h-9 font-display" (click)="toggle()">
    <ng-icon name="lucideMoreVertical" />
  </button>
  <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="trigger" [cdkConnectedOverlayOpen]="isOpen()" (backdropClick)="isOpen.set(false)" [cdkConnectedOverlayHasBackdrop]="true" cdkConnectedOverlayBackdropClass="!opacity-0">
      <div class="p-1 bg-text/5 backdrop-blur rounded-default border border-text/10 min-w-48 absolute top-[calc(100%+6px)] -right-10">
          @for (item of options(); track item.label) {
            <app-ui-dropdown-item (onSelect)="setCurrentItem($index)">
                <ng-icon [name]="item.icon" size="18" icon />
                {{ item.label }}
            </app-ui-dropdown-item>
          }
      </div>
  </ng-template>
  `,
  viewProviders: [provideIcons({ lucideMoreVertical })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent {
  options = input.required<Option[]>();
  protected isOpen = signal(false);

  onSelectionChange = output<number>();

  protected iconLoader = injectNgIconLoader() as (name: string) => string;

  protected setCurrentItem(idx: number) {
    this.isOpen.set(false);
    this.onSelectionChange.emit(idx);
  }

  protected toggle() {
    this.isOpen.update((prev) => !prev);
  }
}
