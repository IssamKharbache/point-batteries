// src/types/jsPDF.d.ts
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: any;
    lastAutoTable: any;
  }
}
