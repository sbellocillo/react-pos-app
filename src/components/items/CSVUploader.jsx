import { useState, useRef } from "react";

const CSVUploader = ({ onImport, itemTypes }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const parseCSV = (content) => {
    const lines = content.split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      // Handle simplified CSV splitting (note: this breaks on commas inside quotes)
      const values = lines[i].split(",");
      const row = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim();
      });

      // Match "Type Name" to "category_id"
      if (row.type && itemTypes) {
        const matchedType = itemTypes.find(
          (t) => t.name.toLowerCase() === row.type.toLowerCase()
        );
        if (matchedType) row.category_id = matchedType.id;
      }

      if (row.name && row.price) {
        data.push(row);
      }
    }

    return data;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const parsedData = parseCSV(text);

        if (parsedData.length === 0) {
          alert("Error: No valid data found in CSV.");
        } else {
          if (onImport) {
            await onImport(parsedData);
          } else {
            console.error("onImport prop is missing");
          }
        }
      } catch (err) {
        console.error(err);
        alert("Error: Failed to process file.");
      } finally {
        setLoading(false);
        // Reset input so the same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      alert("Error: Failed to read file.");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="csv-uploader">
      <input
        type="file"
        accept=".csv,text/csv"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        className="btn-secondary"
        onClick={() => fileInputRef.current.click()}
        disabled={loading}
      >
        {loading ? "Loading..." : "Import CSV"}
      </button>
    </div>
  );
};

export default CSVUploader;