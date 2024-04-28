declare module 'html2pdf.js/dist/html2pdf.js' {
    export default function html2pdf(): {
      from(element: HTMLElement): any;
      set(options: any): any;
      save(): void;
    };
  }