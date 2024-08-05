import { Input } from "./components/ui/input";
import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Progress } from "./components/ui/progress";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [stok, setStok] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const MARGIN = 2000; //keuntungan yang diambil tiap transaksi

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
    let stok = 0;
    let income = 0;
    data.forEach((row) => {
      const roundedPrice = Math.floor(row.Harga / 1000) * 1000; // Membulatkan ke bawah ke ribuan terdekat
      const adjustedPrice = roundedPrice + MARGIN;
      income += adjustedPrice; // Menjumlahkan hasilnya
      stok += row.Harga;
    });
    setStok(stok);
    setIncome(income);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className=" space-y-4">
          <div className="flex gap-2">
            <Input type="file" onChange={handleFileUpload} accept=".xlsx" />
          </div>

          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>Total Income</CardDescription>
              <CardTitle className="text-4xl">
                Rp {income.toLocaleString("id-ID")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +{(income - stok).toLocaleString("id-ID")} from stok{" "}
                {stok.toLocaleString("id-ID")}
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={(stok / income) * 100} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

export default App;
