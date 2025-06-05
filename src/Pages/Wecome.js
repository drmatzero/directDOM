// Pages/Wecome.js
import { createElement, createComponent, useState } from "../PureView/core.js"; // Impor useState
import { Link } from "../PureView/router.js";
// import GlobalStateCounter f// Konten utama modal (children yang dilewatkan)
//createElement('div', { className: 'mt-2' }, children) rom "../components/GlobalStateCounter.js"; // Komentari/hapus jika tidak digunakan
import Modal from "../PureView/modal.js"; // Impor komponen Modal

export const WelcomePage = createComponent(function WelcomePageComponent() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const openInfoModal = () => setIsInfoModalOpen(true);
  const closeInfoModal = () => setIsInfoModalOpen(false);

  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => setIsFormModalOpen(false);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    alert("Formulir disubmit!");
    closeFormModal();
  };

  return createElement(
    "div",
    { className: "p-6 bg-white rounded-lg shadow-md" },
    createElement("h1", { className: "text-4xl font-extrabold text-blue-700 mb-4" }, "Selamat Datang di Pureview App!"),
    createElement("p", { className: "text-lg text-gray-700 mb-8 leading-relaxed" }, "Ini adalah aplikasi sederhana yang dibangun dengan Pureview, framework UI minimalis kita. Rasakan performa dan kontrol langsung atas DOM!"),
    createElement(
      "div",
      { className: "flex space-x-4 justify-center mb-8" },
      createElement(Link, {
        to: "/thankyou",
        children: "Pergi ke Halaman Terima Kasih",
        className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg",
        style: {},
      }),
      createElement(Link, {
        to: "/test1",
        children: "Pergi ke Halaman Tes",
        className: "bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg",
        style: {},
      })
    ),

    // Tombol untuk membuka modal
    createElement(
      "div",
      { className: "flex space-x-4 justify-center mt-8" },
      createElement(
        "button",
        {
          onClick: openInfoModal,
          className: "bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg",
        },
        "Buka Modal Info"
      ),
      createElement(
        "button",
        {
          onClick: openFormModal,
          className: "bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg",
        },
        "Buka Modal Formulir"
      )
    ),

    // Modal Info
    createElement(
      Modal,
      { isOpen: isInfoModalOpen, onClose: closeInfoModal },
      createElement("h2", { className: "text-2xl font-bold text-blue-800 mb-4" }, "Informasi Penting!"),
      createElement("p", { className: "text-gray-700 mb-4" }, "Ini adalah contoh konten modal informasi. Anda bisa menempatkan teks, gambar, atau elemen lain di sini."),
      createElement("p", { className: "text-sm text-gray-500" }, "Tekan ESC atau klik di luar untuk menutup.")
    ),

    // Modal Formulir
    createElement(
      Modal,
      { isOpen: isFormModalOpen, onClose: closeFormModal },
      createElement("h2", { className: "text-2xl font-bold text-orange-800 mb-4" }, "Formulir Kontak"),
      createElement(
        "form",
        { onSubmit: handleSubmitForm, className: "space-y-4" },
        createElement(
          "div",
          {},
          createElement("label", { htmlFor: "name", className: "block text-gray-700 text-sm font-bold mb-2" }, "Nama:"),
          createElement("input", {
            type: "text",
            id: "name",
            name: "name",
            className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            placeholder: "Masukkan nama Anda",
          })
        ),
        createElement(
          "div",
          {},
          createElement("label", { htmlFor: "email", className: "block text-gray-700 text-sm font-bold mb-2" }, "Email:"),
          createElement("input", {
            type: "email",
            id: "email",
            name: "email",
            className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            placeholder: "Masukkan email Anda",
          })
        ),
        createElement(
          "div",
          { className: "flex items-center justify-between mt-6" },
          createElement(
            "button",
            {
              type: "submit",
              className: "bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
            },
            "Kirim"
          ),
          createElement(
            "button",
            {
              type: "button",
              onClick: closeFormModal,
              className: "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline",
            },
            "Batal"
          )
        )
      )
    )
  );
});

export default WelcomePage;
