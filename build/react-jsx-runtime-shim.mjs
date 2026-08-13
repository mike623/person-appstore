// Shim for `react/jsx-runtime` (automatic JSX) — @ai-sdk/react is compiled with
// it. Adapts the jsx(type, props, key) calling convention to window.React's
// classic createElement, so it uses the same shared React instance.
const React = window.React;

export const Fragment = React.Fragment;

export function jsx(type, props, key) {
  const { children, ...rest } = props || {};
  if (key !== undefined) rest.key = key;
  if (children === undefined) return React.createElement(type, rest);
  return React.createElement(type, rest, ...(Array.isArray(children) ? children : [children]));
}

export const jsxs = jsx;
export const jsxDEV = jsx;
