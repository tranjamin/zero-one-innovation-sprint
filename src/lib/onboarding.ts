export const INTRO_PREFERENCE_KEY = 'wien-energy-hide-intro';
export function shouldShowIntro(storage: Pick<Storage,'getItem'>) {
 try {return storage.getItem(INTRO_PREFERENCE_KEY) !== 'true';} catch {return true;}
}
export function rememberIntroPreference(storage: Pick<Storage,'setItem'|'removeItem'>, hidden: boolean) {
 try {if(hidden) storage.setItem(INTRO_PREFERENCE_KEY,'true'); else storage.removeItem(INTRO_PREFERENCE_KEY);} catch { /* Storage may be disabled; dismissal still works. */ }
}