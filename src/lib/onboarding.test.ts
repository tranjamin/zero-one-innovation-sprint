import {it,expect} from 'vitest';
import {shouldShowIntro,rememberIntroPreference,INTRO_PREFERENCE_KEY} from './onboarding';
it('shows onboarding without an opt-out',()=>{localStorage.clear();expect(shouldShowIntro(localStorage)).toBe(true)});
it('remembers do not show again across subsequent reads',()=>{localStorage.clear();rememberIntroPreference(localStorage,true);expect(localStorage.getItem(INTRO_PREFERENCE_KEY)).toBe('true');expect(shouldShowIntro(localStorage)).toBe(false)});
it('removes opt-out when unchecked',()=>{rememberIntroPreference(localStorage,true);rememberIntroPreference(localStorage,false);expect(shouldShowIntro(localStorage)).toBe(true)});