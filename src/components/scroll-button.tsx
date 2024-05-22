import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { MoveDownIcon } from "lucide-react";

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false); // State untuk menentukan apakah tombol terlihat
  const prevScrollPos = useRef(0); // Ref untuk menyimpan posisi scroll sebelumnya

  // Fungsi untuk scroll ke bawah halaman
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight, // scroll ke bagian paling bawah halaman
      behavior: "smooth", // Menggunakan animasi scroll yang halus
    });
  };

  // Effect untuk menambahkan event listener saat komponen digunakan
  useEffect(() => {
    const toggleVisibility = () => {
      const currentScrollPos = window.pageYOffset; // Mendapatkan posisi scroll saat ini

      // Menampilkan tombol setelah pengguna mulai scroll ke atas
      setIsVisible(currentScrollPos < prevScrollPos.current);

      prevScrollPos.current = currentScrollPos; // Menyimpan posisi scroll saat ini sebagai posisi sebelumnya
    };

    window.addEventListener("scroll", toggleVisibility); // Membersihkan event listener saat komponen tidak digunakan

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`mb-2 ${isVisible ? "visible" : "invisible"}`}> {/* Mengatur visibilitas tombol */}
      <Button
        className="rounded-full"
        size="icon"
        variant="outline" 
        onClick={scrollToBottom} // Menghubungkan klik tombol dengan fungsi scrollToBottom
      >
        <MoveDownIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ScrollButton;
