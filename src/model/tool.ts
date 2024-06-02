export async function fetchCsv(file: string) {
    const response = await fetch(file);
    const reader = response.body?.getReader();
    if (reader) {
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = await decoder.decode(result.value);
        const rows = csv.split("\n").filter((str) => str != "");
        return rows.map((row) => row.split(","));
    }
    return undefined;
}