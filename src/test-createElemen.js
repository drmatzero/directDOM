// test_createElement.js
import { createElement, createComponent, mountComponent, useState, useEffect, createRef } from "./PureView/core.js";

// --- Komponen Fungsional Sederhana untuk Pengujian ---
const MyFunctionalComponent = createComponent(function MyFunctionalComponent(props) {
    const [count, setCount] = useState(props.initialCount || 0);

    useEffect(() => {
        console.log(`MyFunctionalComponent: Efek dijalankan untuk count: ${count}`);
        // Contoh efek: mengubah judul dokumen
        document.title = `Count: ${count}`;
        return () => {
            console.log(`MyFunctionalComponent: Cleanup efek untuk count: ${count}`);
            document.title = "Pengujian createElement PureView"; // Kembalikan judul
        };
    }, [count]); // Efek akan berjalan ulang jika count berubah

    const increment = () => setCount(count + 1);

    return createElement(
        "div",
        { className: "p-4 bg-yellow-100 rounded-md shadow-sm" },
        createElement("h3", { className: "text-lg font-semibold text-yellow-800 mb-2" }, "Komponen Fungsional"),
        createElement("p", { className: "text-gray-700" }, `Properti dari Parent: ${props.message}`),
        createElement("p", { className: "text-gray-700" }, `State Internal (Count): ${count}`),
        createElement("button", { onClick: increment, className: "mt-3 bg-yellow-500 hover:bg-yellow-600" }, "Increment Komponen")
    );
});

// --- Komponen Utama Pengujian ---
const TestApp = createComponent(function TestApp() {
    const myRef = createRef(); // Ref untuk mengakses elemen DOM secara langsung
    const [dynamicText, setDynamicText] = useState("Teks Awal Dinamis");
    const [showList, setShowList] = useState(true);

    useEffect(() => {
        // Efek untuk memverifikasi ref setelah render
        if (myRef.current) {
            console.log("Ref element current:", myRef.current);
            myRef.current.style.border = "2px solid green";
        }
    }, []); // Hanya berjalan sekali saat mount

    const handleButtonClick = () => {
        setDynamicText("Teks Diperbarui!");
        alert("Tombol diklik! Cek konsol untuk ref element.");
    };

    const toggleList = () => {
        setShowList(!showList);
    };

    const listItems = ["Item Satu", "Item Dua", "Item Tiga"];

    return createElement(
        "div",
        {},
        createElement("h1", { className: "text-3xl font-bold mb-6" }, "Pengujian `createElement`"),

        // Test 1: Elemen HTML Dasar dengan Props
        createElement("div", { className: "test-section" },
            createElement("h3", {}, "1. Elemen HTML Dasar & Props"),
            createElement(
                "p",
                {
                    id: "paragraph-test",
                    className: "text-gray-600",
                    style: { color: "navy", fontSize: "1.1em" },
                    "data-test-id": "basic-p"
                },
                "Ini adalah paragraf dengan berbagai properti."
            ),
            createElement(
                "button",
                { onClick: handleButtonClick, className: "mt-3" },
                "Klik Saya (Event Listener)"
            ),
            createElement(
                "div",
                { ref: myRef, className: "result-box mt-4" },
                "Elemen ini menggunakan ref (akan memiliki border hijau)."
            )
        ),

        // Test 2: Children (Teks, Angka, Elemen Lain)
        createElement("div", { className: "test-section" },
            createElement("h3", {}, "2. Children (Teks, Angka, Elemen Bersarang)"),
            createElement(
                "div",
                { className: "p-3 bg-indigo-50 rounded-md" },
                "Ini adalah teks. ",
                123,
                " Ini juga teks.",
                createElement("span", { style: { fontWeight: "bold", color: "#667eea" } }, " Ini adalah span bersarang.")
            )
        ),

        // Test 3: Children sebagai Array (List Rendering)
        createElement("div", { className: "test-section" },
            createElement("h3", {}, "3. Children sebagai Array (List)"),
            createElement(
                "ul",
                { className: "list-disc list-inside" },
                showList ? listItems.map((item, index) =>
                    createElement("li", { key: `item-${index}`, className: "text-gray-700" }, item)
                ) : createElement("li", {}, "Daftar disembunyikan."),
                createElement("button", { onClick: toggleList, className: "mt-3" }, "Toggle Daftar")
            )
        ),

        // Test 4: dangerouslySetInnerHTML
        createElement("div", { className: "test-section" },
            createElement("h3", {}, "4. `dangerouslySetInnerHTML`"),
            createElement(
                "div",
                {
                    className: "p-3 bg-red-50 border border-red-300 rounded-md",
                    dangerouslySetInnerHTML: { __html: "Ini adalah <strong>HTML</strong> yang dimasukkan secara <em>mentah</em>." }
                }
            )
        ),

        // Test 5: Komponen Fungsional sebagai Anak
        createElement("div", { className: "test-section" },
            createElement("h3", {}, "5. Komponen Fungsional sebagai Anak"),
            createElement(MyFunctionalComponent, { message: dynamicText, initialCount: 10 })
        )
    );
});

// Dapatkan root DOM element
const appRoot = document.getElementById("app-root");

// Mount aplikasi pengujian ke root DOM
mountComponent(appRoot, { render: () => createElement(TestApp) });
