import { FormControl } from '@angular/forms';
import { nonWhitespaceValidator } from './non-whitespace.validator';

describe('nonWhitespaceValidator', () => {
  it('accepts text containing a non-whitespace character', () => {
    const control = new FormControl('  message  ', nonWhitespaceValidator());

    expect(control.valid).toBe(true);
  });

  it('rejects whitespace-only text', () => {
    const control = new FormControl('   ', nonWhitespaceValidator());

    expect(control.errors).toEqual({ whitespace: true });
  });
});
