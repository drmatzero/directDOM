// Pages/TestData.js
import { createElement, createComponent, useState, useEffect } from "../PureView/core.js";

export const TestData = createComponent(() => {
  console.log("TestData dirender"); // Log saat komponen di-render
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // useEffect untuk fetching data
  useEffect(() => {
    console.log("TestData useEffect dijalankan (fetching data)"); // Log saat useEffect dijalankan
    setLoading(true);
    fetch("/dokumen.json") // Pastikan file dokumen.json ada di root proyek Anda
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        setLoading(false);
        setData(jsonData);
        console.log("TestData data diterima:", jsonData); // Log saat data diterima
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        console.log("TestData error:", err.message); // Log jika ada error
      });

    // Fungsi cleanup untuk useEffect ini (jika ada resource yang perlu dibersihkan)
    return () => {
      console.log("TestData cleanup dijalankan (useEffect data fetching).");
      // Tidak ada resource yang perlu dibersihkan secara eksplisit untuk fetch ini
    };
  }, []); // Dependensi kosong, efek hanya berjalan sekali saat mount

  const handleSectionClick = (id) => {
    setSelectedSectionId(id);
    console.log("TestData section diklik:", id); // Log saat section diklik
  };

  const renderFunctionDetails = () => {
    if (loading) {
      return createElement("p", { className: "text-gray-600" }, "Memuat detail...");
    }
    if (error) {
      return createElement("p", { className: "text-red-500" }, `Error memuat detail: ${error}`);
    }
    if (!data || !selectedSectionId) {
      return createElement("p", { className: "text-gray-600" }, "Pilih bagian dari daftar.");
    }

    const selectedSection = data.find((section) => section.id === selectedSectionId);
    if (!selectedSection || !selectedSection.functions) {
      return createElement("p", { className: "text-gray-600" }, "Tidak ada detail fungsi untuk bagian ini.");
    }

    return createElement(
      "div",
      { className: "p-4 bg-blue-50 rounded-lg shadow-sm" },
      createElement("h3", { className: "text-xl font-semibold text-blue-700 mb-3" }, `Fungsi dalam "${selectedSection.title}"`),
      createElement(
        "ul",
        { className: "list-disc pl-5 space-y-2" },
        selectedSection.functions.map((func) => createElement("li", { key: func.name, className: "text-gray-700" }, createElement("strong", { className: "text-blue-600" }, `${func.name}: `), func.description))
      )
    );
  };

  return createElement(
    "div",
    { style: { display: "flex", minHeight: "calc(100vh - 200px)", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#ffffff" } },
    createElement(
      "div",
      { style: { width: "250px", borderRight: "1px solid #e2e8f0", padding: "15px", backgroundColor: "#f7fafc", borderRadius: "8px 0 0 8px" } },
      createElement("h2", { className: "text-2xl font-bold text-gray-800 mb-4" }, "Bagian Dokumentasi"),
      loading
        ? createElement("p", { className: "text-gray-600" }, "Memuat daftar bagian...")
        : error
        ? createElement("p", { className: "text-red-500" }, `Error: ${error}`)
        : data &&
          createElement(
            "ul",
            { className: "space-y-2" },
            data.map((section) =>
              createElement(
                "li",
                {
                  key: section.id,
                  style: { cursor: "pointer", marginBottom: "5px", fontWeight: selectedSectionId === section.id ? "bold" : "normal" },
                  className: `text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 rounded-md ${selectedSectionId === section.id ? "bg-blue-100 text-blue-800" : ""}`,
                  onClick: () => handleSectionClick(section.id),
                },
                section.title
              )
            )
          )
    ),
    createElement("div", { style: { flex: 1, padding: "15px", overflowY: "auto" } }, createElement("h2", { className: "text-2xl font-bold text-gray-800 mb-4" }, "Detail Bagian"), renderFunctionDetails())
  );
});

export default TestData;
