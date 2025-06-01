// src/components/GlobalStateCounter.js
import { createElement, createRef } from './core.js'; // Sesuaikan path jika berbeda
import { subscribeGlobal, setGlobalState, getGlobalState, unsubscribeGlobal } from './state.js'; // Impor fungsi state global

export function GlobalStateCounter() {
  const countDisplayRef = createRef();
  let componentRootElement; // Untuk menyimpan elemen DOM root dari instance komponen ini

  // Dapatkan nilai awal dari state global
  const initialCount = getGlobalState('globalCount');

  // Fungsi untuk memperbarui state global
  const increment = () => {
    const currentCount = getGlobalState('globalCount');
    setGlobalState('globalCount', currentCount + 1); // Perbarui state global
  };

  // Buat elemen DOM komponen
  const element = componentRootElement = createElement('div', {},
    createElement('p', { ref: countDisplayRef }, `Global Count: ${initialCount}`),
    createElement('button', { onClick: increment }, 'Increment Global')
  );

  return {
    element: element,
    // Hook mounted: dipanggil setelah komponen ditambahkan ke DOM
    mounted() {
      console.log('GlobalStateCounter mounted.');

      // Definisikan callback untuk subscribe. Simpan referensinya
      // agar bisa digunakan untuk unsubscribe nanti.
      this._globalStateUpdateCallback = (newCount) => {
        if (countDisplayRef.current) {
          countDisplayRef.current.textContent = `Global Count: ${newCount}`;
          // Setelah memperbarui DOM, picu hook 'updated'
          if (typeof this.updated === 'function') {
            this.updated.call(componentRootElement); // 'this' di dalam hook updated merujuk ke componentRootElement
          }
        }
      };

      // Berlangganan ke perubahan 'globalCount'
      subscribeGlobal('globalCount', this._globalStateUpdateCallback);
    },
    // Hook updated: dipanggil setelah DOM komponen diperbarui karena perubahan state
    updated() {
      console.log('GlobalStateCounter updated. Global Count is now:', getGlobalState('globalCount'));
    },
    // Hook unmounted: dipanggil sebelum komponen dilepas dari DOM
    unmounted() {
      console.log('GlobalStateCounter unmounted.');
      // Penting: berhenti berlangganan untuk mencegah kebocoran memori
      if (this._globalStateUpdateCallback) {
        unsubscribeGlobal('globalCount', this._globalStateUpdateCallback);
      }
    }
  };
}
