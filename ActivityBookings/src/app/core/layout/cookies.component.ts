import { ChangeDetectionStrategy, Component, OutputEmitterRef, output } from '@angular/core';

/** Acceptance kinds for cookies */
type Acceptance = 'essentials' | 'all';

/**
 * Component to display a dialog to accept or cancel cookies.
 * Outputs the rejection or acceptance kind of cookies
 */
@Component({
  selector: 'lab-cookies',
  standalone: true,
  imports: [],
  template: `
    <dialog open>
      <article>
        <header>
          <h2>We use cookies</h2>
          <p>To ensure you get the best experience on our website.</p>
        </header>
        <section>
          <p>To be compliant with the EU GDPR law, we need your consent to set the cookies.</p>
        </section>
        <footer>
          <button class="contrast outline" (click)="cancel.emit()">Cancel</button>
          <button class="secondary outline" (click)="accept.emit('essentials')">Accept only essentials</button>
          <button class="primary outline" (click)="accept.emit('all')">Accept all</button>
        </footer>
      </article>
    </dialog>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesComponent {
  // * Output properties division

  /** Output signaling that cookies are not accepted */
  cancel: OutputEmitterRef<void> = output();

  /** Output signaling that cookies are accepted (all or only essentials) */
  accept: OutputEmitterRef<Acceptance> = output<Acceptance>();
}
