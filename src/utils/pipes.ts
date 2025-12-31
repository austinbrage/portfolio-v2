export const utilPipes = {
  console: function (value: string): string {
    console.log("PIPE console:", value);
    return value;
  },

  truncate: function (str: string, maxLength: number): string {
    if (typeof str !== "string") {
      return str;
    }

    if (str.length <= maxLength) {
      return str;
    }

    return str.slice(0, maxLength) + "...";
  },
  upper: function (str: string): string {
    if (typeof str !== "string") {
      return str;
    }

    if (str.length === 0) {
      return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};