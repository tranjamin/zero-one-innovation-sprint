import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider, useLanguage } from './language-provider';

vi.mock('@tanstack/react-router', () => ({ useRouterState: () => '/about' }));

describe('App language preference', () => {
  it('starts in English and allows switching to German', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper: LanguageProvider });
    expect(result.current.language).toBe('en');
    act(() => result.current.setLanguage('de'));
    expect(result.current.language).toBe('de');
  });
});