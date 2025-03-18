import Dexie from "dexie";


export const db = new Dexie("CSVDatabase");
db.version(1).stores({
    csvData: "++id,columns",
    columnStore: "columnName, values" 
});

self.onmessage = async function (e) {
    if (e.data) {
        try {
            const response = await fetch(e.data);
            const text = await response.text();
            const { headers, data } = parseCSV(text);

            await storeData(headers, data);

            postMessage({ success: true });
        } catch (error) {
            postMessage({ success: false, message: error.message });
        }
    }
};

// **Parse CSV efficiently**
function parseCSV(csvText) {
    const rows = csvText.trim().split("\r").map(row => row.split(","));
    const headers = rows[0].map(header => header.trim());
    const data = rows.slice(1).map(row => {
        let obj = {};
        row.forEach((cell, index) => {
            obj[headers[index]] = cell.trim();
        });
        return obj;
    });

    return { headers, data };
}

// **Efficiently store data in Dexie**
async function storeData(headers, data) {
    await db.transaction("rw", db.csvData, db.columnStore, async () => {
        // Store headers and rows together
        await db.csvData.put({ columns: headers, data });

        // Store each column separately for fast access
        for (let header of headers) {
            let columnValues = data.map(row => row[header]);
            await db.columnStore.put({ columnName: header, values: columnValues });
        }
    });
}

export async function getColumn(columnName) {
    const columnData = await db.columnStore.get(columnName);
    return columnData ? columnData.values : null;
}



export async function clearCSVData() {
    await db.transaction("rw", db.csvData, db.columnStore, async () => {
        await db.csvData.clear();  // Clears table storing rows & headers
        await db.columnStore.clear();  // Clears table storing columns
    });
    console.log("CSV data cleared successfully!");
}

