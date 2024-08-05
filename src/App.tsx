// import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [sum, setSum] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setData(parsedData);
        calculateSum(parsedData);
        console.log(parsedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const calculateSum = (data: any[]) => {
    let total = 0;
    let income = 0;
    data.forEach((row) => {
      const roundedPrice = Math.floor(row.Harga / 1000) * 1000; // Membulatkan ke bawah ke ribuan terdekat
      const adjustedPrice = roundedPrice + 2000; // Menambahkan 2
      income += adjustedPrice; // Menjumlahkan hasilnya
      total += row.Harga;
    });
    setSum(total);
    setIncome(income);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <div className="flex gap-2">
            <Input type="file" onChange={handleFileUpload} />
          </div>
          <h2>Total Saldo Rp {sum.toLocaleString("id-ID")}</h2>
          <h2>Total Penghasilan Rp {income.toLocaleString("id-ID")}</h2>
          <h2>Total Pesanan {data.length}</h2>
          <h2>Keuntungan Rp {(income - sum).toLocaleString("id-ID")}</h2>
        </div>
      </div>
    </>
  );
}

export default App;
