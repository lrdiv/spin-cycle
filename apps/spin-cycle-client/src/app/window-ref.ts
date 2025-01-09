import { InjectionToken } from '@angular/core';

export const WindowRef = new InjectionToken<Window>('Global window object', {
  factory: () => window,
});
