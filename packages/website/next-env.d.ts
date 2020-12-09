/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg';

declare module '../../node_modules/preact-i18n' {
  // Type definitions for preact-i18n 2.3
  // Project: https://github.com/synacor/preact-i18n
  // Definitions by:  Lukas Tetzlaff <https://github.com/ltetzlaff>
  //                  Sascha Zarhuber <https://github.com/saschazar21>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
  // TypeScript Version: 3.5

  import { h, Component, Context, VNode, ComponentChild, JSX } from 'preact';

  interface IntlContext {
    intl: {
      definition: { [key: string]: any };
      mark: boolean;
      scope: string;
    };
  }

  interface IntlProviderProps {
    children: JSX.Element | JSX.Element[];
    definition?: { [key: string]: any };
    mark?: boolean;
    scope?: string;
  }

  interface LocalizerProps {
    children: JSX.Element | JSX.Element[];
  }
  interface TextProps {
    children?: string;
    id: string;
    fields?: { [key: string]: any };
    plural?: number;
  }

  export const IntlContext: Context<IntlContext>;

  export function IntlProvider(props: IntlProviderProps): JSX.Element;

  export function Text(props: TextProps): JSX.Element;

  export function MarkupText(props: TextProps): JSX.Element;

  export function Localizer(props: LocalizerProps): JSX.Element;

  export function translate(
    id: string,
    scope: string,
    dictionary: { [key: string]: any },
    fields?: { [key: string]: any },
    plural?: number,
    fallback?: string
  ): string;

  export function useText(
    mapping: { [key: string]: string | JSX.Element } | string | JSX.Element
  ): { [key: string]: string };

  // tslint:disable-next-line:no-unnecessary-generics
  export function withText<Props, Context = IntlContext>(mapping: {
    [key: string]: any;
  }): (
    Child: ComponentChild
    // tslint:disable-next-line:no-unnecessary-generics
  ) => new (props?: Props, context?: Context) => any;

  export function intl(
    Child: Component,
    options?: { scope?: string; definition?: { [key: string]: any } }
  ): VNode;

  declare enum Intl {
    intl,
    IntlContext,
    IntlProvider,
    Text,
    MarkupText,
    Localizer,
    withText,
    useText,
    translate,
  }

  export default Intl;
}
