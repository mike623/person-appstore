// esbuild aliases `react` to this shim so the chat bundle shares the ONE React
// instance the rest of the site already loaded from the CDN (window.React),
// instead of bundling a second copy. Single instance = hooks work when
// <AskMikePanel/> renders inside app.jsx's tree.
const React = window.React;

export default React;
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useRef = React.useRef;
export const useMemo = React.useMemo;
export const useCallback = React.useCallback;
export const useContext = React.useContext;
export const useReducer = React.useReducer;
export const useLayoutEffect = React.useLayoutEffect;
export const useImperativeHandle = React.useImperativeHandle;
export const useDebugValue = React.useDebugValue;
export const useSyncExternalStore = React.useSyncExternalStore;
export const useId = React.useId;
export const useTransition = React.useTransition;
export const useDeferredValue = React.useDeferredValue;
export const createContext = React.createContext;
export const createElement = React.createElement;
export const cloneElement = React.cloneElement;
export const Fragment = React.Fragment;
export const forwardRef = React.forwardRef;
export const memo = React.memo;
export const isValidElement = React.isValidElement;
export const Children = React.Children;
