declare module "html6" {
  interface CompileOptions {
    pipes?: Record<string, Function>;
    components?: string[];
    mode?: string;
    formatter?: Function;
  }

  interface CompiledRenderer {
    render: (data?: Record<string, any>) => string;
  }

  function compile(
    template: string,
    options?: CompileOptions
  ): CompiledRenderer;

  export { compile };
}

declare module "pretty" {
  function pretty(html: string): string;
  export = pretty;
}