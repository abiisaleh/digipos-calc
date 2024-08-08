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
import { Calendar, CalendarDays, Users } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Alert, AlertTitle } from "./components/ui/alert";
import { id } from "date-fns/locale";
import { parse, format } from "date-fns";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [stok, setStok] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);

  const [from, setFrom] = useState<string>("0");
  const [until, setUntil] = useState<string>("0");

  const MARGIN = 2000; //keuntungan yang diambil tiap transaksi

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const date = file.name.split("_");

      setFrom(() => {
        const rawDate = date[1];
        const parsedDate = parse(rawDate, "yyyyMMdd", new Date());
        return format(parsedDate, "dd MMM yyyy", { locale: id });
      });

      setUntil(() => {
        const rawDate = date[2];
        const parsedDate = parse(rawDate, "yyyyMMdd", new Date());
        return format(parsedDate, "dd MMM yyyy", { locale: id });
      });

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

          <div className="flex gap-2 text-xs">
            <Alert>
              <Calendar className="size-4" />
              <AlertTitle>{from}</AlertTitle>
            </Alert>
            <Alert>
              <CalendarDays className="size-4" />
              <AlertTitle>{until}</AlertTitle>
            </Alert>
          </div>

          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>
                <div className="flex justify-between">
                  <div>Total Income</div>

                  <Badge variant="secondary">
                    {data.length} <Users className="ms-1 size-3 text-black" />
                  </Badge>
                </div>
              </CardDescription>
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

          <p className="text-center text-gray-500 text-sm">
            made by{" "}
            <a href="https://abiisaleh.xyz" className="font-medium">
              abiisaleh
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
