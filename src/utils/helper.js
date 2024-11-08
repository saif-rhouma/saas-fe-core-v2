/* eslint-disable dot-notation */
/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_flatten
 * https://github.com/you-dont-need-x/you-dont-need-lodash
 */

// ----------------------------------------------------------------------

export const getApplicationName = (userInput) => {
  let { name } = userInput.userOwnedApps;
  if (userInput?.roles?.includes('STAFF')) {
    // eslint-disable-next-line prefer-destructuring
    name = userInput.applications.name;
  }
  return name;
};

// ----------------------------------------------------------------------

export function flattenArray(list, key = 'children') {
  let children = [];

  const flatten = list?.map((item) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}

// ----------------------------------------------------------------------

export function flattenDeep(array) {
  const isArray = array && Array.isArray(array);

  if (isArray) {
    return array.flat(Infinity);
  }
  return [];
}

// ----------------------------------------------------------------------

export function orderBy(array, properties, orders) {
  return array.slice().sort((a, b) => {
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      const order = orders && orders[i] === 'desc' ? -1 : 1;

      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) return -1 * order;
      if (aValue > bValue) return 1 * order;
    }
    return 0;
  });
}

// ----------------------------------------------------------------------

export function keyBy(array, key) {
  return (array || []).reduce((result, item) => {
    const keyValue = key ? item[key] : item;

    return { ...result, [String(keyValue)]: item };
  }, {});
}

// ----------------------------------------------------------------------

export function sumBy(array, iteratee) {
  return array.reduce((sum, item) => sum + iteratee(item), 0);
}

// ----------------------------------------------------------------------

export function calculateTax(price, taxRate) {
  const taxAmount = price * (taxRate / 100);
  return taxAmount;
}

// ----------------------------------------------------------------------

export function calculateAfterTax(price, taxRate) {
  const taxAmount = price * (taxRate / 100);
  const finalPrice = price + taxAmount;
  return finalPrice;
}

// ----------------------------------------------------------------------

export function isEqual(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
    return a === b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

// ----------------------------------------------------------------------

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export const merge = (target, ...sources) => {
  if (!sources.length) return target;

  const source = sources.shift();

  // eslint-disable-next-line no-restricted-syntax
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      merge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }

  return merge(target, ...sources);
};

export const sortByDateDesc = (array, key) =>
  array.sort((a, b) => new Date(a[key]) - new Date(b[key]));

// ----------------------------------------------------------------------
// Function to convert JSON to CSV format
export const convertToCSV = (array) => {
  const keys = Object.keys(array[0]);
  const csvRows = [];

  // Add the header row
  csvRows.push(keys.join(','));

  // Add the data rows
  array.forEach((row) => {
    const values = keys.map((key) => row[key]);
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

// ----------------------------------------------------------------------

// Function to handle export to Excel
export const exportToExcel = async (filename, headerSet, data, sheetName = 'Sheet1') => {
  // Function to remap data based on custom headers and corresponding keys
  const remapData = (dataset, headers) =>
    dataset.map((row) => {
      const remappedRow = {};
      headers.forEach((head) => {
        remappedRow[head.displayName] = row[head.key]; // Dynamically map key to display name
      });
      return remappedRow;
    });

  // eslint-disable-next-line import/no-extraneous-dependencies
  const XLSX = await import('xlsx-js-style'); // Dynamically import the xlsx library

  const remappedData = remapData(data, headerSet); // Use dynamic remapped data
  const headerDisplayNames = headerSet.map((head) => head.displayName); // Extract header display names

  // Create header styles
  const headerCellStyle = {
    font: {
      bold: true, // Bold font
      color: { rgb: 'FFFFFF' }, // White text color
    },
    fill: {
      fgColor: { rgb: '4F81BD' }, // Blue background color
    },
    alignment: {
      horizontal: 'center', // Center alignment for header
    },
  };

  const worksheet = XLSX.utils.json_to_sheet(remappedData, { header: headerDisplayNames });

  // Apply styles to header cells
  headerDisplayNames.forEach((_, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // Header row is the first row (0-indexed)
    if (!worksheet[cellAddress]) worksheet[cellAddress] = {}; // Ensure the cell exists
    worksheet[cellAddress].s = headerCellStyle; // Apply style to the header cell
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

//-------------------------------------------------------
/**
 *
 * @param dateTime
 * @returns true if it's in the past
 */
export function isDateTimeInPast(dateTime) {
  const now = new Date(); // Get the current date and time
  const inputDateTime = new Date(dateTime); // Convert the input to a Date object

  return inputDateTime < now; // Check if the input date is in the past
}
//-------------------------------------------------------
